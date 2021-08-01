// We've created some helper functions for Node to make your signing-life easier
import { Asset, JWT } from "@mux/mux-node"
import fs from "fs"

// read our private key to string
const keySecret = fs.readFileSync(`mux-private-key.pem`).toString()

export function createJWT(asset: Asset) {
  // Set some base options we can use for a few different signing types
  // Type can be either video, thumbnail, gif, or storyboard
  let baseOptions = {
    keyId: `4ka4zsFjaj01t01HKZTpxxAYtCRgR9ismBWxf6IFftDCg`, // Enter your signing key id here
    keySecret, // Enter your base64 encoded private key here
    expiration: "1d", // E.g 60, "2 days", "10h", "7d", numeric value interpreted as seconds
    playback_restriction_id: `CSe00t4FSsGjyeVus6FwKZjn4tPzS8AV9nijw37GOeBI`,
  }

  const paybackId =
    asset.playback_ids !== undefined && asset.playback_ids.length > 0
      ? asset.playback_ids[0].id
      : "ERROR-NO-PLAYBACK_ID"

  const token = JWT.sign(paybackId, { ...baseOptions, type: "video" })
  return token

  // Now the signed playback url should look like this:
  // https://stream.mux.com/${playbackId}.m3u8?token=${token}

  // If you wanted to pass in params for something like a gif, use the
  // params key in the options object
  //   const gifToken = JWT.sign(playbackId, {
  //     ...baseOptions,
  //     type: "gif",
  //     params: { time: 10 },
  //   })

  // https://image.mux.com/${playbackId}/animated.gif?token=${gifToken}
}
