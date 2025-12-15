import { Resend } from 'resend';
import { getCustomerConfirmationEmail } from '@/emails/customer-confirmation';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
const FROM_EMAIL = 'onboarding@resend.dev';
const BUSINESS_EMAIL = 'info@iconiclimos.com';

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
 * Send business notification for new quote
 */
export async function sendBusinessNotification(
  quoteNumber: string,
  customerName: string,
  customerEmail: string,
  customerPhone: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: BUSINESS_EMAIL,
      subject: `New Quote Request - ${quoteNumber}`,
      html: `
        <h1>New Quote Request</h1>
        <p><strong>Quote Number:</strong> ${quoteNumber}</p>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Phone:</strong> ${customerPhone}</p>
        <p>Login to your admin dashboard to view full details and respond.</p>
      `,
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