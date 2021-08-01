import { Box, Container, Grid } from "@mui/material"
import { Tabs } from "material-ui-bootstrap"
import React, { useState } from "react"
import ReactMarkdown from "react-markdown"
import { LogoComponent } from "./LogoComponent"

interface Props {
  title: string
  children: React.ReactNode
}

const FOOTER_CONTENT = ``

export function Outside(props: Props) {
  const [selected, setSelected] = useState(0)

  return (
    <Container>
      <Grid container style={{ minHeight: "100vh" }} alignItems="center">
        <Grid item xs={12}>
          <Box maxWidth={400} minHeight={800} style={{ margin: "auto" }}>
            <Grid
              container
              alignItems="center"
              alignContent="center"
              justifyContent="space-around"
            >
              <Grid item>
                <LogoComponent scale={1} />
              </Grid>
            </Grid>
            <Tabs
              tabs={["Login", "Help"]}
              selectedIndex={selected}
              onSelect={(x) => setSelected(x)}
            >
              {selected === 0 ? props.children : null}
              {selected === 1 ? <>Help info goes here</> : null}
            </Tabs>
            <ReactMarkdown>{FOOTER_CONTENT}</ReactMarkdown>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}
