import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { BOOKING_EMAIL, INFO_EMAIL } from '@/constants/emails';

const COMPANY_NOTIFICATION_TO = [INFO_EMAIL, BOOKING_EMAIL];
const FROM_EMAIL = BOOKING_EMAIL;

function getResend() {
  return new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

interface EnquiryData {
  name: string;
  email: string;
  phone?: string;
  query?: string;
  service?: string;
  bookingType?: string;
  bookingRef?: string;
  pickupLocation?: string;
  pickupDate?: string;
  pickupTime?: string;
  dropoffLocation?: string;
  dropoffDate?: string;
  dropoffTime?: string;
  additionalNotes?: string;
  totalDays?: number;
}

function buildCustomerEnquiryHtml(data: EnquiryData): string {
  const isServiceBooking = !!data.service;

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <tr>
            <td style="background:linear-gradient(135deg,#0E253F,#1B365D);padding:32px 40px;text-align:center;">
              <h1 style="color:#ffffff;font-size:24px;margin:0 0 6px;">ELITEDRIVE4U</h1>
              <p style="color:#A88B5C;font-size:13px;margin:0;letter-spacing:2px;text-transform:uppercase;">
                ${isServiceBooking ? 'Service Booking Received' : 'We Got Your Message'}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              <p style="color:#1a1a1a;font-size:16px;margin:0;">Dear ${data.name},</p>
              <p style="color:#6b7280;font-size:14px;margin:8px 0 0;line-height:1.6;">
                ${isServiceBooking
                  ? 'Thank you for your service booking request. Our team will review the details and contact you within 24 hours to confirm everything.'
                  : 'Thank you for reaching out to EliteDrive4U. We have received your message and one of our team members will get back to you as soon as possible.'}
              </p>
            </td>
          </tr>
          ${isServiceBooking && data.bookingRef ? `
          <tr>
            <td style="padding:0 40px 16px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4ff;border-radius:8px;border:1px solid #dbeafe;">
                <tr>
                  <td style="padding:16px 20px;text-align:center;">
                    <p style="color:#6b7280;font-size:12px;margin:0;text-transform:uppercase;letter-spacing:1px;">Booking Reference</p>
                    <p style="color:#0E253F;font-size:20px;font-weight:bold;margin:6px 0 0;font-family:monospace;letter-spacing:1px;">${data.bookingRef}</p>
                    ${data.bookingType ? `<p style="margin:8px 0 0;"><span style="display:inline-block;background-color:${data.bookingType === 'chauffeur' ? '#fdf4ff' : '#f0fdf4'};color:${data.bookingType === 'chauffeur' ? '#9333ea' : '#16a34a'};font-size:11px;font-weight:600;padding:4px 12px;border-radius:12px;text-transform:uppercase;letter-spacing:1px;">${data.bookingType === 'chauffeur' ? 'Chauffeur Service' : 'Service Booking'}</span></p>` : ''}
                  </td>
                </tr>
              </table>
            </td>
          </tr>` : ''}
          ${isServiceBooking ? `
          <tr>
            <td style="padding:0 40px 16px;">
              <p style="color:#6b7280;font-size:13px;margin:0;line-height:1.6;">Pricing is not confirmed online. Our team will contact you with a quote based on vehicle, locations, and your requirements.</p>
            </td>
          </tr>` : ''}
          <tr>
            <td style="padding:0 40px 32px;text-align:center;">
              <p style="color:#6b7280;font-size:13px;margin:0 0 4px;">Need immediate assistance?</p>
              <a href="tel:03333391475" style="color:#0E253F;font-size:14px;font-weight:600;text-decoration:none;">03333 391 475</a>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 40px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="color:#9ca3af;font-size:11px;margin:0;">&copy; ${new Date().getFullYear()} EliteDrive4U. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildCompanyEnquiryHtml(data: EnquiryData): string {
  const isServiceBooking = !!data.service;

  const detailsRows = isServiceBooking
    ? `
      <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;width:120px;">Booking Type</td><td style="color:#1a1a1a;font-size:13px;font-weight:600;padding:3px 0;"><span style="display:inline-block;background-color:${data.bookingType === 'chauffeur' ? '#fdf4ff' : '#f0fdf4'};color:${data.bookingType === 'chauffeur' ? '#9333ea' : '#16a34a'};font-size:11px;font-weight:600;padding:2px 10px;border-radius:10px;">${data.bookingType === 'chauffeur' ? 'Chauffeur' : 'Service'}</span></td></tr>
      <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Service</td><td style="color:#1a1a1a;font-size:13px;font-weight:500;padding:3px 0;">${data.service}</td></tr>
      <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Pickup</td><td style="color:#1a1a1a;font-size:13px;font-weight:500;padding:3px 0;">${data.pickupLocation} — ${data.pickupDate} at ${data.pickupTime}</td></tr>
      <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Drop-off</td><td style="color:#1a1a1a;font-size:13px;font-weight:500;padding:3px 0;">${data.dropoffLocation} — ${data.dropoffDate} at ${data.dropoffTime}</td></tr>
      ${data.totalDays != null && data.totalDays > 0 ? `<tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Rental days</td><td style="color:#1a1a1a;font-size:13px;font-weight:500;padding:3px 0;">${data.totalDays}</td></tr>` : ''}
      <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;vertical-align:top;">Price</td><td style="color:#1a1a1a;font-size:13px;font-weight:500;padding:3px 0;">To be quoted — contact customer with vehicle &amp; location-based pricing</td></tr>
      ${data.additionalNotes ? `<tr><td style="color:#6b7280;font-size:13px;padding:8px 0 3px;vertical-align:top;">Customer notes</td><td style="color:#1a1a1a;font-size:13px;font-weight:500;padding:8px 0 3px;line-height:1.5;">${escapeHtml(data.additionalNotes)}</td></tr>` : ''}
    `
    : `
      <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;width:120px;">Message</td><td style="color:#1a1a1a;font-size:13px;font-weight:500;padding:3px 0;">${data.query}</td></tr>
    `;

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <tr>
            <td style="background:#0E253F;padding:24px 40px;">
              <h1 style="color:#ffffff;font-size:18px;margin:0;">${isServiceBooking ? 'New Service Booking' : 'New Enquiry'}</h1>
              ${data.bookingRef ? `<p style="color:#A88B5C;font-size:13px;margin:4px 0 0;">Ref: ${data.bookingRef}</p>` : ''}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px 16px;">
              <p style="color:#9ca3af;font-size:11px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Contact Details</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;width:120px;">Name</td><td style="color:#1a1a1a;font-size:13px;font-weight:500;padding:3px 0;">${data.name}</td></tr>
                <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Email</td><td style="color:#1a1a1a;font-size:13px;font-weight:500;padding:3px 0;"><a href="mailto:${data.email}" style="color:#0E253F;text-decoration:none;">${data.email}</a></td></tr>
                ${data.phone ? `<tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Phone</td><td style="color:#1a1a1a;font-size:13px;font-weight:500;padding:3px 0;">${data.phone}</td></tr>` : ''}
              </table>
            </td>
          </tr>
          <tr><td style="padding:0 40px;"><div style="border-top:1px solid #e5e7eb;"></div></td></tr>
          <tr>
            <td style="padding:16px 40px;">
              <p style="color:#9ca3af;font-size:11px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">${isServiceBooking ? 'Booking Details' : 'Message'}</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${detailsRows}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 40px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="color:#9ca3af;font-size:11px;margin:0;">Automated notification from EliteDrive4U.</p>
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
    const data: EnquiryData = await request.json();
    const isServiceBooking = !!data.service;

    const resend = getResend();

    const [customerResult, companyResult] = await Promise.all([
      resend.emails.send({
        from: `EliteDrive4U <${FROM_EMAIL}>`,
        to: data.email,
        subject: isServiceBooking
          ? `Service Booking Received — EliteDrive4U`
          : `We received your message — EliteDrive4U`,
        html: buildCustomerEnquiryHtml(data),
      }),
      resend.emails.send({
        from: `EliteDrive4U <${FROM_EMAIL}>`,
        to: COMPANY_NOTIFICATION_TO,
        subject: isServiceBooking
          ? `New Service Booking: ${data.service} — ${data.name}`
          : `New Enquiry from ${data.name}`,
        html: buildCompanyEnquiryHtml(data),
      }),
    ]);

    if (customerResult.error || companyResult.error) {
      console.error('Resend error:', customerResult.error || companyResult.error);
      return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 });
  }
}
