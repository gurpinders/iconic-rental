import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();

    // Prepare update data
    const updateData: any = {};

    if (body.status) {
      updateData.status = body.status;
      updateData.respondedAt = new Date();
    }

    if (body.quotedPrice !== undefined) {
      updateData.quotedPrice = body.quotedPrice;
    }

    if (body.notes !== undefined) {
      updateData.notes = body.notes;
    }

    // Update quote
    const quote = await prisma.quote.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      quote,
    });

  } catch (error) {
    console.error('Error updating quote:', error);
    return NextResponse.json(
      { error: 'Failed to update quote' },
      { status: 500 }
    );
  }
}