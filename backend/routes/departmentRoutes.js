const express = require('express');
const router = express.Router();

const { getDepartments, getDepartmentById, getProductsByDepartment } = require('../controllers/departmentController');

router.get('/departments', getDepartments);
router.get('/departments/:id', getDepartmentById);
router.get('/departments/:id/products', getProductsByDepartment);

module.exports = router;
