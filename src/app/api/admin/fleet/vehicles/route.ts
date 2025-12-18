import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all vehicles (existing)
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

// POST - Create new vehicle (NEW)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      category,
      description,
      features,
      basePrice,
      hourlyRate,
      imageUrl,
      isActive,
    } = body;

    // Validate required fields
    if (!name || !category) {
      return NextResponse.json(
        { error: 'Vehicle name and category are required' },
        { status: 400 }
      );
    }

    // Create vehicle
    const vehicle = await prisma.vehicle.create({
      data: {
        name,
        category,
        description: description || null,
        features: features || null,
        basePrice: basePrice || null,
        hourlyRate: hourlyRate || null,
        imageUrl: imageUrl || null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    console.log('Vehicle created:', vehicle.name);

    return NextResponse.json({
      success: true,
      message: 'Vehicle created successfully',
      vehicle,
    });

  } catch (error) {
    console.error('Create vehicle error:', error);
    return NextResponse.json(
      { error: 'Failed to create vehicle' },
      { status: 500 }
    );
  }
}