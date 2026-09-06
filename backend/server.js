import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { pool } from './config/database.js';
import userRoutes from './routes/users.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import emiRoutes from './routes/emi.js';
import variantsRoutes from './routes/variants.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/emi', emiRoutes);
app.use('/api/variants', variantsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// Database initialization
async function initializeDatabase() {
  try {
    // Check connection
    const result = await pool.query('SELECT NOW()');
    console.log('Database connected successfully');
    
    // Initialize tables if they don't exist
    await createTables();
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}

async function createTables() {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create products table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        seller_id UUID NOT NULL REFERENCES users(id),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        quantity INT DEFAULT 0,
        category VARCHAR(100),
        image_url TEXT,
        rating DECIMAL(3, 2) DEFAULT 0,
        reviews_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create product variants table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS product_variants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        variant_name VARCHAR(100) NOT NULL,
        variant_value VARCHAR(255) NOT NULL,
        price_adjustment DECIMAL(10, 2) DEFAULT 0,
        stock INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create EMI plans table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS emi_plans (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        plan_name VARCHAR(100) NOT NULL,
        tenure_months INT NOT NULL,
        interest_rate DECIMAL(5, 2) NOT NULL,
        emi_amount DECIMAL(10, 2) NOT NULL,
        processing_fee DECIMAL(10, 2) DEFAULT 0,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        buyer_id UUID NOT NULL REFERENCES users(id),
        seller_id UUID NOT NULL REFERENCES users(id),
        product_id UUID NOT NULL REFERENCES products(id),
        quantity INT NOT NULL,
        total_price DECIMAL(10, 2) NOT NULL,
        emi_plan_id UUID REFERENCES emi_plans(id),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Tables initialized successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

// Start server
async function startServer() {
  await initializeDatabase();
  
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startServer();

export default app;
