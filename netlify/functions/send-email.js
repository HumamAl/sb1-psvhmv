const sgMail = require('@sendgrid/mail');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { to, subject, text } = JSON.parse(event.body);

  if (!to || !subject || !text) {
    return { statusCode: 400, body: JSON.stringify({ message: 'Missing required fields' }) };
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to,
    from: 'humamalrubaye22@gmail.com', // Your verified sender email
    subject,
    text,
  };

  try {
    await sgMail.send(msg);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `Failed to send email: ${error.message}` }),
    };
  }
};