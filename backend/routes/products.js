import express from 'express';
import { pool } from '../config/database.js';

const router = express.Router();

// Create product
router.post('/', async (req, res) => {
  try {
    const { seller_id, name, description, price, quantity, category, image_url } = req.body;

    if (!seller_id || !name || !price) {
      return res.status(400).json({ error: 'seller_id, name, and price are required' });
    }

    const result = await pool.query(
      'INSERT INTO products (seller_id, name, description, price, quantity, category, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [seller_id, name, description, price, quantity, category, image_url]
    );

    res.status(201).json({
      message: 'Product created successfully',
      product: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all products with variants and EMI plans
router.get('/', async (req, res) => {
  try {
    const { category, search, limit = 20, offset = 0 } = req.query;
    let query = `
      SELECT p.*, 
             json_agg(DISTINCT jsonb_build_object('id', pv.id, 'name', pv.variant_name, 'value', pv.variant_value, 'price_adjustment', pv.price_adjustment, 'stock', pv.stock)) FILTER (WHERE pv.id IS NOT NULL) as variants,
             json_agg(DISTINCT jsonb_build_object('id', ep.id, 'plan_name', ep.plan_name, 'tenure_months', ep.tenure_months, 'interest_rate', ep.interest_rate, 'emi_amount', ep.emi_amount, 'processing_fee', ep.processing_fee)) FILTER (WHERE ep.id IS NOT NULL) as emi_plans
      FROM products p
      LEFT JOIN product_variants pv ON p.id = pv.product_id
      LEFT JOIN emi_plans ep ON p.id = ep.product_id AND ep.active = true
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      query += ` AND p.category = $${params.length + 1}`;
      params.push(category);
    }

    if (search) {
      query += ` AND (p.name ILIKE $${params.length + 1} OR p.description ILIKE $${params.length + 1})`;
      params.push(`%${search}%`);
    }

    query += ` GROUP BY p.id ORDER BY p.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get product by ID with variants and EMI plans
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT p.*, 
             json_agg(DISTINCT jsonb_build_object('id', pv.id, 'name', pv.variant_name, 'value', pv.variant_value, 'price_adjustment', pv.price_adjustment, 'stock', pv.stock)) FILTER (WHERE pv.id IS NOT NULL) as variants,
             json_agg(DISTINCT jsonb_build_object('id', ep.id, 'plan_name', ep.plan_name, 'tenure_months', ep.tenure_months, 'interest_rate', ep.interest_rate, 'emi_amount', ep.emi_amount, 'processing_fee', ep.processing_fee)) FILTER (WHERE ep.id IS NOT NULL) as emi_plans
      FROM products p
      LEFT JOIN product_variants pv ON p.id = pv.product_id
      LEFT JOIN emi_plans ep ON p.id = ep.product_id AND ep.active = true
      WHERE p.id = $1
      GROUP BY p.id
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, quantity, category, image_url, rating, reviews_count } = req.body;

    const result = await pool.query(
      'UPDATE products SET name = COALESCE($1, name), description = COALESCE($2, description), price = COALESCE($3, price), quantity = COALESCE($4, quantity), category = COALESCE($5, category), image_url = COALESCE($6, image_url), rating = COALESCE($7, rating), reviews_count = COALESCE($8, reviews_count), updated_at = CURRENT_TIMESTAMP WHERE id = $9 RETURNING *',
      [name, description, price, quantity, category, image_url, rating, reviews_count, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully', product: result.rows[0] });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get products by seller
router.get('/seller/:seller_id', async (req, res) => {
  try {
    const { seller_id } = req.params;
    const query = `
      SELECT p.*, 
             json_agg(DISTINCT jsonb_build_object('id', pv.id, 'name', pv.variant_name, 'value', pv.variant_value, 'price_adjustment', pv.price_adjustment, 'stock', pv.stock)) FILTER (WHERE pv.id IS NOT NULL) as variants,
             json_agg(DISTINCT jsonb_build_object('id', ep.id, 'plan_name', ep.plan_name, 'tenure_months', ep.tenure_months, 'interest_rate', ep.interest_rate, 'emi_amount', ep.emi_amount, 'processing_fee', ep.processing_fee)) FILTER (WHERE ep.id IS NOT NULL) as emi_plans
      FROM products p
      LEFT JOIN product_variants pv ON p.id = pv.product_id
      LEFT JOIN emi_plans ep ON p.id = ep.product_id AND ep.active = true
      WHERE p.seller_id = $1
      GROUP BY p.id
    `;

    const result = await pool.query(query, [seller_id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching seller products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
