import { MuxAsset } from "@prisma/client"
import { ResponsiveTable, Spacer } from "material-ui-pack"
import { useState } from "react"
import { useDeleteMuxAsset, useFetchAllMuxAssets } from "../api/api"
import ConfirmDialog from "../ConfirmDialog"
import { Title } from "../Title"
import { Uploader } from "./Uploader"
import { VideoChip } from "./VideoChip"
import { VideoFormDialog } from "./VideoFormDialog"

type SortBy = "title" | "filename"

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

  const [sortBy, setSortBy] = useState<SortBy>("title")
  const [ascendingTitle, setAscendingTitle] = useState(true)
  const [ascendingFilename, setAscendingFilename] = useState(true)

  return (
    <>
      <Title label="Videos" />
      <Spacer />
      <ResponsiveTable
        onEdit={(ma) => setOpenMuxAsset(ma)}
        onDelete={(ma) => setMuxAssetToDelete(ma)}
        striped
        rowData={muxAssets.sort((a, b) => {
          if (sortBy === "title" && ascendingTitle) {
            return a.title.localeCompare(b.title)
          } else if (sortBy === "title" && !ascendingTitle) {
            return b.title.localeCompare(a.title)
          } else if (sortBy === "filename" && ascendingFilename) {
            return a.originalFileName.localeCompare(b.originalFileName)
          } else if (sortBy === "filename" && !ascendingFilename) {
            return b.originalFileName.localeCompare(a.originalFileName)
          } else {
            return 0
          }
        })}
        schema={[
          {
            label: "Title",
            ascending: ascendingTitle,
            onSortChange: (x) => {
              setSortBy("title")
              setAscendingTitle(!ascendingTitle)
            },
            render: (ma) => <VideoChip muxAsset={ma} />,
          },
          {
            label: "Filename",
            ascending: ascendingFilename,
            onSortChange: (x) => {
              setSortBy("filename")
              setAscendingFilename(!ascendingFilename)
            },
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
