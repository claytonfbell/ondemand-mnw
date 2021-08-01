import AddIcon from "@mui/icons-material/Add"
import { Button } from "@mui/material"
import { ResponsiveTable, Spacer } from "material-ui-pack"
import { useState } from "react"
import { useDeleteWebinar, useFetchAllWebinars } from "../api/api"
import { WebinarWithMuxAssets } from "../api/WebinarWithMuxAssets"
import ConfirmDialog from "../ConfirmDialog"
import { Title } from "../Title"
import { VideoChip } from "./VideoChip"
import {
  WebinarFormDialog,
  WEBINAR_FORM_DEFAULT_STATE,
} from "./WebinarFormDialog"

export function AdminWebinarsList() {
  const [openWebinar, setOpenWebinar] = useState<WebinarWithMuxAssets>()
  const { data: webinars = [] } = useFetchAllWebinars()
  const [webinarToDelete, setWebinarToDelete] = useState<WebinarWithMuxAssets>()
  const { mutateAsync: deleteWebinar } = useDeleteWebinar()
  function handleConfirmedDelete() {
    if (webinarToDelete !== undefined) {
      deleteWebinar(webinarToDelete)
      setWebinarToDelete(undefined)
    }
  }

  return (
    <>
      <Title label="Webinars" />
      <Spacer />
      <ResponsiveTable
        onEdit={(webinar) => setOpenWebinar(webinar)}
        onDelete={(webinar) => setWebinarToDelete(webinar)}
        striped
        rowData={webinars}
        schema={[
          {
            label: "Title",
            render: (w) => w.title,
          },
          {
            xsDownHidden: true,
            label: "SKU",
            render: (w) => w.sku,
          },
          {
            xsDownHidden: true,
            label: "Videos",
            render: (w) => {
              return (
                <>
                  {w.muxAssets
                    .sort((a, b) => a.orderBy - b.orderBy)
                    .map((x) =>
                      x.muxAsset !== undefined ? (
                        <VideoChip muxAsset={x.muxAsset} key={x.muxAssetId} />
                      ) : (
                        <></>
                      )
                    )}
                </>
              )
            },
          },
        ]}
      />
      <ConfirmDialog
        message="Are you sure you want to remove this Webinar? Any video belonging to this webinar will not be deleted from MUX until you remove it from the Videos tab."
        open={webinarToDelete !== undefined}
        onClose={() => setWebinarToDelete(undefined)}
        onAccept={handleConfirmedDelete}
      />
      <Spacer />
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => setOpenWebinar(WEBINAR_FORM_DEFAULT_STATE)}
      >
        Add New Webinar
      </Button>
      <WebinarFormDialog
        open={openWebinar !== undefined}
        onClose={() => setOpenWebinar(undefined)}
        webinar={openWebinar}
      />
    </>
  )
}
