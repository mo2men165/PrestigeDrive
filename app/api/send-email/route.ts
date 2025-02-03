import emailjs from 'emailjs-com';

export async function POST(request: Request) {
  const { subject, body, recipient } = await request.json();

  const serviceID = 'service_r8i8v6g';
  const templateID = 'template_1fgx54n';
  const userID = 'JNKdBh4-SqH_asdv7';  // You can find this in your EmailJS account

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
