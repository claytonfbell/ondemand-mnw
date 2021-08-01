/*
  Warnings:

  - A unique constraint covering the columns `[md5]` on the table `MuxAsset` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `md5` to the `MuxAsset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MuxAsset" ADD COLUMN     "md5" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MuxAsset.md5_unique" ON "MuxAsset"("md5");
