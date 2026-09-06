import React, { useState } from 'react';
import ProductListing from './ProductListing';
import ProductDetail from './ProductDetail';
import './Marketplace.css';

const Marketplace = () => {
  const [view, setView] = useState('listing');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderData, setOrderData] = useState(null);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setView('detail');
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setView('listing');
    setSelectedProduct(null);
  };

  const handleProceed = (checkoutData) => {
    setOrderData(checkoutData);
    setView('checkout');
    window.scrollTo(0, 0);
  };

  const renderView = () => {
    switch (view) {
      case 'listing':
        return <ProductListing onProductSelect={handleProductSelect} />;
      case 'detail':
        return (
          <div className="detail-wrapper">
            {selectedProduct && (
              <ProductDetail
                product={selectedProduct}
                onBack={handleBack}
                onProceed={handleProceed}
              />
            )}
          </div>
        );
      case 'checkout':
        return (
          <CheckoutSummary orderData={orderData} onBack={handleBack} />
        );
      default:
        return <ProductListing onProductSelect={handleProductSelect} />;
    }
  };

  return <div className="marketplace">{renderView()}</div>;
};

const CheckoutSummary = ({ orderData, onBack }) => {
  const handlePlaceOrder = () => {
    alert('Order placed successfully! Order ID: ' + Math.random().toString(36).substr(2, 9));
    onBack();
  };

  return (
    <div className="checkout-summary">
      <button className="back-button" onClick={onBack}>
        ← Back to Products
      </button>

      <div className="checkout-container">
        <div className="checkout-card">
          <h1>Order Summary</h1>

          <div className="order-details">
            <div className="detail-item">
              <span className="label">Total Amount:</span>
              <span className="value">₹{orderData.totalPrice.toLocaleString()}</span>
            </div>

            <div className="detail-item">
              <span className="label">Quantity:</span>
              <span className="value">{orderData.quantity}</span>
            </div>

            {orderData.emiPlan && (
              <>
                <div className="detail-item">
                  <span className="label">Monthly EMI:</span>
                  <span className="value">₹{orderData.emiPlan.emi_amount.toLocaleString()}</span>
                </div>

                <div className="detail-item">
                  <span className="label">Duration:</span>
                  <span className="value">{orderData.emiPlan.tenure_months} months</span>
                </div>

                <div className="detail-item">
                  <span className="label">Processing Fee:</span>
                  <span className="value">₹{(orderData.emiPlan.processing_fee || 0).toLocaleString()}</span>
                </div>
              </>
            )}

            {Object.keys(orderData.variants).length > 0 && (
              <div className="variants-info">
                <h3>Selected Variants:</h3>
                {Object.entries(orderData.variants).map(([name, variant]) => (
                  <div key={name} className="variant-info">
                    <span>{name}:</span>
                    <span>{variant.data.variant_value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="place-order-btn" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
