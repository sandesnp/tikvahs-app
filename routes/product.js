// routes/product.js
const express = require('express');
const router = express.Router();
const PRODUCT = require('../models/product');

// POST a new product
router.post('/', async (req, res) => {
  const product = new PRODUCT({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category, // Include the category attribute
    imageUrl: req.body.imageUrl,
  });
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await PRODUCT.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE all products
router.delete('/', async (req, res) => {
  try {
    await PRODUCT.deleteMany({});
    res.json({ message: 'All products deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/category', async (req, res) => {
  try {
    const categories = await PRODUCT.aggregate([
      {
        $group: {
          _id: '$category', // Group by category
        },
      },
      {
        $project: {
          _id: 0, // Exclude the _id field
          category: '$_id', // Map the _id field to category
        },
      },
      {
        $group: {
          _id: null, // Group all documents into one
          categories: { $push: '$category' }, // Push category names into an array
        },
      },
      {
        $project: {
          _id: 0, // Exclude the _id field
          categories: 1, // Include only the categories array
        },
      },
    ]);

    // Extract the categories array from the aggregation result
    const categoryList = categories.length > 0 ? categories[0].categories : [];
    console.log(categoryList);
    res.json(categoryList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/category/:categoryName', async (req, res) => {
  try {
    const categoryName = req.params.categoryName;
    const regex = new RegExp(categoryName, 'i'); // 'i' for case-insensitive
    const products = await PRODUCT.find({ category: regex });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get product object by ID
async function getProduct(req, res, next) {
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
    const { name, description, price, category, imageUrl } = req.body;
    let updateData = {};

    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = price;
    if (category) updateData.category = category; // Include the category for update
    if (imageUrl) updateData.imageUrl = imageUrl;

    try {
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
    const { name, description, price, category, imageUrl } = req.body;

    res.product.name = name;
    res.product.description = description;
    res.product.price = price;
    res.product.category = category; // Set the category attribute
    res.product.imageUrl = imageUrl;

    try {
      const updatedProduct = await res.product.save();
      res.json(updatedProduct);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  })
  .delete(getProduct, async (req, res) => {
    try {
      await res.product.remove();
      res.json({ message: 'Deleted Product' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;
