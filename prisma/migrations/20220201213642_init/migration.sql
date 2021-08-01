/*
  Warnings:

  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CarryOver` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UsersOnOrganizations` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[authCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "CarryOver" DROP CONSTRAINT "CarryOver_accountId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_accountId_fkey";

-- DropForeignKey
ALTER TABLE "UsersOnOrganizations" DROP CONSTRAINT "UsersOnOrganizations_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "UsersOnOrganizations" DROP CONSTRAINT "UsersOnOrganizations_userId_fkey";

-- DropIndex
DROP INDEX "User.authCode_index";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "passwordHash";

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "CarryOver";

-- DropTable
DROP TABLE "Item";

-- DropTable
DROP TABLE "Organization";

-- DropTable
DROP TABLE "Payment";

-- DropTable
DROP TABLE "UsersOnOrganizations";

-- DropEnum
DROP TYPE "AccountType";

-- DropEnum
DROP TYPE "CreditCardType";

-- CreateTable
CREATE TABLE "Asset" (
    "id" SERIAL NOT NULL,
    "muxId" VARCHAR(255),
    "sku" VARCHAR(255),
    "title" VARCHAR(255),
    "description" VARCHAR(4000),
    "surveyUrl" VARCHAR(1000),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersOnAssets" (
    "assetId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "squareSpaceOrderId" TEXT,
    "firstViewAt" TIMESTAMP(3),

    PRIMARY KEY ("userId","assetId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.authCode_unique" ON "User"("authCode");

-- AddForeignKey
ALTER TABLE "UsersOnAssets" ADD FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnAssets" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
