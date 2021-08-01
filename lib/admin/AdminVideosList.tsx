import { MuxAsset } from "@prisma/client"
import { ResponsiveTable, Spacer } from "material-ui-pack"
import { useState } from "react"
import { useDeleteMuxAsset, useFetchAllMuxAssets } from "../api/api"
import ConfirmDialog from "../ConfirmDialog"
import { Title } from "../Title"
import { Uploader } from "./Uploader"
import { VideoChip } from "./VideoChip"
import { VideoFormDialog } from "./VideoFormDialog"

export function AdminVideosList() {
  const [openMuxAsset, setOpenMuxAsset] = useState<MuxAsset>()
  const { data: muxAssets = [] } = useFetchAllMuxAssets()
  const [muxAssetToDelete, setMuxAssetToDelete] = useState<MuxAsset>()
  const { mutateAsync: deleteMuxAsset } = useDeleteMuxAsset()
  function handleConfirmedDelete() {
    if (muxAssetToDelete !== undefined) {
      deleteMuxAsset(muxAssetToDelete.id)
      setMuxAssetToDelete(undefined)
    }
  }

  return (
    <>
      <Title label="Videos" />
      <Spacer />
      <ResponsiveTable
        onEdit={(ma) => setOpenMuxAsset(ma)}
        onDelete={(ma) => setMuxAssetToDelete(ma)}
        striped
        rowData={muxAssets}
        schema={[
          {
            label: "Title",
            render: (ma) => <VideoChip muxAsset={ma} />,
          },
          {
            label: "Filename",
            render: (ma) => ma.originalFileName,
          },
        ]}
      />
      <ConfirmDialog
        message="Are you sure you want to delete this video from MUX?"
        open={muxAssetToDelete !== undefined}
        onClose={() => setMuxAssetToDelete(undefined)}
        onAccept={handleConfirmedDelete}
      />
      <VideoFormDialog
        open={openMuxAsset !== undefined}
        onClose={() => setOpenMuxAsset(undefined)}
        muxAsset={openMuxAsset}
      />

      <Spacer />
      <Uploader onUploaded={() => {}} />
    </>
  )
}
