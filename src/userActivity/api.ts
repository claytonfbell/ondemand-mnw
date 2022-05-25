import { useQuery } from "react-query"
import rest, { RestError } from "../../lib/api/rest"
import { FetchUserAcitivityLogParams } from "./FetchUserAcitivityLogParams"
import { UserActivityLogWithUserPaginated } from "./UserActivityLogWithUserPaginated"

export function useFetchUserActivities(params: FetchUserAcitivityLogParams) {
  return useQuery<UserActivityLogWithUserPaginated, RestError>(
    ["userActivities", params],
    () => rest.get(`/userActivities`, params)
  )
}
