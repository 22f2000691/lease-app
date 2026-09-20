import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middlewares/auth';
import prisma from '../utils/prisma';

const router = Router();

// Get all tenants
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const tenants = await prisma.tenant.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tenants' });
  }
});

// Create tenant
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { name, contactPerson, mobileNumber, registeredAddress, kycDocumentUrl } = req.body;
    const tenant = await prisma.tenant.create({
      data: { name, contactPerson, mobileNumber, registeredAddress, kycDocumentUrl }
    });
    res.status(201).json(tenant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create tenant' });
  }
});

// Get a single tenant
router.get('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: { leases: { include: { unit: { include: { property: true } } } } }
    });
    
    if (!tenant) {
      res.status(404).json({ error: 'Tenant not found' });
      return;
    }
    
    res.json(tenant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tenant' });
  }
});

export default router;
