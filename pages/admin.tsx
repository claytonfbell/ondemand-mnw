import { Alert } from "@mui/material"
import Head from "next/head"
import { AdminTools } from "../lib/admin/AdminTools"
import { useCheckLogin } from "../lib/api/api"
import { Inside } from "../lib/Inside"

export default function Home() {
  const { data: login } = useCheckLogin()

  return (
    <>
      <Head>
        <title>Montessori Northwest Ondemand Admin</title>
        <meta
          name="description"
          content="Montessori Northwest Ondemand Admin"
        />
      </Head>
      <Inside title="Admin">
        {login?.user.isAdmin === true ? (
          <AdminTools />
        ) : (
          <Alert severity="error" variant="filled">
            You are not an admin user.
          </Alert>
        )}
      </Inside>
    </>
  )
}
