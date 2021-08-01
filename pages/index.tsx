import Head from "next/head"
import { Inside } from "../lib/Inside"
import { WebinarList } from "../lib/WebinarList"

export default function Home() {
  return (
    <>
      <Head>
        <title>Montessori Northwest Ondemand</title>
        <meta name="description" content="Montessori Northwest Ondemand" />
      </Head>

      <Inside title="Montessori Northwest Ondemand">
        <WebinarList />
      </Inside>

      {/* <ReactQueryDevtools /> */}
    </>
  )
}
