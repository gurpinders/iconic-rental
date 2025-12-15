'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'

export default function QuotePage() {
  const [formData, setFormData] = useState({
    // Contact Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Event Details
    serviceType: '',
    eventType: '',
    eventDate: '',
    eventTime: '',
    
    // Trip Details
    pickupTime: '',
    pickupLocation: '',
    dropoffLocation: '',
    duration: '',
    numberOfPassengers: '',
    
    // Vehicle Preference
    vehicleCategory: '',
    
    // Additional Info
    specialRequests: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [quoteNumber, setQuoteNumber] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    
    try {
        const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
        })

        const data = await response.json()

        if (!response.ok) {
        throw new Error(data.error || 'Failed to submit quote')
        }

        setQuoteNumber(data.quoteNumber)
        setSubmitted(true)
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
        setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-black pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <div className="mb-8">
            <svg className="w-20 h-20 mx-auto text-white mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-5xl font-bold mb-4">Request Received!</h1>
            <p className="text-xl text-gray-400 mb-8">
              Thank you for your quote request. Our team will review your details and get back to you within 24 hours.
            </p>
            <p className="text-lg text-gray-400 mb-8">
              Quote Reference: <span className="text-white font-bold">#{quoteNumber}</span>
            </p>
            <div className="flex gap-4 justify-center">
              <a href="/">
                <Button variant="primary">Back to Home</Button>
              </a>
              <a href="/fleet">
                <Button variant="outline">Browse Fleet</Button>
              </a>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 tracking-wide">Request a Quote</h1>
          <p className="text-xl text-gray-400">Fill out the form below and we'll get back to you with a personalized quote</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Information */}
          <div className="p-8 bg-zinc-900 rounded-lg border border-white/20">
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-white/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-white/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-white/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-white/50 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="p-8 bg-zinc-900 rounded-lg border border-white/20">
            <h2 className="text-2xl font-bold mb-6">Event Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Service Type *</label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-white/50 transition-all"
                >
                  <option value="">Select Service</option>
                  <option value="POINT_TO_POINT">Point to Point</option>
                  <option value="HOURLY">Hourly Charter</option>
                  <option value="AIRPORT">Airport Transfer</option>
                  <option value="WEDDING">Wedding</option>
                  <option value="CORPORATE">Corporate Event</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Event Type *</label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-white/50 transition-all"
                >
                  <option value="">Select Event</option>
                  <option value="WEDDING">Wedding</option>
                  <option value="PROM">Prom</option>
                  <option value="CORPORATE">Corporate Event</option>
                  <option value="AIRPORT">Airport Transfer</option>
                  <option value="BIRTHDAY">Birthday</option>
                  <option value="ANNIVERSARY">Anniversary</option>
                  <option value="NIGHT_OUT">Night Out</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Event Date *</label>
                <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-white/50 transition-all cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:invert"
                />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Pickup Time
                  </label>
                  <input
                    type="time"
                    name="pickupTime"
                    value={formData.pickupTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-zinc-900 border border-white/20 rounded focus:outline-none focus:border-white/50"
                  />
                  <p className="text-sm text-gray-500 mt-1">When should we pick you up?</p>
                </div>
            </div>
          </div>

          {/* Trip Details */}
          <div className="p-8 bg-zinc-900 rounded-lg border border-white/20">
            <h2 className="text-2xl font-bold mb-6">Trip Details</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Pickup Location *</label>
                <input
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  required
                  placeholder="Enter pickup address"
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-white/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Dropoff Location *</label>
                <input
                  type="text"
                  name="dropoffLocation"
                  value={formData.dropoffLocation}
                  onChange={handleChange}
                  required
                  placeholder="Enter dropoff address"
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-white/50 transition-all"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Estimated Duration *</label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-white/50 transition-all"
                  >
                    <option value="">Select Duration</option>
                    <option value="2">2 hours</option>
                    <option value="3">3 hours</option>
                    <option value="4">4 hours</option>
                    <option value="5">5 hours</option>
                    <option value="6">6 hours</option>
                    <option value="8">8 hours</option>
                    <option value="10+">10+ hours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Number of Passengers *</label>
                  <input
                    type="number"
                    name="numberOfPassengers"
                    value={formData.numberOfPassengers}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-white/50 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Preference */}
          <div className="p-8 bg-zinc-900 rounded-lg border border-white/20">
            <h2 className="text-2xl font-bold mb-6">Vehicle Preference</h2>
            <div>
              <label className="block text-sm font-semibold mb-2">Preferred Vehicle Type</label>
              <select
                name="vehicleCategory"
                value={formData.vehicleCategory}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-white/50 transition-all"
              >
                <option value="">No Preference</option>
                <option value="LIMO">Limousine</option>
                <option value="PARTY_BUS">Party Bus</option>
                <option value="LUXURY_BUS">Luxury Bus</option>
                <option value="SPRINTER_VAN">Sprinter Van</option>
                <option value="SUV">SUV</option>
              </select>
            </div>
          </div>

          {/* Special Requests */}
          <div className="p-8 bg-zinc-900 rounded-lg border border-white/20">
            <h2 className="text-2xl font-bold mb-6">Additional Information</h2>
            <div>
              <label className="block text-sm font-semibold mb-2">Special Requests or Notes</label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                rows={5}
                placeholder="Any special requests, stops, or additional information..."
                className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-white/50 transition-all resize-none"
              />
            </div>
          </div>
            {/* Error Message */}
            {error && (
            <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
                <p className="text-red-400">{error}</p>
            </div>
            )}
          {/* Submit Button */}
          <div className="text-center">
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
              className={isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Quote Request'
              )}
            </Button>
            <p className="text-sm text-gray-400 mt-4">
              We'll review your request and get back to you within 24 hours
            </p>
          </div>
        </form>
      </div>
    </main>
  )
}