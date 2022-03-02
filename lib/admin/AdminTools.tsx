import { Box } from "@mui/material"
import { Tabs } from "material-ui-bootstrap"
import { useState } from "react"
import { AdminUserActivityList } from "./AdminUserActivityList"
import { AdminUsersList } from "./AdminUserList"
import { AdminVideosList } from "./AdminVideosList"
import { AdminWebinarsList } from "./AdminWebinarsList"

export function AdminTools() {
  const [selected, setSelected] = useState(0)

  return (
    <>
      <Tabs
        selectedIndex={selected}
        onSelect={(newIndex) => setSelected(newIndex)}
        tabs={["Webinars", "Videos", "User Activity", "Manage Users"]}
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
        </Box>
      </Tabs>
    </>
  )
}
