import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all promo codes
export async function GET() {
  try {
    const promoCodes = await prisma.promoCode.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      promoCodes,
    });

  } catch (error) {
    console.error('Get promo codes error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch promo codes' },
      { status: 500 }
    );
  }
}

// POST - Create new promo code
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      code,
      description,
      discountType,
      discountValue,
      minBookingAmount,
      maxDiscount,
      usageLimit,
      validFrom,
      validUntil,
      applicableServices,
      isActive,
    } = body;

    // Validate required fields
    if (!code || !discountType || !discountValue || !validFrom || !validUntil) {
      return NextResponse.json(
        { error: 'Code, discount type, discount value, and validity dates are required' },
        { status: 400 }
      );
    }

    // Validate code format (alphanumeric only)
    if (!/^[A-Z0-9]+$/.test(code)) {
      return NextResponse.json(
        { error: 'Promo code must contain only letters and numbers' },
        { status: 400 }
      );
    }

    // Check if code already exists
    const existingCode = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (existingCode) {
      return NextResponse.json(
        { error: 'A promo code with this code already exists' },
        { status: 409 }
      );
    }

    // Validate dates
    const validFromDate = new Date(validFrom);
    const validUntilDate = new Date(validUntil);

    if (validUntilDate <= validFromDate) {
      return NextResponse.json(
        { error: 'Valid until date must be after valid from date' },
        { status: 400 }
      );
    }

    // Create promo code
    const promoCode = await prisma.promoCode.create({
      data: {
        code: code.toUpperCase(),
        description: description || null,
        discountType,
        discountValue: parseFloat(discountValue),
        minBookingAmount: minBookingAmount ? parseFloat(minBookingAmount) : null,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        usageCount: 0,
        validFrom: validFromDate,
        validUntil: validUntilDate,
        applicableServices: applicableServices || [],
        applicableVehicles: [],
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    console.log('Promo code created:', promoCode.code);

    return NextResponse.json({
      success: true,
      message: 'Promo code created successfully',
      promoCode,
    });

  } catch (error) {
    console.error('Create promo code error:', error);
    return NextResponse.json(
      { error: 'Failed to create promo code' },
      { status: 500 }
    );
  }
}