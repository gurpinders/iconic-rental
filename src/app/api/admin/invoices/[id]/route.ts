import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET single invoice
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        customer: true,
        booking: {
          include: {
            vehicle: true,
          },
        },
        promoCode: true,
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      invoice,
    });

  } catch (error) {
    console.error('Get invoice error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoice' },
      { status: 500 }
    );
  }
}

// PATCH - Update invoice
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { paymentStatus, paymentMethod, notes } = body;

    const updateData: any = {};

    if (paymentStatus !== undefined) {
      updateData.paymentStatus = paymentStatus;
      
      // Set paidAt if marked as paid
      if (paymentStatus === 'PAID') {
        updateData.paidAt = new Date();
      } else {
        updateData.paidAt = null;
      }
    }

    if (paymentMethod !== undefined) {
      updateData.paymentMethod = paymentMethod;
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: 'Invoice updated successfully',
      invoice,
    });

  } catch (error) {
    console.error('Update invoice error:', error);
    return NextResponse.json(
      { error: 'Failed to update invoice' },
      { status: 500 }
    );
  }
}