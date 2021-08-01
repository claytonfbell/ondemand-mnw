import Mux from "@mux/mux-node"
import { NextApiResponse } from "next"
import { UploadRequest } from "../../../lib/api/UploadRequest"
import { UploadResponse } from "../../../lib/api/UploadResponse"
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

    if (req.method === "POST") {
      // First check if we already have this file stored in mux and our database
      const { md5 }: UploadRequest = req.body
      const muxAsset = await prisma.muxAsset.findUnique({ where: { md5 } })
      if (muxAsset) {
        const asset = await Video.Assets.get(muxAsset.id)
        const response: UploadResponse = {
          existingMuxAsset: {
            muxAsset: muxAsset,
            asset,
            token: createJWT(asset),
          },
        }
        return response
      }

      // create an upload url link
      const upload = await Video.Uploads.create({
        cors_origin: process.env.HOST,
        new_asset_settings: {
          playback_policy: ["signed"],
          mp4_support: "standard",
        },
      })
      if (upload === null) {
        throw new ServerException(
          "Failed to fetch or create a new upload url at MUX."
        )
      } else {
        userLog(user, `Started uploading video with md5 hash ${md5}`)

        const response: UploadResponse = {
          upload,
        }
        return response
      }
    }
  })
}

export default withSession(handler)
