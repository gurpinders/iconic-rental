import { NextResponse } from 'next/server';
import { sendCustomerConfirmation } from '@/lib/email';

export async function GET() {
  try {
    // Test data
    const testQuoteData = {
      email: 'psandhu0124@gmail.com', 
      firstName: 'John',
      lastName: 'Doe',
      quoteNumber: 'IL' + Date.now(),
      serviceType: 'HOURLY',
      eventType: 'WEDDING',
      eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      numberOfPassengers: 8,
      pickupLocation: '123 Main St, Toronto, ON',
    };

    const result = await sendCustomerConfirmation(testQuoteData);

    if (result.success) {
      return NextResponse.json({ 
        message: 'Professional email sent successfully! Check your inbox.',
        data: result.data 
      });
    } else {
      return NextResponse.json({ 
        message: 'Failed to send email',
        error: result.error 
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ 
      message: 'Error testing email',
      error: error 
    }, { status: 500 });
  }
}