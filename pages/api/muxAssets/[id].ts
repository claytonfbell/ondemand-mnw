import Mux from "@mux/mux-node"
import { MuxAsset } from "@prisma/client"
import { NextApiResponse } from "next"
import { FetchMuxAssetResponse } from "../../../lib/api/FetchMuxAssetResponse"
import { buildResponse } from "../../../lib/server/buildResponse"
import { createJWT } from "../../../lib/server/createJWT"
import {
  ForbiddenException,
  NotFoundException,
} from "../../../lib/server/HttpException"
import prisma from "../../../lib/server/prisma"
import {
  requireAdminAuthentication,
  requireAuthentication,
} from "../../../lib/server/requireAuthentication"
import withSession, { NextIronRequest } from "../../../lib/server/session"
import { getUsersWebinarSkus } from "../../../lib/server/squarespace/getUsersWebinarSkus"
import { userLog } from "../../../lib/server/userLog"
import validate from "../../../lib/server/validate"

async function handler(
  req: NextIronRequest,
  res: NextApiResponse
): Promise<void> {
  buildResponse(res, async () => {
    const user = await requireAuthentication(req, prisma)
    const { Video } = new Mux()
    const id = req.query.id as string
    const muxAsset = await prisma.muxAsset.findUnique({ where: { id } })

    if (muxAsset === null) {
      throw new NotFoundException("Mux asset not found")
    }

    // validate user is permitted to view
    if (user.isAdmin !== true) {
      const userSkus = await getUsersWebinarSkus(user)
      const assetSkus = await (
        await prisma.muxAssetsOnWebinars.findMany({
          where: { muxAssetId: muxAsset.id },
          include: { webinar: true },
        })
      ).map((x) => x.webinar.sku)

      const isPermitted =
        assetSkus.filter((sku) => userSkus.includes(sku)).length > 0
      if (!isPermitted) {
        throw new ForbiddenException()
      }
    }

    if (req.method === "GET") {
      const asset = await Video.Assets.get(id)
      const response: FetchMuxAssetResponse = {
        muxAsset,
        asset,
        token: createJWT(asset),
      }
      return response
    } else if (req.method === "PUT") {
      const user = await requireAdminAuthentication(req, prisma)
      const { title = "" }: MuxAsset = req.body
      validate({ title }).min(1)

      userLog(user, `Renamed video title to \`${title}\``)

      return await prisma.muxAsset.update({
        where: { id: muxAsset.id },
        data: { title },
      })
    } else if (req.method === "DELETE") {
      await requireAdminAuthentication(req, prisma)
      // unlink from webinars first
      await prisma.muxAssetsOnWebinars.deleteMany({ where: { muxAssetId: id } })
      // now remove from database
      await prisma.muxAsset.deleteMany({ where: { id } })
      // now delete asset in mux
      await Video.Assets.del(id)

      userLog(user, `Deleted video \`${muxAsset.originalFileName}\``)
    }
  })
}

export default withSession(handler)
