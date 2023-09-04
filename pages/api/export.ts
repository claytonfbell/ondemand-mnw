import { NextApiResponse } from "next"
import {
  NotFoundException,
  UnauthorizedException,
} from "../../lib/server/HttpException"
import { buildResponse } from "../../lib/server/buildResponse"
import withSession, { NextIronRequest } from "../../lib/server/session"

async function handler(
  req: NextIronRequest,
  res: NextApiResponse
): Promise<void> {
  buildResponse(res, async () => {
    if (req.method === "GET") {
      if (req.query.ck !== process.env.CRON_KEY) {
        throw new UnauthorizedException()
      }
      throw new NotFoundException("This has been discontinued.")
      //   await exportFromPopuliToMailChimp()
      //   return true
    }
  })
}

export default withSession(handler)
