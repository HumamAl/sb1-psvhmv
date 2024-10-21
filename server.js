import express from 'express';
import sgMail from '@sendgrid/mail';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post('/api/send-email', async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const msg = {
    to,
    from: 'humamalrubaye22@gmail.com', // Your verified sender email
    subject,
    text,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent successfully to ${to}`);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: `Failed to send email: ${error.message}` });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});