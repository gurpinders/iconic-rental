import twilio from 'twilio';

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER;

let twilioClient: ReturnType<typeof twilio> | null = null;

// Only initialize if all credentials are present
if (accountSid && authToken) {
  twilioClient = twilio(accountSid, authToken);
}

interface QuoteNotificationData {
  quoteName: string;
  quoteNumber: string;
  serviceType: string;
  eventDate: string;
  numberOfPassengers: number;
  quoteUrl: string;
}

export async function sendQuoteNotificationSMS(data: QuoteNotificationData): Promise<void> {
  // Check if Twilio is configured
  if (!twilioClient) {
    console.warn('Twilio not configured - skipping SMS');
    return;
  }

  if (!twilioPhoneNumber || !adminPhoneNumber) {
    console.warn('Twilio phone numbers not configured - skipping SMS');
    return;
  }

  try {
    const message = `New Quote: ${data.quoteNumber}
${data.quoteName}
${data.serviceType}
${data.eventDate}
${data.numberOfPassengers} passengers
${data.quoteUrl}`;

    const result = await twilioClient.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: adminPhoneNumber,
    });

    console.log('SMS sent successfully! SID:', result.sid);
  } catch (error) {
    console.error('Failed to send SMS:', error);
    throw error;
  }
}

export async function sendQuoteReminderSMS(data: QuoteNotificationData): Promise<void> {
  // Check if Twilio is configured
  if (!twilioClient) {
    console.warn('Twilio not configured - skipping SMS');
    return;
  }

  if (!twilioPhoneNumber || !adminPhoneNumber) {
    console.warn('Twilio phone numbers not configured - skipping SMS');
    return;
  }

  try {
    const message = `Reminder: Quote ${data.quoteNumber}
${data.quoteName}
Not responded - 24hrs
${data.quoteUrl}`;

    const result = await twilioClient.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: adminPhoneNumber,
    });

    console.log('Reminder SMS sent successfully! SID:', result.sid);
  } catch (error) {
    console.error('Failed to send reminder SMS:', error);
    throw error;
  }
}