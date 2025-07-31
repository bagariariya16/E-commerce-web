import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text flex-grow-1">
          <strong>Brand:</strong> {product.brand}<br />
          <strong>Category:</strong> {product.category}<br />
          <strong>Retail Price:</strong> ${product.retail_price.toFixed(2)}<br />
          <strong>Department:</strong> {product.department}
        </p>
        <Link to={`/products/${product.id}`} className="btn btn-primary mt-auto">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
