import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import propertyRoutes from './routes/properties';
import unitRoutes from './routes/units';
import tenantRoutes from './routes/tenants';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/tenants', tenantRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Lease Management API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
