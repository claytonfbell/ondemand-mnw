import { NextApiResponse } from "next"
import { UnauthorizedException } from "../../lib/server/HttpException"
import { buildResponse } from "../../lib/server/buildResponse"
import { runPopuliProcessing } from "../../lib/server/populi-tags/runPopuliProcessing"
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
      await runPopuliProcessing()
      return true
    }
  })
}

export default withSession(handler)
