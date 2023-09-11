import { Box } from "@mui/material"
import { Tabs } from "material-ui-bootstrap"
import { useRouter, useSearchParams } from "next/navigation"
import { AdminCertificateList } from "../../src/certificates/AdminCertificateList"
import { AdminUserActivityList } from "../../src/userActivity/AdminUserActivityList"
import { AdminExportPopuliMailingLists } from "./AdminExportPopuliMailingLists"
import { AdminUsersList } from "./AdminUserList"
import { AdminVideosList } from "./AdminVideosList"
import { AdminWebinarsList } from "./AdminWebinarsList"

type TabItem = {
  label: string
  slug: string
}

export function AdminTools() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabs: TabItem[] = [
    { label: "Webinars", slug: "webinars" },
    { label: "Videos", slug: "videos" },
    { label: "User Activity", slug: "user-activity" },
    { label: "Manage Users", slug: "manage-users" },
    { label: "Generate Certificates", slug: "generate-certificates" },
    {
      label: "Export Populi Mailing Lists",
      slug: "export-populi-mailing-lists",
    },
  ]
  const selected = Math.max(
    0,
    tabs.findIndex((t) => t.slug === searchParams.get("t"))
  )

  return (
    <Tabs
      selectedIndex={selected}
      onSelect={(newIndex) => {
        if (newIndex > 0) {
          const tab = tabs[newIndex].slug
          router.push(`?t=${tab}`)
        } else {
          router.push(``)
        }
      }}
      tabs={tabs.map((t) => t.label)}
    >
      <Box
        sx={{
          minHeight: 500,
        }}
      >
        {selected === 0 ? <AdminWebinarsList /> : null}
        {selected === 1 ? <AdminVideosList /> : null}
        {selected === 2 ? <AdminUserActivityList /> : null}
        {selected === 3 ? <AdminUsersList /> : null}
        {selected === 4 ? <AdminCertificateList /> : null}
        {selected === 5 ? <AdminExportPopuliMailingLists /> : null}
      </Box>
    </Tabs>
  )
}
