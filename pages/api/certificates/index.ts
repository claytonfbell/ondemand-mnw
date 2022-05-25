import { Certificate } from "@prisma/client"
import { NextApiResponse } from "next"
import { buildResponse } from "../../../lib/server/buildResponse"
import prisma from "../../../lib/server/prisma"
import { requireAdminAuthentication } from "../../../lib/server/requireAuthentication"
import withSession, { NextIronRequest } from "../../../lib/server/session"
import validate from "../../../lib/server/validate"
import { CertificatesPaginated } from "../../../src/certificates/CertificatesPaginated"

async function handler(
  req: NextIronRequest,
  res: NextApiResponse
): Promise<void> {
  buildResponse(res, async () => {
    await requireAdminAuthentication(req, prisma)

    if (req.method === "GET") {
      const pageNum = parseInt(req.query.pageNum as string)
      const pageSize = parseInt(req.query.pageSize as string)

      const keywords = (req.query.keyword as string)
        .trim()
        .split(" ")
        .map((x) => x.trim())
        .filter((x) => x.length > 0)

      // search by name
      let AND: any | undefined = undefined
      if (keywords.length > 0) {
        AND = keywords.map((keyword) => {
          return {
            OR: [
              {
                title: { contains: keyword, mode: "insensitive" },
              },
            ],
          }
        })
      }

      // FETCH ACTIVITY FEED PAGINATED
      const [rowCount, data] = await prisma.$transaction([
        prisma.certificate.count({
          where: {
            id: { gt: 0 },
            AND,
          },
        }),
        prisma.certificate.findMany({
          where: {
            id: { gt: 0 },
            AND,
          },
          orderBy: { id: "desc" },
          skip: (pageNum - 1) * pageSize,
          take: pageSize,
        }),
      ])
      const response: CertificatesPaginated = {
        data,
        pageNum,
        pageCount: Math.ceil(rowCount / pageSize),
        pageSize,
        rowCount,
      }
      return response
    } else if (req.method === "POST") {
      const {
        title = "",
        description = "",
        presenter = "",
        hours = "",
        date = "",
        displayDate = false,
        names,
      } = validateCertificate(req.body as Certificate)

      const certificate = await prisma.certificate.create({
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
    }
  })
}

export default withSession(handler)

export function validateCertificate(certificate: Certificate): Certificate {
  const { title, description, presenter, hours, names, date, displayDate } =
    certificate
  validate({ title }).min(1).max(100)
  validate({ description }).min(1).max(2000)
  validate({ presenter }).min(1).max(250)
  validate({ names }).min(1).max(2000)

  return certificate
}
