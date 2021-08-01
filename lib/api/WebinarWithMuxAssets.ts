import { MuxAsset, MuxAssetsOnWebinars, Webinar } from "@prisma/client"

export type WebinarWithMuxAssets = Webinar & {
  muxAssets: MuxAssetsOnWebinarsWithMuxAsset[]
}

type MuxAssetsOnWebinarsWithMuxAsset = MuxAssetsOnWebinars & {
  muxAsset?: MuxAsset
}
