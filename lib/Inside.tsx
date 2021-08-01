import {
  AppBar,
  Button,
  Container,
  CssBaseline,
  Grid,
  Toolbar,
} from "@mui/material"
import NextLink from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { useCheckLogin, useLogout } from "./api/api"
import { AppErrorBoundary } from "./AppErrorBoundary"
import { Login } from "./Login"
import { LogoComponent } from "./LogoComponent"
import { Outside } from "./Outside"

interface Props {
  title: string
  children: React.ReactNode
}

export function Inside(props: Props) {
  const { data: loginResponse, isLoading } = useCheckLogin()

  // timer
  const [timer, setTimer] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setTimer((prev) => prev + 1), 100)
    return () => clearInterval(t)
  }, [])

  const { mutateAsync: logout } = useLogout()

  const { pathname } = useRouter()

  return (
    <>
      <CssBaseline />
      {isLoading ? null : loginResponse === undefined ? (
        <Outside title="Login">
          <Login />
        </Outside>
      ) : (
        <>
          <AppBar position="static" color="default" variant="outlined">
            <Toolbar>
              <Grid
                container
                spacing={1}
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item>
                  <NextLink href="/">
                    <a>
                      <LogoComponent scale={0.5} />
                    </a>
                  </NextLink>
                </Grid>
                <Grid item>
                  {loginResponse.user.isAdmin === true ? (
                    <>
                      <NextLink href="/">
                        <Button
                          variant={pathname === "/" ? "outlined" : "text"}
                        >
                          Main
                        </Button>
                      </NextLink>
                      <NextLink href="/admin">
                        <Button
                          variant={pathname === "/admin" ? "outlined" : "text"}
                        >
                          Admin
                        </Button>
                      </NextLink>
                    </>
                  ) : null}
                  <Button variant="text" onClick={() => logout()}>
                    Logout
                  </Button>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>

          <Container
            style={{
              marginTop: 24,
              paddingBottom: 120,
            }}
          >
            <main>
              <AppErrorBoundary>{props.children}</AppErrorBoundary>
            </main>
          </Container>
        </>
      )}
    </>
  )
}
