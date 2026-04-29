const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const listProducts = async () => {
  try {
    await connectDB();
    
    const products = await Product.find({}, 'name category');
    console.log('--- Current Database State ---');
    products.forEach(p => {
      console.log(`- ${p.name} | Category: [${p.category}]`);
    });
    console.log('------------------------------');
    
    process.exit(0);
  } catch (error) {
    console.error('List failed:', error);
    process.exit(1);
  }
};

listProducts();
