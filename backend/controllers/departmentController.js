const Department = require('../models/Department');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// GET /api/departments
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({});
    res.json({ success: true, data: departments });
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// GET /api/departments/:id
const getDepartmentById = async (req, res) => {
  try {
    const deptId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(deptId)) {
      return res.status(400).json({ success: false, message: 'Invalid department ID' });
    }

    const department = await Department.findById(deptId);

    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    res.json({ success: true, data: department });
  } catch (error) {
    console.error('Error fetching department:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// GET /api/departments/:id/products
const getProductsByDepartment = async (req, res) => {
  try {
    const deptId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(deptId)) {
      return res.status(400).json({ success: false, message: 'Invalid department ID' });
    }

    // Check if department exists
    const department = await Department.findById(deptId);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    // Find products referencing this department_id
    const products = await Product.find({ department_id: deptId });

    res.json({
      success: true,
      department: { id: department._id, name: department.name },
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products by department:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = { getDepartments, getDepartmentById, getProductsByDepartment };
