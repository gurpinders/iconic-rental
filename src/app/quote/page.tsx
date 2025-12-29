'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

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

  // Date and time state for pickers
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<Date | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [quoteNumber, setQuoteNumber] = useState('')
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({})
  const [maxPassengers, setMaxPassengers] = useState(50)

  // Vehicle capacity mapping
  const vehicleCapacities: { [key: string]: number } = {
    'LIMO': 10,
    'PARTY_BUS': 45,
    'LUXURY_BUS': 45,
    'SPRINTER_VAN': 12,
    'SUV': 7,
    '': 50
  }

  // Calculate minimum booking date (2 weeks from now)
  const minBookingDate = new Date()
  minBookingDate.setDate(minBookingDate.getDate() + 14)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    setFormData({
      ...formData,
      [name]: value
    })

    // Clear validation error for this field when user types
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      })
    }

    // Update max passengers when vehicle changes
    if (name === 'vehicleCategory') {
      const capacity = vehicleCapacities[value] || 50
      setMaxPassengers(capacity)
      
      if (formData.numberOfPassengers && parseInt(formData.numberOfPassengers) > capacity) {
        setFormData(prev => ({
          ...prev,
          numberOfPassengers: capacity.toString()
        }))
      }
    }
  }

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date)
    if (date) {
      setFormData({
        ...formData,
        eventDate: date.toISOString().split('T')[0]
      })
      
      if (validationErrors.eventDate) {
        setValidationErrors({
          ...validationErrors,
          eventDate: ''
        })
      }
    }
  }

  const handleTimeChange = (time: Date | null) => {
    setSelectedTime(time)
    if (time) {
      const hours = time.getHours().toString().padStart(2, '0')
      const minutes = time.getMinutes().toString().padStart(2, '0')
      setFormData({
        ...formData,
        pickupTime: `${hours}:${minutes}`
      })
    }
  }

  const validateForm = () => {
    const errors: {[key: string]: string} = {}

    // Required fields
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required'
    }
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required'
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required'
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      errors.phone = 'Please enter a valid phone number (at least 10 digits)'
    }
    if (!formData.serviceType) {
      errors.serviceType = 'Please select a service type'
    }
    if (!formData.eventType) {
      errors.eventType = 'Please select an event type'
    }
    if (!formData.eventDate) {
      errors.eventDate = 'Event date is required'
    }
    if (!formData.pickupLocation.trim()) {
      errors.pickupLocation = 'Pickup location is required'
    }
    if (!formData.dropoffLocation.trim()) {
      errors.dropoffLocation = 'Dropoff location is required'
    }
    if (!formData.duration) {
      errors.duration = 'Please select estimated duration'
    }
    if (!formData.numberOfPassengers) {
      errors.numberOfPassengers = 'Number of passengers is required'
    } else if (parseInt(formData.numberOfPassengers) < 1) {
      errors.numberOfPassengers = 'Must be at least 1 passenger'
    } else if (parseInt(formData.numberOfPassengers) > maxPassengers) {
      errors.numberOfPassengers = `Maximum ${maxPassengers} passengers for selected vehicle type`
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setError('Please fix the errors below before submitting')
      return
    }

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
      window.scrollTo({ top: 0, behavior: 'smooth' })

      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'quote_submitted',
          quote_value: formData.serviceType,
          quote_passengers: formData.numberOfPassengers,
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      window.scrollTo({ top: 0, behavior: 'smooth' })
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
      <style jsx global>{`
        /* Custom DatePicker Styles */
        .react-datepicker {
          background-color: #18181b !important;
          border: 1px solid rgba(255,255,255,0.2) !important;
          border-radius: 12px !important;
          font-family: inherit !important;
        }
        
        .react-datepicker__header {
          background-color: #000000 !important;
          border-bottom: 1px solid rgba(255,255,255,0.2) !important;
          border-radius: 12px 12px 0 0 !important;
          padding-top: 12px !important;
        }
        
        .react-datepicker__current-month,
        .react-datepicker__day-name {
          color: #ffffff !important;
          font-weight: 600 !important;
        }
        
        .react-datepicker__day {
          color: #a1a1aa !important;
          border-radius: 8px !important;
          transition: all 0.2s !important;
        }
        
        .react-datepicker__day:hover {
          background-color: rgba(255,255,255,0.1) !important;
          color: #ffffff !important;
        }
        
        .react-datepicker__day--selected {
          background-color: #ffffff !important;
          color: #000000 !important;
          font-weight: bold !important;
        }
        
        .react-datepicker__day--disabled {
          color: #3f3f46 !important;
          cursor: not-allowed !important;
        }
        
        .react-datepicker__day--disabled:hover {
          background-color: transparent !important;
        }
        
        .react-datepicker__navigation-icon::before {
          border-color: #ffffff !important;
        }
        
        .react-datepicker__time-container {
          border-left: 1px solid rgba(255,255,255,0.2) !important;
        }
        
        .react-datepicker__time {
          background-color: #18181b !important;
        }
        
        .react-datepicker__time-list {
          background-color: #18181b !important;
        }
        
        .react-datepicker__time-list-item {
          color: #a1a1aa !important;
          transition: all 0.2s !important;
        }
        
        .react-datepicker__time-list-item:hover {
          background-color: rgba(255,255,255,0.1) !important;
          color: #ffffff !important;
        }
        
        .react-datepicker__time-list-item--selected {
          background-color: #ffffff !important;
          color: #000000 !important;
          font-weight: bold !important;
        }
        
        .react-datepicker-popper {
          z-index: 9999 !important;
        }
      `}</style>

      <div className="max-w-4xl mx-auto px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 tracking-wide">Request a Quote</h1>
          <p className="text-xl text-gray-400">Fill out the form below and we'll get back to you with a personalized quote</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-900/20 border-2 border-red-500/50 rounded-lg text-red-300">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
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
                  className={`w-full px-4 py-3 bg-black border rounded-lg focus:border-white/50 transition-all ${
                    validationErrors.firstName ? 'border-red-500' : 'border-white/20'
                  }`}
                />
                {validationErrors.firstName && (
                  <p className="text-red-400 text-sm mt-1">{validationErrors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-black border rounded-lg focus:border-white/50 transition-all ${
                    validationErrors.lastName ? 'border-red-500' : 'border-white/20'
                  }`}
                />
                {validationErrors.lastName && (
                  <p className="text-red-400 text-sm mt-1">{validationErrors.lastName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-black border rounded-lg focus:border-white/50 transition-all ${
                    validationErrors.email ? 'border-red-500' : 'border-white/20'
                  }`}
                />
                {validationErrors.email && (
                  <p className="text-red-400 text-sm mt-1">{validationErrors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (416) 123-4567"
                  className={`w-full px-4 py-3 bg-black border rounded-lg focus:border-white/50 transition-all ${
                    validationErrors.phone ? 'border-red-500' : 'border-white/20'
                  }`}
                />
                {validationErrors.phone && (
                  <p className="text-red-400 text-sm mt-1">{validationErrors.phone}</p>
                )}
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
                  className={`w-full px-4 py-3 bg-black border rounded-lg focus:border-white/50 transition-all ${
                    validationErrors.serviceType ? 'border-red-500' : 'border-white/20'
                  }`}
                >
                  <option value="">Select Service</option>
                  <option value="POINT_TO_POINT">Point to Point</option>
                  <option value="HOURLY">Hourly Charter</option>
                  <option value="AIRPORT">Airport Transfer</option>
                  <option value="WEDDING">Wedding</option>
                  <option value="CORPORATE">Corporate Event</option>
                </select>
                {validationErrors.serviceType && (
                  <p className="text-red-400 text-sm mt-1">{validationErrors.serviceType}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Event Type *</label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-black border rounded-lg focus:border-white/50 transition-all ${
                    validationErrors.eventType ? 'border-red-500' : 'border-white/20'
                  }`}
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
                {validationErrors.eventType && (
                  <p className="text-red-400 text-sm mt-1">{validationErrors.eventType}</p>
                )}
              </div>
              
              {/* Date Picker */}
              <div>
                <label className="block text-sm font-semibold mb-2">Event Date *</label>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  minDate={minBookingDate}
                  dateFormat="MMMM d, yyyy"
                  placeholderText="Click to select date"
                  className={`w-full px-4 py-3 bg-black border rounded-lg focus:border-white/50 transition-all cursor-pointer ${
                    validationErrors.eventDate ? 'border-red-500' : 'border-white/20'
                  }`}
                />
                <p className="text-sm text-gray-500 mt-1">Minimum 2 weeks notice required</p>
                {validationErrors.eventDate && (
                  <p className="text-red-400 text-sm mt-1">{validationErrors.eventDate}</p>
                )}
              </div>
              
              {/* Time Picker */}
              <div>
                <label className="block text-sm font-semibold mb-2">Pickup Time</label>
                <DatePicker
                  selected={selectedTime}
                  onChange={handleTimeChange}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  placeholderText="Click to select time"
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-white/50 transition-all cursor-pointer"
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
                  placeholder="Enter pickup address"
                  className={`w-full px-4 py-3 bg-black border rounded-lg focus:border-white/50 transition-all ${
                    validationErrors.pickupLocation ? 'border-red-500' : 'border-white/20'
                  }`}
                />
                {validationErrors.pickupLocation && (
                  <p className="text-red-400 text-sm mt-1">{validationErrors.pickupLocation}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Dropoff Location *</label>
                <input
                  type="text"
                  name="dropoffLocation"
                  value={formData.dropoffLocation}
                  onChange={handleChange}
                  placeholder="Enter dropoff address"
                  className={`w-full px-4 py-3 bg-black border rounded-lg focus:border-white/50 transition-all ${
                    validationErrors.dropoffLocation ? 'border-red-500' : 'border-white/20'
                  }`}
                />
                {validationErrors.dropoffLocation && (
                  <p className="text-red-400 text-sm mt-1">{validationErrors.dropoffLocation}</p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Estimated Duration *</label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-black border rounded-lg focus:border-white/50 transition-all ${
                      validationErrors.duration ? 'border-red-500' : 'border-white/20'
                    }`}
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
                  {validationErrors.duration && (
                    <p className="text-red-400 text-sm mt-1">{validationErrors.duration}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Number of Passengers *</label>
                  <input
                    type="number"
                    name="numberOfPassengers"
                    value={formData.numberOfPassengers}
                    onChange={handleChange}
                    min="1"
                    max={maxPassengers}
                    className={`w-full px-4 py-3 bg-black border rounded-lg focus:border-white/50 transition-all ${
                      validationErrors.numberOfPassengers ? 'border-red-500' : 'border-white/20'
                    }`}
                  />
                  {formData.vehicleCategory && (
                    <p className="text-sm text-gray-400 mt-1">
                      Maximum capacity: {maxPassengers} passengers
                    </p>
                  )}
                  {validationErrors.numberOfPassengers && (
                    <p className="text-red-400 text-sm mt-1">{validationErrors.numberOfPassengers}</p>
                  )}
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
                <option value="LIMO">Limousine (Up to 10 passengers)</option>
                <option value="PARTY_BUS">Party Bus (Up to 45 passengers)</option>
                <option value="LUXURY_BUS">Luxury Bus (Up to 45 passengers)</option>
                <option value="SPRINTER_VAN">Sprinter Van (Up to 12 passengers)</option>
                <option value="SUV">SUV (Up to 7 passengers)</option>
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