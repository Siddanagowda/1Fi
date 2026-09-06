import React, { useState } from 'react';
import './VariantSelector.css';

const VariantSelector = ({ variants = [], onSelectVariant }) => {
  const [selectedVariants, setSelectedVariants] = useState({});

  // Group variants by variant_name (e.g., Color, Size, Storage, etc.)
  const groupedVariants = {};
  variants.forEach((variant) => {
    if (!groupedVariants[variant.variant_name]) {
      groupedVariants[variant.variant_name] = [];
    }
    groupedVariants[variant.variant_name].push(variant);
  });

  const handleSelectVariant = (variantName, variantId, variant) => {
    const updated = { ...selectedVariants, [variantName]: { id: variantId, data: variant } };
    setSelectedVariants(updated);
    onSelectVariant(updated);
  };

  if (!variants || variants.length === 0) {
    return null;
  }

  return (
    <div className="variant-selector">
      <h3 className="variant-title">Choose Your Variant</h3>

      {Object.entries(groupedVariants).map(([variantName, options]) => (
        <div key={variantName} className="variant-group">
          <label className="variant-label">{variantName}</label>
          <div className="variant-options">
            {options.map((variant) => {
              const isSelected = selectedVariants[variantName]?.id === variant.id;
              const isOutOfStock = variant.stock === 0;

              return (
                <button
                  key={variant.id}
                  className={`variant-option ${isSelected ? 'selected' : ''} ${
                    isOutOfStock ? 'out-of-stock' : ''
                  }`}
                  onClick={() => handleSelectVariant(variantName, variant.id, variant)}
                  disabled={isOutOfStock}
                  title={isOutOfStock ? 'Out of stock' : ''}
                >
                  <span className="variant-value">{variant.variant_value}</span>
                  {variant.price_adjustment > 0 && (
                    <span className="price-adjustment">+₹{variant.price_adjustment.toLocaleString()}</span>
                  )}
                  {isOutOfStock && <span className="out-of-stock-label">Out of Stock</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VariantSelector;
