/*
  Warnings:

  - You are about to drop the column `amenities` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `capacity` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `isFeatured` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `licensePlate` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `luggageCapacity` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `make` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `model` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `priceNote` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `priceStarting` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `shortDescription` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Vehicle` table. All the data in the column will be lost.
  - Changed the type of `category` on the `Vehicle` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/

-- Add new columns safely
ALTER TABLE "Vehicle" 
ADD COLUMN IF NOT EXISTS "basePrice" DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS "hourlyRate" DECIMAL(10,2);

-- Add imageUrl if it doesn't exist
ALTER TABLE "Vehicle" 
ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;

-- Make description and features nullable if they exist
ALTER TABLE "Vehicle" 
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "features" DROP NOT NULL;

-- Drop old columns only if they exist (safe cleanup)
ALTER TABLE "Vehicle" 
DROP COLUMN IF EXISTS "amenities",
DROP COLUMN IF EXISTS "capacity",
DROP COLUMN IF EXISTS "color",
DROP COLUMN IF EXISTS "isFeatured",
DROP COLUMN IF EXISTS "licensePlate",
DROP COLUMN IF EXISTS "luggageCapacity",
DROP COLUMN IF EXISTS "make",
DROP COLUMN IF EXISTS "model",
DROP COLUMN IF EXISTS "priceNote",
DROP COLUMN IF EXISTS "priceStarting",
DROP COLUMN IF EXISTS "shortDescription",
DROP COLUMN IF EXISTS "slug",
DROP COLUMN IF EXISTS "thumbnail",
DROP COLUMN IF EXISTS "year";

-- Drop old indexes if they exist
DROP INDEX IF EXISTS "Vehicle_isFeatured_idx";
DROP INDEX IF EXISTS "Vehicle_slug_key";

-- Ensure category index exists
CREATE INDEX IF NOT EXISTS "Vehicle_category_idx" ON "Vehicle"("category");

-- Note: We're keeping the category column as-is to preserve data
-- If category is currently an enum and needs to be TEXT, that requires manual intervention