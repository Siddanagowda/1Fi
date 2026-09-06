import React, { useState } from 'react';
import './ProductFilters.css';

const ProductFilters = ({ onFilterChange, categories = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100000]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onFilterChange({ search: value, category: selectedCategory, priceRange });
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    onFilterChange({ search: searchTerm, category: value, priceRange });
  };

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    setPriceRange([0, value]);
    onFilterChange({ search: searchTerm, category: selectedCategory, priceRange: [0, value] });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange([0, 100000]);
    onFilterChange({ search: '', category: '', priceRange: [0, 100000] });
  };

  return (
    <div className="product-filters">
      <div className="filters-header">
        <h3>Filters</h3>
        <button className="clear-btn" onClick={handleClearFilters}>
          Clear All
        </button>
      </div>

      <div className="filter-group">
        <label htmlFor="search">Search Products</label>
        <input
          id="search"
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="category">Category</label>
        <select value={selectedCategory} onChange={handleCategoryChange} className="filter-select">
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="price">Max Price: ₹{priceRange[1].toLocaleString()}</label>
        <input
          id="price"
          type="range"
          min="0"
          max="100000"
          step="5000"
          value={priceRange[1]}
          onChange={handlePriceChange}
          className="price-slider"
        />
        <div className="price-labels">
          <span>₹0</span>
          <span>₹100,000</span>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
