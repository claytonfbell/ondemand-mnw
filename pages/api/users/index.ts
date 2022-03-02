import { NextApiResponse } from "next"
import { buildResponse } from "../../../lib/server/buildResponse"
import { BadRequestException } from "../../../lib/server/HttpException"
import prisma from "../../../lib/server/prisma"
import { requireAdminAuthentication } from "../../../lib/server/requireAuthentication"
import withSession, { NextIronRequest } from "../../../lib/server/session"
import validate from "../../../lib/server/validate"

async function handler(
  req: NextIronRequest,
  res: NextApiResponse
): Promise<void> {
  buildResponse(res, async () => {
    await requireAdminAuthentication(req, prisma)

    // GET
    if (req.method === "GET") {
      const users = await prisma.user.findMany({
        include: { webinars: { include: { webinar: true } } },
        orderBy: { id: "desc" },
      })
      return users
    }
    // POST
    if (req.method === "POST") {
      // validate input
      let { email = "" } = req.body as PostArgs
      email = email.toLowerCase()
      validate({ email }).email()
      const existing = await prisma.user.findFirst({ where: { email } })
      if (existing !== null) {
        throw new BadRequestException("User already exists.")
      }

      return await prisma.user.create({
        data: {
          email,
          isAdmin: false,
        },
      })
    }
  })
}

export default withSession(handler)

interface PostArgs {
  email?: string
}
