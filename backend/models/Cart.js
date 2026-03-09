const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  stock: { type: Number, required: true },
});

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [cartItemSchema],
    totalPrice: { type: Number, default: 0 },
    totalItems: { type: Number, default: 0 },
    savedAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

cartSchema.methods.calculateTotals = function () {
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.totalPrice = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  this.savedAmount = this.items.reduce((sum, item) => sum + (item.oldPrice - item.price) * item.quantity, 0);
};

module.exports = mongoose.model('Cart', cartSchema);