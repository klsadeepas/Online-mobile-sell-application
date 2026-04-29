const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Coupon = require('./models/Coupon');

// Route files
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const couponRoutes = require('./routes/couponRoutes');

dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MobileHub API is running' });
});

// Seed admin user
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@gmail.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@gmail.com',
        password: 'admin123',
        role: 'admin',
        phone: '1234567890',
        address: 'Admin Office'
      });
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error creating admin:', error.message);
  }
};

// Seed sample coupons
const seedCoupons = async () => {
  try {
    const coupons = [
      {
        code: 'SAVE10',
        description: 'Save 10% on your order',
        discountType: 'percentage',
        discountValue: 10,
        minPurchase: 100,
        maxDiscount: 50,
        validUntil: new Date('2026-12-31')
      },
      {
        code: 'PHONE20',
        description: 'Get $20 off on phones',
        discountType: 'fixed',
        discountValue: 20,
        minPurchase: 200,
        validUntil: new Date('2026-12-31')
      },
      {
        code: 'WELCOME15',
        description: 'Welcome offer - 15% off',
        discountType: 'percentage',
        discountValue: 15,
        minPurchase: 0,
        maxDiscount: 100,
        validUntil: new Date('2026-12-31')
      }
    ];

    for (const coupon of coupons) {
      const exists = await Coupon.findOne({ code: coupon.code });
      if (!exists) {
        await Coupon.create(coupon);
      }
    }
    console.log('Coupons seeded successfully');
  } catch (error) {
    console.error('Error seeding coupons:', error.message);
  }
};

// Seed sample products
const seedProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count > 0) {
      console.log('Products already exist, skipping seed');
      return;
    }

    const products = [
      // Apple
      {
        name: 'iPhone 15 Pro Max',
        brand: 'Apple',
        description: 'The most powerful iPhone ever with A17 Pro chip, titanium design, and advanced camera system.',
        price: 1199, // This is the final selling price
        discountPercentage: 5, // This is the percentage discount
        images: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-black-titanium-select-202309', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500'],
        stock: 50,
        specs: { storage: '256GB', ram: '8GB', processor: 'A17 Pro', camera: '48MP Main', battery: '5000mAh', displaySize: '6.7"', os: 'iOS 17' },
        rating: 4.8,
        numReviews: 234,
        isFeatured: true
      },
      {
        name: 'iPhone 15 Pro',
        brand: 'Apple',
        description: 'Pro-level iPhone with titanium build, A17 Pro chip, and professional camera system.',
        price: 999, // This is the final selling price
        discountPercentage: 3, // This is the percentage discount
        images: ['https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=500', 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500'],
        stock: 45,
        specs: { storage: '128GB', ram: '8GB', processor: 'A17 Pro', camera: '48MP Main', battery: '3274mAh', displaySize: '6.1"', os: 'iOS 17' },
        rating: 4.7,
        numReviews: 189,
        isFeatured: true
      },
      {
        name: 'iPhone 15',
        brand: 'Apple',
        description: 'The new iPhone with Dynamic Island, 48MP camera, and powerful A16 Bionic chip.',
        price: 799, // This is the final selling price
        discountPercentage: 0, // This is the percentage discount
        images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500', 'https://images.unsplash.com/photo-1580910051074-3eb694886f94?w=500'],
        stock: 60,
        specs: { storage: '128GB', ram: '6GB', processor: 'A16 Bionic', camera: '48MP Main', battery: '3349mAh', displaySize: '6.1"', os: 'iOS 17' },
        rating: 4.6,
        numReviews: 312,
        isFeatured: true
      },
      {
        name: 'iPhone 14 Pro Max',
        brand: 'Apple',
        description: 'Previous generation flagship with Dynamic Island, A16 Bionic, and pro camera system.',
        price: 1099, // This is the final selling price
        discountPercentage: 15, // This is the percentage discount
        images: ['https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=500', 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500'],
        stock: 30,
        specs: { storage: '256GB', ram: '6GB', processor: 'A16 Bionic', camera: '48MP Main', battery: '4323mAh', displaySize: '6.7"', os: 'iOS 16' },
        rating: 4.7,
        numReviews: 456,
        isFeatured: false
      },
      {
        name: 'iPhone SE (2024)',
        brand: 'Apple',
        description: 'Affordable iPhone with powerful chip and classic design.',
        price: 429, // This is the final selling price
        discountPercentage: 0, // This is the percentage discount
        images: ['https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500', 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500'],
        stock: 80,
        specs: { storage: '64GB', ram: '4GB', processor: 'A15 Bionic', camera: '12MP Main', battery: '2018mAh', displaySize: '4.7"', os: 'iOS 17' },
        rating: 4.4,
        numReviews: 178,
        isFeatured: false
      },
      // Samsung
      {
        name: 'Samsung Galaxy S24 Ultra',
        brand: 'Samsung',
        description: 'Ultimate Galaxy experience with S Pen, AI features, and premium titanium design.',
        price: 1299, // This is the final selling price
        discountPercentage: 8, // This is the percentage discount
        images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500'],
        stock: 40,
        specs: { storage: '512GB', ram: '12GB', processor: 'Snapdragon 8 Gen 3', camera: '200MP Main', battery: '5000mAh', displaySize: '6.8"', os: 'Android 14' },
        rating: 4.9,
        numReviews: 267,
        isFeatured: true
      },
      {
        name: 'Samsung Galaxy S24+',
        brand: 'Samsung',
        description: 'Premium Galaxy with AI features, stunning display, and powerful performance.',
        price: 999, // This is the final selling price
        discountPercentage: 5, // This is the percentage discount
        images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500', 'https://images.unsplash.com/photo-1610945415295-d9b89351aff97?w=500'],
        stock: 35,
        specs: { storage: '256GB', ram: '12GB', processor: 'Snapdragon 8 Gen 3', camera: '50MP Main', battery: '4900mAh', displaySize: '6.7"', os: 'Android 14' },
        rating: 4.7,
        numReviews: 198,
        isFeatured: true
      },
      {
        name: 'Samsung Galaxy S24',
        brand: 'Samsung',
        description: 'Compact flagship with AI features and powerful performance.',
        price: 799, // This is the final selling price
        discountPercentage: 0, // This is the percentage discount
        images: ['https://images.unsplash.com/photo-1580910051074-3eb694886f94?w=500', 'https://images.unsplash.com/photo-1610945415295-d9b89351aff97?w=500'],
        stock: 55,
        specs: { storage: '128GB', ram: '8GB', processor: 'Snapdragon 8 Gen 3', camera: '50MP Main', battery: '4000mAh', displaySize: '6.2"', os: 'Android 14' },
        rating: 4.6,
        numReviews: 234,
        isFeatured: true
      },
      {
        name: 'Samsung Galaxy Z Fold 5',
        brand: 'Samsung',
        description: 'Revolutionary foldable phone with large display and productivity features.',
        price: 1799, // This is the final selling price
        discountPercentage: 10, // This is the percentage discount
        images: ['https://images.unsplash.com/photo-1598327105109-3b8e2c9a6f41?w=500', 'https://images.unsplash.com/photo-1628815113969-0487917f0a36?w=500'],
        stock: 20,
        specs: { storage: '512GB', ram: '12GB', processor: 'Snapdragon 8 Gen 2', camera: '50MP Main', battery: '4400mAh', displaySize: '7.6"', os: 'Android 13' },
        rating: 4.5,
        numReviews: 89,
        isFeatured: true
      },
      {
        name: 'Samsung Galaxy A54',
        brand: 'Samsung',
        description: 'Mid-range phone with premium design and great camera.',
        price: 449, // This is the final selling price
        discountPercentage: 12, // This is the percentage discount
        images: ['https://images.unsplash.com/photo-1580910051074-3eb694886f94?w=500', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500'],
        stock: 70,
        specs: { storage: '128GB', ram: '8GB', processor: 'Exynos 1380', camera: '50MP Main', battery: '5000mAh', displaySize: '6.4"', os: 'Android 13' },
        rating: 4.3,
        numReviews: 345,
        isFeatured: false
      },
      // Xiaomi
      {
        name: 'Xiaomi 14 Pro',
        brand: 'Xiaomi',
        description: 'Flagship with Leica cameras, Snapdragon 8 Gen 3, and premium design.',
        price: 899, // This is the final selling price
        discountPercentage: 5, // This is the percentage discount
        images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500'],
        stock: 35,
        specs: { storage: '256GB', ram: '12GB', processor: 'Snapdragon 8 Gen 3', camera: '50MP Main', battery: '4880mAh', displaySize: '6.73"', os: 'Android 14' },
        rating: 4.7,
        numReviews: 156,
        isFeatured: true
      },
      {
        name: 'Xiaomi 14',
        brand: 'Xiaomi',
        description: 'Compact flagship with Leica cameras and powerful performance.',
        price: 699, // This is the final selling price
        discountPercentage: 0, // This is the percentage discount
        images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', 'https://images.unsplash.com/photo-1580910051074-3eb694886f94?w=500'],
        stock: 40,
        specs: { storage: '256GB', ram: '12GB', processor: 'Snapdragon 8 Gen 3', camera: '50MP Main', battery: '4610mAh', displaySize: '6.36"', os: 'Android 14' },
        rating: 4.6,
        numReviews: 123,
        isFeatured: true
      },
      {
        name: 'Xiaomi Redmi Note 13 Pro+',
        brand: 'Xiaomi',
        description: 'Mid-range powerhouse with 200MP camera and fast charging.',
        price: 399, // This is the final selling price
        discountPercentage: 8, // This is the percentage discount
        images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'],
        stock: 65,
        specs: { storage: '256GB', ram: '12GB', processor: 'Dimensity 7200 Ultra', camera: '200MP Main', battery: '5000mAh', displaySize: '6.67"', os: 'Android 13' },
        rating: 4.5,
        numReviews: 289,
        isFeatured: false
      },
      {
        name: 'Xiaomi 13 Ultra',
        brand: 'Xiaomi',
        description: 'Photography flagship with Leica optics and 1-inch sensor.',
        price: 1099, // This is the final selling price
        discountPercentage: 15, // This is the percentage discount
        images: ['https://images.unsplash.com/photo-1580910051074-3eb694886f94?w=500', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'],
        stock: 25,
        specs: { storage: '512GB', ram: '16GB', processor: 'Snapdragon 8 Gen 2', camera: '50MP Main', battery: '5000mAh', displaySize: '6.73"', os: 'Android 13' },
        rating: 4.8,
        numReviews: 98,
        isFeatured: true
      },
      // OnePlus
      {
        name: 'OnePlus 12',
        brand: 'OnePlus',
        description: 'Flagship with Hasselblad cameras, Snapdragon 8 Gen 3, and 100W charging.',
        price: 799, // This is the final selling price
        discountPercentage: 0, // This is the percentage discount
        images: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500'],
        stock: 45,
        specs: { storage: '256GB', ram: '16GB', processor: 'Snapdragon 8 Gen 3', camera: '50MP Main', battery: '5400mAh', displaySize: '6.82"', os: 'Android 14' },
        rating: 4.7,
        numReviews: 178,
        isFeatured: true
      },
      {
        name: 'OnePlus 12R',
        brand: 'OnePlus',
        description: 'Premium mid-range with flagship features at great price.',
        price: 499, // This is the final selling price
        discountPercentage: 10, // This is the percentage discount
        images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500'],
        stock: 55,
        specs: { storage: '128GB', ram: '8GB', processor: 'Snapdragon 8 Gen 2', camera: '50MP Main', battery: '5500mAh', displaySize: '6.78"', os: 'Android 14' },
        rating: 4.5,
        numReviews: 234,
        isFeatured: true
      },
      {
        name: 'OnePlus Open',
        brand: 'OnePlus',
        description: 'Premium foldable with Hasselblad cameras and OxygenOS.',
        price: 1699, // This is the final selling price
        discountPercentage: 12, // This is the percentage discount
        images: ['https://images.unsplash.com/photo-1628815113969-0487917f0a36?w=500', 'https://images.unsplash.com/photo-1598327105109-3b8e2c9a6f41?w=500'],
        stock: 15,
        specs: { storage: '512GB', ram: '16GB', processor: 'Snapdragon 8 Gen 2', camera: '48MP Main', battery: '4805mAh', displaySize: '7.82"', os: 'Android 13' },
        rating: 4.6,
        numReviews: 67,
        isFeatured: true
      },
      // Google Pixel
      {
        name: 'Google Pixel 8 Pro',
        brand: 'Google Pixel',
        description: 'AI-powered phone with Tensor G3, amazing camera, and 7 years of updates.',
        price: 999, // This is the final selling price
        discountPercentage: 5, // This is the percentage discount
        images: ['https://images.unsplash.com/photo-1598327105109-3b8e2c9a6f41?w=500', 'https://images.unsplash.com/photo-1628815113969-0487917f0a36?w=500'],
        stock: 40,
        specs: { storage: '256GB', ram: '12GB', processor: 'Tensor G3', camera: '50MP Main', battery: '5050mAh', displaySize: '6.7"', os: 'Android 14' },
        rating: 4.6,
        numReviews: 198,
        isFeatured: true
      },
      {
        name: 'Google Pixel 8',
        brand: 'Google Pixel',
        description: 'Compact AI phone with great camera and clean software.',
        price: 699, // This is the final selling price
        discountPercentage: 0, // This is the percentage discount
        images: ['https://images.unsplash.com/photo-1628815113969-0487917f0a36?w=500', 'https://images.unsplash.com/photo-1598327105109-3b8e2c9a6f41?w=500'],
        stock: 50,
        specs: { storage: '128GB', ram: '8GB', processor: 'Tensor G3', camera: '50MP Main', battery: '4575mAh', displaySize: '6.2"', os: 'Android 14' },
        rating: 4.5,
        numReviews: 267,
        isFeatured: true
      },
      {
        name: 'Google Pixel 7a',
        brand: 'Google Pixel',
        description: 'Affordable Pixel with excellent camera and smooth performance.',
        price: 449, // This is the final selling price
        discountPercentage: 15, // This is the percentage discount
        images: ['https://images.unsplash.com/photo-1598327105109-3b8e2c9a6f41?w=500', 'https://images.unsplash.com/photo-1628815113969-0487917f0a36?w=500'],
        stock: 60,
        specs: { storage: '128GB', ram: '8GB', processor: 'Tensor G2', camera: '64MP Main', battery: '4380mAh', displaySize: '6.2"', os: 'Android 13' },
        rating: 4.4,
        numReviews: 412,
        isFeatured: false
      },
      // Oppo
      {
        name: 'Oppo Find X7 Pro',
        brand: 'Oppo',
        description: 'Premium flagship with Hasselblad cameras and stunning design.',
        price: 899, // This is the final selling price
        discountPercentage: 8, // This is the percentage discount
        images: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500', 'https://images.unsplash.com/photo-1580910051074-3eb694886f94?w=500'],
        stock: 30,
        specs: { storage: '256GB', ram: '16GB', processor: 'Dimensity 9300', camera: '50MP Main', battery: '5000mAh', displaySize: '6.78"', os: 'Android 14' },
        rating: 4.7,
        numReviews: 145,
        isFeatured: true
      },
      {
        name: 'Oppo Reno 11 Pro',
        brand: 'Oppo',
        description: 'Stylish mid-range with great camera and fast charging.',
        price: 499, // This is the final selling price
        discountPercentage: 10, // This is the percentage discount
        images: ['https://images.unsplash.com/photo-1580910051074-3eb694886f94?w=500', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500'],
        stock: 55,
        specs: { storage: '256GB', ram: '12GB', processor: 'Dimensity 8200', camera: '50MP Main', battery: '4600mAh', displaySize: '6.74"', os: 'Android 14' },
        rating: 4.4,
        numReviews: 189,
        isFeatured: false
      },
      {
        name: 'Oppo A98 5G',
        brand: 'Oppo',
        description: 'Budget-friendly 5G phone with large display and good battery.',
        price: 299, // This is the final selling price
        discountPercentage: 5, // This is the percentage discount
        images: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500', 'https://images.unsplash.com/photo-1580910051074-3eb694886f94?w=500'],
        stock: 80,
        specs: { storage: '128GB', ram: '8GB', processor: 'Snapdragon 695', camera: '64MP Main', battery: '5000mAh', displaySize: '6.72"', os: 'Android 13' },
        rating: 4.2,
        numReviews: 234,
        isFeatured: false
      },
      // Vivo
      {
        name: 'Vivo X100 Pro',
        brand: 'Vivo',
        description: 'Photography flagship with Zeiss optics and premium design.',
        price: 999, // This is the final selling price
        discountPercentage: 8, // This is the percentage discount
        images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500'],
        stock: 25,
        specs: { storage: '256GB', ram: '16GB', processor: 'Dimensity 9300', camera: '50MP Main', battery: '5400mAh', displaySize: '6.78"', os: 'Android 14' },
        rating: 4.8,
        numReviews: 89,
        isFeatured: true
      },
      {
        name: 'Vivo V29 Pro',
        brand: 'Vivo',
        description: 'Mid-range with great camera and stylish design.',
        price: 449, // This is the final selling price
        discountPercentage: 12, // This is the percentage discount
        images: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500'],
        stock: 50,
        specs: { storage: '256GB', ram: '12GB', processor: 'Dimensity 8200', camera: '50MP Main', battery: '4600mAh', displaySize: '6.78"', os: 'Android 13' },
        rating: 4.4,
        numReviews: 156,
        isFeatured: false
      },
      {
        name: 'Vivo Y100',
        brand: 'Vivo',
        description: 'Budget phone with good specs and modern design.',
        price: 249, // This is the final selling price
        discountPercentage: 0, // This is the percentage discount
        images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500'],
        stock: 90,
        specs: { storage: '128GB', ram: '8GB', processor: 'Dimensity 900', camera: '64MP Main', battery: '5000mAh', displaySize: '6.67"', os: 'Android 13' },
        rating: 4.1,
        numReviews: 178,
        isFeatured: false
      },
      // Realme
      {
        name: 'Realme GT 5 Pro',
        brand: 'Realme',
        description: 'Performance flagship with Snapdragon 8 Gen 3 and great value.',
        price: 599, // This is the final selling price
        discountPercentage: 5, // This is the percentage discount
        images: ['https://images.unsplash.com/photo-1580910051074-3eb694886f94?w=500', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500'],
        stock: 40,
        specs: { storage: '256GB', ram: '16GB', processor: 'Snapdragon 8 Gen 3', camera: '50MP Main', battery: '5400mAh', displaySize: '6.78"', os: 'Android 14' },
        rating: 4.6,
        numReviews: 123,
        isFeatured: true
      },
      {
        name: 'Realme 12 Pro+',
        brand: 'Realme',
        description: 'Mid-range with periscope camera and premium design.',
        price: 399, // This is the final selling price
        discountPercentage: 10, // This is the percentage discount
        images: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500', 'https://images.unsplash.com/photo-1580910051074-3eb694886f94?w=500'],
        stock: 55,
        specs: { storage: '256GB', ram: '12GB', processor: 'Snapdragon 7s Gen 2', camera: '200MP Main', battery: '5000mAh', displaySize: '6.7"', os: 'Android 14' },
        rating: 4.5,
        numReviews: 198,
        isFeatured: true
      },
      {
        name: 'Realme C55',
        brand: 'Realme',
        description: 'Budget phone with good performance and modern design.',
        price: 149, // This is the final selling price
        discountPercentage: 0, // This is the percentage discount
        images: ['https://images.unsplash.com/photo-1580910051074-3eb694886f94?w=500', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500'],
        stock: 100,
        specs: { storage: '128GB', ram: '8GB', processor: 'Helio G88', camera: '64MP Main', battery: '5000mAh', displaySize: '6.72"', os: 'Android 13' },
        rating: 4.0,
        numReviews: 345,
        isFeatured: false
      }
    ];

    await Product.insertMany(products);
    console.log('30 sample products seeded successfully');
  } catch (error) {
    console.error('Error seeding products:', error.message);
  }
};

// Initialize
const init = async () => {
  await seedAdmin();
  await seedCoupons();
  await seedProducts();
};

init();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});