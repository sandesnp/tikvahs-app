const express = require('express');
const router = express.Router();
const PRODUCT = require('../models/product');

router
  .route('/')
  .get(async (req, res, next) => {
    try {
      const response = await PRODUCT.find({});
      res.status(200).send(response);
      next();
    } catch (err) {
      console.log('Error getting product', err);
      res.status(500).json({ message: 'Error getting product' });
    }
  })
  .post(async (req, res, next) => {
    try {
      const response = await PRODUCT.create(req.body);
      res.send(response);
      next();
    } catch (err) {
      console.log('error during product creation', err);
      res.status(500).send({ message: 'Error during product creation.' });
    }
  });

module.exports = router;
