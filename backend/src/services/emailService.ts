import * as nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

// Initialize the email transporter
async function getTransporter() {
  if (transporter) return transporter;

  if (process.env.SENDGRID_API_KEY) {
    // Use SendGrid SMTP if API key is provided
    transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: 'apikey', // SendGrid requires the exact string 'apikey' as the username
        pass: process.env.SENDGRID_API_KEY,
      },
    });
    console.log('📧 Configured SendGrid email transporter');
  } else if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    // Use generic SMTP if configured in .env
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log('📧 Configured real SMTP email transporter');
  } else {
    // Generate a test Ethereal account if no real SMTP is provided
    console.log('⚙️ No SMTP credentials found. Creating test Ethereal email account...');
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
    console.log('📧 Configured Ethereal testing email transporter');
  }

  return transporter;
}

export async function sendDigestEmail(reportHtml: string) {
  try {
    const mailer = await getTransporter();
    const adminEmail = process.env.ADMIN_EMAIL || process.env.FROM_EMAIL || 'admin@leaseapp.local';
    const fromEmail = process.env.FROM_EMAIL || 'no-reply@leaseapp.local';
    
    const info = await mailer.sendMail({
      from: `"LeaseApp System" <${fromEmail}>`,
      to: adminEmail,
      subject: `🚨 Daily Operations Digest - ${new Date().toLocaleDateString()}`,
      html: reportHtml,
    });

    console.log(`✅ Digest email sent to ${adminEmail}`);
    
    // If using Ethereal, log the preview URL so the developer can click and see it!
    if (!process.env.SENDGRID_API_KEY && !process.env.SMTP_HOST) {
      console.log('👀 Preview your email here: %s', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('❌ Failed to send digest email:', error);
  }
}
