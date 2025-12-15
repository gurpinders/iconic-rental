import { Resend } from 'resend';
import { getCustomerConfirmationEmail } from '@/emails/customer-confirmation';
import { getBusinessNotificationEmail } from '@/emails/business-notification';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
const FROM_EMAIL = 'onboarding@resend.dev';
const BUSINESS_EMAIL = 'psandhu0124@gmail.com';

/**
 * Send a test email
 */
export async function sendTestEmail(toEmail: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject: 'Test Email from Iconic Limos',
      html: '<h1>Hello!</h1><p>This is a test email from Iconic Limos & Rentals. If you received this, email setup is working! 🎉</p>',
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

/**
 * Send customer quote confirmation with professional template
 */
export async function sendCustomerConfirmation(quoteData: {
  email: string;
  firstName: string;
  lastName: string;
  quoteNumber: string;
  serviceType: string;
  eventType: string;
  eventDate: string;
  numberOfPassengers: number;
  pickupLocation: string;
}) {
  try {
    const customerName = `${quoteData.firstName} ${quoteData.lastName}`;
    
    const emailHtml = getCustomerConfirmationEmail({
      quoteNumber: quoteData.quoteNumber,
      customerName,
      serviceType: quoteData.serviceType,
      eventType: quoteData.eventType,
      eventDate: new Date(quoteData.eventDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      numberOfPassengers: quoteData.numberOfPassengers.toString(),
      pickupLocation: quoteData.pickupLocation,
    });

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: quoteData.email,
      subject: `Quote Request Received - ${quoteData.quoteNumber}`,
      html: emailHtml,
    });

    if (error) {
      console.error('Error sending customer confirmation:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending customer confirmation:', error);
    return { success: false, error };
  }
}

/**
 * Send business notification for new quote with full details
 */
export async function sendBusinessNotification(quoteData: {
  quoteNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceType: string;
  eventType: string;
  eventDate: string;
  eventTime?: string;
  numberOfPassengers: number;
  numberOfHours?: number;
  pickupLocation: string;
  dropoffLocation?: string;
  specialRequests?: string;
}) {
  try {
    const customerName = `${quoteData.firstName} ${quoteData.lastName}`;
    
    const emailHtml = getBusinessNotificationEmail({
      quoteNumber: quoteData.quoteNumber,
      customerName,
      customerEmail: quoteData.email,
      customerPhone: quoteData.phone,
      serviceType: quoteData.serviceType,
      eventType: quoteData.eventType,
      eventDate: new Date(quoteData.eventDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      eventTime: quoteData.eventTime,
      numberOfPassengers: quoteData.numberOfPassengers,
      numberOfHours: quoteData.numberOfHours,
      pickupLocation: quoteData.pickupLocation,
      dropoffLocation: quoteData.dropoffLocation,
      specialRequests: quoteData.specialRequests,
      submittedAt: new Date().toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
    });

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: BUSINESS_EMAIL,
      subject: `🔔 New Quote Request - ${quoteData.quoteNumber}`,
      html: emailHtml,
    });

    if (error) {
      console.error('Error sending business notification:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending business notification:', error);
    return { success: false, error };
  }
}