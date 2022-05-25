-- DropForeignKey
ALTER TABLE "MuxAssetsOnWebinars" DROP CONSTRAINT "MuxAssetsOnWebinars_muxAssetId_fkey";

-- DropForeignKey
ALTER TABLE "MuxAssetsOnWebinars" DROP CONSTRAINT "MuxAssetsOnWebinars_webinarId_fkey";

-- DropForeignKey
ALTER TABLE "SquarespaceOrderLineItem" DROP CONSTRAINT "SquarespaceOrderLineItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "UserAcivityLog" DROP CONSTRAINT "UserAcivityLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "WebinarsOnUsers" DROP CONSTRAINT "WebinarsOnUsers_userId_fkey";

-- DropForeignKey
ALTER TABLE "WebinarsOnUsers" DROP CONSTRAINT "WebinarsOnUsers_webinarId_fkey";

-- CreateTable
CREATE TABLE "Certificate" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(4000) NOT NULL,
    "presenter" VARCHAR(255) NOT NULL,
    "hours" VARCHAR(255) NOT NULL,
    "date" TEXT NOT NULL,
    "displayDate" BOOLEAN NOT NULL,
    "names" VARCHAR(4000) NOT NULL,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WebinarsOnUsers" ADD CONSTRAINT "WebinarsOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebinarsOnUsers" ADD CONSTRAINT "WebinarsOnUsers_webinarId_fkey" FOREIGN KEY ("webinarId") REFERENCES "Webinar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MuxAssetsOnWebinars" ADD CONSTRAINT "MuxAssetsOnWebinars_webinarId_fkey" FOREIGN KEY ("webinarId") REFERENCES "Webinar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MuxAssetsOnWebinars" ADD CONSTRAINT "MuxAssetsOnWebinars_muxAssetId_fkey" FOREIGN KEY ("muxAssetId") REFERENCES "MuxAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SquarespaceOrderLineItem" ADD CONSTRAINT "SquarespaceOrderLineItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "SquarespaceOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAcivityLog" ADD CONSTRAINT "UserAcivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "MuxAsset.md5_unique" RENAME TO "MuxAsset_md5_key";

-- RenameIndex
ALTER INDEX "SquarespaceOrder.customerEmail_index" RENAME TO "SquarespaceOrder_customerEmail_idx";

-- RenameIndex
ALTER INDEX "SquarespaceOrderLineItem.sku_index" RENAME TO "SquarespaceOrderLineItem_sku_idx";

-- RenameIndex
ALTER INDEX "User.authCode_unique" RENAME TO "User_authCode_key";

-- RenameIndex
ALTER INDEX "User.email_unique" RENAME TO "User_email_key";
