import { User } from "@prisma/client"
import moment from "moment"
import prisma from "../prisma"

export async function getUsersWebinarSkus(user: User) {
  const webinars = await prisma.webinar.findMany({
    where: {
      users: {
        some: {
          userId: user.id,
          expiresAt: { gt: moment().toDate() },
        },
      },
    },
  })
  return webinars.map((x) => x.sku).filter((x) => x.length > 0)
}
