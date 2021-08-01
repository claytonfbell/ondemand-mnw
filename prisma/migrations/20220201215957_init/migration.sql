/*
  Warnings:

  - The primary key for the `UsersOnAssets` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `squareSpaceOrderId` on the `UsersOnAssets` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - Made the column `squareSpaceOrderId` on table `UsersOnAssets` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UsersOnAssets" DROP CONSTRAINT "UsersOnAssets_pkey",
ALTER COLUMN "squareSpaceOrderId" SET NOT NULL,
ALTER COLUMN "squareSpaceOrderId" SET DATA TYPE VARCHAR(255),
ADD PRIMARY KEY ("userId", "assetId", "squareSpaceOrderId");
