/*
  Warnings:

  - You are about to drop the `WebinarsOnUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WebinarsOnUsers" DROP CONSTRAINT "WebinarsOnUsers_userId_fkey";

-- DropForeignKey
ALTER TABLE "WebinarsOnUsers" DROP CONSTRAINT "WebinarsOnUsers_webinarId_fkey";

-- DropTable
DROP TABLE "WebinarsOnUsers";

-- CreateTable
CREATE TABLE "SquarespaceOrder" (
    "id" VARCHAR(255) NOT NULL,
    "orderNumber" INTEGER NOT NULL,
    "createdOn" TIMESTAMP(3) NOT NULL,
    "modifiedOn" TIMESTAMP(3) NOT NULL,
    "customerEmail" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SquarespaceOrderLineItem" (
    "id" VARCHAR(255) NOT NULL,
    "orderId" VARCHAR(255) NOT NULL,
    "sku" VARCHAR(255) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SquarespaceOrder.customerEmail_index" ON "SquarespaceOrder"("customerEmail");

-- CreateIndex
CREATE INDEX "SquarespaceOrderLineItem.sku_index" ON "SquarespaceOrderLineItem"("sku");

-- AddForeignKey
ALTER TABLE "SquarespaceOrderLineItem" ADD FOREIGN KEY ("orderId") REFERENCES "SquarespaceOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
