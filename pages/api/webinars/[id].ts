import { MuxAssetsOnWebinars, Webinar } from "@prisma/client"
import { NextApiResponse } from "next"
import { WebinarWithMuxAssets } from "../../../lib/api/WebinarWithMuxAssets"
import { buildResponse } from "../../../lib/server/buildResponse"
import { NotFoundException } from "../../../lib/server/HttpException"
import prisma from "../../../lib/server/prisma"
import { requireAdminAuthentication } from "../../../lib/server/requireAuthentication"
import withSession, { NextIronRequest } from "../../../lib/server/session"
import { userLog } from "../../../lib/server/userLog"
import validate from "../../../lib/server/validate"

async function handler(
  req: NextIronRequest,
  res: NextApiResponse
): Promise<void> {
  buildResponse(res, async () => {
    const user = await requireAdminAuthentication(req, prisma)

    const id = Number(req.query.id as string)
    const webinar = await prisma.webinar.findUnique({ where: { id } })

    if (webinar === null) {
      throw new NotFoundException("Webinar not found.")
    }

    if (req.method === "GET") {
      return webinar
    } else if (req.method === "PUT") {
      // validate inputs
      const {
        title = "",
        sku = "",
        description = "",
        surveyUrl = "",
        muxAssets,
      }: WebinarWithMuxAssets = req.body
      validate({ title }).min(1)
      validate({ sku }).notNull()
      validate({ description }).notNull()
      validate({ surveyUrl }).notNull()

      await prisma.webinar.update({
        where: { id: webinar.id },
        include: {
          muxAssets: {
            orderBy: [{ orderBy: "asc" }],
            include: { muxAsset: true },
          },
        },
        data: {
          title,
          sku,
          description,
          surveyUrl,
        },
      })

      saveMuxAssetsOnWebinar(webinar, muxAssets)

      userLog(user, `Updated webinar with id ${id} and title \`${title}\``)

      return webinar
    } else if (req.method === "DELETE") {
      // remove from database
      await prisma.muxAssetsOnWebinars.deleteMany({ where: { webinarId: id } })
      await prisma.webinar.delete({ where: { id } })

      userLog(user, `Deleted webinar with id ${id}`)
    }
  })
}

export default withSession(handler)

export async function saveMuxAssetsOnWebinar(
  webinar: Webinar,
  muxAssets: MuxAssetsOnWebinars[]
) {
  // relational join updates
  const existing = await prisma.muxAssetsOnWebinars.findMany({
    where: { webinarId: webinar.id },
  })
  const toRemove = existing.filter(
    (x) => muxAssets.find((y) => y.muxAssetId === x.muxAssetId) === undefined
  )
  const toInsert = muxAssets.filter(
    (x) => existing.find((y) => y.muxAssetId === x.muxAssetId) === undefined
  )
  const toUpdate = muxAssets.filter(
    (x) => existing.find((y) => y.muxAssetId === x.muxAssetId) !== undefined
  )

  for (let i = 0; i < toRemove.length; i++) {
    await prisma.muxAssetsOnWebinars.delete({
      where: {
        muxAssetId_webinarId: {
          muxAssetId: toRemove[i].muxAssetId,
          webinarId: webinar.id,
        },
      },
    })
  }
  for (let i = 0; i < toInsert.length; i++) {
    await prisma.muxAssetsOnWebinars.create({
      data: {
        muxAssetId: toInsert[i].muxAssetId,
        webinarId: webinar.id,
        orderBy: toInsert[i].orderBy,
      },
    })
  }
  console.log(toUpdate)
  for (let i = 0; i < toUpdate.length; i++) {
    await prisma.muxAssetsOnWebinars.update({
      where: {
        muxAssetId_webinarId: {
          muxAssetId: toUpdate[i].muxAssetId,
          webinarId: webinar.id,
        },
      },
      data: {
        orderBy: toUpdate[i].orderBy,
      },
    })
  }

  // end relational join updates
}
