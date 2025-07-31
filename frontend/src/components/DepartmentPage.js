import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from './ProductCard';  // reuse existing product card
import { fetchDepartments, fetchProductsByDepartmentName } from '../api';

const DepartmentPage = () => {
  const { name } = useParams();  // department name from URL e.g. "men"
  const [department, setDepartment] = useState(null); // for header info
  const [products, setProducts] = useState([]);
  const [departments, setDepartments] = useState([]); // for sidebar or nav
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Departments for sidebar or navigation menu
  useEffect(() => {
    fetchDepartments()
      .then(data => setDepartments(data.data))
      .catch(() => setDepartments([]));
  }, []);

  // Fetch products for the selected department by name
  useEffect(() => {
  if (departments.length === 0) return; // wait till departments load

  setLoading(true);
  setError(null);

  const deptObj = departments.find(d => d.name.toLowerCase() === name.toLowerCase());

  if (!deptObj) {
    setError('Department not found');
    setLoading(false);
    return;
  }

  setDepartment(deptObj);

  fetchProductsByDepartmentId(deptObj._id)
    .then(res => {
      setProducts(res.data);
      setLoading(false);
    })
    .catch(() => {
      setError('Failed to load products');
      setLoading(false);
    });

}, [name, departments]);


  // Helper fetch API call - fetch products by department ID
  async function fetchProductsByDepartmentId(deptId) {
    const response = await fetch(`http://localhost:5000/api/departments/${deptId}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  }

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar department list */}
        <nav className="col-md-2 d-none d-md-block bg-light sidebar">
          <div className="pt-3">
            <h5>Departments</h5>
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link to="/" className={`nav-link ${name.toLowerCase() === '' ? 'active' : ''}`}>
                  All Products
                </Link>
              </li>
              {departments.map(dept => (
                <li key={dept._id} className="nav-item">
                  <Link
                    to={`/department/${dept.name.toLowerCase()}`}
                    className={`nav-link ${name.toLowerCase() === dept.name.toLowerCase() ? 'active' : ''}`}
                  >
                    {dept.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main content */}
        <main className="col-md-10 ms-sm-auto px-md-4">
          <h2 className="mt-3">
            Department: {department.name} ({products.length} products)
          </h2>

          {products.length === 0 ? (
            <p>No products found in this department.</p>
          ) : (
            <div className="row g-4 py-3">
              {products.map(product => (
                <div key={product.id} className="col-sm-6 col-md-4 col-lg-3">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DepartmentPage;
