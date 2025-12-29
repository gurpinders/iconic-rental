import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      subtotal,
      tax,
      promoCodeId,
      promoDiscount,
      paymentStatus,
      paymentMethod,
      dueDate,
      notes,
    } = body;

    // Validate required fields
    if (!subtotal || tax === undefined) {
      return NextResponse.json(
        { error: 'Subtotal and tax are required' },
        { status: 400 }
      );
    }

    // Get the booking
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        customer: true,
        quote: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check if booking has a customer account
    if (!booking.customerId) {
      return NextResponse.json(
        { error: 'Cannot create invoice for booking without customer account. Customer must have an account to receive invoices.' },
        { status: 400 }
      );
    }

    // Calculate total
    const subtotalNum = parseFloat(subtotal);
    const taxNum = parseFloat(tax);
    const promoDiscountNum = promoDiscount ? parseFloat(promoDiscount) : 0;
    const total = subtotalNum - promoDiscountNum + taxNum;

    // Generate invoice number
    const invoiceNumber = `INV${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    // Create the invoice
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        customerId: booking.customerId, // Now guaranteed to be a string
        bookingId: booking.id,
        subtotal: subtotalNum,
        promoDiscount: promoDiscountNum,
        tax: taxNum,
        total,
        promoCodeId: promoCodeId || null,
        paymentStatus: paymentStatus || 'PENDING',
        paymentMethod: paymentMethod || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        notes: notes || null,
        paidAt: paymentStatus === 'PAID' ? new Date() : null,
      },
    });

    // If promo code was used, increment usage count
    if (promoCodeId) {
      await prisma.promoCode.update({
        where: { id: promoCodeId },
        data: {
          usageCount: {
            increment: 1,
          },
        },
      });
    }

    console.log('Invoice created:', invoice.invoiceNumber);

    return NextResponse.json({
      success: true,
      message: 'Invoice created successfully',
      invoice: {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
      },
    });

  } catch (error) {
    console.error('Create invoice error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create invoice',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}