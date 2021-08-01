import { Dialog, DialogContent } from "@mui/material"
import { MuxAsset } from "@prisma/client"
import { Form } from "material-ui-pack"
import { useEffect, useState } from "react"
import { useUpdateMuxAsset } from "../api/api"

interface Props {
  open: boolean
  onClose: () => void
  muxAsset: MuxAsset | undefined
}

export function VideoFormDialog({ open, onClose, muxAsset }: Props) {
  const [state, setState] = useState(muxAsset)

  const {
    mutateAsync: updateMuxAsset,
    isLoading,
    error,
    reset,
  } = useUpdateMuxAsset()
  function handleSubmit() {
    if (state !== undefined) {
      updateMuxAsset(state).then(onClose)
    }
  }

  useEffect(() => {
    if (open) {
      reset()
      setState(muxAsset)
    }
  }, [open, muxAsset, reset])

  const [openExistingDialog, setOpenExistingDialog] = useState(false)

  return (
    <>
      <Dialog open={open} fullWidth maxWidth="sm">
        <DialogContent>
          <Form
            busy={isLoading}
            error={error?.message}
            state={state}
            setState={setState}
            onCancel={onClose}
            onSubmit={handleSubmit}
            schema={{
              title: "capitalize",
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
