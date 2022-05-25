import { NextApiResponse } from "next"
import { buildResponse } from "../../lib/server/buildResponse"
import prisma from "../../lib/server/prisma"
import { requireAdminAuthentication } from "../../lib/server/requireAuthentication"
import withSession, { NextIronRequest } from "../../lib/server/session"
import { UserActivityLogWithUserPaginated } from "../../src/userActivity/UserActivityLogWithUserPaginated"

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
                user: {
                  email: { contains: keyword, mode: "insensitive" },
                },
              },
            ],
          }
        })
      }

      // FETCH ACTIVITY FEED PAGINATED
      const [rowCount, data] = await prisma.$transaction([
        prisma.userAcivityLog.count({
          where: {
            id: { gt: 0 },
            AND,
          },
        }),
        prisma.userAcivityLog.findMany({
          where: {
            id: { gt: 0 },
            AND,
          },
          include: { user: true },
          orderBy: { id: "desc" },
          skip: (pageNum - 1) * pageSize,
          take: pageSize,
        }),
      ])
      const response: UserActivityLogWithUserPaginated = {
        data,
        pageNum,
        pageCount: Math.ceil(rowCount / pageSize),
        pageSize,
        rowCount,
      }
      return response
    }
  })
}

export default withSession(handler)
