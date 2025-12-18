const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const productsRouter = require('./routes/products');
const customersRouter = require('./routes/customers');
const appointmentsRouter = require('./routes/appointments');
const authRouter = require('./routes/auth');  // ← ADD THIS

// Base routes
app.get('/', (req, res) => {
  res.json({ 
    ok: true,
    message: 'Salon Management API',
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// API routes
app.use('/api/products', productsRouter);
app.use('/api/customers', customersRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/auth', authRouter);  // ← ADD THIS

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});