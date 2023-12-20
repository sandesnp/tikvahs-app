const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: String, required: true },
  imageUrl: { type: String, required: true },
  userType: { type: Boolean, default: false },
});

module.exports = mongoose.model('Product', productSchema);
