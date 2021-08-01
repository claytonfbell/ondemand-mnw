import { Asset } from "@mux/mux-node"
import { MuxAsset } from "@prisma/client"

export interface FetchMuxAssetResponse {
  asset: Asset
  muxAsset: MuxAsset
  token: string
}
