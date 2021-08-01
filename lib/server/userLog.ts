import { User } from "@prisma/client"
import moment from "moment"
import prisma from "./prisma"

export async function userLog(user: User, details: string) {
  return prisma.userAcivityLog.create({
    data: {
      userId: user.id,
      time: moment().toDate(),
      details,
    },
  })
}
