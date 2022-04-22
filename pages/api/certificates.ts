import fontkit from "@pdf-lib/fontkit"
import AdmZip from "adm-zip"
import fs from "fs"
import moment from "moment"
import { NextApiResponse } from "next"
import { PDFDocument, PDFFont, rgb, StandardFonts } from "pdf-lib"
import { GenerateCertificatesRequest } from "../../lib/api/GenerateCertificatesRequest"
import { GenerateCertificatesResponse } from "../../lib/api/GenerateCertificatesResponse"
import { buildResponse } from "../../lib/server/buildResponse"
import { BadRequestException } from "../../lib/server/HttpException"
import prisma from "../../lib/server/prisma"
import { requireAdminAuthentication } from "../../lib/server/requireAuthentication"
import withSession, { NextIronRequest } from "../../lib/server/session"
import validate from "../../lib/server/validate"

async function handler(
  req: NextIronRequest,
  res: NextApiResponse
): Promise<void> {
  buildResponse(res, async () => {
    await requireAdminAuthentication(req, prisma)

    if (req.method === "POST") {
      const { names, description, date, presenterName, eventName } =
        req.body as GenerateCertificatesRequest

      validate({ description }).min(1)
      validate({ presenterName }).min(1)
      validate({ eventName }).min(1)

      const allNames = names
        .split("\n")
        .map((name) => name.trim())
        .filter((name) => name.length > 0)
      if (allNames.length === 0) {
        throw new BadRequestException("No names provided.")
      }

      // passed validation - generate certificates
      const files: string[] = []
      for (let i = 0; i < allNames.length; i++) {
        files.push(
          await generateCertificatePdf({
            names: allNames[i],
            description,
            date,
            presenterName: presenterName,
            eventName,
          })
        )
      }

      // now lets zip them up
      var zip = new AdmZip()
      for (let i = 0; i < files.length; i++) {
        zip.addLocalFile(files[i])
        fs.unlinkSync(files[i])
      }
      zip.writeZip("/tmp/files.zip")
      const base64 = fs.readFileSync("/tmp/files.zip", { encoding: "base64" })
      fs.unlinkSync("/tmp/files.zip")

      // create a filename string for the front-end to use
      const filename = `${moment(date).format("YYYY-MM-DD")}-${sanitizeFileName(
        eventName
      )}-${sanitizeFileName(presenterName)}.zip`

      const response: GenerateCertificatesResponse = {
        base64,
        filename,
      }
      return response
    }
  })
}

export default withSession(handler)

async function generateCertificatePdf({
  eventName,
  names,
  description,
  date,
  presenterName,
}: GenerateCertificatesRequest) {
  const pdfDoc = await PDFDocument.load(
    fs.readFileSync(`${process.cwd()}/certificate-template.pdf`)
  )
  pdfDoc.registerFontkit(fontkit)

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const pages = pdfDoc.getPages()
  const firstPage = pages[0]
  const { width, height } = firstPage.getSize()

  // draw eventName centered
  const eventNameUpper = eventName.toUpperCase()
  firstPage.drawText(eventNameUpper, {
    x: width / 2 - helveticaFont.widthOfTextAtSize(eventNameUpper, 14) / 2,
    y: height / 2 + 82,
    size: 14,
    font: helveticaFont,
    color: rgb(0.2, 0.2, 0.2),
  })

  // draw name centered
  firstPage.drawText(names, {
    x: width / 2 - helveticaFont.widthOfTextAtSize(names, 18) / 2,
    y: height / 2 + 27,
    size: 18,
    font: helveticaFont,
    color: rgb(0.2, 0.2, 0.2),
  })

  // draw description
  firstPage.drawText(wrapText(description, helveticaFont, 7, 320), {
    x: 70,
    y: 190,
    size: 7,
    font: helveticaFont,
    color: rgb(0.2, 0.2, 0.2),
    lineHeight: 9,
  })
  // draw date - right aligned
  const displayDate = moment(date).format("LL")
  firstPage.drawText(displayDate, {
    x: width - 76 - helveticaFont.widthOfTextAtSize(displayDate, 14),
    y: 186,
    size: 14,
    font: helveticaFont,
    color: rgb(0.2, 0.2, 0.2),
    lineHeight: 9,
  })

  // draw presenter name - right aligned
  firstPage.drawText(presenterName, {
    x: width - 76 - helveticaFont.widthOfTextAtSize(presenterName, 14),
    y: 166,
    size: 14,
    font: helveticaFont,
    color: rgb(0.2, 0.2, 0.2),
    lineHeight: 9,
  })

  const pdfBytes = await pdfDoc.save()

  const filename = `${moment(date).format("YYYY-MM-DD")}-${sanitizeFileName(
    names
  )}.pdf`
  const filePath = `/tmp/${filename}`
  fs.writeFileSync(filePath, pdfBytes)

  return filePath
}

function sanitizeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

// wrap text to fit in a box
function wrapText(
  text: string,
  font: PDFFont,
  fontSize: number,
  width: number
) {
  const lines: string[] = []
  let line: string[] = []

  const allWords = text.split(" ")
  while (allWords.length > 0) {
    const word = allWords.shift()
    if (word !== undefined) {
      if (font.widthOfTextAtSize([...line, word].join(" "), fontSize) > width) {
        lines.push([...line].join(" "))
        line = [word]
      } else {
        line.push(word)
      }
    }
  }
  if (line.length > 0) {
    lines.push(line.join(" "))
  }
  console.log(lines.join("\n"))
  return lines.join("\n")
}
