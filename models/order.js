const { Schema, model } = require('mongoose');

const OrderItem = {
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number },
};

// Define a schema for the shipping address
const ShippingAddress = new Schema(
  {
    line1: { type: String },
    line2: { type: String, required: false },
    city: { type: String },
    state: { type: String },
    postal_code: { type: String },
    country: { type: String },
  },
  { _id: false }
); // _id: false because we don't need a separate ID for the address
const Order = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    orderDetails: [OrderItem],
    orderStatus: { type: Boolean, default: false },
    shippingAddress: ShippingAddress,
    paymentStatus: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = model('Order', Order);
