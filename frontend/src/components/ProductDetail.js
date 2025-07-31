import React, { useEffect, useState } from 'react';
import { fetchProductById } from '../api';
import { useParams, Link } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProductById(id)
      .then(data => setProduct(data.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center mt-5">Loading product details...</div>;
  if (error) return <div className="text-danger text-center mt-5">Error: {error}</div>;
  if (!product) return <div className="text-center mt-5">Product not found.</div>;

  return (
    <div className="container">
      <Link to="/" className="btn btn-link mt-3">&laquo; Back to Products</Link>
      <h2 className="my-4">{product.name}</h2>

      <div className="row">
        {/* Placeholder for image if you have one */}
        <div className="col-md-6">
          <div className="border p-3 rounded text-center bg-light">
            <h5>Image Placeholder</h5>
            {/* <img src={product.image} alt={product.name} className="img-fluid" /> */}
          </div>
        </div>
        <div className="col-md-6">
          <ul className="list-group">
            <li className="list-group-item"><strong>Brand:</strong> {product.brand}</li>
            <li className="list-group-item"><strong>Category:</strong> {product.category}</li>
            <li className="list-group-item"><strong>Cost:</strong> ${product.cost.toFixed(2)}</li>
            <li className="list-group-item"><strong>Retail Price:</strong> ${product.retail_price.toFixed(2)}</li>
            <li className="list-group-item"><strong>Department:</strong> {product.department}</li>
            <li className="list-group-item"><strong>SKU:</strong> {product.sku}</li>
            <li className="list-group-item"><strong>Distribution Center ID:</strong> {product.distribution_center_id}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
