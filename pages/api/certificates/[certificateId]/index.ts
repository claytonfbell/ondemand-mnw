import { Certificate } from "@prisma/client"
import { NextApiResponse } from "next"
import { buildResponse } from "../../../../lib/server/buildResponse"
import { NotFoundException } from "../../../../lib/server/HttpException"
import prisma from "../../../../lib/server/prisma"
import { requireAdminAuthentication } from "../../../../lib/server/requireAuthentication"
import withSession, { NextIronRequest } from "../../../../lib/server/session"
import { validateCertificate } from "../index"

async function handler(
  req: NextIronRequest,
  res: NextApiResponse
): Promise<void> {
  buildResponse(res, async () => {
    await requireAdminAuthentication(req, prisma)
    const certificateId = parseInt(req.query.certificateId as string)

    const certificate = await prisma.certificate.findFirst({
      where: { id: certificateId },
    })
    if (certificate === null) {
      throw new NotFoundException("Certificate not found")
    }

    if (req.method === "PUT") {
      const {
        title = "",
        description = "",
        presenter = "",
        hours = "",
        date = "",
        displayDate = false,
        names,
      } = validateCertificate(req.body as Certificate)

      const certificate = await prisma.certificate.update({
        where: { id: certificateId },
        data: {
          title,
          description,
          presenter,
          hours,
          date,
          displayDate,
          names,
        },
      })
      return certificate
    } else if (req.method === "DELETE") {
      return await prisma.certificate.delete({
        where: {
          id: certificateId,
        },
      })
    }
  })
}

export default withSession(handler)
