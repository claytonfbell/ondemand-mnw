import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import ReactMarkdown from "react-markdown"
import { MuxVideoPlayer } from "./admin/MuxVideoPlayer"
import { WebinarWithMuxAssets } from "./api/WebinarWithMuxAssets"
import { Title } from "./Title"

interface Props {
  webinar: WebinarWithMuxAssets
}

export function WebinarBox(props: Props) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  return (
    <Paper sx={{ marginBottom: 3 }}>
      <Box padding={isMobile ? 2 : 5}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={7} md={8} lg={9}>
            <Title label={props.webinar.title} />
          </Grid>
          <Grid item xs={12} sm={5} md={4} lg={3}>
            {props.webinar.surveyUrl !== null &&
            props.webinar.surveyUrl !== "" ? (
              <>
                <Button
                  fullWidth
                  size="large"
                  color="secondary"
                  variant="contained"
                  href={props.webinar.surveyUrl}
                  target="google"
                >
                  Complete the Quiz
                </Button>
              </>
            ) : null}
          </Grid>
          <Grid item xs={12}>
            <Typography>
              <ReactMarkdown>{props.webinar.description}</ReactMarkdown>
            </Typography>
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
