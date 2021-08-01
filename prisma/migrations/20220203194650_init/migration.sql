/*
  Warnings:

  - The primary key for the `MuxAsset` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `assetId` on the `MuxAsset` table. All the data in the column will be lost.
  - The primary key for the `MuxAssetsOnWebinars` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "MuxAssetsOnWebinars" DROP CONSTRAINT "MuxAssetsOnWebinars_muxAssetId_fkey";

-- DropIndex
DROP INDEX "MuxAsset.assetId_unique";

-- AlterTable
ALTER TABLE "MuxAsset" DROP CONSTRAINT "MuxAsset_pkey",
DROP COLUMN "assetId",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(255),
ADD PRIMARY KEY ("id");
DROP SEQUENCE "MuxAsset_id_seq";

-- AlterTable
ALTER TABLE "MuxAssetsOnWebinars" DROP CONSTRAINT "MuxAssetsOnWebinars_pkey",
ALTER COLUMN "muxAssetId" SET DATA TYPE VARCHAR(255),
ADD PRIMARY KEY ("muxAssetId", "webinarId");

-- AddForeignKey
ALTER TABLE "MuxAssetsOnWebinars" ADD FOREIGN KEY ("muxAssetId") REFERENCES "MuxAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
