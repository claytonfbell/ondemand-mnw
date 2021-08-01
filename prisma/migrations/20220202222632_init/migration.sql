/*
  Warnings:

  - A unique constraint covering the columns `[muxAssetId]` on the table `Webinar` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Webinar.muxAssetId_unique" ON "Webinar"("muxAssetId");
