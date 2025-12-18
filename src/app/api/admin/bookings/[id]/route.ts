import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PATCH - Update booking
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, notes } = body;

    const updateData: any = {};

    if (status !== undefined) {
      updateData.status = status;
      
      // Set completedAt if marked as completed
      if (status === 'COMPLETED') {
        updateData.completedAt = new Date();
      }
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: 'Booking updated successfully',
      booking,
    });

  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}