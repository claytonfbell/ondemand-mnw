/*
  Warnings:

  - You are about to drop the column `muxAssetId` on the `Webinar` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Webinar.muxAssetId_unique";

-- AlterTable
ALTER TABLE "Webinar" DROP COLUMN "muxAssetId";

-- CreateTable
CREATE TABLE "MuxAsset" (
    "id" SERIAL NOT NULL,
    "assetId" VARCHAR(255) NOT NULL,
    "originalFileName" VARCHAR(255) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MuxAssetsOnWebinars" (
    "webinarId" INTEGER NOT NULL,
    "muxAssetId" INTEGER NOT NULL,
    "orderBy" INTEGER NOT NULL,

    PRIMARY KEY ("muxAssetId","webinarId")
);

-- CreateIndex
CREATE UNIQUE INDEX "MuxAsset.assetId_unique" ON "MuxAsset"("assetId");

-- AddForeignKey
ALTER TABLE "MuxAssetsOnWebinars" ADD FOREIGN KEY ("webinarId") REFERENCES "Webinar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MuxAssetsOnWebinars" ADD FOREIGN KEY ("muxAssetId") REFERENCES "MuxAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
