import cron from 'node-cron';
import prisma from '../utils/prisma';
import { sendDigestEmail } from '../services/emailService';

// Function that performs the actual check and email dispatch
export async function runDailyChecks() {
  console.log('⏰ Running daily operations check...');
  
  try {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    // 1. Find leases expiring in the next 30 days
    const expiringLeases = await prisma.leaseContract.findMany({
      where: {
        status: 'Active',
        endDate: {
          lte: thirtyDaysFromNow,
          gte: today
        }
      },
      include: {
        tenant: true,
        unit: { include: { property: true } }
      }
    });

    // 2. Find invoices that are overdue
    const overdueInvoices = await prisma.invoice.findMany({
      where: {
        status: 'Overdue'
      },
      include: {
        lease: { include: { tenant: true, unit: { include: { property: true } } } }
      }
    });

    // If there is nothing to report, do not send an email.
    if (expiringLeases.length === 0 && overdueInvoices.length === 0) {
      console.log('✅ No expiring leases or overdue invoices today. Skipping email digest.');
      return;
    }

    // Generate HTML Report
    let html = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 20px; text-align: center;">
          <h1 style="color: #fff; margin: 0;">Daily Operations Digest</h1>
        </div>
        <div style="padding: 20px;">
          <p>Hello,</p>
          <p>Here is your daily summary of items requiring your attention.</p>
    `;

    // Overdue Rent Section
    if (overdueInvoices.length > 0) {
      html += `
        <h2 style="color: #ef4444; border-bottom: 1px solid #eaeaea; padding-bottom: 10px;">🔴 Overdue Rent (${overdueInvoices.length})</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background-color: #f8fafc; text-align: left;">
            <th style="padding: 10px; border: 1px solid #eaeaea;">Tenant</th>
            <th style="padding: 10px; border: 1px solid #eaeaea;">Shop</th>
            <th style="padding: 10px; border: 1px solid #eaeaea;">Amount</th>
          </tr>
      `;
      for (const inv of overdueInvoices) {
        html += `
          <tr>
            <td style="padding: 10px; border: 1px solid #eaeaea;">${inv.lease.tenant.name}</td>
            <td style="padding: 10px; border: 1px solid #eaeaea;">${inv.lease.unit.property.name} - ${inv.lease.unit.shopNumber}</td>
            <td style="padding: 10px; border: 1px solid #eaeaea; font-weight: bold;">₹${inv.amount.toLocaleString()}</td>
          </tr>
        `;
      }
      html += `</table>`;
    }

    // Expiring Leases Section
    if (expiringLeases.length > 0) {
      html += `
        <h2 style="color: #f59e0b; border-bottom: 1px solid #eaeaea; padding-bottom: 10px;">⚠️ Upcoming Renewals (${expiringLeases.length})</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background-color: #f8fafc; text-align: left;">
            <th style="padding: 10px; border: 1px solid #eaeaea;">Tenant</th>
            <th style="padding: 10px; border: 1px solid #eaeaea;">Shop</th>
            <th style="padding: 10px; border: 1px solid #eaeaea;">End Date</th>
          </tr>
      `;
      for (const lease of expiringLeases) {
        html += `
          <tr>
            <td style="padding: 10px; border: 1px solid #eaeaea;">${lease.tenant.name}</td>
            <td style="padding: 10px; border: 1px solid #eaeaea;">${lease.unit.property.name} - ${lease.unit.shopNumber}</td>
            <td style="padding: 10px; border: 1px solid #eaeaea;">${new Date(lease.endDate).toLocaleDateString()}</td>
          </tr>
        `;
      }
      html += `</table>`;
    }

    html += `
        </div>
        <div style="background-color: #f8fafc; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
          This is an automated message from your Lease Management System.
        </div>
      </div>
    `;

    // Send the email
    await sendDigestEmail(html);

  } catch (error) {
    console.error('❌ Error during daily checks:', error);
  }
}

// Schedule the task to run every day at 8:00 AM
export function initCronJobs() {
  // '0 8 * * *' = 8:00 AM every day
  cron.schedule('0 8 * * *', () => {
    runDailyChecks();
  });
  console.log('⏰ Scheduled daily operations digest for 08:00 AM');
}
