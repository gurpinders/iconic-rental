import { NextResponse } from 'next/server';
import { sendBusinessNotification } from '@/lib/email';

export async function GET() {
  try {
    // Test data
    const testQuoteData = {
      quoteNumber: 'IL' + Date.now(),
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@example.com',
      phone: '(416) 555-7890',
      serviceType: 'HOURLY',
      eventType: 'WEDDING',
      eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      eventTime: '6:00 PM',
      numberOfPassengers: 12,
      numberOfHours: 6,
      pickupLocation: '123 Bride Street, Toronto, ON M5V 2T6',
      dropoffLocation: 'Royal Oak Hotel, 500 King St W, Toronto, ON',
      specialRequests: 'Please include champagne service and red carpet for the bride and groom entrance. Wedding party will need assistance with coordinating multiple pickups.',
    };

    const result = await sendBusinessNotification(testQuoteData);

    if (result.success) {
      return NextResponse.json({ 
        message: 'Business notification email sent successfully! Check your business email inbox.',
        data: result.data 
      });
    } else {
      return NextResponse.json({ 
        message: 'Failed to send business notification',
        error: result.error 
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ 
      message: 'Error testing business email',
      error: error 
    }, { status: 500 });
  }
}