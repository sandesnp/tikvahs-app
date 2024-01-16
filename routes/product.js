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

// POST a new product
router
  .route('/')
  .post(async (req, res) => {
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
  })
  .get(async (req, res) => {
    try {
      const products = await PRODUCT.find();
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
  .delete(async (req, res) => {
    try {
      await PRODUCT.deleteMany({});
      res.json({ message: 'All products deleted' });
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

// GET a single product by ID
router
  .route('/:id')
  .get(getProduct, (req, res) => {
    res.json(res.product);
  })
  .patch(getProduct, async (req, res) => {
    try {
      const updateData = {};

      if (req.body.name != null) {
        updateData.name = req.body.name;
      }
      if (req.body.description != null) {
        updateData.description = req.body.description;
      }
      if (req.body.price != null) {
        updateData.price = req.body.price;
      }
      if (req.body.imageUrl != null) {
        updateData.imageUrl = req.body.imageUrl;
      }
      // Add other fields as necessary

      const updatedProduct = await PRODUCT.updateOne(
        { _id: req.params.id },
        { $set: updateData }
      );

      if (updatedProduct.matchedCount === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.json({ message: 'Product updated successfully', updatedProduct });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  })
  .put(getProduct, async (req, res) => {
    try {
      const { name, description, price, imageUrl } = req.body;
      if (name) res.product.name = name;
      if (description) res.product.description = description;
      if (price) res.product.price = price;
      if (imageUrl) res.product.imageUrl = imageUrl;

      const updatedProduct = await res.product.save();
      res.json(updatedProduct);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  })
  .delete(getProduct, async (req, res) => {
    try {
      await res.product.remove();
      res.json({ message: 'Deleted PRODUCT' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;
