const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const updates = [
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    newImages: ['https://images.unsplash.com/photo-1546435770-a3e426ff4737?q=80&w=800']
  },
  {
    name: 'USB-C to Lightning Cable (2m)',
    newImages: ['https://images.unsplash.com/photo-1589492477829-5e65395b66cc?q=80&w=800']
  },
  {
    name: 'Samsung 256GB MicroSDXC Memory Card',
    newImages: ['https://images.unsplash.com/photo-1558489020-0294998399a0?q=80&w=800']
  },
  {
    name: 'iPhone 15 Pro Silicone Case with MagSafe',
    newImages: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=800']
  }
];

const updateImages = async () => {
  try {
    await connectDB();
    
    for (const item of updates) {
      const result = await Product.updateOne(
        { name: item.name },
        { $set: { images: item.newImages } }
      );
      if (result.modifiedCount > 0) {
        console.log(`Updated image for: ${item.name}`);
      } else {
        console.log(`Could not find or already updated: ${item.name}`);
      }
    }
    
    console.log('Component images updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Update failed:', error);
    process.exit(1);
  }
};

updateImages();
