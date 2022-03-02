import { Dialog, DialogContent, DialogTitle } from "@mui/material"
import { Form, Spacer } from "material-ui-pack"
import { useState } from "react"
import { useCreateUser } from "../api/api"

interface Props {
  open: boolean
  onClose: () => void
}

export function AddUserDialog({ open, onClose }: Props) {
  const [state, setState] = useState({ email: "" })
  const { mutateAsync: createUser, isLoading, error } = useCreateUser()

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Add New User</DialogTitle>
      <DialogContent>
        <Form
          busy={isLoading}
          error={error?.message}
          state={state}
          setState={setState}
          onSubmit={() => {
            createUser(state).then(onClose)
          }}
          onCancel={onClose}
          schema={{
            email: "email",
          }}
        />
        <Spacer />
      </DialogContent>
    </Dialog>
  )
}
