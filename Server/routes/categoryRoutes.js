const express = require('express');
const router = express.Router();
const models = require('../Models');

// Middleware to validate category
router.use('/:category', (req, res, next) => {
  const { category } = req.params;
  if (!models[category]) return res.status(404).json({ error: 'Category not found' });
  req.Model = models[category];
  next();
});

// GET all
router.get('/:category', async (req, res) => {
  try {
    const items = await req.Model.find({});
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create
router.post('/:category', async (req, res) => {
  try {
    const newItem = await req.Model.create(req.body);
    res.json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET by ID
router.get('/:category/:id', async (req, res) => {
  try {
    const item = await req.Model.findById(req.params.id);
    res.json(item);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// PUT update
router.put('/:category/:id', async (req, res) => {
  try {
    const item = await req.Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:category/:id', async (req, res) => {
  try {
    const item = await req.Model.findByIdAndDelete(req.params.id);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
