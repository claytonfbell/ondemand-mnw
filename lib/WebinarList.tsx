import { Alert, Typography } from "@mui/material"
import { DisplayError } from "material-ui-pack"
import { useFetchAllWebinars } from "./api/api"
import { useAuthenticateWithQueryString } from "./useAuthenticateWithQueryString"
import { WebinarBox } from "./WebinarBox"
export function WebinarList() {
  const { data: webinars, isLoading, error } = useFetchAllWebinars()
  useAuthenticateWithQueryString()
  return (
    <>
      <DisplayError error={error?.message} />
      {isLoading ? <>Loading...</> : null}
      {webinars !== undefined ? (
        <>
          {webinars.length === 0 ? (
            <Alert severity="error" variant="filled">
              <Typography>
                You do not have any recently ordered videos.
              </Typography>
            </Alert>
          ) : null}
          {webinars.map((webinar) => (
            <WebinarBox key={webinar.id} webinar={webinar} />
          ))}
        </>
      ) : null}
    </>
  )
}
