import { NextApiResponse } from "next"
import { buildResponse } from "../../lib/server/buildResponse"
import { UnauthorizedException } from "../../lib/server/HttpException"
import { exportFromPopuliToMailChimp } from "../../lib/server/populi-mailchimp/exportFromPopuliToMailChimp"
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
      await exportFromPopuliToMailChimp()
      return true
    }
  })
}

export default withSession(handler)
