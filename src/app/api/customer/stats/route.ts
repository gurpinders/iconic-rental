import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentCustomer } from '@/lib/customer-auth';

export async function GET(request: Request) {
  try {
    // Get authenticated customer
    const customer = await getCurrentCustomer();

    if (!customer) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get current date for upcoming bookings
    const now = new Date();

    // Fetch stats
    const [
      totalBookings,
      upcomingBookings,
      completedBookings,
      pendingInvoices,
    ] = await Promise.all([
      // Total bookings
      prisma.booking.count({
        where: { customerId: customer.id },
      }),
      
      // Upcoming bookings (future dates, status CONFIRMED or PENDING)
      prisma.booking.count({
        where: {
          customerId: customer.id,
          eventDate: { gte: now },
          status: { in: ['CONFIRMED', 'PENDING'] },
        },
      }),
      
      // Completed bookings
      prisma.booking.count({
        where: {
          customerId: customer.id,
          status: 'COMPLETED',
        },
      }),
      
      // Pending invoices
      prisma.invoice.count({
        where: {
          booking: {
            customerId: customer.id,
          },
          status: 'PENDING',
        },
      }),
    ]);

    return NextResponse.json({
      totalBookings,
      upcomingBookings,
      completedBookings,
      pendingInvoices,
    });

  } catch (error) {
    console.error('Customer stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}