import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middlewares/auth';
import prisma from '../utils/prisma';

const router = Router();

// Generate monthly invoices manually (in reality, this would be a CRON job, but an API endpoint is useful for the dashboard)
router.post('/generate', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { targetMonth, targetYear } = req.body;
    
    // Find all active leases
    const activeLeases = await prisma.leaseContract.findMany({
      where: { status: 'Active' }
    });

    let createdCount = 0;

    for (const lease of activeLeases) {
      // Check if invoice already exists for this month
      const existing = await prisma.invoice.findFirst({
        where: { leaseId: lease.id, targetMonth, targetYear }
      });

      if (!existing) {
        // Calculate escalated rent
        const start = new Date(lease.startDate);
        const targetDate = new Date(targetYear, targetMonth - 1, lease.dueDay); // Month is 1-indexed in req body
        
        let elapsedYears = targetYear - start.getFullYear();
        if (targetMonth - 1 < start.getMonth() || (targetMonth - 1 === start.getMonth() && targetDate.getDate() < start.getDate())) {
          elapsedYears--;
        }
        if (elapsedYears < 0) elapsedYears = 0;

        const currentRent = lease.baseRent * Math.pow(1 + lease.incrementPercentage / 100, elapsedYears);

        // Determine initial status based on due date
        const today = new Date();
        const status = targetDate < today ? 'Overdue' : 'Pending';

        await prisma.invoice.create({
          data: {
            leaseId: lease.id,
            targetMonth,
            targetYear,
            amount: parseFloat(currentRent.toFixed(2)),
            dueDate: targetDate,
            status
          }
        });
        createdCount++;
      }
    }

    res.json({ message: `Successfully generated ${createdCount} invoices.` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate invoices' });
  }
});

// Get invoices (filterable by status)
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;
    const filter = status ? { status: String(status) } : {};

    const invoices = await prisma.invoice.findMany({
      where: filter,
      include: {
        lease: { include: { tenant: true, unit: true } }
      },
      orderBy: [{ targetYear: 'desc' }, { targetMonth: 'desc' }]
    });

    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// Mark invoice as paid
router.post('/:id/pay', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { paymentMode } = req.body;

    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        status: 'Paid',
        paymentMode,
        paidDate: new Date()
      }
    });

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to record payment' });
  }
});

export default router;
