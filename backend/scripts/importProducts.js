require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const Product = require('../models/Product');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const results = [];
fs.createReadStream('./data/products.csv')
  .pipe(csv())
  .on('data', (data) => {
    results.push({
      id: data.id,
      cost: Number(data.cost),
      category: data.category,
      name: data.name,
      brand: data.brand,
      retail_price: Number(data.retail_price),
      department: data.department,
      sku: data.sku,
      distribution_center_id: data.distribution_center_id
    });
  })
  .on('end', async () => {
    try {
      await Product.deleteMany({});
      await Product.insertMany(results);
      console.log('Data Imported Successfully!');
      process.exit();
    } catch (error) {
      console.error('Error Importing Data:', error);
      process.exit(1);
    }
  });
