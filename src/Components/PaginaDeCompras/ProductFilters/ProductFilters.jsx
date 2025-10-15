import React from 'react';
import PropTypes from 'prop-types';
import { ArrowUpDown, Truck } from 'lucide-react';
import './ProductFilters.css';

function ProductFilters({ sortBy, onSortChange, showFreeShippingOnly, onFreeShippingToggle, totalProducts }) {
  return (
    <div className="product-filters">
      <div className="product-filters__info">
        <span className="product-filters__count">{totalProducts} produtos</span>
      </div>

      <div className="product-filters__controls">
        {/* Filtro de Frete Grátis */}
        <button
          type="button"
          className={`filter-button ${showFreeShippingOnly ? 'filter-button--active' : ''}`}
          onClick={onFreeShippingToggle}
          aria-label="Filtrar apenas produtos com frete grátis"
        >
          <Truck size={16} />
          Frete grátis
        </button>

        {/* Ordenação */}
        <div className="sort-control">
          <ArrowUpDown size={16} className="sort-icon" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="sort-select"
            aria-label="Ordenar produtos"
          >
            <option value="default">Ordenar por</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
            <option value="discount">Maior desconto</option>
            <option value="name">Nome A-Z</option>
          </select>
        </div>
      </div>
    </div>
  );
}

ProductFilters.propTypes = {
  sortBy: PropTypes.string.isRequired,
  onSortChange: PropTypes.func.isRequired,
  showFreeShippingOnly: PropTypes.bool.isRequired,
  onFreeShippingToggle: PropTypes.func.isRequired,
  totalProducts: PropTypes.number.isRequired,
};

export default ProductFilters;
