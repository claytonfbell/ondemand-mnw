import { PaginatedRequest } from "../shared/PaginatedRequest"

export interface FetchUserAcitivityLogParams extends PaginatedRequest {
  keyword: string
}
