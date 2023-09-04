import { NextApiResponse } from "next"
import { fetchAllPopuliMailingListContacts } from "../../lib/server/populi-to-squarespace/fetchAllPopuliMailingListContacts"
import prisma from "../../lib/server/prisma"
import { requireAdminAuthentication } from "../../lib/server/requireAuthentication"
import withSession, { NextIronRequest } from "../../lib/server/session"

async function handler(
  req: NextIronRequest,
  res: NextApiResponse
): Promise<void> {
  await requireAdminAuthentication(req, prisma)
  if (req.method === "GET") {
    // query param alumni
    const alumni = req.query.alumni === "true"
    const csv = await fetchAllPopuliMailingListContacts(alumni)
    // header content type
    res.setHeader("Content-Type", "text/csv")
    // header content disposition
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${
        alumni ? "alumni" : "not-alumni"
      }-mailing-list.csv`
    )
    // write csv
    res.status(200).send(csv)
  }
}

export default withSession(handler)
