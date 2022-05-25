import { Dialog, DialogContent } from "@mui/material"
import { Certificate } from "@prisma/client"
import { Form, Spacer } from "material-ui-pack"
import React, { useState } from "react"
import { useCreateCertificate, useUpdateCertificate } from "./api"

interface Props {
  open: boolean
  onClose: () => void
  certificate: Certificate
}

export function CertificateDialog({ open, onClose, ...props }: Props) {
  const [state, setState] = useState<Certificate>(props.certificate)

  React.useEffect(() => {
    setState(props.certificate)
  }, [props.certificate])

  const {
    mutateAsync: createCertificate,
    isLoading: isCreating,
    error: createError,
  } = useCreateCertificate()

  const {
    mutateAsync: updateCertificate,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateCertificate()

  const isLoading = isCreating || isUpdating
  const error = createError || updateError

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogContent>
        <Form
          busy={isLoading}
          error={error?.message}
          state={state}
          setState={setState}
          onSubmit={() => {
            if (state.id === 0) {
              createCertificate(state).then(onClose)
            } else {
              updateCertificate(state).then(onClose)
            }
          }}
          onCancel={onClose}
          schema={{
            title: "text",
            hours: "text",
            description: { type: "text", multiline: true, rows: 5 },
            displayDate: "checkbox",
            date: state.displayDate ? "date" : undefined,
            presenter: "text",
            names: { type: "text", multiline: true, rows: 5 },
          }}
        />
        <Spacer />
      </DialogContent>
    </Dialog>
  )
}
