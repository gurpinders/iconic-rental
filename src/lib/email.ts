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

/**
 * Send email verification link to new customers
 */
export async function sendVerificationEmail(email: string, token: string, firstName: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/customer/verify-email?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Verify Your Iconic Limos Account',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #000000;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000;">
              <tr>
                <td align="center" style="padding: 40px 20px;">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #18181b; border: 1px solid rgba(255,255,255,0.2); border-radius: 12px;">
                    <!-- Header -->
                    <tr>
                      <td align="center" style="padding: 40px 40px 20px 40px;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">
                          Iconic Limos & Rentals
                        </h1>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 20px 40px 40px 40px;">
                        <h2 style="margin: 0 0 20px 0; color: #ffffff; font-size: 24px; font-weight: bold;">
                          Welcome, ${firstName}!
                        </h2>
                        <p style="margin: 0 0 20px 0; color: #a1a1aa; font-size: 16px; line-height: 1.6;">
                          Thank you for registering with Iconic Limos & Rentals. Please verify your email address by clicking the button below.
                        </p>
                        
                        <!-- Button -->
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" style="padding: 20px 0;">
                              <a href="${verificationUrl}" style="display: inline-block; padding: 16px 32px; background-color: #ffffff; color: #000000; text-decoration: none; font-weight: bold; border-radius: 12px; font-size: 16px;">
                                Verify Email Address
                              </a>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 20px 0 0 0; color: #71717a; font-size: 14px; line-height: 1.6;">
                          Or copy and paste this link into your browser:<br>
                          <a href="${verificationUrl}" style="color: #a1a1aa; word-break: break-all;">
                            ${verificationUrl}
                          </a>
                        </p>
                        
                        <p style="margin: 20px 0 0 0; color: #71717a; font-size: 14px; line-height: 1.6;">
                          This link will expire in 24 hours for security purposes.
                        </p>
                        
                        <p style="margin: 20px 0 0 0; color: #71717a; font-size: 14px; line-height: 1.6;">
                          If you didn't create an account with Iconic Limos, please ignore this email.
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td align="center" style="padding: 20px 40px 40px 40px; border-top: 1px solid rgba(255,255,255,0.1);">
                        <p style="margin: 0; color: #71717a; font-size: 12px;">
                          © ${new Date().getFullYear()} Iconic Limos & Rentals. All rights reserved.<br>
                          Greater Toronto Area, Ontario, Canada
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending verification email:', error);
      return { success: false, error };
    }

    console.log('Verification email sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return { success: false, error };
  }
}

/**
 * Send password reset email with reset link
 */
export async function sendPasswordResetEmail(email: string, token: string, firstName: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/customer/reset-password?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Reset Your Iconic Limos Password',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #000000;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000;">
              <tr>
                <td align="center" style="padding: 40px 20px;">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #18181b; border: 1px solid rgba(255,255,255,0.2); border-radius: 12px;">
                    <!-- Header -->
                    <tr>
                      <td align="center" style="padding: 40px 40px 20px 40px;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">
                          Iconic Limos & Rentals
                        </h1>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 20px 40px 40px 40px;">
                        <h2 style="margin: 0 0 20px 0; color: #ffffff; font-size: 24px; font-weight: bold;">
                          Hi ${firstName},
                        </h2>
                        <p style="margin: 0 0 20px 0; color: #a1a1aa; font-size: 16px; line-height: 1.6;">
                          We received a request to reset your password. Click the button below to create a new password.
                        </p>
                        
                        <!-- Button -->
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" style="padding: 20px 0;">
                              <a href="${resetUrl}" style="display: inline-block; padding: 16px 32px; background-color: #ffffff; color: #000000; text-decoration: none; font-weight: bold; border-radius: 12px; font-size: 16px;">
                                Reset Password
                              </a>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 20px 0 0 0; color: #71717a; font-size: 14px; line-height: 1.6;">
                          Or copy and paste this link into your browser:<br>
                          <a href="${resetUrl}" style="color: #a1a1aa; word-break: break-all;">
                            ${resetUrl}
                          </a>
                        </p>
                        
                        <p style="margin: 20px 0 0 0; color: #71717a; font-size: 14px; line-height: 1.6;">
                          This link will expire in 1 hour for security purposes.
                        </p>
                        
                        <p style="margin: 20px 0 0 0; color: #71717a; font-size: 14px; line-height: 1.6;">
                          If you didn't request a password reset, please ignore this email or contact us if you have concerns.
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td align="center" style="padding: 20px 40px 40px 40px; border-top: 1px solid rgba(255,255,255,0.1);">
                        <p style="margin: 0; color: #71717a; font-size: 12px;">
                          © ${new Date().getFullYear()} Iconic Limos & Rentals. All rights reserved.<br>
                          Greater Toronto Area, Ontario, Canada
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending password reset email:', error);
      return { success: false, error };
    }

    console.log('Password reset email sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return { success: false, error };
  }
}