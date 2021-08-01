import Mux from "@mux/mux-node"
import { NextApiResponse } from "next"
import { CreateMuxAssetRequest } from "../../../lib/api/CreateMuxAssetRequest"
import { FetchMuxAssetResponse } from "../../../lib/api/FetchMuxAssetResponse"
import { buildResponse } from "../../../lib/server/buildResponse"
import { createJWT } from "../../../lib/server/createJWT"
import { ServerException } from "../../../lib/server/HttpException"
import prisma from "../../../lib/server/prisma"
import { requireAdminAuthentication } from "../../../lib/server/requireAuthentication"
import withSession, { NextIronRequest } from "../../../lib/server/session"
import { userLog } from "../../../lib/server/userLog"

async function handler(
  req: NextIronRequest,
  res: NextApiResponse
): Promise<void> {
  buildResponse(res, async () => {
    const user = await requireAdminAuthentication(req, prisma)
    const { Video } = new Mux()

    // Add uploaded asset to muxAsset table
    if (req.method === "GET") {
      return await prisma.muxAsset.findMany()
    } else if (req.method === "POST") {
      const { originalFileName, uploadId, md5, title }: CreateMuxAssetRequest =
        req.body
      const upload = await Video.Uploads.get(uploadId)
      if (upload === null || upload.asset_id === undefined) {
        throw new ServerException("Failed to create a new asset at MUX.")
      } else {
        const muxAsset = await prisma.muxAsset.create({
          data: {
            id: upload.asset_id,
            originalFileName,
            md5,
            title,
          },
        })
        const asset = await Video.Assets.get(upload.asset_id)

        userLog(
          user,
          `Finished uploading video to MUX: \`${originalFileName}\` and asset id \`${upload.asset_id}\``
        )

        const response: FetchMuxAssetResponse = {
          muxAsset,
          asset,
          token: createJWT(asset),
        }
        return response
      }
    }
  })
}

export default withSession(handler)
