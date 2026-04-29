const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const updates = [
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    newImages: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'USB-C to Lightning Cable (2m)',
    newImages: ['https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Samsung 256GB MicroSDXC Memory Card',
    newImages: ['https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'iPhone 15 Pro Silicone Case with MagSafe',
    newImages: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80']
  }
];

const updateImages = async () => {
  try {
    await connectDB();
    
    for (const item of updates) {
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
    
    console.log('Component images updated with stabilized URLs!');
    process.exit(0);
  } catch (error) {
    console.error('Update failed:', error);
    process.exit(1);
  }
};

updateImages();
