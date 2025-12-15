import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendCustomerConfirmation, sendBusinessNotification } from '@/lib/email';

// Generate unique quote number
function generateQuoteNumber(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `IL${timestamp}${random}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'serviceType',
      'eventType',
      'eventDate',
      'pickupLocation',
      'numberOfPassengers'
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Generate unique quote number
    const quoteNumber = generateQuoteNumber();

    // Save quote to database
    const quote = await prisma.quote.create({
      data: {
        quoteNumber,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        serviceType: body.serviceType,
        eventType: body.eventType,
        eventDate: new Date(body.eventDate),
        pickupTime: body.pickupTime && body.pickupTime !== '' ? body.pickupTime : null,
        pickupLocation: body.pickupLocation,
        dropoffLocation: body.dropoffLocation || null,
        numberOfHours: body.numberOfHours ? parseInt(body.numberOfHours) : null,
        numberOfPassengers: parseInt(body.numberOfPassengers),
        specialRequests: body.specialRequests || null,
        status: 'PENDING',
      },
    });

    console.log('Quote saved to database:', quote.quoteNumber);

    // Prepare email data
    const emailData = {
      quoteNumber: quote.quoteNumber,
      firstName: quote.firstName,
      lastName: quote.lastName,
      email: quote.email,
      phone: quote.phone,
      serviceType: quote.serviceType,
      eventType: quote.eventType,
      eventDate: quote.eventDate.toISOString(),
      numberOfPassengers: quote.numberOfPassengers,
      numberOfHours: quote.numberOfHours || undefined,
      pickupLocation: quote.pickupLocation,
      dropoffLocation: quote.dropoffLocation || undefined,
      specialRequests: quote.specialRequests || undefined,
    };

    // Send emails (don't fail the request if emails fail)
    const emailResults = {
      customerEmail: false,
      businessEmail: false,
    };

    try {
      // Send customer confirmation email
      const customerResult = await sendCustomerConfirmation(emailData);
      emailResults.customerEmail = customerResult.success;
      
      if (customerResult.success) {
        console.log('Customer confirmation email sent successfully');
      } else {
        console.error('Failed to send customer confirmation:', customerResult.error);
      }
    } catch (error) {
      console.error('Error sending customer email:', error);
    }

    try {
      // Send business notification email
      const businessResult = await sendBusinessNotification(emailData);
      emailResults.businessEmail = businessResult.success;
      
      if (businessResult.success) {
        console.log('Business notification email sent successfully');
      } else {
        console.error('Failed to send business notification:', businessResult.error);
      }
    } catch (error) {
      console.error('Error sending business email:', error);
    }

    // Return success response (even if emails failed)
    return NextResponse.json({
      success: true,
      quoteNumber: quote.quoteNumber,
      message: 'Quote request received successfully',
      emailStatus: emailResults,
    });

  } catch (error) {
    console.error('Error creating quote:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create quote request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}