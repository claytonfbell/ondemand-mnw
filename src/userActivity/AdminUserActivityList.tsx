import Grid from "@mui/material/Grid"
import {
  DisplayDateTime,
  ResponsiveTable,
  Spacer,
  TextFieldBase,
} from "material-ui-pack"
import moment from "moment"
import React from "react"
import { useDebounce } from "react-use"
import { Title } from "../../lib/Title"
import { Paginator } from "../shared/Paginator"
import { useFetchUserActivities } from "./api"
import { FetchUserAcitivityLogParams } from "./FetchUserAcitivityLogParams"

export function AdminUserActivityList() {
  const [keyword, setKeyword] = React.useState("")
  const [state, setState] = React.useState<FetchUserAcitivityLogParams>({
    pageNum: 1,
    pageSize: 100,
    keyword: "",
  })
  const { data } = useFetchUserActivities(state)
  useFetchUserActivities({ ...state, pageNum: state.pageNum + 1 })

  useDebounce(
    () => {
      setState((prev) => ({ ...prev, keyword }))
    },
    500,
    [keyword]
  )

  return (
    <>
      <Title label="User Activity" />
      <Spacer />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextFieldBase
            label="Search Email"
            value={keyword}
            onChange={(keyword) => setKeyword(keyword)}
          />
        </Grid>
      </Grid>
      <Spacer />
      {data !== undefined ? (
        <>
          <Paginator
            results={{ ...data, pageNum: state.pageNum }}
            onChangePage={(pageNum) =>
              setState((prev) => ({ ...prev, pageNum }))
            }
          />
          <ResponsiveTable
            striped
            rowData={data?.data || []}
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
        </>
      ) : null}
      <Spacer />
    </>
  )
}
