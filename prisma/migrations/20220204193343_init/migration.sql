/*
  Warnings:

  - You are about to drop the column `fulfillmentStatus` on the `SquarespaceOrderLineItem` table. All the data in the column will be lost.
  - Added the required column `fulfillmentStatus` to the `SquarespaceOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SquarespaceOrder" ADD COLUMN     "fulfillmentStatus" "FulfillmentStatus" NOT NULL;

-- AlterTable
ALTER TABLE "SquarespaceOrderLineItem" DROP COLUMN "fulfillmentStatus";
