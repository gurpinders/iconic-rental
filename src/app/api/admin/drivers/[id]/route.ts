import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET single driver
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const driver = await prisma.driver.findUnique({
      where: { id },
      include: {
        bookings: {
          include: {
            customer: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
            vehicle: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            eventDate: 'desc',
          },
        },
        unavailableDates: {
          orderBy: {
            startDate: 'desc',
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    if (!driver) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      driver,
    });

  } catch (error) {
    console.error('Get driver error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch driver' },
      { status: 500 }
    );
  }
}

// PATCH - Update driver
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: any = {};

    if (body.firstName !== undefined) updateData.firstName = body.firstName;
    if (body.lastName !== undefined) updateData.lastName = body.lastName;
    if (body.email !== undefined) updateData.email = body.email.toLowerCase();
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.licenseNumber !== undefined) updateData.licenseNumber = body.licenseNumber || null;
    if (body.licenseExpiry !== undefined) updateData.licenseExpiry = body.licenseExpiry ? new Date(body.licenseExpiry) : null;
    if (body.licenseClass !== undefined) updateData.licenseClass = body.licenseClass || null;
    if (body.employeeNumber !== undefined) updateData.employeeNumber = body.employeeNumber || null;
    if (body.hireDate !== undefined) updateData.hireDate = body.hireDate ? new Date(body.hireDate) : null;
    if (body.photoUrl !== undefined) updateData.photoUrl = body.photoUrl || null;
    if (body.notes !== undefined) updateData.notes = body.notes || null;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const driver = await prisma.driver.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: 'Driver updated successfully',
      driver,
    });

  } catch (error) {
    console.error('Update driver error:', error);
    return NextResponse.json(
      { error: 'Failed to update driver' },
      { status: 500 }
    );
  }
}

// DELETE driver
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if driver has bookings
    const driver = await prisma.driver.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    if (!driver) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      );
    }

    if (driver._count.bookings > 0) {
      return NextResponse.json(
        { error: 'Cannot delete driver with existing bookings. Consider deactivating instead.' },
        { status: 400 }
      );
    }

    await prisma.driver.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Driver deleted successfully',
    });

  } catch (error) {
    console.error('Delete driver error:', error);
    return NextResponse.json(
      { error: 'Failed to delete driver' },
      { status: 500 }
    );
  }
}