// routes/product.js
const express = require('express');
const router = express.Router();
const PRODUCT = require('../models/product');

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await PRODUCT.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single product by ID
router.get('/:id', getProduct, (req, res) => {
  res.json(res.product);
});

// POST a new product
router.post('/', async (req, res) => {
  console.log('product uploade: ', req.body);
  const product = new PRODUCT({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    imageUrl: req.body.imageUrl,
  });
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a product
router.patch('/:id', getProduct, async (req, res) => {
  if (req.body.name != null) {
    res.product.name = req.body.name;
  }
  if (req.body.description != null) {
    res.product.description = req.body.description;
  }
  // Add other fields as necessary
  try {
    const updatedProduct = await res.product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a product
router.delete('/:id', getProduct, async (req, res) => {
  try {
    await res.product.remove();
    res.json({ message: 'Deleted PRODUCT' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get product object by ID
async function getProduct(req, res, next) {
  console.log(req.params.id);
  let product;
  try {
    product = await PRODUCT.findById(req.params.id);
    if (product == null) {
      return res.status(404).json({ message: 'Cannot find product' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.product = product;
  next();
}

module.exports = router;
