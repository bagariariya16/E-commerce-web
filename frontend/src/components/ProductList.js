import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../api';
import ProductCard from './ProductCard';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const limit = 12;

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProducts(page, limit)
      .then(data => {
        setProducts(data.data);
        setTotalPages(data.totalPages);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [page]);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  if (loading) return <div className="text-center mt-5">Loading products...</div>;
  if (error) return <div className="text-danger text-center mt-5">Error: {error}</div>;
  if (products.length === 0) return <div className="text-center mt-5">No products found.</div>;

  return (
    <div className="container">
      <h2 className="mb-4">Products</h2>
      <div className="row g-4">
        {products.map(product => (
          <div key={product.id} className="col-sm-6 col-md-4 col-lg-3">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center align-items-center my-4">
        <button className="btn btn-outline-primary me-2" onClick={handlePrev} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button className="btn btn-outline-primary ms-2" onClick={handleNext} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductList;
