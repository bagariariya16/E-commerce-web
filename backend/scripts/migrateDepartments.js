require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Department = require('../models/Department');

async function migrateDepartments() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // 1. Get distinct department names from products (including undefined/null cases)
    const uniqueDepartments = await Product.distinct('department');
    console.log('Unique departments from products:', uniqueDepartments);

    // 2. Clean out existing departments collection (optional)
    await Department.deleteMany({});

    // 3. Insert departments from unique list (filter out invalid names)
    const validDeptNames = uniqueDepartments.filter(name => !!name && name !== 'undefined');  // filter out falsy and "undefined"
    const insertResult = await Department.insertMany(
      validDeptNames.map(name => ({ name }))
    );

    // 4. Insert or get default "Unknown" department for missing or undefined
    let defaultDept = await Department.findOne({ name: 'Unknown' });
    if (!defaultDept) {
      defaultDept = await Department.create({ name: 'Unknown' });
      console.log('Created default "Unknown" department');
    }

    // 5. Build deptName -> _id map
    const deptMap = {};
    insertResult.forEach(dept => {
      deptMap[dept.name] = dept._id;
    });
    // Add default department to map
    deptMap['Unknown'] = defaultDept._id;

    // 6. Find all products to update
    const products = await Product.find({})
      .populate('department_id', 'name')
  .limit(10);
    

    // 7. Build bulk update operations with handling missing/undefined departments
    const bulkOps = products.map(product => {
      // Use actual dept name if exists and valid, otherwise assign default "Unknown"
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
            $unset: { department: "" }  // Remove old department field
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
