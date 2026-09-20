import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middlewares/auth';
import prisma from '../utils/prisma';

const router = Router();

// Create a lease contract
router.post('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tenantId, unitId, startDate, endDate, baseRent, incrementPercentage, dueDay, documentUrl } = req.body;
    
    // Check if unit is available
    const unit = await prisma.unit.findUnique({ where: { id: unitId } });
    if (!unit || unit.status === 'Occupied') {
      res.status(400).json({ error: 'Unit is not available for leasing' });
      return;
    }

    const lease = await prisma.leaseContract.create({
      data: {
        tenantId,
        unitId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        baseRent,
        incrementPercentage,
        dueDay,
        documentUrl,
        status: 'Active'
      }
    });

    // Update unit status to Occupied
    await prisma.unit.update({
      where: { id: unitId },
      data: { status: 'Occupied' }
    });

    res.status(201).json(lease);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create lease contract' });
  }
});

// Get all leases
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const leases = await prisma.leaseContract.findMany({
      include: {
        tenant: true,
        unit: { include: { property: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(leases);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leases' });
  }
});

// Get lease by ID
router.get('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const lease = await prisma.leaseContract.findUnique({
      where: { id },
      include: {
        tenant: true,
        unit: { include: { property: true } },
        invoices: { orderBy: { targetYear: 'desc', targetMonth: 'desc' } }
      }
    });

    if (!lease) {
      res.status(404).json({ error: 'Lease not found' });
      return;
    }

    res.json(lease);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lease' });
  }
});

// Calculate current escalated rent for a given lease (Dynamic Annual Escalation Engine)
router.get('/:id/current-rent', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const lease = await prisma.leaseContract.findUnique({ where: { id } });

    if (!lease) {
      res.status(404).json({ error: 'Lease not found' });
      return;
    }

    const start = new Date(lease.startDate);
    const today = new Date();
    
    let elapsedYears = today.getFullYear() - start.getFullYear();
    // Adjust if the anniversary hasn't happened yet this year
    if (today.getMonth() < start.getMonth() || (today.getMonth() === start.getMonth() && today.getDate() < start.getDate())) {
      elapsedYears--;
    }

    if (elapsedYears < 0) elapsedYears = 0;

    const currentRent = lease.baseRent * Math.pow(1 + lease.incrementPercentage / 100, elapsedYears);

    res.json({ currentRent: parseFloat(currentRent.toFixed(2)), elapsedYears });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate rent' });
  }
});

export default router;
