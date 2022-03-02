import { User, Webinar, WebinarsOnUsers } from "@prisma/client"

export type UserWithWebinars = User & {
  webinars: (WebinarsOnUsers & {
    webinar: Webinar
  })[]
}
