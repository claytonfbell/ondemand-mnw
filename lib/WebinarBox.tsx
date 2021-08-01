import { Box, Button, Grid, Paper, Typography } from "@mui/material"
import { Spacer } from "material-ui-pack"
import ReactMarkdown from "react-markdown"
import { MuxVideoPlayer } from "./admin/MuxVideoPlayer"
import { WebinarWithMuxAssets } from "./api/WebinarWithMuxAssets"
import { Title } from "./Title"

interface Props {
  webinar: WebinarWithMuxAssets
}

export function WebinarBox(props: Props) {
  return (
    <Paper sx={{ marginBottom: 3 }}>
      <Box padding={3}>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Title label={props.webinar.title} />
            <Typography>
              <ReactMarkdown>{props.webinar.description}</ReactMarkdown>
            </Typography>
          </Grid>
          <Grid item>
            {props.webinar.surveyUrl !== null &&
            props.webinar.surveyUrl !== "" ? (
              <>
                <Spacer />
                <Button
                  size="large"
                  color="secondary"
                  variant="contained"
                  href={props.webinar.surveyUrl}
                  target="google"
                >
                  Complete the Survey After
                </Button>
              </>
            ) : null}
          </Grid>
        </Grid>

        {props.webinar.muxAssets.map((muxAsset) => (
          <MuxVideoPlayer
            key={muxAsset.muxAssetId}
            muxAssetId={muxAsset.muxAssetId}
          />
        ))}
      </Box>
    </Paper>
  )
}
