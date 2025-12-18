-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "driverAssignedAt" TIMESTAMP(3),
ADD COLUMN     "driverId" TEXT;

-- CreateTable
CREATE TABLE "Driver" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "licenseNumber" TEXT,
    "licenseExpiry" TIMESTAMP(3),
    "licenseClass" TEXT,
    "employeeNumber" TEXT,
    "hireDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "photoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DriverUnavailability" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DriverUnavailability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Driver_email_key" ON "Driver"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_employeeNumber_key" ON "Driver"("employeeNumber");

-- CreateIndex
CREATE INDEX "Driver_isActive_idx" ON "Driver"("isActive");

-- CreateIndex
CREATE INDEX "Driver_email_idx" ON "Driver"("email");

-- CreateIndex
CREATE INDEX "DriverUnavailability_driverId_idx" ON "DriverUnavailability"("driverId");

-- CreateIndex
CREATE INDEX "DriverUnavailability_startDate_endDate_idx" ON "DriverUnavailability"("startDate", "endDate");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverUnavailability" ADD CONSTRAINT "DriverUnavailability_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE CASCADE ON UPDATE CASCADE;
