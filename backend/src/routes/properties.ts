import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middlewares/auth';
import prisma from '../utils/prisma';

const router = Router();

// Get all properties with unit counts
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const properties = await prisma.property.findMany({
      include: {
        _count: {
          select: { units: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Create property
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { name, address } = req.body;
    const property = await prisma.property.create({
      data: { name, address }
    });
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// Get a single property with units
router.get('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const property = await prisma.property.findUnique({
      where: { id },
      include: { units: true }
    });
    
    if (!property) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }
    
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

export default router;
