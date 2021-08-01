/*
  Warnings:

  - You are about to drop the column `title` on the `MuxAssetsOnWebinars` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MuxAsset" ADD COLUMN     "title" VARCHAR(255) NOT NULL DEFAULT E'';

-- AlterTable
ALTER TABLE "MuxAssetsOnWebinars" DROP COLUMN "title";
