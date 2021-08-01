import { Upload } from "@mux/mux-node"
import { FetchMuxAssetResponse } from "./FetchMuxAssetResponse"

export interface UploadResponse {
  upload?: Upload
  existingMuxAsset?: FetchMuxAssetResponse
}
