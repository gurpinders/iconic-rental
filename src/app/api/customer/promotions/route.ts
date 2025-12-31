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
        OR: [
          { validFrom: null },
          { validFrom: { lte: now } }
        ],
        AND: [
          {
            OR: [
              { validUntil: null },
              { validUntil: { gte: now } }
            ]
          }
        ]
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Filter out codes that have reached max uses
    const availablePromoCodes = promoCodes.filter(promo => {
      if (!promo.maxUses) return true; // No limit
      return promo.usageCount < promo.maxUses; // Still has uses left
    });

    // Categorize by discount type
    const categorized = {
      percentage: availablePromoCodes.filter(p => p.discountType === 'PERCENTAGE'),
      fixedAmount: availablePromoCodes.filter(p => p.discountType === 'FIXED_AMOUNT'),
    };

    return NextResponse.json({
      success: true,
      promoCodes: availablePromoCodes,
      categorized,
      total: availablePromoCodes.length,
    });
  } catch (error) {
    console.error('Get promotions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch promotions' },
      { status: 500 }
    );
  }
}