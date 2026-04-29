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
    required: [true, 'Please provide brand name']
    // NO ENUM HERE - ALLOW ALL BRANDS
  },
  category: {
    type: String,
    required: [true, 'Please provide category'],
    enum: ['Smartphone', 'Component'],
    default: 'Smartphone'
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
  originalPrice: {
    type: Number,
    min: 0
  },
  discountPercentage: {
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
    storage: { type: String, required: false, default: '' },
    ram: { type: String, required: false, default: '' },
    processor: { type: String, required: false, default: '' },
    camera: { type: String, required: false, default: '' },
    battery: { type: String, required: false, default: '' },
    displaySize: { type: String, required: false, default: '' },
    os: { type: String, required: false, default: '' }
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

productSchema.pre('save', function(next) {
  if (this.isModified('price') || this.isModified('discountPercentage')) {
    if (this.discountPercentage > 0 && this.price > 0) {
      this.originalPrice = this.price / (1 - this.discountPercentage / 100);
    } else {
      this.originalPrice = this.price;
    }
  }
  next();
});

productSchema.index({ name: 'text', brand: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);