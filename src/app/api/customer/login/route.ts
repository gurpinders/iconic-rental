import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, createCustomerToken, setCustomerAuthCookie } from '@/lib/customer-auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find customer
    const customer = await prisma.customer.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if account is active
    if (!customer.isActive) {
      return NextResponse.json(
        { error: 'Account is deactivated. Please contact support.' },
        { status: 403 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, customer.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check email verification (optional - you can skip this in development)
    if (!customer.emailVerified && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Please verify your email before logging in' },
        { status: 403 }
      );
    }

    // Update last login
    await prisma.customer.update({
      where: { id: customer.id },
      data: { lastLogin: new Date() },
    });

    // Create token
    const token = await createCustomerToken({
      customerId: customer.id,
      email: customer.email,
    });

    // Set cookie
    await setCustomerAuthCookie(token);

    console.log('Customer logged in:', customer.email);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      customer: {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}