import moment from "moment"
import prisma from "../prisma"

export async function applyWebinarsToUsers() {
  // get all the items not yet applied
  const items = await prisma.squarespaceOrderLineItem.findMany({
    where: {
      applied: false,
    },
    include: {
      order: true,
    },
  })
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const webinar = await prisma.webinar.findFirst({ where: { sku: item.sku } })
    // there is a webinar, so we will create users (if necessary) and apply the webinars to them
    if (webinar !== null && item.quantity > 0) {
      for (let j = 0; j < item.emails.length && j < item.quantity; j++) {
        const email = item.emails[j]
        let user = await prisma.user.findUnique({ where: { email } })
        if (user === null) {
          user = await prisma.user.create({
            data: {
              email,
              isAdmin: false,
            },
          })
        }

        // set an expiration for viewing the webinar
        const expiresAt: Date = moment(item.order.createdOn)
          .add(7, "days")
          .toDate()

        await prisma.webinarsOnUsers.upsert({
          where: {
            webinarId_userId: {
              userId: user.id,
              webinarId: webinar.id,
            },
          },
          create: {
            webinarId: webinar.id,
            userId: user.id,
            expiresAt,
            orderId: item.orderId,
          },
          update: {
            expiresAt,
            orderId: item.orderId,
          },
        })
      }
    }

    // now mark off applied column
    await prisma.squarespaceOrderLineItem.update({
      where: { id: item.id },
      data: {
        applied: true,
      },
    })
  }
}
