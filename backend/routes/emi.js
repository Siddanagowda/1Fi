import express from 'express';
import { pool } from '../config/database.js';

const router = express.Router();

// Add EMI plan to product
router.post('/', async (req, res) => {
  try {
    const { product_id, plan_name, tenure_months, interest_rate, emi_amount, processing_fee } = req.body;

    if (!product_id || !plan_name || !tenure_months || !interest_rate) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    const result = await pool.query(
      'INSERT INTO emi_plans (product_id, plan_name, tenure_months, interest_rate, emi_amount, processing_fee) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [product_id, plan_name, tenure_months, interest_rate, emi_amount || 0, processing_fee || 0]
    );

    res.status(201).json({
      message: 'EMI plan created successfully',
      emi_plan: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating EMI plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all EMI plans for a product
router.get('/product/:product_id', async (req, res) => {
  try {
    const { product_id } = req.params;
    const result = await pool.query(
      'SELECT * FROM emi_plans WHERE product_id = $1 AND active = true ORDER BY tenure_months ASC',
      [product_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching EMI plans:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get EMI plan by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM emi_plans WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'EMI plan not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching EMI plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update EMI plan
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { plan_name, tenure_months, interest_rate, emi_amount, processing_fee, active } = req.body;

    const result = await pool.query(
      'UPDATE emi_plans SET plan_name = COALESCE($1, plan_name), tenure_months = COALESCE($2, tenure_months), interest_rate = COALESCE($3, interest_rate), emi_amount = COALESCE($4, emi_amount), processing_fee = COALESCE($5, processing_fee), active = COALESCE($6, active) WHERE id = $7 RETURNING *',
      [plan_name, tenure_months, interest_rate, emi_amount, processing_fee, active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'EMI plan not found' });
    }

    res.json({ message: 'EMI plan updated successfully', emi_plan: result.rows[0] });
  } catch (error) {
    console.error('Error updating EMI plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete EMI plan
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM emi_plans WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'EMI plan not found' });
    }

    res.json({ message: 'EMI plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting EMI plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
