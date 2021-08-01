import Hls from "hls.js"
import { useMemo, useRef, useState } from "react"
import { useDebounce } from "react-use"
import { useFetchMuxAsset } from "../api/api"

interface Props {
  muxAssetId: string
  maxWidth?: number
  maxHeight?: number
}

export function MuxVideoPlayer(props: Props) {
  const { data: response } = useFetchMuxAsset(props.muxAssetId)

  const videoRef = useRef<HTMLVideoElement>(null)

  const src = useMemo(() => {
    const playbackId =
      response?.asset.playback_ids !== undefined &&
      response.asset.playback_ids.length > 0
        ? response.asset.playback_ids[0].id
        : null
    const token = response?.token || null
    return playbackId !== null && token !== null
      ? `https://stream.mux.com/${playbackId}.m3u8?token=${token}`
      : null
  }, [response?.asset.playback_ids, response?.token])

  const [loaded, setLoaded] = useState(false)

  // prevents glitchy reloads when window gets refocus
  useDebounce(
    () => {
      let hls: Hls
      if (videoRef.current && src !== null && !loaded) {
        setLoaded(true)
        const video = videoRef.current
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          // Some browers (safari and ie edge) support HLS natively
          video.src = src
        } else if (Hls.isSupported()) {
          // This will run in all other modern browsers
          hls = new Hls()
          hls.loadSource(src)
          hls.attachMedia(video)
        } else {
          console.error("This is a legacy browser that doesn't support MSE")
        }
      }
      return () => {
        if (hls) {
          hls.destroy()
        }
      }
    },
    500,
    [loaded, src, videoRef]
  )

  return (
    <video
      controls
      ref={videoRef}
      style={{
        width: "100%",
        height: "100%",
        maxWidth:
          props.maxWidth !== undefined ? `${props.maxWidth}px` : undefined,
        maxHeight:
          props.maxHeight !== undefined ? `${props.maxHeight}px` : undefined,
      }}
    />
  )
}
