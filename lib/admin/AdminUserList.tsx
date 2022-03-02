import { Button, Chip, Grid } from "@mui/material"
import { ResponsiveTable, Spacer } from "material-ui-pack"
import moment from "moment"
import { useState } from "react"
import { useFetchUsers } from "../api/api"
import { UserWithWebinars } from "../api/UserWithWebinars"
import { Title } from "../Title"
import { AddUserDialog } from "./AddUserDialog"
import { UserDialog } from "./UserDialog"

export function AdminUsersList() {
  const { data: users = [] } = useFetchUsers()
  const [openUser, setOpenUser] = useState<UserWithWebinars>()
  const [openAddUser, setOpenAddUser] = useState(false)

  return (
    <>
      <Grid container justifyContent="space-between">
        <Grid item>
          <Title label="Users" />
        </Grid>
        <Grid item>
          <Button variant="outlined" onClick={() => setOpenAddUser(true)}>
            Add New User
          </Button>
        </Grid>
      </Grid>
      <Spacer />
      <ResponsiveTable
        striped
        rowData={users}
        onEdit={(x) => setOpenUser(x)}
        schema={[
          {
            label: "Email",
            render: (x) => x.email,
          },
          {
            label: "Active Webinars",
            render: (x) => (
              <>
                {x.webinars
                  .filter((x) => moment(x.expiresAt).isAfter(moment()))
                  .map((webinarsOnUser) => (
                    <Chip
                      key={webinarsOnUser.webinarId}
                      sx={{
                        marginRight: 1,
                        marginBottom: 1,
                      }}
                      size="small"
                      label={webinarsOnUser.webinar.title}
                    />
                  ))}
              </>
            ),
          },
        ]}
      />
      <UserDialog
        userId={openUser?.id}
        onClose={() => setOpenUser(undefined)}
      />
      <AddUserDialog open={openAddUser} onClose={() => setOpenAddUser(false)} />
      <Spacer />
    </>
  )
}
