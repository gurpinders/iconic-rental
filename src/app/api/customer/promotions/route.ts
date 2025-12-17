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

    const now = new Date();

    // Get all active promo codes that are currently valid
    const promoCodes = await prisma.promoCode.findMany({
      where: {
        isActive: true,
        validFrom: {
          lte: now,
        },
        validUntil: {
          gte: now,
        },
        OR: [
          { usageLimit: null }, // No limit
          {
            usageCount: {
              lt: prisma.promoCode.fields.usageLimit, // Still has uses left
            },
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Categorize by discount type
    const categorized = {
      percentage: promoCodes.filter(p => p.discountType === 'PERCENTAGE'),
      fixedAmount: promoCodes.filter(p => p.discountType === 'FIXED_AMOUNT'),
    };

    return NextResponse.json({
      success: true,
      promoCodes,
      categorized,
      total: promoCodes.length,
    });

  } catch (error) {
    console.error('Get promotions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch promotions' },
      { status: 500 }
    );
  }
}