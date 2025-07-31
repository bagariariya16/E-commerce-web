const Product = require('../models/Product');
const Department = require('../models/Department');

const getProducts = async (req, res) => {
  try {
    let limit = parseInt(req.query.limit) || 10;
    let page = parseInt(req.query.page) || 1;
    if(limit < 1) limit = 10;
    if(page < 1) page = 1;
    const skip = (page - 1) * limit;

    const total = await Product.countDocuments({});
    const products = await Product.find({})
      .populate('department_id', 'name') // populate department with only name field
      .skip(skip)
      .limit(limit);

    // Map results to include department name in a friendlier way
    const data = products.map(p => ({
      id: p.id,
      cost: p.cost,
      category: p.category,
      name: p.name,
      brand: p.brand,
      retail_price: p.retail_price,
      department: p.department_id ? p.department_id.name : null,
      department_id: p.department_id ? p.department_id._id : null,
      sku: p.sku,
      distribution_center_id: p.distribution_center_id
    }));

    res.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data
    });
  } catch (error) {
    console.error('Error fetching product list:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const product = await Product.findOne({ id: productId }).populate('department_id', 'name');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      data: {
        id: product.id,
        cost: product.cost,
        category: product.category,
        name: product.name,
        brand: product.brand,
        retail_price: product.retail_price,
        department: product.department_id ? product.department_id.name : null,
        department_id: product.department_id ? product.department_id._id : null,
        sku: product.sku,
        distribution_center_id: product.distribution_center_id
      }
    });
  } catch (error) {
    console.error('Error fetching product by id:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = { getProducts, getProductById };
