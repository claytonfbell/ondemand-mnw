// pages/api/login.ts
import moment from "moment"
import { NextApiResponse } from "next"
import { AuthenticationRequest } from "../../lib/api/AuthenticationRequest"
import { LoginResponse } from "../../lib/api/LoginResponse"
import { buildResponse } from "../../lib/server/buildResponse"
import { BadRequestException } from "../../lib/server/HttpException"
import prisma from "../../lib/server/prisma"
import withSession, { NextIronRequest } from "../../lib/server/session"
import { userLog } from "../../lib/server/userLog"

async function handler(
  req: NextIronRequest,
  res: NextApiResponse
): Promise<void> {
  buildResponse(res, async () => {
    if (req.method === "POST") {
      let { authCode = "" }: AuthenticationRequest = req.body

      // check if email is already used
      let user = await prisma.user.findFirst({
        where: {
          authCode: { equals: authCode },
        },
      })
      if (user === null) {
        throw new BadRequestException(
          `Authentication code is not valid. ${authCode}`
        )
      }
      if (
        user.authCodeExpiresAt === null ||
        user.authCodeExpiresAt < moment().toDate()
      ) {
        throw new BadRequestException("Authentication code expired.")
      }

      // validation passed
      // send user an auth code
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          authCode: null,
          authCodeExpiresAt: null,
        },
      })

      // validation passed! finalize registration
      // get user from database then:
      req.session.set("user", user)
      await req.session.save()

      userLog(user, "User signed in")

      const response: LoginResponse = {
        user,
      }
      return response
    }
  })
}

export default withSession(handler)
