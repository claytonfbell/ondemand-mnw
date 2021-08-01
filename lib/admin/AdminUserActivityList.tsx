import { DisplayDateTime, ResponsiveTable, Spacer } from "material-ui-pack"
import moment from "moment"
import { useFetchUserActivities } from "../api/api"
import { Title } from "../Title"

export function AdminUserActivityList() {
  const { data: activities = [] } = useFetchUserActivities()

  return (
    <>
      <Title label="User Activity" />
      <Spacer />
      <ResponsiveTable
        striped
        rowData={activities}
        schema={[
          {
            label: "User",
            render: (x) => x.user.email,
          },
          {
            label: "Time",
            render: (x) => (
              <DisplayDateTime
                iso8601={moment(x.time).toISOString()}
                fromNow={true}
              />
            ),
          },
          {
            label: "Activity",
            render: (x) => x.details,
          },
        ]}
      />

      <Spacer />
    </>
  )
}
