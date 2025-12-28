import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';

// Generate a secure random token
function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find customer
    const customer = await prisma.customer.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Don't reveal if email exists or not (security best practice)
    if (!customer) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists, a reset link has been sent',
      });
    }

    // Generate reset token and expiry (1 hour from now)
    const resetToken = generateResetToken();
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save token to database
    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Send password reset email
    const emailResult = await sendPasswordResetEmail(
      customer.email,
      resetToken,
      customer.firstName
    );

    if (!emailResult.success) {
      console.error('Failed to send password reset email:', emailResult.error);
    }

    console.log('Password reset requested for:', customer.email);

    // Always return success (don't reveal if email exists)
    return NextResponse.json({
      success: true,
      message: 'If an account exists, a reset link has been sent',
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}