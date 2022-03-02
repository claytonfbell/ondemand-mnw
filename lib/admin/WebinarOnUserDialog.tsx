import { Dialog, DialogContent } from "@mui/material"
import { WebinarsOnUsers } from "@prisma/client"
import { Form } from "material-ui-pack"
import { useEffect, useState } from "react"
import { useFetchAllWebinars, useUpsertWebinarOnUser } from "../api/api"

interface Props {
  webinarOnUser: WebinarsOnUsers | undefined
  onClose: () => void
}

export function WebinarOnUserDialog(props: Props) {
  const [state, setState] = useState<WebinarsOnUsers>()

  useEffect(() => {
    if (props.webinarOnUser !== undefined) {
      setState(props.webinarOnUser)
    }
  }, [props.webinarOnUser])

  const {
    mutateAsync: upsertWebinarOnUser,
    isLoading,
    error,
  } = useUpsertWebinarOnUser()

  function handleSubmit() {
    if (state !== undefined) {
      upsertWebinarOnUser(state).then(props.onClose)
    }
  }

  const { data: webinars = [] } = useFetchAllWebinars()

  return (
    <Dialog open={props.webinarOnUser !== undefined} onClose={props.onClose}>
      <DialogContent>
        <Form
          busy={isLoading}
          error={error?.message}
          state={state}
          setState={setState}
          onCancel={props.onClose}
          onSubmit={handleSubmit}
          schema={{
            webinarId: {
              type: "select",
              allowNull: true,
              options: webinars.map((w) => ({
                value: w.id,
                label: `${w.sku} - ${w.title}`,
              })),
              label: "Webinar",
            },
            expiresAt: "dateTime",
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
