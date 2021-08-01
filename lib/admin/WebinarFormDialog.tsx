import CloseIcon from "@mui/icons-material/Close"
import {
  Button,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material"
import { MuxAssetsOnWebinars } from "@prisma/client"
import { Form, Spacer } from "material-ui-pack"
import { useEffect, useMemo, useState } from "react"
import {
  useCreateWebinar,
  useFetchAllMuxAssets,
  useFetchMuxAsset,
  useUpdateWebinar,
} from "../api/api"
import { WebinarWithMuxAssets } from "../api/WebinarWithMuxAssets"
import { Uploader } from "./Uploader"
import { VideoChip } from "./VideoChip"

export const WEBINAR_FORM_DEFAULT_STATE: WebinarWithMuxAssets = {
  id: 0,
  title: "",
  description: "",
  sku: "",
  surveyUrl: "",
  muxAssets: [],
}

interface WebinarFormDialogProps {
  open: boolean
  onClose: () => void
  webinar: WebinarWithMuxAssets | undefined
}

export function WebinarFormDialog({
  open,
  onClose,
  webinar,
}: WebinarFormDialogProps) {
  const [state, setState] = useState<WebinarWithMuxAssets>(
    webinar || WEBINAR_FORM_DEFAULT_STATE
  )

  const {
    mutateAsync: createWebinar,
    isLoading: isCreating,
    error: createError,
    reset: resetCreate,
  } = useCreateWebinar()
  const {
    mutateAsync: updateWebinar,
    isLoading: isUpdating,
    error: updateError,
    reset: resetUpdate,
  } = useUpdateWebinar()
  const isLoading = isCreating || isUpdating
  const error = createError || updateError
  function handleSubmit() {
    if (state.id === 0) {
      createWebinar(state).then(onClose)
    } else {
      updateWebinar(state).then(onClose)
    }
  }

  useEffect(() => {
    if (open && webinar !== undefined) {
      resetCreate()
      resetUpdate()
      setState(webinar)
    }
  }, [open, resetCreate, resetUpdate, webinar])

  const [openExistingDialog, setOpenExistingDialog] = useState(false)

  const muxAssets = useMemo(() => {
    return state.muxAssets
      .sort((a, b) => a.orderBy - b.orderBy)
      .map((x, index) => ({ ...x, orderBy: index + 1 }))
  }, [state.muxAssets])

  return (
    <>
      <Dialog open={open} fullWidth maxWidth="sm">
        <DialogContent>
          <Form
            busy={isLoading}
            error={error?.message}
            state={state}
            setState={setState}
            submitLabel={state.id === 0 ? "Add Webinar" : "Save Changes"}
            onCancel={onClose}
            onSubmit={handleSubmit}
            schema={{
              title: "capitalize",
              sku: { type: "text", label: "SKU" },
              description: { type: "text", minRows: 4, multiline: true },
              surveyUrl: "text",
              muxAssets: () => {
                return (
                  <>
                    <Grid
                      container
                      spacing={2}
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      {muxAssets.map((x) => (
                        <MuxAssetOnWebinar
                          key={x.muxAssetId}
                          muxAssetOnWebinar={x}
                          onChange={(x) => {
                            setState((prev) => ({
                              ...prev,
                              muxAssets: [
                                ...prev.muxAssets.filter(
                                  (y) => y.muxAssetId !== x.muxAssetId
                                ),
                                x,
                              ],
                            }))
                          }}
                          onRemove={() => {
                            setState((prev) => ({
                              ...prev,
                              muxAssets: [
                                ...prev.muxAssets.filter(
                                  (y) => y.muxAssetId !== x.muxAssetId
                                ),
                              ],
                            }))
                          }}
                        />
                      ))}
                    </Grid>
                    <Spacer />
                    {state.muxAssets.length < 1 ? (
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={8}>
                          <Uploader
                            onUploaded={(resp) => {
                              if (
                                state.muxAssets.find(
                                  (x) => x.muxAssetId === resp.muxAsset.id
                                ) === undefined
                              ) {
                                setState((prev) => ({
                                  ...prev,
                                  muxAssets: [
                                    ...prev.muxAssets,
                                    {
                                      webinarId: state.id,
                                      muxAssetId: resp.muxAsset.id,
                                      orderBy: prev.muxAssets.length + 1,
                                    },
                                  ],
                                }))
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Button
                            color="secondary"
                            fullWidth
                            variant="contained"
                            onClick={() => setOpenExistingDialog(true)}
                          >
                            Add Existing Video
                          </Button>
                          <AddExistingVideoDialog
                            open={openExistingDialog}
                            onClose={() => setOpenExistingDialog(false)}
                            onAdd={(muxAssetId) => {
                              if (
                                state.muxAssets.find(
                                  (x) => x.muxAssetId === muxAssetId
                                ) === undefined
                              ) {
                                setState((prev) => ({
                                  ...prev,
                                  muxAssets: [
                                    ...prev.muxAssets,
                                    {
                                      webinarId: state.id,
                                      muxAssetId,
                                      orderBy: prev.muxAssets.length + 1,
                                    },
                                  ],
                                }))
                              }
                            }}
                          />
                        </Grid>
                      </Grid>
                    ) : null}
                  </>
                )
              },
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

interface MuxAssetOnWebinarProps {
  muxAssetOnWebinar: MuxAssetsOnWebinars
  onRemove: () => void
  onChange: (muxAssetOnWebinar: MuxAssetsOnWebinars) => void
}

function MuxAssetOnWebinar(props: MuxAssetOnWebinarProps) {
  const { data: muxAsset } = useFetchMuxAsset(
    props.muxAssetOnWebinar.muxAssetId
  )
  return (
    <>
      {/* <Grid item xs={2}>
        <NumberFieldBase
          size="small"
          setZeroToNull={false}
          value={props.muxAssetOnWebinar.orderBy}
          onChange={(orderBy) => {
            props.onChange({
              ...props.muxAssetOnWebinar,
              orderBy: orderBy || 0,
            })
          }}
        />
      </Grid> */}
      <Grid item xs={10}>
        {muxAsset !== undefined ? (
          <VideoChip muxAsset={muxAsset.muxAsset} />
        ) : null}
      </Grid>
      <Grid item xs={2} style={{ textAlign: "right" }}>
        <Tooltip title="Unlink video from this webinar">
          <IconButton onClick={props.onRemove}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </Grid>
    </>
  )
}

interface AddExistingVideoDialogProps {
  open: boolean
  onClose: () => void
  onAdd: (id: string) => void
}

interface AddExistingVideoDialogState {
  muxAssetId: string | null
}

function AddExistingVideoDialog({
  open,
  onClose,
  onAdd,
}: AddExistingVideoDialogProps) {
  const [state, setState] = useState<AddExistingVideoDialogState>({
    muxAssetId: null,
  })

  const { data: muxAssets = [] } = useFetchAllMuxAssets()

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <Form
          state={state}
          setState={setState}
          onSubmit={() => {
            if (state.muxAssetId !== null) {
              onClose()
              onAdd(state.muxAssetId)
            }
          }}
          disabledSubmitButton={state.muxAssetId === null}
          onCancel={onClose}
          schema={{
            muxAssetId: {
              type: "select",
              options: muxAssets.map((x) => ({
                value: x.id,
                label: x.originalFileName,
              })),
            },
          }}
        />

        <Spacer />
      </DialogContent>
    </Dialog>
  )
}
