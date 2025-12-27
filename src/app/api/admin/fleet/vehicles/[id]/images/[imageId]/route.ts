import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET single vehicle
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' }  // ← ADDED THIS!
        },
        bookings: {
          include: {
            customer: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            driver: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            eventDate: 'desc',
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      vehicle,
    });
  } catch (error) {
    console.error('Get vehicle error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicle' },
      { status: 500 }
    );
  }
}

// PATCH - Update vehicle
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.description !== undefined) updateData.description = body.description || null;
    if (body.features !== undefined) updateData.features = body.features || null;
    if (body.basePrice !== undefined) updateData.basePrice = body.basePrice || null;
    if (body.hourlyRate !== undefined) updateData.hourlyRate = body.hourlyRate || null;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl || null;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: updateData,
      include: {
        images: {
          orderBy: { order: 'asc' }  // ← ADDED THIS!
        },
        bookings: {
          include: {
            customer: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            driver: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            eventDate: 'desc',
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Vehicle updated successfully',
      vehicle,
    });
  } catch (error) {
    console.error('Update vehicle error:', error);
    return NextResponse.json(
      { error: 'Failed to update vehicle' },
      { status: 500 }
    );
  }
}

// DELETE vehicle
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if vehicle has bookings
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    if (vehicle._count.bookings > 0) {
      return NextResponse.json(
        { error: 'Cannot delete vehicle with existing bookings. Consider deactivating instead.' },
        { status: 400 }
      );
    }

    // Delete all vehicle images first
    await prisma.vehicleImage.deleteMany({
      where: { vehicleId: id },
    });

    // Delete vehicle
    await prisma.vehicle.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Vehicle deleted successfully',
    });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    return NextResponse.json(
      { error: 'Failed to delete vehicle' },
      { status: 500 }
    );
  }
}

git add src/app/api/admin/fleet/vehicles/\[id\]/route.ts
git commit -m "Fix vehicle API to include images relationship"
git push