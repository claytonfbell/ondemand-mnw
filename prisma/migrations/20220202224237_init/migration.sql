/*
  Warnings:

  - Made the column `muxAssetId` on table `Webinar` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sku` on table `Webinar` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `Webinar` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Webinar` required. This step will fail if there are existing NULL values in that column.
  - Made the column `surveyUrl` on table `Webinar` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Webinar" ALTER COLUMN "muxAssetId" SET NOT NULL,
ALTER COLUMN "sku" SET NOT NULL,
ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "surveyUrl" SET NOT NULL;
