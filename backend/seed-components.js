const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const components = [
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    brand: 'Sony',
    category: 'Component',
    description: 'Industry-leading noise canceling with two processors controlling 8 microphones.',
    price: 119700, // RS
    images: ['https://images.unsplash.com/photo-1618366712277-7226027a0b3f?q=80&w=800'],
    stock: 20,
    specs: {},
    rating: 4.9,
    numReviews: 45
  },
  {
    name: 'USB-C to Lightning Cable (2m)',
    brand: 'Apple',
    category: 'Component',
    description: 'Connect your iPhone, iPad, or iPod with Lightning connector to your USB-C or Thunderbolt 3 (USB-C) enabled Mac.',
    price: 8700,
    images: ['https://images.unsplash.com/photo-1588506191060-da8595180aa2?q=80&w=800'],
    stock: 150,
    specs: {},
    rating: 4.5,
    numReviews: 120
  },
  {
    name: 'Samsung 256GB MicroSDXC Memory Card',
    brand: 'Samsung',
    category: 'Component',
    description: 'Up to 130MB/s transfer speed with UHS-I interface.',
    price: 14500,
    images: ['https://images.unsplash.com/photo-1544652478-6653e09f18a2?q=80&w=800'],
    stock: 80,
    specs: {},
    rating: 4.7,
    numReviews: 65
  },
  {
    name: 'iPhone 15 Pro Silicone Case with MagSafe',
    brand: 'Apple',
    category: 'Component',
    description: 'Silky, soft-touch finish of the silicone exterior feels great in your hand.',
    price: 17400,
    images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=800'],
    stock: 45,
    specs: {},
    rating: 4.4,
    numReviews: 30
  }
];

const seed = async () => {
  try {
    await connectDB();
    
    // Update all existing products to have 'Smartphone' category
    await Product.updateMany({ category: { $exists: false } }, { $set: { category: 'Smartphone' } });
    console.log('Updated existing products to Smartphone category');

    // Add new components
    for (const item of components) {
      const exists = await Product.findOne({ name: item.name });
      if (!exists) {
        await Product.create(item);
        console.log(`Created component: ${item.name}`);
      }
    }
    
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
};

seed();
