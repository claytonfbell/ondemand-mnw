import { FulfillmentStatus } from "@prisma/client"

export interface ISquarespaceFetchOrdersResponse {
  result: ISquarespaceOrder[]
  pagination: {
    nextPageUrl: null | string
    nextPageCursor: null | string
    hasNextPage: boolean
  }
}

export interface ISquarespaceOrder {
  id: string
  orderNumber: string
  createdOn: string
  modifiedOn: string
  customerEmail: string
  fulfillmentStatus: FulfillmentStatus
  lineItems: ISquarespaceOrderLineItem[]
}

export interface ISquarespaceOrderLineItem {
  id: string
  sku: string | null
  quantity?: number | null
  customizations?: ICustomization[] | null
}

interface ICustomization {
  label: string
  value: string
}
