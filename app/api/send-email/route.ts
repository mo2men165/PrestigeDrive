import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { BOOKING_EMAIL, INFO_EMAIL } from '@/constants/emails';

const COMPANY_NOTIFICATION_TO = [INFO_EMAIL, BOOKING_EMAIL];
const FROM_EMAIL = BOOKING_EMAIL;

function getResend() {
  return new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);
}

interface BookingEmailData {
  bookingRef: string;
  bookingType?: string;
  name: string;
  email: string;
  phone: string;
  carTitle: string;
  selectedPlan: string;
  pickupLocation: string;
  pickupDate: string;
  pickupTime: string;
  dropoffLocation: string;
  dropoffDate: string;
  dropoffTime: string;
  totalDays: number | string;
  basePrice: string;
  planCost: string;
  planCostPerDay: string;
  totalPrice: string;
  selectedAddons: string;
  addonsCost: string;
}

function buildCustomerEmailHtml(data: BookingEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0E253F,#1B365D);padding:32px 40px;text-align:center;">
              <h1 style="color:#ffffff;font-size:24px;margin:0 0 6px;">ELITEDRIVE4U</h1>
              <p style="color:#A88B5C;font-size:13px;margin:0;letter-spacing:2px;text-transform:uppercase;">Booking Confirmed</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:32px 40px 16px;">
              <p style="color:#1a1a1a;font-size:16px;margin:0;">Dear ${data.name},</p>
              <p style="color:#6b7280;font-size:14px;margin:8px 0 0;line-height:1.6;">
                Thank you for choosing EliteDrive4U. Your booking has been confirmed. A member of our team will be in touch within 24 hours to finalise the details.
              </p>
            </td>
          </tr>

          <!-- Booking Reference -->
          <tr>
            <td style="padding:0 40px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4ff;border-radius:8px;border:1px solid #dbeafe;">
                <tr>
                  <td style="padding:16px 20px;text-align:center;">
                    <p style="color:#6b7280;font-size:12px;margin:0;text-transform:uppercase;letter-spacing:1px;">Booking Reference</p>
                    <p style="color:#0E253F;font-size:20px;font-weight:bold;margin:6px 0 0;font-family:monospace;letter-spacing:1px;">${data.bookingRef}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Booking Type -->
          <tr>
            <td align="center" style="padding:0 40px 16px;">
              <span style="display:inline-block;background-color:${data.bookingType === 'chauffeur' ? '#fdf4ff' : '#f0fdf4'};color:${data.bookingType === 'chauffeur' ? '#9333ea' : '#16a34a'};font-size:12px;font-weight:600;padding:6px 16px;border-radius:20px;border:1px solid ${data.bookingType === 'chauffeur' ? '#e9d5ff' : '#d1fae5'};text-transform:uppercase;letter-spacing:1px;">
                ${data.bookingType === 'chauffeur' ? 'Chauffeur Service' : 'Standard Booking'}
              </span>
            </td>
          </tr>

          <!-- Vehicle -->
          <tr>
            <td style="padding:0 40px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fafafa;border-radius:8px;border:1px solid #e5e7eb;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="color:#9ca3af;font-size:11px;margin:0;text-transform:uppercase;letter-spacing:1px;">Vehicle</p>
                    <p style="color:#1a1a1a;font-size:18px;font-weight:600;margin:4px 0 0;">${data.carTitle}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Pickup & Dropoff -->
          <tr>
            <td style="padding:0 40px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="48%" style="background-color:#f0fdf4;border-radius:8px;border:1px solid #d1fae5;padding:16px 20px;vertical-align:top;">
                    <p style="color:#16a34a;font-size:11px;margin:0;text-transform:uppercase;letter-spacing:1px;">Pickup</p>
                    <p style="color:#1a1a1a;font-size:14px;font-weight:600;margin:6px 0 2px;">${data.pickupLocation}</p>
                    <p style="color:#6b7280;font-size:13px;margin:0;">${data.pickupDate} at ${data.pickupTime}</p>
                  </td>
                  <td width="4%"></td>
                  <td width="48%" style="background-color:#fef2f2;border-radius:8px;border:1px solid #fecaca;padding:16px 20px;vertical-align:top;">
                    <p style="color:#dc2626;font-size:11px;margin:0;text-transform:uppercase;letter-spacing:1px;">Drop-off</p>
                    <p style="color:#1a1a1a;font-size:14px;font-weight:600;margin:6px 0 2px;">${data.dropoffLocation}</p>
                    <p style="color:#6b7280;font-size:13px;margin:0;">${data.dropoffDate} at ${data.dropoffTime}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Duration -->
          <tr>
            <td align="center" style="padding:0 40px 24px;">
              <span style="display:inline-block;background-color:#eff6ff;color:#0E253F;font-size:13px;font-weight:600;padding:8px 20px;border-radius:20px;border:1px solid #dbeafe;">
                ${data.totalDays} day${Number(data.totalDays) !== 1 ? 's' : ''} rental
              </span>
            </td>
          </tr>

          <!-- Price Breakdown -->
          <tr>
            <td style="padding:0 40px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
                <tr>
                  <td style="background-color:#fafafa;padding:12px 20px;border-bottom:1px solid #e5e7eb;">
                    <p style="color:#1a1a1a;font-size:14px;font-weight:600;margin:0;">Price Breakdown</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color:#6b7280;font-size:13px;padding:4px 0;">Rental (${data.totalDays} days)</td>
                        <td align="right" style="color:#1a1a1a;font-size:13px;font-weight:500;padding:4px 0;">£${data.basePrice}</td>
                      </tr>
                      ${data.selectedPlan && data.selectedPlan !== '' ? `
                      <tr>
                        <td style="color:#6b7280;font-size:13px;padding:4px 0;">Protection Plan (${data.selectedPlan})</td>
                        <td align="right" style="color:#1a1a1a;font-size:13px;font-weight:500;padding:4px 0;">£${data.planCost}</td>
                      </tr>` : ''}
                      ${data.selectedAddons && data.selectedAddons !== 'None' ? `
                      <tr>
                        <td style="color:#6b7280;font-size:13px;padding:4px 0;">Add-ons (${data.selectedAddons})</td>
                        <td align="right" style="color:#1a1a1a;font-size:13px;font-weight:500;padding:4px 0;">£${data.addonsCost}</td>
                      </tr>` : ''}
                      <tr>
                        <td colspan="2" style="border-top:1px solid #e5e7eb;padding-top:12px;margin-top:8px;"></td>
                      </tr>
                      <tr>
                        <td style="color:#1a1a1a;font-size:16px;font-weight:700;padding:4px 0;">Total</td>
                        <td align="right" style="color:#0E253F;font-size:18px;font-weight:700;padding:4px 0;">£${data.totalPrice}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="color:#6b7280;font-size:13px;margin:0 0 4px;">Need to make changes or have questions?</p>
              <p style="margin:0;">
                <a href="tel:03333391475" style="color:#0E253F;font-size:13px;font-weight:600;text-decoration:none;">03333 391 475</a>
                <span style="color:#d1d5db;margin:0 8px;">|</span>
                <a href="mailto:${BOOKING_EMAIL}" style="color:#0E253F;font-size:13px;font-weight:600;text-decoration:none;">${BOOKING_EMAIL}</a>
              </p>
              <p style="color:#9ca3af;font-size:11px;margin:16px 0 0;">&copy; ${new Date().getFullYear()} EliteDrive4U. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildCompanyEmailHtml(data: BookingEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background:#0E253F;padding:24px 40px;">
              <h1 style="color:#ffffff;font-size:18px;margin:0;">New Booking Received</h1>
              <p style="color:#A88B5C;font-size:13px;margin:4px 0 0;">Ref: ${data.bookingRef}</p>
            </td>
          </tr>

          <!-- Customer Info -->
          <tr>
            <td style="padding:24px 40px 16px;">
              <p style="color:#9ca3af;font-size:11px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Customer Details</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;width:120px;">Name</td><td style="color:#1a1a1a;font-size:13px;font-weight:500;padding:3px 0;">${data.name}</td></tr>
                <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Email</td><td style="color:#1a1a1a;font-size:13px;font-weight:500;padding:3px 0;"><a href="mailto:${data.email}" style="color:#0E253F;text-decoration:none;">${data.email}</a></td></tr>
                <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Phone</td><td style="color:#1a1a1a;font-size:13px;font-weight:500;padding:3px 0;">${data.phone}</td></tr>
              </table>
            </td>
          </tr>

          <tr><td style="padding:0 40px;"><div style="border-top:1px solid #e5e7eb;"></div></td></tr>

          <!-- Booking Details -->
          <tr>
            <td style="padding:16px 40px;">
              <p style="color:#9ca3af;font-size:11px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Booking Details</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;width:120px;">Booking Type</td><td style="color:#1a1a1a;font-size:13px;font-weight:600;padding:3px 0;"><span style="display:inline-block;background-color:${data.bookingType === 'chauffeur' ? '#fdf4ff' : '#f0fdf4'};color:${data.bookingType === 'chauffeur' ? '#9333ea' : '#16a34a'};font-size:11px;font-weight:600;padding:2px 10px;border-radius:10px;">${data.bookingType === 'chauffeur' ? 'Chauffeur' : 'Standard'}</span></td></tr>
                <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Vehicle</td><td style="color:#1a1a1a;font-size:13px;font-weight:600;padding:3px 0;">${data.carTitle}</td></tr>
                <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Duration</td><td style="color:#1a1a1a;font-size:13px;font-weight:500;padding:3px 0;">${data.totalDays} days</td></tr>
                <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Pickup</td><td style="color:#1a1a1a;font-size:13px;font-weight:500;padding:3px 0;">${data.pickupLocation} — ${data.pickupDate} at ${data.pickupTime}</td></tr>
                <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Drop-off</td><td style="color:#1a1a1a;font-size:13px;font-weight:500;padding:3px 0;">${data.dropoffLocation} — ${data.dropoffDate} at ${data.dropoffTime}</td></tr>
                <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Plan</td><td style="color:#1a1a1a;font-size:13px;font-weight:500;padding:3px 0;">${data.selectedPlan || 'None'}</td></tr>
                <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Add-ons</td><td style="color:#1a1a1a;font-size:13px;font-weight:500;padding:3px 0;">${data.selectedAddons || 'None'}</td></tr>
              </table>
            </td>
          </tr>

          <tr><td style="padding:0 40px;"><div style="border-top:1px solid #e5e7eb;"></div></td></tr>

          <!-- Pricing -->
          <tr>
            <td style="padding:16px 40px;">
              <p style="color:#9ca3af;font-size:11px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Pricing</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Rental</td><td align="right" style="color:#1a1a1a;font-size:13px;font-weight:500;padding:3px 0;">£${data.basePrice}</td></tr>
                ${data.selectedPlan ? `<tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Plan</td><td align="right" style="color:#1a1a1a;font-size:13px;font-weight:500;padding:3px 0;">£${data.planCost}</td></tr>` : ''}
                ${data.selectedAddons !== 'None' ? `<tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Add-ons</td><td align="right" style="color:#1a1a1a;font-size:13px;font-weight:500;padding:3px 0;">£${data.addonsCost}</td></tr>` : ''}
                <tr><td colspan="2" style="border-top:1px solid #e5e7eb;padding-top:8px;"></td></tr>
                <tr><td style="color:#1a1a1a;font-size:15px;font-weight:700;padding:3px 0;">Total</td><td align="right" style="color:#0E253F;font-size:17px;font-weight:700;padding:3px 0;">£${data.totalPrice}</td></tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="color:#9ca3af;font-size:11px;margin:0;">This is an automated notification from the EliteDrive4U booking system.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(request: Request) {
  try {
    const data: BookingEmailData = await request.json();

    const resend = getResend();

    const [customerResult, companyResult] = await Promise.all([
      resend.emails.send({
        from: `EliteDrive4U <${FROM_EMAIL}>`,
        to: data.email,
        subject: `Booking Confirmed — ${data.bookingRef}`,
        html: buildCustomerEmailHtml(data),
      }),
      resend.emails.send({
        from: `EliteDrive4U Bookings <${FROM_EMAIL}>`,
        to: COMPANY_NOTIFICATION_TO,
        subject: `New Booking: ${data.carTitle} — ${data.bookingRef}`,
        html: buildCompanyEmailHtml(data),
      }),
    ]);

    if (customerResult.error || companyResult.error) {
      console.error('Resend error:', customerResult.error || companyResult.error);
      return NextResponse.json(
        { error: 'Failed to send one or more emails' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 });
  }
}
