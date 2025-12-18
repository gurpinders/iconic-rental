import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, generateVerificationToken } from '@/lib/customer-auth';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      vehicleId,
      totalPrice,
      pickupTime,
      driverName,
      driverPhone,
      vehicleDetails,
      notes,
      createCustomerAccount,
      customerPassword,
    } = body;

    // Validate required fields
    if (!vehicleId || !totalPrice || !pickupTime) {
      return NextResponse.json(
        { error: 'Vehicle, total price, and pickup time are required' },
        { status: 400 }
      );
    }

    // Get the quote
    const quote = await prisma.quote.findUnique({
      where: { id },
    });

    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    // Check if booking already exists for this quote
    const existingBooking = await prisma.booking.findUnique({
      where: { quoteId: id },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: 'Booking already exists for this quote' },
        { status: 400 }
      );
    }

    let customerId = quote.customerId;

    // If customer account doesn't exist and we should create one
    if (!customerId && createCustomerAccount) {
      if (!customerPassword) {
        return NextResponse.json(
          { error: 'Password required to create customer account' },
          { status: 400 }
        );
      }

      // Check if customer already exists by email
      const existingCustomer = await prisma.customer.findUnique({
        where: { email: quote.email.toLowerCase() },
      });

      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        // Create customer account
        const passwordHash = await hashPassword(customerPassword);
        const verificationToken = generateVerificationToken();

        const newCustomer = await prisma.customer.create({
          data: {
            email: quote.email.toLowerCase(),
            passwordHash,
            firstName: quote.firstName,
            lastName: quote.lastName,
            phone: quote.phone,
            company: quote.company,
            verificationToken,
            emailVerified: false, // They'll need to verify
          },
        });

        customerId = newCustomer.id;
      }
    }

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer account required. Enable "Create customer account" option.' },
        { status: 400 }
      );
    }

    // Generate booking number
    const bookingNumber = `BK${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        bookingNumber,
        customerId,
        quoteId: id,
        status: 'CONFIRMED',
        serviceType: quote.serviceType,
        vehicleId,
        eventDate: quote.eventDate,
        eventType: quote.eventType,
        pickupTime,
        pickupLocation: quote.pickupLocation,
        dropoffLocation: quote.dropoffLocation,
        numberOfHours: quote.numberOfHours,
        numberOfPassengers: quote.numberOfPassengers,
        specialRequests: quote.specialRequests,
        totalPrice,
        paidAmount: 0,
        driverName: driverName || null,
        driverPhone: driverPhone || null,
        vehicleDetails: vehicleDetails || null,
        notes: notes || null,
      },
    });

    // Update quote status to ACCEPTED
    await prisma.quote.update({
      where: { id },
      data: {
        status: 'ACCEPTED',
        customerId, // Link the quote to customer
      },
    });

    console.log('Booking created:', booking.bookingNumber);

    return NextResponse.json({
      success: true,
      message: 'Booking created successfully',
      booking: {
        id: booking.id,
        bookingNumber: booking.bookingNumber,
      },
    });

  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create booking',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}