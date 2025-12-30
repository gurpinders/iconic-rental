import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      serviceType,
      vehicleCategory,
      eventDate,
      eventType,
      pickupTime,
      pickupLocation,
      dropoffLocation,
      duration,
      numberOfPassengers,
      specialRequests,
      promoCode,  // ADD THIS
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !serviceType || !eventDate || !pickupLocation || !numberOfPassengers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate and find promo code if provided
    let promoCodeId = null;
    if (promoCode && promoCode.trim()) {
      const validPromo = await prisma.promoCode.findFirst({
        where: {
          code: promoCode.toUpperCase().trim(),
          isActive: true,
          OR: [
            { validFrom: null },
            { validFrom: { lte: new Date() } }
          ],
        },
      });

      if (validPromo) {
        // Check if promo is still valid (not expired)
        if (!validPromo.validUntil || validPromo.validUntil >= new Date()) {
          // Check if promo hasn't exceeded max uses
          if (!validPromo.maxUses || validPromo.usageCount < validPromo.maxUses) {
            // Check if promo applies to this service type
            if (validPromo.applicableServices.length === 0 || validPromo.applicableServices.includes(serviceType)) {
              promoCodeId = validPromo.id;
            }
          }
        }
      }
      // Note: We don't show an error if promo is invalid
      // Admin can review and apply discount manually if needed
    }

    // Find vehicle if category specified
    let vehicleId = null;
    if (vehicleCategory) {
      const vehicle = await prisma.vehicle.findFirst({
        where: {
          category: vehicleCategory,
          isActive: true,
        },
      });
      vehicleId = vehicle?.id || null;
    }

    // Generate quote number
    const quoteNumber = `QT${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    // Create quote
    const quote = await prisma.quote.create({
      data: {
        quoteNumber,
        firstName,
        lastName,
        email: email.toLowerCase(),
        phone,
        company: company || null,
        serviceType,
        vehicleId,
        eventDate: new Date(eventDate),
        eventType,
        pickupTime: pickupTime || null,
        pickupLocation,
        dropoffLocation: dropoffLocation || null,
        numberOfHours: duration ? parseInt(duration) : null,
        numberOfPassengers: parseInt(numberOfPassengers),
        specialRequests: specialRequests || null,
        promoCodeId,  // ADD THIS
        status: 'PENDING',
      },
    });

    console.log('Quote created:', quote.quoteNumber, promoCodeId ? `with promo: ${promoCode}` : '');

    return NextResponse.json({
      success: true,
      message: 'Quote submitted successfully',
      quoteNumber: quote.quoteNumber,
    });

  } catch (error) {
    console.error('Quote creation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to submit quote',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}