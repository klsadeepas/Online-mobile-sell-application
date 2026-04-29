const Product = require('../models/Product');
const fs = require('fs'); // Standard node module

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const pageSize = 30;
    const page = Number(req.query.page) || 1;

    // Defensive check: ensure keyword is present and not the literal string "undefined"
    const keyword = (req.query.keyword && req.query.keyword !== 'undefined')
      ? {
        $or: [
          { name: { $regex: req.query.keyword, $options: 'i' } },
          { brand: { $regex: req.query.keyword, $options: 'i' } },
          { description: { $regex: req.query.keyword, $options: 'i' } }
        ]
      }
      : {};

    // Start with keyword filters
    let query = { ...keyword };

    // Add category filter - DEFAULT to Smartphone if not specified
    if (req.query.category) {
      query.category = req.query.category;
    } else {
      query.category = 'Smartphone';
    }

    // Add brand filter (case-insensitive for better UX)
    if (req.query.brand && req.query.brand !== 'All') {
      query.brand = { $regex: new RegExp(`^${req.query.brand}$`, 'i') };
    }

    // Prevent price filters from overwriting each other
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice) || 0;
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice) || 999999;
    }

    if (req.query.ram) query['specs.ram'] = { $regex: new RegExp(`^${req.query.ram}$`, 'i') };
    if (req.query.storage) query['specs.storage'] = { $regex: new RegExp(`^${req.query.storage}$`, 'i') };
    if (req.query.rating) query.rating = { $gte: Number(req.query.rating) };
    if (req.query.inStock === 'true') query.stock = { $gt: 0 };

    // Support flash sale filtering used in frontend links
    if (req.query.isFlashSale === 'true') {
      query.isFlashSale = true;
      query.flashSaleEnd = { $gt: new Date() };
    }

    const sort = {};
    switch (req.query.sort) {
      case 'price_low': sort.price = 1; break;
      case 'price_high': sort.price = -1; break;
      case 'rating': sort.rating = -1; break;
      default: sort.createdAt = -1;
    }

    const count = await Product.countDocuments(query);
    const totalPages = Math.ceil(count / pageSize) || 1;
    // If requested page is out of bounds (e.g. after filter change), default to page 1
    const safePage = page > 1 ? page : 1;

    const products = await Product.find(query)
      .sort(sort)
      .limit(pageSize)
      .skip(pageSize * (safePage - 1));

    // ABSOLUTE PROTECTION: Force filter the array to double-check Mongoose results
    let filteredProducts = products;
    if (query.category === 'Smartphone') {
      filteredProducts = products.filter(p => p.category === 'Smartphone' || !p.category);
    } else if (query.category === 'Component') {
      filteredProducts = products.filter(p => p.category === 'Component');
    }

    res.json({
      products: filteredProducts,
      page: safePage,
      pages: totalPages,
      total: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true, category: 'Smartphone' }).limit(8);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get flash sale products
// @route   GET /api/products/flash-sales
// @access  Public
const getFlashSaleProducts = async (req, res) => {
  try {
    const now = new Date();
    const products = await Product.find({
      isFlashSale: true,
      category: 'Smartphone',
      flashSaleEnd: { $gt: now }
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product brands
// @route   GET /api/products/brands
// @access  Public
const getBrands = async (req, res) => {
  try {
    const brands = await Product.distinct('brand');
    res.json(brands);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      const relatedProducts = await Product.find({
        brand: product.brand,
        _id: { $ne: product._id }
      }).limit(4);
      res.json(relatedProducts);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getFeaturedProducts,
  getFlashSaleProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getBrands,
  getRelatedProducts
};