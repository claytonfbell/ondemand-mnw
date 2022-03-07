import axios from "axios"
import moment from "moment"
import { v4 as uuidv4 } from "uuid"
import { IStatusMonitorPing } from "../../api/IStatusMonitorPing"
import prisma from "../prisma"
import { sendEmail } from "../sendEmail"
import { userLog } from "../userLog"
import { applyWebinarsToUsers } from "./applyWebinarsToUsers"
import { scrapeOrdersFromSquareSpace } from "./scrapeOrdersFromSquareSpace"

export async function sendNewPurchasersLoginLinks() {
  const logs: string[] = []

  const scraped = await scrapeOrdersFromSquareSpace()
  logs.push(`Scraped ${scraped} order(s) from Squarespace`)

  const applied = await applyWebinarsToUsers()
  logs.push(`Applied ${applied} webinars(s) to users`)

  // get new orders in past hour that havn't received email yet and are not canceled
  const ago = moment().subtract(24, "hours")
  const newOrders = await prisma.squarespaceOrder.findMany({
    where: {
      sentLoginEmail: false,
      modifiedOn: { gt: ago.toDate() },
      fulfillmentStatus: { not: "CANCELED" },
    },
  })

  for (let i = 0; i < newOrders.length; i++) {
    const order = newOrders[i]

    const users = await prisma.user.findMany({
      where: {
        webinars: { some: { orderId: order.id } },
      },
    })
    for (let j = 0; j < users.length; j++) {
      let user = users[j]

      const webinars = await prisma.webinar.findMany({
        where: { users: { some: { userId: user.id, orderId: order.id } } },
      })

      if (webinars.length > 0) {
        // create new auth code
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            authCode: uuidv4(),
            authCodeExpiresAt: moment().add(1, "days").toDate(),
          },
        })

        const authLink = `${process.env.HOST}/?authCode=${user.authCode}`

        const subject = `Montessori Northwest Order #${order.orderNumber}`
        console.log(subject)
        const surveyUrls = webinars
          .filter((x) => x.surveyUrl !== null && x.surveyUrl !== "")
          .map((x) => x.surveyUrl)

        const text = `Thank you for purchasing:

${webinars
  .map(
    (w) =>
      `* ${w.title} - [Watch Now](${authLink})${
        w.surveyUrl !== "" ? ` - [Complete Quiz After](${w.surveyUrl})` : ""
      }`
  )
  .join("\n")}

  This email includes a secure link to the webinar, which will last 7 days after the purchase.

  In order to receive a professional development certificate for watching this recorded webinar, please complete the quiz linked on the webinar page. After completing the quiz, email [info@montessori-nw.org](mailto:info@montessori-nw.org) to let us know you are ready to receive your certificate. Upon verification of your purchase and completed quiz, we will award your certificate via email.

`
        await prisma.squarespaceOrder.update({
          where: { id: order.id },
          data: {
            sentLoginEmail: true,
          },
        })
        await sendEmail({ to: user.email, subject, text })
        logs.push(
          `${user.email} received order confirmation link to watch videos`
        )
        userLog(user, "Received order confirmation link to watch videos")
      }
    }
  }

  // status monitor
  const ping: IStatusMonitorPing = {
    name: "Scrape New Orders from Squarespace",
    groupName: "Squarespace Orders",
    details: logs.join("\n\n"),
    apiKey: process.env.STATUS_MONITOR_API_KEY || "",
    interval: 10,
    success: true,
    tag: "",
    progressBar: 0,
    emails: ["angelika@montessori-nw.org", "claytonfbell@gmail.com"],
  }
  axios.post(`https://status-monitor.app/api/ping`, ping)

  return true
}
