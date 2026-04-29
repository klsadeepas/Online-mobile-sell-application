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
  originalPrice: { // Price before discount
    type: Number,
    min: 0
  },
  discountPercentage: { // Percentage discount
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
    storage: { type: String },
    ram: { type: String },
    processor: { type: String },
    camera: { type: String },
    battery: { type: String },
    displaySize: { type: String },
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

// Pre-save hook to calculate originalPrice if discountPercentage is provided
productSchema.pre('save', function(next) {
  if (this.isModified('price') || this.isModified('discountPercentage')) {
    if (this.discountPercentage > 0 && this.price > 0) {
      this.originalPrice = this.price / (1 - this.discountPercentage / 100);
    } else {
      this.originalPrice = this.price; // If no discount, originalPrice is the same as price
    }
  }
  next();
});

// Index for search
productSchema.index({ name: 'text', brand: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);