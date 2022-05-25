import { Pagination } from "../shared/Pagination"
import { UserActivityLogWithUser } from "./UserActivityLogWithUser"

export interface UserActivityLogWithUserPaginated extends Pagination {
  data: UserActivityLogWithUser[]
}
