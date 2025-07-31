require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Department = require('../models/Department');

async function migrateDepartments() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // 1. Get distinct department names from products
    const uniqueDepartments = await Product.distinct('department');
    console.log('Unique departments:', uniqueDepartments);

    // 2. Create Department entries
    // Clean out existing departments collection (optional, comment if you want to keep data)
    await Department.deleteMany({});

    // Insert departments and keep mapping of name -> _id
    const insertResult = await Department.insertMany(
      uniqueDepartments.map(name => ({ name }))
    );

    const deptMap = {};
    insertResult.forEach(dept => {
      deptMap[dept.name] = dept._id;
    });

    // 3. Update each product: set department_id by matching name to deptMap
    const products = await Product.find({});

    const bulkOps = products.map(product => {
      const deptId = deptMap[product.department];
      if (!deptId) {
        console.warn(`No department_id found for product id ${product.id} with department '${product.department}'`);
      }
      return {
        updateOne: {
          filter: { _id: product._id },
          update: {
            $set: { department_id: deptId },
            $unset: { department: "" }  // Remove old department field optionally
          }
        }
      };
    });

    if (bulkOps.length > 0) {
      const bulkWriteResult = await Product.bulkWrite(bulkOps);
      console.log('Bulk update result:', bulkWriteResult);
    }

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

migrateDepartments();
