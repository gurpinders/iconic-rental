import { NextResponse } from 'next/server';
import { getCurrentCustomer } from '@/lib/customer-auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const customerToken = await getCurrentCustomer();

    if (!customerToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get all bookings for this customer
    const bookings = await prisma.booking.findMany({
      where: {
        customerId: customerToken.customerId,
      },
      include: {
        vehicle: {
          select: {
            name: true,
            category: true,
            imageUrl: true,
          },
        },
        quote: {
          select: {
            quoteNumber: true,
          },
        },
      },
      orderBy: {
        eventDate: 'desc',
      },
    });

    // Categorize bookings
    const now = new Date();
    const categorized = {
      upcoming: bookings.filter(b => new Date(b.eventDate) > now && b.status !== 'CANCELLED' && b.status !== 'COMPLETED'),
      past: bookings.filter(b => new Date(b.eventDate) <= now || b.status === 'COMPLETED'),
      cancelled: bookings.filter(b => b.status === 'CANCELLED'),
    };

    return NextResponse.json({
      success: true,
      bookings,
      categorized,
      total: bookings.length,
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}