import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import VariantSelector from './VariantSelector';
import EMICalculator from './EMICalculator';
import './ProductDetail.css';

const ProductDetail = ({ product, onBack, onProceed }) => {
  const [selectedVariants, setSelectedVariants] = useState({});
  const [selectedEMI, setSelectedEMI] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [emiPlans, setEmiPlans] = useState([]);
  const [emiLoading, setEmiLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(null);

  useEffect(() => {
    fetchEMIPlans();
  }, [product.id]);

  const fetchEMIPlans = async () => {
    try {
      setEmiLoading(true);
      const plans = await apiClient.getEMIPlans(product.id);
      setEmiPlans(plans);
    } catch (error) {
      console.error('Error fetching EMI plans:', error);
    } finally {
      setEmiLoading(false);
    }
  };

  const calculateFinalPrice = () => {
    let price = parseFloat(product.price);

    // Add variant price adjustments
    Object.values(selectedVariants).forEach((variant) => {
      if (variant.data?.price_adjustment) {
        price += variant.data.price_adjustment;
      }
    });

    return price * quantity;
  };

  const handleProceed = () => {
    if (Object.keys(selectedVariants).length < product.variants?.length) {
      setShowNotification('Please select all variants');
      setTimeout(() => setShowNotification(null), 3000);
      return;
    }

    onProceed({
      product: product.id,
      variants: selectedVariants,
      emiPlan: selectedEMI,
      quantity,
      totalPrice: calculateFinalPrice(),
    });
  };

  const finalPrice = calculateFinalPrice();

  return (
    <div className="product-detail">
      <button className="back-button" onClick={onBack}>
        ← Back to Products
      </button>

      <div className="detail-container">
        <div className="detail-image-section">
          <img
            src={product.image_url || 'https://via.placeholder.com/400x400?text=No+Image'}
            alt={product.name}
            className="detail-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
            }}
          />

          <div className="image-info">
            <div className="badge-group">
              {product.category && <span className="category-badge">{product.category}</span>}
              {product.rating && <span className="rating-badge">★ {product.rating}</span>}
            </div>
          </div>
        </div>

        <div className="detail-info-section">
          <h1 className="product-title">{product.name}</h1>

          <div className="product-meta">
            {product.rating && (
              <div className="rating-section">
                <span className="stars">
                  {'★'.repeat(Math.floor(product.rating))}
                  {'☆'.repeat(5 - Math.floor(product.rating))}
                </span>
                <span className="reviews">({product.reviews_count || 0} reviews)</span>
              </div>
            )}
          </div>

          {product.description && (
            <div className="description-section">
              <h3>About this product</h3>
              <p>{product.description}</p>
            </div>
          )}

          <div className="pricing-section">
            <div className="price-box">
              <span className="label">Price</span>
              <span className="price">₹{product.price.toLocaleString()}</span>
            </div>

            {Object.keys(selectedVariants).length > 0 && (
              <div className="adjustments">
                <p>Variant Adjustments</p>
                {Object.entries(selectedVariants).map(([name, variant]) => (
                  <div key={name} className="adjustment-item">
                    <span>{name}: {variant.data.variant_value}</span>
                    {variant.data.price_adjustment > 0 && (
                      <span>+₹{variant.data.price_adjustment.toLocaleString()}</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="final-price-box">
              <span className="label">Final Price</span>
              <span className="price">₹{finalPrice.toLocaleString()}</span>
            </div>
          </div>

          <div className="quantity-section">
            <label>Quantity</label>
            <div className="quantity-selector">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="qty-btn"
              >
                −
              </button>
              <span className="qty-display">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="qty-btn"
              >
                +
              </button>
            </div>
          </div>

          {showNotification && <div className="notification">{showNotification}</div>}
        </div>
      </div>

      {product.variants && product.variants.length > 0 && (
        <VariantSelector variants={product.variants} onSelectVariant={setSelectedVariants} />
      )}

      <EMICalculator
        productPrice={finalPrice}
        emiPlans={emiPlans}
        onSelectPlan={setSelectedEMI}
        isLoading={emiLoading}
      />

      <div className="action-section">
        <button className="proceed-btn" onClick={handleProceed}>
          {selectedEMI ? `Proceed with ₹${selectedEMI.emi_amount.toLocaleString()}/month` : 'Proceed to Checkout'}
        </button>
        <p className="secure-note">✓ Secure transaction</p>
      </div>
    </div>
  );
};

export default ProductDetail;
