import express from 'express';
import { pool } from '../config/database.js';

const router = express.Router();

// Add variant to product
router.post('/', async (req, res) => {
  try {
    const { product_id, variant_name, variant_value, price_adjustment, stock } = req.body;

    if (!product_id || !variant_name || !variant_value) {
      return res.status(400).json({ error: 'product_id, variant_name, and variant_value are required' });
    }

    const result = await pool.query(
      'INSERT INTO product_variants (product_id, variant_name, variant_value, price_adjustment, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [product_id, variant_name, variant_value, price_adjustment || 0, stock || 0]
    );

    res.status(201).json({
      message: 'Variant created successfully',
      variant: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating variant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all variants for a product
router.get('/product/:product_id', async (req, res) => {
  try {
    const { product_id } = req.params;
    const result = await pool.query(
      'SELECT * FROM product_variants WHERE product_id = $1 ORDER BY variant_name ASC',
      [product_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching variants:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get variant by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM product_variants WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Variant not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching variant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update variant
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { variant_name, variant_value, price_adjustment, stock } = req.body;

    const result = await pool.query(
      'UPDATE product_variants SET variant_name = COALESCE($1, variant_name), variant_value = COALESCE($2, variant_value), price_adjustment = COALESCE($3, price_adjustment), stock = COALESCE($4, stock) WHERE id = $5 RETURNING *',
      [variant_name, variant_value, price_adjustment, stock, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Variant not found' });
    }

    res.json({ message: 'Variant updated successfully', variant: result.rows[0] });
  } catch (error) {
    console.error('Error updating variant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete variant
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM product_variants WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Variant not found' });
    }

    res.json({ message: 'Variant deleted successfully' });
  } catch (error) {
    console.error('Error deleting variant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
