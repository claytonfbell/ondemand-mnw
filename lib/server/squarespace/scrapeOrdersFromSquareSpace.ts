import axios, { AxiosRequestHeaders } from "axios"
import moment from "moment"
import { getMiscSettings } from "../getMiscSettings"
import prisma from "../prisma"
import {
  ISquarespaceFetchOrdersResponse,
  ISquarespaceOrder,
} from "./ISquarespaceFetchOrdersResponse"

export async function scrapeOrdersFromSquareSpace(): Promise<number> {
  // look back starting in 2020 if database is empty
  let modifiedAfter = moment()
    .set("year", 2020)
    .set("month", 3)
    .set("date", 1)
    .set("hour", 0)
    .set("minute", 0)
    .set("second", 0)
    .set("millisecond", 0)

  // time to use for the next time we run this
  const aFewMinutesAgo = moment().subtract(5, "minutes").toDate()

  // we only need to scrape orders that were modified after our last sync
  //   const mostRecentModification = await prisma.squarespaceOrder.findFirst({
  //     orderBy: { modifiedOn: "desc" },
  //   })
  //   if (mostRecentModification !== null) {
  //     modifiedAfter = moment(mostRecentModification.modifiedOn)
  //   }

  // we only need to scrape orders that were modified after last time we checked
  const miscSettings = await getMiscSettings()
  if (
    miscSettings !== null &&
    miscSettings.scrapeFromSquarespaceLastModifiedTime !== null
  ) {
    modifiedAfter = moment(miscSettings.scrapeFromSquarespaceLastModifiedTime)
  }

  const apiVersion = "1.0"
  const modifiedBefore = moment().toISOString()
  const headers: AxiosRequestHeaders = {
    Authorization: `Bearer ${process.env.SQUARE_SPACE_ORDER_API_KEY}`,
    "User-Agent": "ondemand-mnw",
    "Content-Type": "application/json",
  }

  const url = `https://api.squarespace.com/${apiVersion}/commerce/orders?modifiedAfter=${encodeURIComponent(
    modifiedAfter.toISOString()
  )}&modifiedBefore=${encodeURIComponent(modifiedBefore)}`
  console.log(url)
  let response = await axios.get<ISquarespaceFetchOrdersResponse>(url, {
    headers,
  })

  let count = 0
  await response.data.result.forEach(async (order) => {
    count++
    await insertOrUpdateOrder(order)
  })

  // now loop through all additonal pages
  while (
    response.data.pagination.hasNextPage === true &&
    response.data.pagination.nextPageUrl !== null
  ) {
    response = await axios.get<ISquarespaceFetchOrdersResponse>(
      response.data.pagination.nextPageUrl,
      {
        headers,
      }
    )

    await response.data.result.forEach(async (order) => {
      count++
      await insertOrUpdateOrder(order)
    })
  }

  // for next time
  await prisma.miscSettings.update({
    where: { id: 1 },
    data: {
      scrapeFromSquarespaceLastModifiedTime: aFewMinutesAgo,
    },
  })

  return count
}

async function insertOrUpdateOrder(order: ISquarespaceOrder) {
  const existing = await prisma.squarespaceOrder.findUnique({
    where: { id: order.id },
  })

  // UPDATE EXISTING
  if (existing !== null) {
    await prisma.squarespaceOrder.update({
      where: { id: existing.id },
      data: {
        modifiedOn: moment(order.modifiedOn).toDate(),
        customerEmail: order.customerEmail,
        fulfillmentStatus: order.fulfillmentStatus,
      },
    })
    // recreate the sku items
    await prisma.squarespaceOrderLineItem.deleteMany({
      where: { orderId: existing.id },
    })
  }
  // CREATE FIRST TIME
  else {
    await prisma.squarespaceOrder.create({
      data: {
        id: order.id,
        orderNumber: order.orderNumber,
        createdOn: moment(order.createdOn).toDate(),
        modifiedOn: moment(order.modifiedOn).toDate(),
        customerEmail: order.customerEmail,
        fulfillmentStatus: order.fulfillmentStatus,
      },
    })
  }

  // insert the sku items
  await order.lineItems.forEach(async (lineItem) => {
    await prisma.squarespaceOrderLineItem.create({
      data: { id: lineItem.id, orderId: order.id, sku: lineItem.sku || "" },
    })
  })
}
