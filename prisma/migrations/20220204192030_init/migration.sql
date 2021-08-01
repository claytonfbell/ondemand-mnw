/*
  Warnings:

  - Added the required column `fulfillmentStatus` to the `SquarespaceOrderLineItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FulfillmentStatus" AS ENUM ('PENDING', 'FULFILLED', 'CANCELED');

-- AlterTable
ALTER TABLE "SquarespaceOrderLineItem" ADD COLUMN     "fulfillmentStatus" "FulfillmentStatus" NOT NULL;
