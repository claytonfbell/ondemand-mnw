import { NextApiResponse } from "next"
import { WebinarWithMuxAssets } from "../../../lib/api/WebinarWithMuxAssets"
import { buildResponse } from "../../../lib/server/buildResponse"
import prisma from "../../../lib/server/prisma"
import {
  requireAdminAuthentication,
  requireAuthentication,
} from "../../../lib/server/requireAuthentication"
import withSession, { NextIronRequest } from "../../../lib/server/session"
import { getUsersWebinarSkus } from "../../../lib/server/squarespace/getUsersWebinarSkus"
import { userLog } from "../../../lib/server/userLog"
import validate from "../../../lib/server/validate"
import { saveMuxAssetsOnWebinar } from "./[id]"

async function handler(
  req: NextIronRequest,
  res: NextApiResponse
): Promise<void> {
  buildResponse(res, async () => {
    const user = await requireAuthentication(req, prisma)

    // FETCH WEBINARS
    if (req.method === "GET") {
      const skus = await getUsersWebinarSkus(user)
      const allWebinars = await prisma.webinar.findMany({
        include: {
          muxAssets: {
            orderBy: [{ orderBy: "asc" }],
            include: { muxAsset: true },
          },
        },
      })

      return allWebinars.filter(
        (x) => user.isAdmin === true || skus.includes(x.sku)
      )
    }
    // CREATE WEBINAR
    else if (req.method === "POST") {
      await requireAdminAuthentication(req, prisma)
      const {
        title,
        description,
        sku,
        surveyUrl,
        muxAssets,
      }: WebinarWithMuxAssets = req.body

      validate({ title }).min(1)
      validate({ sku }).notNull()
      validate({ description }).notNull()
      validate({ surveyUrl }).notNull()

      const webinar = await prisma.webinar.create({
        data: {
          title,
          description,
          sku,
          surveyUrl,
        },
        include: {
          muxAssets: {
            orderBy: [{ orderBy: "asc" }],
            include: { muxAsset: true },
          },
        },
      })

      saveMuxAssetsOnWebinar(webinar, muxAssets)
      userLog(
        user,
        `Created webinar with id ${webinar.id} and title \`${webinar.title}\``
      )

      return webinar
    }
  })
}

export default withSession(handler)
