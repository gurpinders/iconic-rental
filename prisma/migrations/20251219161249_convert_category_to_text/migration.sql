/*
  Warnings:

  - Changed the type of `category` on the `Vehicle` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/

-- Step 1: Convert the category column from enum to text
-- This preserves all existing data
ALTER TABLE "Vehicle" 
ALTER COLUMN "category" TYPE TEXT USING category::TEXT;

-- Step 2: Now we can safely drop the old enum type (if no other tables use it)
DROP TYPE IF EXISTS "VehicleCategory";

-- Step 3: Ensure the category index exists
CREATE INDEX IF NOT EXISTS "Vehicle_category_idx" ON "Vehicle"("category");
