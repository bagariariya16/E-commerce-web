require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Department = require('../models/Department');

async function migrateDepartments() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // 1. Get distinct department names from products
    const uniqueDepartments = await Product.distinct('department');
    console.log('Unique departments from products:', uniqueDepartments);

    // 2. Clean out existing departments collection (optional)
    await Department.deleteMany({});

    // 3. Insert departments from unique list (filter out falsy and "undefined")
    const validDeptNames = uniqueDepartments.filter(name => !!name && name !== 'undefined');
    const insertResult = await Department.insertMany(
      validDeptNames.map(name => ({ name }))
    );

    // 4. Insert or get default "Unknown" department for missing or invalid
    let defaultDept = await Department.findOne({ name: 'Unknown' });
    if (!defaultDept) {
      defaultDept = await Department.create({ name: 'Unknown' });
      console.log('Created default "Unknown" department');
    }

    // 5. Build department name → ObjectId map
    const deptMap = {};
    insertResult.forEach(dept => {
      deptMap[dept.name] = dept._id;
    });
    deptMap['Unknown'] = defaultDept._id;

    // 6. Get all products (remove .limit(10) to update all)
    const products = await Product.find({});

    // 7. Build bulk update operations
    const bulkOps = products.map(product => {
      let deptName = product.department;
      if (!deptName || !deptMap[deptName]) {
        console.warn(`No valid department found for product id ${product.id} with department: '${deptName}'. Assigning "Unknown".`);
        deptName = 'Unknown';
      }

      return {
        updateOne: {
          filter: { _id: product._id },
          update: {
            $set: { department_id: deptMap[deptName] },
            $unset: { department: "" }
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
