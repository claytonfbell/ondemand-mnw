import fontkit from "@pdf-lib/fontkit"
import { Certificate } from "@prisma/client"
import AdmZip from "adm-zip"
import fs from "fs"
import moment from "moment"
import { NextApiResponse } from "next"
import { PDFDocument, PDFFont, rgb, StandardFonts } from "pdf-lib"
import { GenerateCertificatesResponse } from "../../../../lib/api/GenerateCertificatesResponse"
import { buildResponse } from "../../../../lib/server/buildResponse"
import {
  BadRequestException,
  NotFoundException,
} from "../../../../lib/server/HttpException"
import prisma from "../../../../lib/server/prisma"
import { requireAdminAuthentication } from "../../../../lib/server/requireAuthentication"
import withSession, { NextIronRequest } from "../../../../lib/server/session"

async function handler(
  req: NextIronRequest,
  res: NextApiResponse
): Promise<void> {
  buildResponse(res, async () => {
    await requireAdminAuthentication(req, prisma)
    const certificateId = parseInt(req.query.certificateId as string)

    const certificate = await prisma.certificate.findFirst({
      where: { id: certificateId },
    })
    if (certificate === null) {
      throw new NotFoundException("Certificate not found")
    }

    if (req.method === "POST") {
      const allNames = certificate.names
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
            ...certificate,
            names: allNames[i],
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
      const filename = `${moment(certificate.date).format(
        "YYYY-MM-DD"
      )}-${sanitizeFileName(certificate.title)}-${sanitizeFileName(
        certificate.presenter
      )}.zip`

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
  title,
  names,
  description,
  date,
  displayDate,
  presenter,
  hours,
}: Certificate) {
  const pdfDoc = await PDFDocument.load(
    fs.readFileSync(`${process.cwd()}/certificate-template.pdf`)
  )
  pdfDoc.registerFontkit(fontkit)

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const pages = pdfDoc.getPages()
  const firstPage = pages[0]
  const { width, height } = firstPage.getSize()

  // draw eventName centered
  const eventNameUpper = title.toUpperCase()
  firstPage.drawText(eventNameUpper, {
    x: width / 2 - helveticaFont.widthOfTextAtSize(eventNameUpper, 14) / 2,
    y: height / 2 + 82,
    size: 14,
    font: helveticaFont,
    color: rgb(0.2, 0.2, 0.2),
  })

  if (hours.length > 0) {
    const hoursText = `${hours} hours`
    firstPage.drawText(hoursText, {
      x: width / 2 - helveticaFont.widthOfTextAtSize(hoursText, 14) / 2,
      y: height / 2 + 62,
      size: 14,
      font: helveticaFont,
      color: rgb(0.2, 0.2, 0.2),
    })
  }

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
  if (displayDate === true) {
    const dateFormatted = moment(date).format("LL")
    firstPage.drawText(dateFormatted, {
      x: width - 76 - helveticaFont.widthOfTextAtSize(dateFormatted, 14),
      y: 186,
      size: 14,
      font: helveticaFont,
      color: rgb(0.2, 0.2, 0.2),
      lineHeight: 9,
    })
  }

  // draw presenter name - right aligned
  firstPage.drawText(presenter, {
    x: width - 76 - helveticaFont.widthOfTextAtSize(presenter, 14),
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
  function getLines(paragraph: string) {
    const lines: string[] = []
    let line: string[] = []

    const allWords = paragraph.split(" ")
    while (allWords.length > 0) {
      const word = allWords.shift()
      if (word !== undefined) {
        if (
          font.widthOfTextAtSize([...line, word].join(" "), fontSize) > width
        ) {
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
    return lines.join("\n")
  }

  return text
    .trim()
    .split("\n")
    .map((paragraph) => getLines(paragraph))
    .join("\n")
}
