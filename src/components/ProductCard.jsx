import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onClick }) => {
  const { name, price, image_url, rating = 0, reviews_count = 0, category } = product;

  return (
    <div className="product-card" onClick={onClick}>
      <div className="product-image-container">
        <img
          src={image_url || 'https://via.placeholder.com/250x200?text=No+Image'}
          alt={name}
          className="product-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/250x200?text=No+Image';
          }}
        />
        <div className="product-category-badge">{category || 'General'}</div>
      </div>

      <div className="product-info">
        <h3 className="product-name">{name}</h3>

        <div className="product-rating">
          <span className="stars">
            {'★'.repeat(Math.floor(rating))}
            {'☆'.repeat(5 - Math.floor(rating))}
          </span>
          <span className="review-count">({reviews_count})</span>
        </div>

        <div className="product-price">
          <span className="current-price">₹{parseFloat(price).toLocaleString()}</span>
        </div>

        <button className="product-btn">View Details</button>
      </div>
    </div>
  );
};

export default ProductCard;
