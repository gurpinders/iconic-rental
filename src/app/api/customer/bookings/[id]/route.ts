import { NextResponse } from 'next/server';
import { getCurrentCustomer } from '@/lib/customer-auth';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customerToken = await getCurrentCustomer();

    if (!customerToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get booking with full details
    const booking = await prisma.booking.findUnique({
      where: {
        id: id,
        customerId: customerToken.customerId, // Ensure customer owns this booking
      },
      include: {
        vehicle: true,
        quote: true,
        invoices: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      booking,
    });

  } catch (error) {
    console.error('Get booking error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}