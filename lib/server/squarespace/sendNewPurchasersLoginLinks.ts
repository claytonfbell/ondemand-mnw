import { Webinar } from "@prisma/client"
import axios from "axios"
import moment from "moment"
import { v4 as uuidv4 } from "uuid"
import { IStatusMonitorPing } from "../../api/IStatusMonitorPing"
import prisma from "../prisma"
import { sendEmail } from "../sendEmail"
import { userLog } from "../userLog"
import { scrapeOrdersFromSquareSpace } from "./scrapeOrdersFromSquareSpace"

export async function sendNewPurchasersLoginLinks() {
  const logs: string[] = []

  const scraped = await scrapeOrdersFromSquareSpace()
  logs.push(`Scraped ${scraped} order(s) from Squarespace`)

  // get new orders in past hour that havn't received email yet and are not canceled
  const ago = moment().subtract(24, "hours")
  const newOrders = await prisma.squarespaceOrder.findMany({
    where: {
      sentLoginEmail: false,
      modifiedOn: { gt: ago.toDate() },
      fulfillmentStatus: { not: "CANCELED" },
    },
    include: { items: true },
  })

  for (let i = 0; i < newOrders.length; i++) {
    const order = newOrders[i]
    const webinarsToEmail: Webinar[] = []

    const webinars = await prisma.webinar.findMany({
      where: { sku: { in: order.items.map((x) => x.sku) } },
    })

    if (webinars.length > 0) {
      // find user
      let user = await prisma.user.findUnique({
        where: { email: order.customerEmail },
      })
      // create new user if they don't exist yet
      if (user === null) {
        user = await prisma.user.create({
          data: { email: order.customerEmail, isAdmin: false },
        })
      }

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
      const surveyUrls = webinars
        .filter((x) => x.surveyUrl !== null && x.surveyUrl !== "")
        .map((x) => x.surveyUrl)

      const text = `Thank you for purchasing:

${webinars
  .map(
    (w) =>
      `* ${w.title} - [Watch Now](${authLink})${
        w.surveyUrl !== "" ? ` - [Complete Survey After](${w.surveyUrl})` : ""
      }`
  )
  .join("\n")}

This email includes a secure link to the recording, which will last 7 days after the purchase.

${
  surveyUrls.length > 0
    ? `In order to receive a professional development certificate for watching this recorded webinar, please complete the Google Form linked after the video.

After you have watched the webinar and completed the Google Form, email info@montessori-nw.org to let us know you are ready to receive your professional development certificate. Upon receipt of an email from you, we will verify that you purchased the recording and completed the Google Form then we will award your certificate.

If you have time after you have viewed the video and completed the quiz we would love to hear your feedback. By completing the Google Feedback Form we are able to offer Community Education events that suit your needs.
`
    : ""
}

`
      await prisma.squarespaceOrder.update({
        where: { id: order.id },
        data: {
          sentLoginEmail: true,
        },
      })
      await sendEmail({ to: order.customerEmail, subject, text })
      logs.push(
        `${user.email} received order confirmation link to watch videos`
      )
      userLog(user, "Received order confirmation link to watch videos")
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
