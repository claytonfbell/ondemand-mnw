import DownloadIcon from "@mui/icons-material/Download"
import { Button, Stack, Typography } from "@mui/material"
import { useState } from "react"

export function AdminExportPopuliMailingLists() {
  const endpoint = "/api/mailingList"
  const [disabledAlumni, setDisabledAlumni] = useState(false)
  const [disabledNotAlumni, setDisabledNotAlumni] = useState(false)
  return (
    <Stack spacing={2} alignItems={"flex-start"}>
      <Typography>
        Export Populi data as csv so you can import into Square Space mailing
        lists.
      </Typography>
      <Typography>
        It may take a few minutes to generate the csv file and download it
        because it must query Populi 200 people at a time.
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button
          sx={{ minWidth: 200 }}
          startIcon={<DownloadIcon />}
          variant="outlined"
          onClick={() => {
            setDisabledAlumni(true)
            window.location.href = `${endpoint}?alumni=true`
          }}
          disabled={disabledAlumni}
        >
          Alumni
        </Button>
        <Button
          sx={{ minWidth: 200 }}
          startIcon={<DownloadIcon />}
          variant="outlined"
          onClick={() => {
            setDisabledNotAlumni(true)
            window.location.href = `${endpoint}?alumni=false`
          }}
          disabled={disabledNotAlumni}
        >
          Not Alumni
        </Button>
      </Stack>
    </Stack>
  )
}
