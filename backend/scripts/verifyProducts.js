require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected in verification script');
    return Product.find({});
  })
  .then(products => {
    console.log(`Found ${products.length} products in DB`);
    console.log(products.slice(0, 5));
    process.exit();
  })
  .catch(err => {
    console.error('Error in verification script:', err);
    process.exit(1);
  });
