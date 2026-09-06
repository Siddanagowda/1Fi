import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';
import './ProductListing.css';

const ProductListing = ({ onProductSelect }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    priceRange: [0, 100000],
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const products = await apiClient.getProducts(filters.search, filters.category, 50, 0);

      // Filter by price range
      const filtered = products.filter((p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

      setProducts(filtered);

      // Extract unique categories
      const uniqueCategories = [...new Set(products.map((p) => p.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="product-listing">
      <div className="listing-header">
        <h1>1Fi Marketplace</h1>
        <p>Explore our wide range of products with flexible EMI options</p>
      </div>

      <div className="listing-container">
        <aside className="filters-sidebar">
          <ProductFilters onFilterChange={handleFilterChange} categories={categories} />
        </aside>

        <main className="products-main">
          {error && <div className="error-message">{error}</div>}

          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="products-header">
                <h2>Products</h2>
                <p className="product-count">{products.length} products found</p>
              </div>

              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => onProductSelect(product)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h2>No products found</h2>
              <p>Try adjusting your filters or search term</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductListing;
