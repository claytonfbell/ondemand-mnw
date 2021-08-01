import { alpha, Box, Grid, LinearProgress, useTheme } from "@mui/material"
import * as UpChunk from "@mux/upchunk"
// @ts-ignore
import BMF from "browser-md5-file"
import { DisplayError } from "material-ui-pack"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { useCreateMuxAsset, useCreateUpload } from "../api/api"
import { FetchMuxAssetResponse } from "../api/FetchMuxAssetResponse"

interface Props {
  onUploaded: (response: FetchMuxAssetResponse) => void
}

export function Uploader({ onUploaded }: Props) {
  const { mutateAsync: createMuxAsset, error: createMuxAssetError } =
    useCreateMuxAsset()
  const { mutateAsync: createUpload, error: createUploadError } =
    useCreateUpload()
  const error = createMuxAssetError || createUploadError

  // derived from https://codepen.io/PerfectIsShit/pen/zogMXP
  const uploadFile = useCallback(
    (file: File) => {
      const bmf = new BMF()
      bmf.md5(
        file,
        (err: any, md5?: string | null) => {
          console.log("err:", err)
          console.log("md5 string:", md5)
          if (md5 !== undefined && md5 !== null) {
            createUpload({ md5 }).then((resp) => {
              // If file already exists, skip uploading
              if (resp.existingMuxAsset !== undefined) {
                setProgress(0)
                onUploaded(resp.existingMuxAsset)
              }
              // Now upload the file in chunks
              else if (resp.upload !== undefined) {
                const uploadId = resp.upload.id
                const upload = UpChunk.createUpload({
                  // getUploadUrl is a function that resolves with the upload URL generated
                  // on the server-side
                  endpoint: resp.upload.url,
                  // picker here is a file picker HTML element
                  file,
                  chunkSize: 5120, // Uploads the file in ~5mb chunks
                })

                // subscribe to events
                upload.on("error", (err) => {
                  console.error("💥 🙀", err.detail)
                })

                upload.on("progress", (progress) => {
                  setProgress(progress.detail)
                })

                // subscribe to events
                upload.on("success", () => {
                  console.log("Wrap it up, we're done here. 👋")

                  createMuxAsset({
                    originalFileName: file.name,
                    uploadId,
                    md5,
                    title: file.name,
                  }).then((resp) => {
                    setProgress(0)
                    onUploaded(resp)
                  })
                })
              }
            })
          }
        },
        (progress: any) => {
          console.log("Calculating md5:", progress)
          setProgress(progress * 100)
        }
      )
    },
    [createMuxAsset, createUpload, onUploaded]
  )

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Do something with the files
      console.log(acceptedFiles)
      if (acceptedFiles.length > 0) {
        uploadFile(acceptedFiles[0])
      }
    },
    [uploadFile]
  )
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const [progress, setProgress] = useState(0)
  const theme = useTheme()

  return (
    <>
      <DisplayError error={error?.message} />
      <Box
        {...getRootProps()}
        sx={{
          border: `3px ${isDragActive || progress > 0 ? "solid" : "dashed"} ${
            theme.palette.secondary.main
          }`,
          borderRadius: 1,
          backgroundColor: alpha(theme.palette.secondary.main, 0.3),
          height: 64,
          overflow: "hidden",
          color: theme.palette.secondary.dark,
        }}
      >
        {progress > 0 ? (
          <LinearProgress
            color="secondary"
            sx={{ height: 64 }}
            variant="determinate"
            value={progress}
          />
        ) : (
          <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="space-around"
            height={60}
          >
            <Grid item>
              {isDragActive ? (
                <p>Drop the file here ...</p>
              ) : (
                <p>Drag n drop mp4 video here, or click to select file</p>
              )}
              <input {...getInputProps()} />
            </Grid>
          </Grid>
        )}
      </Box>
    </>
  )
}
