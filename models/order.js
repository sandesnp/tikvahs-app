const { Schema, model } = require('mongoose');

OrderItem = {
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number },
};

const Order = new Schema(
  {
    orderDetails: [OrderItem],
    orderStatus: { type: String, default: false },
    deliveryPerson: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = model('Order', Order);
