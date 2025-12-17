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

    // Get all invoices for this customer
    const invoices = await prisma.invoice.findMany({
      where: {
        customerId: customerToken.customerId,
      },
      include: {
        booking: {
          select: {
            bookingNumber: true,
            eventDate: true,
            eventType: true,
            vehicle: {
              select: {
                name: true,
              },
            },
          },
        },
        promoCode: {
          select: {
            code: true,
            discountType: true,
            discountValue: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Categorize invoices by payment status
    const categorized = {
      pending: invoices.filter(i => i.paymentStatus === 'PENDING'),
      paid: invoices.filter(i => i.paymentStatus === 'PAID'),
      overdue: invoices.filter(i => i.paymentStatus === 'OVERDUE'),
      all: invoices,
    };

    // Calculate totals
    const totals = {
      totalAmount: invoices.reduce((sum, inv) => sum + Number(inv.total), 0),
      paidAmount: invoices
        .filter(i => i.paymentStatus === 'PAID')
        .reduce((sum, inv) => sum + Number(inv.total), 0),
      pendingAmount: invoices
        .filter(i => i.paymentStatus === 'PENDING' || i.paymentStatus === 'OVERDUE')
        .reduce((sum, inv) => sum + Number(inv.total), 0),
    };

    return NextResponse.json({
      success: true,
      invoices,
      categorized,
      totals,
    });

  } catch (error) {
    console.error('Get invoices error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}