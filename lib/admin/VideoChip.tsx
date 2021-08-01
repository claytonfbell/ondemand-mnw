import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material"
import { MuxAsset } from "@prisma/client"
import { useState } from "react"
import { useFetchMuxAsset } from "../api/api"
import { MuxVideoPlayer } from "./MuxVideoPlayer"

interface Props {
  muxAsset: MuxAsset
}

export function VideoChip(props: Props) {
  const [open, setOpen] = useState(false)

  const { data: response } = useFetchMuxAsset(props.muxAsset.id)

  return (
    <>
      <Chip
        label={
          props.muxAsset.title +
          (response?.asset.status !== undefined &&
          response.asset.status !== "ready"
            ? ` - ${response.asset.status.toUpperCase()}`
            : "")
        }
        color={
          response?.asset.status === "errored"
            ? "error"
            : response?.asset.status === "preparing"
            ? "info"
            : undefined
        }
        size="small"
        sx={{ marginRight: 1 }}
        deleteIcon={<PlayArrowIcon />}
        onDelete={() => setOpen(true)}
      />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          {response !== undefined ? (
            <MuxVideoPlayer muxAssetId={response.asset.id} />
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
