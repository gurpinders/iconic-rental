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

    let customerId: string | null = quote.customerId;

    // Check if customer already exists by email
    const existingCustomer = await prisma.customer.findUnique({
      where: { email: quote.email.toLowerCase() },
    });

    if (existingCustomer) {
      // Customer already has an account - link to it automatically
      customerId = existingCustomer.id;
      console.log('Linking booking to existing customer account:', existingCustomer.email);
    } else if (createCustomerAccount) {
      // Customer doesn't exist and admin wants to create account
      if (!customerPassword) {
        return NextResponse.json(
          { error: 'Password required to create customer account' },
          { status: 400 }
        );
      }

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
          emailVerified: true, // Auto-verify since admin is creating
        },
      });

      customerId = newCustomer.id;
      console.log('Created new customer account:', newCustomer.email);
    } else {
      // No customer account - booking will use email communication only
      customerId = null;
      console.log('Creating booking without customer account - email communication only');
    }

    // Generate booking number
    const bookingNumber = `BK${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    // Create the booking (conditionally include customerId)
    const booking = await prisma.booking.create({
      data: {
        bookingNumber,
        ...(customerId ? { customerId } : {}), // Only include if not null
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
        ...(customerId ? { customerId } : {}), // Only include if not null
      },
    });

    console.log('Booking created:', booking.bookingNumber);

    return NextResponse.json({
      success: true,
      message: 'Booking created successfully',
      booking: {
        id: booking.id,
        bookingNumber: booking.bookingNumber,
        hasCustomerAccount: !!customerId,
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