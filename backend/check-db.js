const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const checkProducts = async () => {
  await connectDB();
  const products = await Product.find({}, 'name images');
  products.forEach(p => console.log(p.name));
  process.exit(0);
}
checkProducts();
