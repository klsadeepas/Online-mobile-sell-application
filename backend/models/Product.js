const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  brand: {
    type: String,
    required: [true, 'Please provide brand name'],
    enum: ['Apple', 'Samsung', 'Xiaomi', 'OnePlus', 'Google Pixel', 'Oppo', 'Vivo', 'Realme']
  },
  description: {
    type: String,
    required: [true, 'Please provide description']
  },
  price: {
    type: Number,
    required: [true, 'Please provide price'],
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  images: [{
    type: String
  }],
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  specs: {
    storage: { type: String, required: true },
    ram: { type: String, required: true },
    processor: { type: String, required: true },
    camera: { type: String, required: true },
    battery: { type: String, required: true },
    displaySize: { type: String, required: true },
    os: { type: String }
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isFlashSale: {
    type: Boolean,
    default: false
  },
  flashSaleEnd: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for search
productSchema.index({ name: 'text', brand: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);