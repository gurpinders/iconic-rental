import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      vehicles,
    });

  } catch (error) {
    console.error('Get vehicles error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    );
  }
}