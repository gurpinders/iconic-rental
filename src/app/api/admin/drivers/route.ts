import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all drivers
export async function GET() {
  try {
    const drivers = await prisma.driver.findMany({
      include: {
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: {
        firstName: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      drivers,
    });

  } catch (error) {
    console.error('Get drivers error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drivers' },
      { status: 500 }
    );
  }
}

// POST - Create new driver
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      licenseNumber,
      licenseExpiry,
      licenseClass,
      employeeNumber,
      hireDate,
      photoUrl,
      notes,
      isActive,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: 'First name, last name, email, and phone are required' },
        { status: 400 }
      );
    }

    // Check if driver with email already exists
    const existingDriver = await prisma.driver.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingDriver) {
      return NextResponse.json(
        { error: 'A driver with this email already exists' },
        { status: 409 }
      );
    }

    // Create driver
    const driver = await prisma.driver.create({
      data: {
        firstName,
        lastName,
        email: email.toLowerCase(),
        phone,
        licenseNumber: licenseNumber || null,
        licenseExpiry: licenseExpiry ? new Date(licenseExpiry) : null,
        licenseClass: licenseClass || null,
        employeeNumber: employeeNumber || null,
        hireDate: hireDate ? new Date(hireDate) : null,
        photoUrl: photoUrl || null,
        notes: notes || null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    console.log('Driver created:', driver.email);

    return NextResponse.json({
      success: true,
      message: 'Driver created successfully',
      driver,
    });

  } catch (error) {
    console.error('Create driver error:', error);
    return NextResponse.json(
      { error: 'Failed to create driver' },
      { status: 500 }
    );
  }
}