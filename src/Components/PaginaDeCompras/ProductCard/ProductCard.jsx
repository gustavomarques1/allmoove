import React, { useContext } from 'react';
import propTypes from 'prop-types';
// 1. Corrigindo o nome do ícone importado de 'ShoppingCartPlus' para 'ShoppingCart'
import { ShoppingCart } from 'lucide-react';

import './ProductCard.css';
import AppContext from '../../../context/AppContext';
import formatCurrency from '../../../utils/formatCurrency';

function ProductCard({ data }) {
  const { nome, imagem, price } = data;
  const { handleAddItem } = useContext(AppContext);

  return (
    <section className="product-card">
      <img src={imagem} alt="product" className="card__image" />

      <div className="card__infos">
        <h2 className="card__price">{formatCurrency(price, 'BRL')}</h2>
        <h2 className="card__title">{nome}</h2>
      </div>

      <button
        type="button"
        className="button__add-cart"
        onClick={() => handleAddItem(data)}
      >
        {/* 2. Usando o ícone com o nome correto */}
        <ShoppingCart className="icone_cor" />
      </button>
    </section>
  );
}

export default ProductCard;

ProductCard.propTypes = {
  data: propTypes.shape({
    id: propTypes.number,
    nome: propTypes.string,
    imagem: propTypes.string,
    price: propTypes.number,
  }).isRequired,
};