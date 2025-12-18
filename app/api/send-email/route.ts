import emailjs from 'emailjs-com';

export async function POST(request: Request) {
  const { subject, body, recipient } = await request.json();

  const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
  const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_USER!;
  const userID = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

  try {
    const response = await emailjs.send(serviceID, templateID, {
      subject,
      body,
      recipient,
    }, userID);

    return new Response('Email sent successfully', { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response('Failed to send email', { status: 500 });
  }
}
