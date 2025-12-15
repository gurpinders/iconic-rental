import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function generateQuoteNumber() {
  const prefix = 'IL'
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `${prefix}${timestamp}${random}`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone',
      'serviceType', 'eventType', 'eventDate', 'eventTime',
      'pickupLocation', 'passengers'
    ]

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Generate unique quote number
    const quoteNumber = generateQuoteNumber()

    // Create quote in database
    const quote = await prisma.quote.create({
      data: {
        quoteNumber,
        
        // Contact Info
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        
        // Event Details
        serviceType: body.serviceType,
        eventType: body.eventType,
        eventDate: new Date(body.eventDate),
        pickupTime: body.eventTime,
        
        // Trip Details
        pickupLocation: body.pickupLocation,
        dropoffLocation: body.dropoffLocation || null,
        numberOfHours: body.duration ? parseInt(body.duration) : null,
        numberOfPassengers: parseInt(body.passengers),
        
        // Additional Info
        specialRequests: body.specialRequests || null,
        
        // Status
        status: 'PENDING',
      }
    })

    return NextResponse.json({
      success: true,
      quoteNumber: quote.quoteNumber,
      message: 'Quote request submitted successfully'
    })

  } catch (error) {
    console.error('Quote creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create quote request' },
      { status: 500 }
    )
  }
}