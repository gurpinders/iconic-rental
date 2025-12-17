import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendQuoteReminderSMS } from '@/lib/sms';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// This endpoint will be called by Vercel Cron every hour
export async function GET(request: Request) {
  // Verify the request is from Vercel Cron (optional security)
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('🔍 Checking for quotes needing reminders...');

    // Get the timestamp for 24 hours ago
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    // Find quotes that:
    // 1. Are PENDING or REVIEWING
    // 2. Created more than 24 hours ago
    // 3. Haven't had a reminder sent yet
    const quotesNeedingReminder = await prisma.quote.findMany({
      where: {
        status: {
          in: ['PENDING', 'REVIEWING']
        },
        createdAt: {
          lt: twentyFourHoursAgo
        },
        reminderSentAt: null
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    console.log(`📊 Found ${quotesNeedingReminder.length} quotes needing reminders`);

    const results = {
      total: quotesNeedingReminder.length,
      sent: 0,
      failed: 0,
      errors: [] as string[]
    };

    // Send reminder for each quote
    for (const quote of quotesNeedingReminder) {
      try {
        console.log(`📱 Sending reminder for quote: ${quote.quoteNumber}`);

        // Send reminder SMS
        await sendQuoteReminderSMS({
          quoteName: `${quote.firstName} ${quote.lastName}`,
          quoteNumber: quote.quoteNumber,
          serviceType: quote.serviceType,
          eventDate: quote.eventDate.toDateString(),
          numberOfPassengers: quote.numberOfPassengers,
          quoteUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://iconic-rental.vercel.app'}/admin/quotes/${quote.id}`
        });

        // Update the quote to mark reminder as sent
        await prisma.quote.update({
          where: { id: quote.id },
          data: { reminderSentAt: new Date() }
        });

        results.sent++;
        console.log(`✅ Reminder sent for quote: ${quote.quoteNumber}`);

      } catch (error) {
        results.failed++;
        const errorMessage = `Failed for ${quote.quoteNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        results.errors.push(errorMessage);
        console.error(`❌ ${errorMessage}`);
      }
    }

    console.log('✅ Cron job completed:', results);

    return NextResponse.json({
      success: true,
      message: 'Reminder check completed',
      results
    });

  } catch (error) {
    console.error('❌ Cron job error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check quotes',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}