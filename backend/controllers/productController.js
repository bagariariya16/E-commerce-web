const Product = require('../models/Product');

// GET /api/products?limit=10&page=1
const getProducts = async (req, res) => {
  try {
    // Pagination params
    let limit = parseInt(req.query.limit) || 10;
    let page = parseInt(req.query.page) || 1;
    if(limit < 1) limit = 10;
    if(page < 1) page = 1;

    const skip = (page - 1) * limit;

    const total = await Product.countDocuments({});
    const products = await Product.find({})
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: products
    });
  } catch (error) {
    console.error('Error fetching product list:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    // Validate productId - your id field is string, so basic check:
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const product = await Product.findOne({ id: productId });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product by id:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = { getProducts, getProductById };
