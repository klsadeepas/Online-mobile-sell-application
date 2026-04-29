const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: String,
  image: String,
  price: Number,
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  totalPrice: Number
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [cartItemSchema],
  subtotal: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  shipping: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate totals before saving
cartSchema.pre('save', function(next) {
  this.subtotal = this.items.reduce((acc, item) => acc + item.totalPrice, 0);
  this.tax = Math.round(this.subtotal * 0.1 * 100) / 100; // 10% tax
  this.shipping = this.subtotal > 500 ? 0 : 50; // Free shipping over $500
  this.total = this.subtotal + this.tax + this.shipping;
  next();
});

module.exports = mongoose.model('Cart', cartSchema);