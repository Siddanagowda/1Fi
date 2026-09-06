import express from 'express';
import { pool } from '../config/database.js';

const router = express.Router();

// Create order
router.post('/', async (req, res) => {
  try {
    const { buyer_id, seller_id, product_id, quantity } = req.body;

    if (!buyer_id || !seller_id || !product_id || !quantity) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Get product price
    const productResult = await pool.query('SELECT price FROM products WHERE id = $1', [product_id]);

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const total_price = productResult.rows[0].price * quantity;

    const result = await pool.query(
      'INSERT INTO orders (buyer_id, seller_id, product_id, quantity, total_price) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [buyer_id, seller_id, product_id, quantity, total_price]
    );

    res.status(201).json({
      message: 'Order created successfully',
      order: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update order status
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order updated successfully', order: result.rows[0] });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete order
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get orders by buyer
router.get('/buyer/:buyer_id', async (req, res) => {
  try {
    const { buyer_id } = req.params;
    const result = await pool.query(
      'SELECT * FROM orders WHERE buyer_id = $1 ORDER BY created_at DESC',
      [buyer_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching buyer orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get orders by seller
router.get('/seller/:seller_id', async (req, res) => {
  try {
    const { seller_id } = req.params;
    const result = await pool.query(
      'SELECT * FROM orders WHERE seller_id = $1 ORDER BY created_at DESC',
      [seller_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
