/*
  Warnings:

  - You are about to drop the column `applicableVehicles` on the `PromoCode` table. All the data in the column will be lost.
  - You are about to drop the column `maxDiscount` on the `PromoCode` table. All the data in the column will be lost.
  - You are about to drop the column `minBookingAmount` on the `PromoCode` table. All the data in the column will be lost.
  - You are about to drop the column `usageLimit` on the `PromoCode` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "PromoCode_validFrom_validUntil_idx";

-- DropIndex
DROP INDEX "Quote_eventDate_idx";

-- AlterTable
ALTER TABLE "PromoCode" DROP COLUMN "applicableVehicles",
DROP COLUMN "maxDiscount",
DROP COLUMN "minBookingAmount",
DROP COLUMN "usageLimit",
ADD COLUMN     "maxUses" INTEGER,
ADD COLUMN     "minimumPurchase" DECIMAL(10,2),
ALTER COLUMN "validFrom" DROP NOT NULL,
ALTER COLUMN "validUntil" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "promoCodeId" TEXT;

-- CreateIndex
CREATE INDEX "Quote_email_idx" ON "Quote"("email");

-- CreateIndex
CREATE INDEX "Quote_promoCodeId_idx" ON "Quote"("promoCodeId");

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_promoCodeId_fkey" FOREIGN KEY ("promoCodeId") REFERENCES "PromoCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;
