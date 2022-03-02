import { WebinarsOnUsers } from "@prisma/client"
import moment from "moment"
import { NextApiResponse } from "next"
import { buildResponse } from "../../../../../lib/server/buildResponse"
import { NotFoundException } from "../../../../../lib/server/HttpException"
import prisma from "../../../../../lib/server/prisma"
import { requireAdminAuthentication } from "../../../../../lib/server/requireAuthentication"
import withSession, { NextIronRequest } from "../../../../../lib/server/session"

async function handler(
  req: NextIronRequest,
  res: NextApiResponse
): Promise<void> {
  buildResponse(res, async () => {
    await requireAdminAuthentication(req, prisma)

    const userId = Number(req.query.userId as string)
    const webinarId = Number(req.query.webinarId as string)

    // DELETE
    if (req.method === "DELETE") {
      const webinarOnUser = await prisma.webinarsOnUsers.findUnique({
        where: { webinarId_userId: { userId, webinarId } },
      })
      if (webinarOnUser === null) {
        throw new NotFoundException("Webinar on user not found.")
      }

      if (req.method === "DELETE") {
        await prisma.webinarsOnUsers.delete({
          where: { webinarId_userId: { userId, webinarId } },
        })
      }
    }

    // PUT FOR CREATE AND UPDATE
    if (req.method === "PUT") {
      const {
        webinarId,
        expiresAt = moment().add("7", "days").toDate(),
      }: WebinarsOnUsers = req.body
      const webinar = await prisma.webinar.findUnique({
        where: { id: webinarId },
      })
      if (webinar === null) {
        throw new NotFoundException("Webinar not found.")
      }

      await prisma.webinarsOnUsers.upsert({
        where: { webinarId_userId: { userId, webinarId } },
        update: {
          webinarId,
          userId,
          expiresAt,
        },
        create: {
          webinarId,
          userId,
          expiresAt,
        },
      })
    }
  })
}

export default withSession(handler)
