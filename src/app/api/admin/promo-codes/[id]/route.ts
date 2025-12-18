import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET single promo code
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const promoCode = await prisma.promoCode.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            invoices: true,
          },
        },
      },
    });

    if (!promoCode) {
      return NextResponse.json(
        { error: 'Promo code not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      promoCode,
    });

  } catch (error) {
    console.error('Get promo code error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch promo code' },
      { status: 500 }
    );
  }
}

// PATCH - Update promo code
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      description,
      discountValue,
      minBookingAmount,
      maxDiscount,
      usageLimit,
      validFrom,
      validUntil,
      applicableServices,
      isActive,
    } = body;

    const updateData: any = {};

    if (description !== undefined) updateData.description = description || null;
    if (discountValue !== undefined) updateData.discountValue = parseFloat(discountValue);
    if (minBookingAmount !== undefined) updateData.minBookingAmount = minBookingAmount ? parseFloat(minBookingAmount) : null;
    if (maxDiscount !== undefined) updateData.maxDiscount = maxDiscount ? parseFloat(maxDiscount) : null;
    if (usageLimit !== undefined) updateData.usageLimit = usageLimit ? parseInt(usageLimit) : null;
    if (validFrom !== undefined) updateData.validFrom = new Date(validFrom);
    if (validUntil !== undefined) updateData.validUntil = new Date(validUntil);
    if (applicableServices !== undefined) updateData.applicableServices = applicableServices;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Validate dates if both are provided
    if (updateData.validFrom && updateData.validUntil) {
      if (updateData.validUntil <= updateData.validFrom) {
        return NextResponse.json(
          { error: 'Valid until date must be after valid from date' },
          { status: 400 }
        );
      }
    }

    const promoCode = await prisma.promoCode.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: 'Promo code updated successfully',
      promoCode,
    });

  } catch (error) {
    console.error('Update promo code error:', error);
    return NextResponse.json(
      { error: 'Failed to update promo code' },
      { status: 500 }
    );
  }
}

// DELETE promo code
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if promo code has been used
    const promoCode = await prisma.promoCode.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            invoices: true,
          },
        },
      },
    });

    if (!promoCode) {
      return NextResponse.json(
        { error: 'Promo code not found' },
        { status: 404 }
      );
    }

    if (promoCode._count.invoices > 0) {
      return NextResponse.json(
        { error: 'Cannot delete promo code that has been used. Consider deactivating it instead.' },
        { status: 400 }
      );
    }

    await prisma.promoCode.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Promo code deleted successfully',
    });

  } catch (error) {
    console.error('Delete promo code error:', error);
    return NextResponse.json(
      { error: 'Failed to delete promo code' },
      { status: 500 }
    );
  }
}