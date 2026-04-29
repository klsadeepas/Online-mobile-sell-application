const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const cleanup = async () => {
  try {
    await connectDB();
    
    // 1. Identify items that should be components based on keywords in name
    const componentKeywords = ['Headphones', 'Cable', 'Memory Card', 'Case', 'Cover', 'Charger', 'Adapter'];
    const componentRegex = new RegExp(componentKeywords.join('|'), 'i');

    const result1 = await Product.updateMany(
      { name: { $regex: componentRegex } },
      { $set: { category: 'Component' } }
    );
    console.log(`Aggressively forced ${result1.modifiedCount} items to Component category based on keywords.`);

    // 2. Identify smartphones (anything with RAM/Storage specs)
    const result2 = await Product.updateMany(
      { 
        $or: [
          { 'specs.ram': { $exists: true, $ne: '' } },
          { 'specs.storage': { $exists: true, $ne: '' } }
        ],
        category: { $ne: 'Smartphone' }
      },
      { $set: { category: 'Smartphone' } }
    );
    console.log(`Aggressively forced ${result2.modifiedCount} items to Smartphone category based on specs.`);

    // 3. Ensure all products have a category (default to Smartphone if still missing)
    const result3 = await Product.updateMany(
      { category: { $exists: false } },
      { $set: { category: 'Smartphone' } }
    );
    console.log(`Set default category for ${result3.modifiedCount} items.`);

    console.log('Aggressive database cleanup completed!');
    process.exit(0);
  } catch (error) {
    console.error('Cleanup failed:', error);
    process.exit(1);
  }
};

cleanup();
