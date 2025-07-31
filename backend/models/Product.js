const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: String,
  cost: Number,
  category: String,
  name: String,
  brand: String,
  retail_price: Number,
  // Replace department string with reference ObjectId
  department_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  sku: String,
  distribution_center_id: String
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
