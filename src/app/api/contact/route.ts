import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, subject, message } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Create contact submission
    const contact = await prisma.contactSubmission.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        phone: phone || null,
        subject,
        message,
        status: 'NEW',
      },
    });

    console.log('Contact submission created:', contact.id);

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We will get back to you shortly.',
      contact,
    });

  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit your message. Please try again or call us directly.' },
      { status: 500 }
    );
  }
}