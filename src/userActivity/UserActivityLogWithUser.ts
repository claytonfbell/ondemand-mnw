import { User, UserAcivityLog } from "@prisma/client"

export type UserActivityLogWithUser = UserAcivityLog & {
  user: User
}
