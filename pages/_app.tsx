import { CacheProvider, EmotionCache } from "@emotion/react"
import CssBaseline from "@mui/material/CssBaseline"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { AppProps } from "next/app"
import Head from "next/head"
import * as React from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import createEmotionCache from "../lib/createEmotionCache"
import theme from "../lib/theme"

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}
const queryClient = new QueryClient()

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Montessori Northwest</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <MyThemeProvider>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component {...pageProps} />
        </MyThemeProvider>
      </QueryClientProvider>
    </CacheProvider>
  )
}

function MyThemeProvider(props: any) {
  const { Component, pageProps } = props
  const myTheme = createTheme(theme)
  return <ThemeProvider theme={myTheme}>{props.children}</ThemeProvider>
}
