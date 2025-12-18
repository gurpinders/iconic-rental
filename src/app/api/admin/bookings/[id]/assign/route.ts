import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { driverId, vehicleId } = body;

    // Get the booking
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // TODO: Add conflict detection (check if driver/vehicle already assigned for this date)
    // For now, we'll just assign

    // Update booking with driver and vehicle
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        driverId: driverId || null,
        vehicleId: vehicleId || null,
        driverAssignedAt: driverId ? new Date() : null,
      },
    });

    console.log('Driver/Vehicle assigned to booking:', updatedBooking.bookingNumber);

    return NextResponse.json({
      success: true,
      message: 'Driver and vehicle assigned successfully',
      booking: updatedBooking,
    });

  } catch (error) {
    console.error('Assign driver/vehicle error:', error);
    return NextResponse.json(
      { error: 'Failed to assign driver/vehicle' },
      { status: 500 }
    );
  }
}