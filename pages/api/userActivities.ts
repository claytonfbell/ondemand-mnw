import { NextApiResponse } from "next"
import { buildResponse } from "../../lib/server/buildResponse"
import prisma from "../../lib/server/prisma"
import { requireAdminAuthentication } from "../../lib/server/requireAuthentication"
import withSession, { NextIronRequest } from "../../lib/server/session"

async function handler(
  req: NextIronRequest,
  res: NextApiResponse
): Promise<void> {
  buildResponse(res, async () => {
    await requireAdminAuthentication(req, prisma)

    if (req.method === "GET") {
      // FETCH ORDERS
      return await prisma.userAcivityLog.findMany({
        include: { user: true },
        orderBy: { time: "desc" },
      })
    }
  })
}

export default withSession(handler)
