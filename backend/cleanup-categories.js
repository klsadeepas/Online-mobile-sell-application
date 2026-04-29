const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const componentNames = [
  'iPhone 15 Pro Silicone Case with MagSafe',
  'Samsung 256GB MicroSDXC Memory Card',
  'USB-C to Lightning Cable (2m)',
  'Sony WH-1000XM5 Wireless Headphones'
];

const cleanup = async () => {
  try {
    await connectDB();
    
    // 1. Force Components to correct category
    const result1 = await Product.updateMany(
      { name: { $in: componentNames } },
      { $set: { category: 'Component' } }
    );
    console.log(`Forced ${result1.modifiedCount} items to Component category.`);

    // 2. Ensure everything else is a Smartphone if not already a Component
    const result2 = await Product.updateMany(
      { name: { $nin: componentNames }, category: { $ne: 'Component' } },
      { $set: { category: 'Smartphone' } }
    );
    console.log(`Ensured ${result2.modifiedCount} items are Smartphone category.`);

    console.log('Database cleanup completed!');
    process.exit(0);
  } catch (error) {
    console.error('Cleanup failed:', error);
    process.exit(1);
  }
};

cleanup();
