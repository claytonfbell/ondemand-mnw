/*
  Warnings:

  - You are about to drop the column `scrapeFromSquarespaceLastModifiedTime` on the `MiscSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MiscSettings" DROP COLUMN "scrapeFromSquarespaceLastModifiedTime",
ADD COLUMN     "scrapeFromSquarespaceLastModifiedTimeB" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "SquarespaceOrderLineItem" ADD COLUMN     "applied" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emails" TEXT[],
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "WebinarsOnUsers" (
    "webinarId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "orderId" VARCHAR(255),

    PRIMARY KEY ("webinarId","userId")
);

-- AddForeignKey
ALTER TABLE "WebinarsOnUsers" ADD FOREIGN KEY ("webinarId") REFERENCES "Webinar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebinarsOnUsers" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebinarsOnUsers" ADD FOREIGN KEY ("orderId") REFERENCES "SquarespaceOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
