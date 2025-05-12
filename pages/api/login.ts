// pages/api/login.ts
import { User } from "@prisma/client"
import moment from "moment"
import { NextApiResponse } from "next"
import { v4 as uuidv4 } from "uuid"
import { AuthcodeRequestResponse } from "../../lib/api/AuthcodeRequestResponse"
import { LoginRequest } from "../../lib/api/LoginRequest"
import { LoginResponse } from "../../lib/api/LoginResponse"
import { buildResponse } from "../../lib/server/buildResponse"
import { BadRequestException } from "../../lib/server/HttpException"
import prisma from "../../lib/server/prisma"
import { requireAuthentication } from "../../lib/server/requireAuthentication"
import { sendEmail } from "../../lib/server/sendEmail"
import withSession, { NextIronRequest } from "../../lib/server/session"
import { scrapeOrdersFromSquareSpace } from "../../lib/server/squarespace/scrapeOrdersFromSquareSpace"
import { userLog } from "../../lib/server/userLog"
import validate from "../../lib/server/validate"

async function handler(
  req: NextIronRequest,
  res: NextApiResponse
): Promise<void> {
  buildResponse(res, async () => {
    if (req.method === "DELETE") {
      await req.session.destroy()

      const sessionUser: User | null | undefined = req.session.get("user")
      if (sessionUser !== undefined && sessionUser !== null) {
        userLog(sessionUser, "User signed out")
      }

      return
    } else if (req.method === "GET") {
      const user = await requireAuthentication(req, prisma)
      const data: LoginResponse = { user }
      return data
    } else if (req.method === "POST") {
      let { email = "" }: LoginRequest = req.body
      email = email.toLowerCase()

      validate({ email }).email()

      // check if email is already used
      let user = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      // check if they are approved admin and create them
      if (user === null) {
        const approvedAdmins = [
          "info@montessori-nw.org",
          "nick@montessori-nw.org",
          "angelika@montessori-nw.org",
          "claytonfbell@gmail.com",
          "tyler@montessori-nw.org",
          "jess@montessori-nw.org",
          "kim.yue@montessori-nw.org",
          "grace@montessori-nw.org",
        ]
        if (approvedAdmins.includes(email)) {
          user = await prisma.user.create({ data: { email, isAdmin: true } })
        }
      }

      // check if they have squarespace commerce orders and create them
      if (user === null) {
        await scrapeOrdersFromSquareSpace()
        const orders = await prisma.squarespaceOrder.findMany({
          where: { customerEmail: email },
        })
        if (orders.length > 0) {
          user = await prisma.user.create({ data: { email, isAdmin: false } })
        }
      }

      // still not found, throw error
      if (user === null) {
        throw new BadRequestException("User not found with email.")
      } else {
        // send user an auth code
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            authCode: uuidv4(),
            authCodeExpiresAt: moment().add(10, "minutes").toDate(),
          },
        })

        // send email
        userLog(user, "User requested sign-in auth code")

        const text = `Use this link to login. It will expire in **10 minutes** or as soon as you use it. \n\n${process.env.HOST}/?authCode=${user.authCode}.`
        sendEmail({ to: user.email, subject: "Login Code", text })
          .then(() => {
            console.log("Email sent")
          })
          .catch((error) => {
            console.error(error)
          })

        const response: AuthcodeRequestResponse = {
          message: "Check your email for a link to login.",
        }
        return response
      }

      return
    }
  })
}

export default withSession(handler)
