const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: String,  // Could use Number, but CSV ids are sometimes strings
  cost: Number,
  category: String,
  name: String,
  brand: String,
  retail_price: Number,
  department: String,
  sku: String,
  distribution_center_id: String // Use String to match exactly, unless you want as Number
});

module.exports = mongoose.model('Product', productSchema);
