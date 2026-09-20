import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import propertyRoutes from './routes/properties';
import unitRoutes from './routes/units';
import tenantRoutes from './routes/tenants';
import leaseRoutes from './routes/leases';
import invoiceRoutes from './routes/invoices';
import documentRoutes from './routes/documents';
import { initCronJobs } from './cron/reminders';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/leases', leaseRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/documents', documentRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Lease Management API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  initCronJobs();
});
