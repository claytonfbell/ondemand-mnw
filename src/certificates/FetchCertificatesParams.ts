import { PaginatedRequest } from "../shared/PaginatedRequest"

export interface FetchCertificatesParams extends PaginatedRequest {
  keyword: string
}
