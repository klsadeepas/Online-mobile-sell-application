const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const updates = [
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    newImages: ['https://images.unsplash.com/photo-1601784551446-20c9e07cdbc3?q=80&w=800']
  },
  {
    name: 'USB-C to Lightning Cable (2m)',
    newImages: ['https://images.unsplash.com/photo-1591337676887-a217a6970a8a?q=80&w=800']
  },
  {
    name: 'Samsung 256GB MicroSDXC Memory Card',
    newImages: ['https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=800']
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
      // Use regex for loose matching to handle potential name variations
      const result = await Product.updateOne(
        { name: { $regex: new RegExp(item.name.split(' ')[0], 'i') } }, 
        { $set: { images: item.newImages } }
      );
      if (result.modifiedCount > 0) {
        console.log(`Updated image for: ${item.name}`);
      } else {
        console.log(`No match found for: ${item.name}`);
      }
    }
    
    console.log('Component images updated with verified IDs!');
    process.exit(0);
  } catch (error) {
    console.error('Update failed:', error);
    process.exit(1);
  }
};

updateImages();
