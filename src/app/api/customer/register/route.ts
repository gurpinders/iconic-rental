import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, generateVerificationToken } from '@/lib/customer-auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, phone, company } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if customer already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingCustomer) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Generate verification token
    const verificationToken = generateVerificationToken();

    // Create customer
    const customer = await prisma.customer.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
        phone,
        company: company || null,
        verificationToken,
        emailVerified: false,
      },
    });

    console.log('Customer registered:', customer.email);

    // TODO: Send verification email (we'll add this later)
    // For now, we'll auto-verify in development
    if (process.env.NODE_ENV === 'development') {
      await prisma.customer.update({
        where: { id: customer.id },
        data: { emailVerified: true, verificationToken: null },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      customerId: customer.id,
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}