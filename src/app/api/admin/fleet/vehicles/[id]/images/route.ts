import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { url, alt } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Get current image count to set order
    const currentImages = await prisma.vehicleImage.findMany({
      where: { vehicleId: id },
      orderBy: { order: 'desc' },
      take: 1,
    });

    const nextOrder = currentImages.length > 0 ? currentImages[0].order + 1 : 0;

    // Create the image
    const image = await prisma.vehicleImage.create({
      data: {
        vehicleId: id,
        url,
        alt: alt || 'Vehicle image',
        order: nextOrder,
      },
    });

    return NextResponse.json({
      success: true,
      image,
    });

  } catch (error) {
    console.error('Add image error:', error);
    return NextResponse.json(
      { error: 'Failed to add image' },
      { status: 500 }
    );
  }
}