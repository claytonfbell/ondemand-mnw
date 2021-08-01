/*
  Warnings:

  - You are about to drop the `Asset` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UsersOnAssets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UsersOnAssets" DROP CONSTRAINT "UsersOnAssets_assetId_fkey";

-- DropForeignKey
ALTER TABLE "UsersOnAssets" DROP CONSTRAINT "UsersOnAssets_userId_fkey";

-- DropTable
DROP TABLE "Asset";

-- DropTable
DROP TABLE "UsersOnAssets";

-- CreateTable
CREATE TABLE "Webinar" (
    "id" SERIAL NOT NULL,
    "muxAssetId" VARCHAR(255),
    "sku" VARCHAR(255),
    "title" VARCHAR(255),
    "description" VARCHAR(4000),
    "surveyUrl" VARCHAR(1000),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebinarsOnUsers" (
    "webinarId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "squareSpaceOrderId" VARCHAR(255) NOT NULL,
    "firstViewAt" TIMESTAMP(3),

    PRIMARY KEY ("userId","webinarId","squareSpaceOrderId")
);

-- AddForeignKey
ALTER TABLE "WebinarsOnUsers" ADD FOREIGN KEY ("webinarId") REFERENCES "Webinar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebinarsOnUsers" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
