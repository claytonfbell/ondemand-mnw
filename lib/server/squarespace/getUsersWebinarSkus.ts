import { User } from "@prisma/client"
import moment from "moment"
import prisma from "../prisma"

export async function getUsersWebinarSkus(user: User) {
  // must have been purchased within 7 days
  const seventDaysAgo = moment().subtract(7, "days").toDate()

  const allItems = await prisma.squarespaceOrderLineItem.findMany({
    where: {
      order: {
        customerEmail: user.email,
        fulfillmentStatus: { not: "CANCELED" },
        createdOn: { gt: seventDaysAgo },
      },
    },
  })

  return allItems
    .filter((x) => x.sku !== undefined && x.sku !== null && x.sku !== "")
    .map((x) => x.sku)
}
