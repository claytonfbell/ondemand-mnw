import moment from "moment"
import prisma from "./prisma"

export async function getMiscSettings() {
  let miscSettings = await prisma.miscSettings.findUnique({
    where: { id: 1 },
  })
  if (miscSettings === null) {
    const exportFromPopuliLastModifiedTime = moment()
      .subtract("1", "weeks")
      .toDate()
    miscSettings = await prisma.miscSettings.create({
      data: { id: 1, exportFromPopuliLastModifiedTime },
    })
  }
  return miscSettings
}
