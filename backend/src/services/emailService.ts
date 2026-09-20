import * as nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

// Initialize the email transporter
async function getTransporter() {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    // Use real SMTP if configured in .env
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
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@leaseapp.local';
    
    const info = await mailer.sendMail({
      from: '"LeaseApp System" <no-reply@leaseapp.local>',
      to: adminEmail,
      subject: `🚨 Daily Operations Digest - ${new Date().toLocaleDateString()}`,
      html: reportHtml,
    });

    console.log(`✅ Digest email sent to ${adminEmail}`);
    
    // If using Ethereal, log the preview URL so the developer can click and see it!
    if (!process.env.SMTP_HOST) {
      console.log('👀 Preview your email here: %s', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('❌ Failed to send digest email:', error);
  }
}
