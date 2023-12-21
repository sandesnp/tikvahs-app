const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String },
  payment: [
    {
      cardNumber: {
        type: String,
      },
      expireDate: {
        type: String,
      },
      name: { type: String },
      secretCode: { type: String },
    },
  ],
  userType: { type: String, default: 'normal' },
});

module.exports = mongoose.model('User', userSchema);
