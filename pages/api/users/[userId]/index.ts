import { NextApiResponse } from "next"
import { buildResponse } from "../../../../lib/server/buildResponse"
import { NotFoundException } from "../../../../lib/server/HttpException"
import prisma from "../../../../lib/server/prisma"
import { requireAdminAuthentication } from "../../../../lib/server/requireAuthentication"
import withSession, { NextIronRequest } from "../../../../lib/server/session"

async function handler(
  req: NextIronRequest,
  res: NextApiResponse
): Promise<void> {
  buildResponse(res, async () => {
    await requireAdminAuthentication(req, prisma)

    const userId = Number(req.query.userId as string)

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { webinars: { include: { webinar: true } } },
    })
    if (user === null) {
      throw new NotFoundException("User not found.")
    }

    if (req.method === "GET") {
      return user
    }
  })
}

export default withSession(handler)
