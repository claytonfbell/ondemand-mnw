import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Tooltip,
} from "@mui/material"
import { WebinarsOnUsers } from "@prisma/client"
import { DisplayDateTime, ResponsiveTable, Spacer } from "material-ui-pack"
import moment from "moment"
import { useState } from "react"
import { useDeleteWebinarOnUser, useFetchUser } from "../api/api"
import ConfirmDialog from "../ConfirmDialog"
import { formatDuration } from "../formatFromNow"
import { WebinarOnUserDialog } from "./WebinarOnUserDialog"

interface Props {
  userId: number | undefined
  onClose: () => void
}

export function UserDialog(props: Props) {
  const { data: user } = useFetchUser(props.userId)

  const [selectedWebinarOnUser, setSelectedWebinarOnUser] =
    useState<WebinarsOnUsers>()

  const [webinarOnUserToDelete, setWebinarOnUserToDelete] =
    useState<WebinarsOnUsers>()

  const { mutateAsync: deleteWebinarOnUser } = useDeleteWebinarOnUser()
  function handleDelete() {
    if (webinarOnUserToDelete !== undefined) {
      deleteWebinarOnUser(webinarOnUserToDelete)
      setWebinarOnUserToDelete(undefined)
    }
  }

  return (
    <Dialog
      open={user !== undefined}
      onClose={props.onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>{user?.email}</DialogTitle>
      <DialogContent>
        <ResponsiveTable
          striped
          onEdit={(x) => setSelectedWebinarOnUser(x)}
          onDelete={(x) => setWebinarOnUserToDelete(x)}
          rowData={user?.webinars || []}
          schema={[
            { label: "Webinar", render: (w) => w.webinar.title },
            {
              label: "Status",
              render: (w) =>
                moment(w.expiresAt).isAfter(moment()) ? "Active" : "Expired",
            },
            {
              label: "Expiration",
              render: (w) => (
                <Tooltip
                  arrow
                  title={formatDuration(moment(w.expiresAt).diff(moment()))}
                >
                  <Box>
                    <DisplayDateTime
                      iso8601={moment(w.expiresAt).toISOString()}
                    />
                  </Box>
                </Tooltip>
              ),
            },
          ]}
        />
        <Spacer />
        <Grid container spacing={3}>
          <Grid item xs={6} sm={3}>
            <Button
              fullWidth
              onClick={() =>
                setSelectedWebinarOnUser({
                  userId: props.userId || 0,
                  webinarId: 0,
                  expiresAt: moment().add(7, "days").toDate(),
                  orderId: null,
                })
              }
              variant="outlined"
            >
              Add Webinar
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button fullWidth onClick={props.onClose} variant="outlined">
              Close
            </Button>
          </Grid>
        </Grid>

        <WebinarOnUserDialog
          webinarOnUser={selectedWebinarOnUser}
          onClose={() => setSelectedWebinarOnUser(undefined)}
        />

        <ConfirmDialog
          message="Are you sure?"
          open={webinarOnUserToDelete !== undefined}
          onClose={() => setWebinarOnUserToDelete(undefined)}
          onAccept={handleDelete}
        />
      </DialogContent>
    </Dialog>
  )
}
