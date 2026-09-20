import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middlewares/auth';
import prisma from '../utils/prisma';

const router = Router();

// Create unit
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId, shopNumber, floor, status } = req.body;
    const unit = await prisma.unit.create({
      data: { propertyId, shopNumber, floor, status: status || 'Vacant' }
    });
    res.status(201).json(unit);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create unit' });
  }
});

// Get units for a property
router.get('/property/:propertyId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const propertyId = req.params.propertyId as string;
    const units = await prisma.unit.findMany({
      where: { propertyId },
      orderBy: { shopNumber: 'asc' }
    });
    res.json(units);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch units' });
  }
});

// Update unit
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { shopNumber, floor, status } = req.body;
    const unit = await prisma.unit.update({
      where: { id },
      data: { shopNumber, floor, status }
    });
    res.json(unit);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update unit' });
  }
});

export default router;
