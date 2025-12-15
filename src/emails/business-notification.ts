interface BusinessNotificationProps {
  quoteNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: string;
  eventType: string;
  eventDate: string;
  eventTime?: string;
  numberOfPassengers: number;
  numberOfHours?: number;
  pickupLocation: string;
  dropoffLocation?: string;
  specialRequests?: string;
  submittedAt: string;
}

export function getBusinessNotificationEmail({
  quoteNumber,
  customerName,
  customerEmail,
  customerPhone,
  serviceType,
  eventType,
  eventDate,
  eventTime,
  numberOfPassengers,
  numberOfHours,
  pickupLocation,
  dropoffLocation,
  specialRequests,
  submittedAt,
}: BusinessNotificationProps): string {
  const logoUrl = 'https://iconic-rental.vercel.app/logo_no_bg.png';
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Quote Request - ${quoteNumber}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header with Alert -->
          <tr>
            <td style="background-color: #000000; padding: 30px 20px; text-align: center;">
              <img src="${logoUrl}" alt="Iconic Limos Logo" style="max-width: 150px; height: auto; display: block; margin: 0 auto 15px auto;" />
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 2px;">
                NEW QUOTE REQUEST
              </h1>
            </td>
          </tr>

          <!-- Alert Banner -->
          <tr>
            <td style="background-color: #ff9800; padding: 15px 20px; text-align: center;">
              <p style="margin: 0; color: #000000; font-size: 16px; font-weight: bold;">
                ⚡ Action Required: New customer quote request received
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <!-- Quote Number -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 30px 0;">
                <tr>
                  <td style="background-color: #000000; padding: 20px; text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #cccccc; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                      Quote Reference
                    </p>
                    <p style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 2px;">
                      ${quoteNumber}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Submission Info -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 30px 0;">
                <tr>
                  <td style="background-color: #f8f8f8; padding: 15px; border-radius: 4px;">
                    <p style="margin: 0; color: #666666; font-size: 14px;">
                      <strong>Submitted:</strong> ${submittedAt}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Customer Information -->
              <h2 style="color: #000000; margin: 0 0 15px 0; font-size: 20px; border-bottom: 3px solid #000000; padding-bottom: 10px;">
                👤 Customer Information
              </h2>

              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 30px 0;">
                <tr>
                  <td style="padding: 12px 15px; background-color: #f8f8f8; border-bottom: 1px solid #e0e0e0;">
                    <strong style="color: #000000;">Name:</strong>
                  </td>
                  <td style="padding: 12px 15px; background-color: #f8f8f8; border-bottom: 1px solid #e0e0e0; color: #333333;">
                    ${customerName}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 15px; background-color: #ffffff; border-bottom: 1px solid #e0e0e0;">
                    <strong style="color: #000000;">Email:</strong>
                  </td>
                  <td style="padding: 12px 15px; background-color: #ffffff; border-bottom: 1px solid #e0e0e0;">
                    <a href="mailto:${customerEmail}" style="color: #0066cc; text-decoration: none;">${customerEmail}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 15px; background-color: #f8f8f8;">
                    <strong style="color: #000000;">Phone:</strong>
                  </td>
                  <td style="padding: 12px 15px; background-color: #f8f8f8;">
                    <a href="tel:${customerPhone}" style="color: #0066cc; text-decoration: none; font-weight: bold;">${customerPhone}</a>
                  </td>
                </tr>
              </table>

              <!-- Event Details -->
              <h2 style="color: #000000; margin: 0 0 15px 0; font-size: 20px; border-bottom: 3px solid #000000; padding-bottom: 10px;">
                📅 Event Details
              </h2>

              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 30px 0;">
                <tr>
                  <td style="padding: 12px 15px; background-color: #f8f8f8; border-bottom: 1px solid #e0e0e0;">
                    <strong style="color: #000000;">Service Type:</strong>
                  </td>
                  <td style="padding: 12px 15px; background-color: #f8f8f8; border-bottom: 1px solid #e0e0e0; color: #333333;">
                    ${serviceType}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 15px; background-color: #ffffff; border-bottom: 1px solid #e0e0e0;">
                    <strong style="color: #000000;">Event Type:</strong>
                  </td>
                  <td style="padding: 12px 15px; background-color: #ffffff; border-bottom: 1px solid #e0e0e0; color: #333333;">
                    ${eventType}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 15px; background-color: #f8f8f8; border-bottom: 1px solid #e0e0e0;">
                    <strong style="color: #000000;">Date:</strong>
                  </td>
                  <td style="padding: 12px 15px; background-color: #f8f8f8; border-bottom: 1px solid #e0e0e0; color: #333333; font-weight: bold;">
                    ${eventDate}
                  </td>
                </tr>
                ${eventTime ? `
                <tr>
                  <td style="padding: 12px 15px; background-color: #ffffff; border-bottom: 1px solid #e0e0e0;">
                    <strong style="color: #000000;">Time:</strong>
                  </td>
                  <td style="padding: 12px 15px; background-color: #ffffff; border-bottom: 1px solid #e0e0e0; color: #333333; font-weight: bold;">
                    ${eventTime}
                  </td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 12px 15px; background-color: ${eventTime ? '#f8f8f8' : '#ffffff'}; border-bottom: 1px solid #e0e0e0;">
                    <strong style="color: #000000;">Passengers:</strong>
                  </td>
                  <td style="padding: 12px 15px; background-color: ${eventTime ? '#f8f8f8' : '#ffffff'}; border-bottom: 1px solid #e0e0e0; color: #333333;">
                    ${numberOfPassengers}
                  </td>
                </tr>
                ${numberOfHours ? `
                <tr>
                  <td style="padding: 12px 15px; background-color: #ffffff;">
                    <strong style="color: #000000;">Duration:</strong>
                  </td>
                  <td style="padding: 12px 15px; background-color: #ffffff; color: #333333;">
                    ${numberOfHours} hours
                  </td>
                </tr>
                ` : ''}
              </table>

              <!-- Location Details -->
              <h2 style="color: #000000; margin: 0 0 15px 0; font-size: 20px; border-bottom: 3px solid #000000; padding-bottom: 10px;">
                📍 Location Details
              </h2>

              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 30px 0;">
                <tr>
                  <td style="padding: 12px 15px; background-color: #f8f8f8; border-bottom: 1px solid #e0e0e0;">
                    <strong style="color: #000000;">Pickup:</strong>
                  </td>
                  <td style="padding: 12px 15px; background-color: #f8f8f8; border-bottom: 1px solid #e0e0e0; color: #333333;">
                    ${pickupLocation}
                  </td>
                </tr>
                ${dropoffLocation ? `
                <tr>
                  <td style="padding: 12px 15px; background-color: #ffffff;">
                    <strong style="color: #000000;">Dropoff:</strong>
                  </td>
                  <td style="padding: 12px 15px; background-color: #ffffff; color: #333333;">
                    ${dropoffLocation}
                  </td>
                </tr>
                ` : ''}
              </table>

              <!-- Special Requests -->
              ${specialRequests ? `
              <h2 style="color: #000000; margin: 0 0 15px 0; font-size: 20px; border-bottom: 3px solid #000000; padding-bottom: 10px;">
                💬 Special Requests
              </h2>

              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 30px 0;">
                <tr>
                  <td style="padding: 20px; background-color: #fffacd; border-left: 4px solid #ff9800; border-radius: 4px;">
                    <p style="margin: 0; color: #333333; line-height: 1.6; white-space: pre-wrap;">
                      ${specialRequests}
                    </p>
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- Action Items -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                <tr>
                  <td style="background-color: #e8f5e9; padding: 25px; border-left: 4px solid #4caf50; border-radius: 4px;">
                    <h3 style="color: #2e7d32; margin: 0 0 15px 0; font-size: 18px;">
                      ✅ Next Steps
                    </h3>
                    <ol style="margin: 0; padding-left: 20px; color: #333333; line-height: 1.8;">
                      <li>Review the quote details above</li>
                      <li>Contact the customer via phone or email</li>
                      <li>Prepare a customized quote with pricing</li>
                      <li>Send the quote within 24 hours</li>
                      <li>Follow up to confirm booking</li>
                    </ol>
                  </td>
                </tr>
              </table>

              <!-- Quick Actions -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                <tr>
                  <td align="center" style="padding: 10px;">
                    <a href="tel:${customerPhone}" style="display: inline-block; background-color: #4caf50; color: #ffffff; padding: 15px 30px; text-decoration: none; font-weight: bold; letter-spacing: 1px; border-radius: 4px; margin: 5px;">
                      📞 CALL CUSTOMER
                    </a>
                  </td>
                  <td align="center" style="padding: 10px;">
                    <a href="mailto:${customerEmail}" style="display: inline-block; background-color: #2196f3; color: #ffffff; padding: 15px 30px; text-decoration: none; font-weight: bold; letter-spacing: 1px; border-radius: 4px; margin: 5px;">
                      ✉️ EMAIL CUSTOMER
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #000000; padding: 25px 20px; text-align: center;">
              <p style="color: #cccccc; margin: 0; font-size: 14px;">
                This is an automated notification from your Iconic Limos quote system.
              </p>
              <p style="color: #999999; margin: 10px 0 0 0; font-size: 12px;">
                Quote Reference: ${quoteNumber}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}