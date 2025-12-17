import { NextResponse } from 'next/server';
import { getCurrentCustomer } from '@/lib/customer-auth';
import prisma from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    const customerToken = await getCurrentCustomer();

    if (!customerToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { firstName, lastName, phone, company } = body;

    // Validate required fields
    if (!firstName || !lastName || !phone) {
      return NextResponse.json(
        { error: 'First name, last name, and phone are required' },
        { status: 400 }
      );
    }

    // Update customer
    const customer = await prisma.customer.update({
      where: { id: customerToken.customerId },
      data: {
        firstName,
        lastName,
        phone,
        company: company || null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        company: true,
        emailVerified: true,
        createdAt: true,
        lastLogin: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      customer,
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}