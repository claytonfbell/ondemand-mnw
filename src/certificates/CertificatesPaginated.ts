import { Certificate } from "@prisma/client"
import { Pagination } from "../shared/Pagination"

export interface CertificatesPaginated extends Pagination {
  data: Certificate[]
}
