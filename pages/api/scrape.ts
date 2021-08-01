import { NextApiResponse } from "next"
import { buildResponse } from "../../lib/server/buildResponse"
import withSession, { NextIronRequest } from "../../lib/server/session"
import { sendNewPurchasersLoginLinks } from "../../lib/server/squarespace/sendNewPurchasersLoginLinks"

async function handler(
  req: NextIronRequest,
  res: NextApiResponse
): Promise<void> {
  buildResponse(res, async () => {
    if (req.method === "GET") {
      // FETCH ORDERS
      return await sendNewPurchasersLoginLinks()
    }
  })
}

export default withSession(handler)
