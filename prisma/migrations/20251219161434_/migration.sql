-- CreateEnum
CREATE TYPE "VehicleCategory" AS ENUM ('LIMO', 'PARTY_BUS', 'LUXURY_BUS', 'SPRINTER_VAN', 'SUV');

-- AlterTable
ALTER TABLE "Vehicle" ALTER COLUMN "features" DROP NOT NULL,
ALTER COLUMN "features" SET DATA TYPE TEXT;
