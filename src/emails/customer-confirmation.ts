interface CustomerConfirmationProps {
  quoteNumber: string;
  customerName: string;
  serviceType: string;
  eventType: string;
  eventDate: string;
  numberOfPassengers: string;
  pickupLocation: string;
}

export function getCustomerConfirmationEmail({
  quoteNumber,
  customerName,
  serviceType,
  eventType,
  eventDate,
  numberOfPassengers,
  pickupLocation,
}: CustomerConfirmationProps): string {
  // Get the base URL for logo (replace with your actual Vercel URL)
  const logoUrl = 'https://iconic-rental.vercel.app/logo_no_bg.png'; // Update this!

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quote Confirmation - Iconic Limos</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header with Logo -->
          <tr>
            <td style="background-color: #000000; padding: 40px 20px; text-align: center;">
              <img src="${logoUrl}" alt="Iconic Limos Logo" style="max-width: 200px; height: auto; display: block; margin: 0 auto 20px auto;" />
              <p style="color: #cccccc; margin: 10px 0 0 0; font-size: 14px; letter-spacing: 1px;">
                LUXURY TRANSPORTATION
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <!-- Greeting -->
              <h2 style="color: #000000; margin: 0 0 20px 0; font-size: 24px;">
                Thank You, ${customerName}!
              </h2>
              
              <p style="color: #333333; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                We've received your quote request and are excited to help make your event unforgettable. 
                Our team will review your requirements and get back to you within 24 hours with a personalized quote.
              </p>

              <!-- Quote Number Box -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                <tr>
                  <td style="background-color: #f8f8f8; border-left: 4px solid #000000; padding: 20px;">
                    <p style="margin: 0 0 5px 0; color: #666666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                      Your Quote Number
                    </p>
                    <p style="margin: 0; color: #000000; font-size: 24px; font-weight: bold; letter-spacing: 1px;">
                      ${quoteNumber}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Quote Details -->
              <h3 style="color: #000000; margin: 30px 0 15px 0; font-size: 18px; border-bottom: 2px solid #000000; padding-bottom: 10px;">
                Quote Details
              </h3>

              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee;">
                    <strong style="color: #000000;">Service Type:</strong>
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; text-align: right; color: #333333;">
                    ${serviceType}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee;">
                    <strong style="color: #000000;">Event Type:</strong>
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; text-align: right; color: #333333;">
                    ${eventType}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee;">
                    <strong style="color: #000000;">Event Date:</strong>
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; text-align: right; color: #333333;">
                    ${eventDate}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee;">
                    <strong style="color: #000000;">Number of Passengers:</strong>
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; text-align: right; color: #333333;">
                    ${numberOfPassengers}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0;">
                    <strong style="color: #000000;">Pickup Location:</strong>
                  </td>
                  <td style="padding: 10px 0; text-align: right; color: #333333;">
                    ${pickupLocation}
                  </td>
                </tr>
              </table>

              <!-- What's Next Section -->
              <h3 style="color: #000000; margin: 30px 0 15px 0; font-size: 18px; border-bottom: 2px solid #000000; padding-bottom: 10px;">
                What Happens Next?
              </h3>

              <!-- Step 1 -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 20px 0 0 0;">
                <tr>
                  <td style="width: 50px; vertical-align: top; padding-right: 15px;">
                    <table role="presentation" style="border-collapse: collapse;">
                      <tr>
                        <td style="width: 40px; height: 40px; background-color: #000000; color: #ffffff; border-radius: 20px; text-align: center; font-size: 20px; font-weight: bold; line-height: 40px;">
                          1
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td style="padding: 0 0 20px 0; vertical-align: top;">
                    <strong style="color: #000000; display: block; margin-bottom: 5px; font-size: 16px;">Review & Quote Preparation</strong>
                    <span style="color: #666666; font-size: 14px; line-height: 1.5;">Our team will carefully review your requirements and prepare a customized quote tailored to your needs.</span>
                  </td>
                </tr>
              </table>

              <!-- Step 2 -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0;">
                <tr>
                  <td style="width: 50px; vertical-align: top; padding-right: 15px;">
                    <table role="presentation" style="border-collapse: collapse;">
                      <tr>
                        <td style="width: 40px; height: 40px; background-color: #000000; color: #ffffff; border-radius: 20px; text-align: center; font-size: 20px; font-weight: bold; line-height: 40px;">
                          2
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td style="padding: 0 0 20px 0; vertical-align: top;">
                    <strong style="color: #000000; display: block; margin-bottom: 5px; font-size: 16px;">Receive Your Quote</strong>
                    <span style="color: #666666; font-size: 14px; line-height: 1.5;">Within 24 hours, you'll receive a detailed quote via email with pricing and vehicle options.</span>
                  </td>
                </tr>
              </table>

              <!-- Step 3 -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0;">
                <tr>
                  <td style="width: 50px; vertical-align: top; padding-right: 15px;">
                    <table role="presentation" style="border-collapse: collapse;">
                      <tr>
                        <td style="width: 40px; height: 40px; background-color: #000000; color: #ffffff; border-radius: 20px; text-align: center; font-size: 20px; font-weight: bold; line-height: 40px;">
                          3
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td style="padding: 0 0 20px 0; vertical-align: top;">
                    <strong style="color: #000000; display: block; margin-bottom: 5px; font-size: 16px;">Confirm & Book</strong>
                    <span style="color: #666666; font-size: 14px; line-height: 1.5;">Review your quote, ask any questions, and confirm your booking with a simple deposit.</span>
                  </td>
                </tr>
              </table>

              <!-- Contact Section -->
              <div style="background-color: #f8f8f8; padding: 25px; margin: 30px 0; border-radius: 4px;">
                <h3 style="color: #000000; margin: 0 0 15px 0; font-size: 18px;">
                  Have Questions?
                </h3>
                <p style="color: #666666; margin: 0 0 15px 0; line-height: 1.6;">
                  Our team is here to help! Feel free to reach out anytime:
                </p>
                <p style="margin: 5px 0; color: #333333;">
                  📞 <strong>Phone:</strong> <a href="tel:+14161234567" style="color: #000000; text-decoration: none;">(416) 123-4567</a>
                </p>
                <p style="margin: 5px 0; color: #333333;">
                  ✉️ <strong>Email:</strong> <a href="mailto:info@iconiclimos.com" style="color: #000000; text-decoration: none;">info@iconiclimos.com</a>
                </p>
                <p style="margin: 5px 0; color: #333333;">
                  ⏰ <strong>Available:</strong> 24/7
                </p>
              </div>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://iconic-rental.vercel.app/fleet" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 15px 40px; text-decoration: none; font-weight: bold; letter-spacing: 1px; border-radius: 4px;">
                      VIEW OUR FLEET
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Closing -->
              <p style="color: #333333; line-height: 1.6; margin: 20px 0 0 0; font-size: 16px;">
                Thank you for choosing Iconic Limos & Rentals. We look forward to providing you with an exceptional luxury transportation experience!
              </p>

              <p style="color: #333333; margin: 30px 0 0 0; font-size: 16px;">
                Best regards,<br>
                <strong>The Iconic Limos Team</strong>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #000000; padding: 30px 20px; text-align: center;">
              <img src="${logoUrl}" alt="Iconic Limos Logo" style="max-width: 150px; height: auto; display: block; margin: 0 auto 15px auto;" />
              <p style="color: #cccccc; margin: 0 0 15px 0; font-size: 14px;">
                Greater Toronto Area | Available 24/7
              </p>
              <p style="color: #999999; margin: 0; font-size: 12px;">
                © 2024 Iconic Limos & Rentals. All rights reserved.
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