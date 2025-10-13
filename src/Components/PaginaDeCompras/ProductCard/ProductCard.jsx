import React, { useContext } from 'react';
import propTypes from 'prop-types';
// 1. Corrigindo o nome do ícone importado de 'ShoppingCartPlus' para 'ShoppingCart'
import { ShoppingCart } from 'lucide-react';

import './ProductCard.css';
import AppContext from '../../../context/AppContext';
import formatCurrency from '../../../utils/formatCurrency';

function ProductCard({ data }) {
  const { nome, imagem, precoVenda, price } = data;
  const { handleAddItem } = useContext(AppContext);

  // Usa precoVenda da API ou price do fallback JSON
  const preco = precoVenda || price || 0;

  // Imagem: usa imagem da API ou placeholder
  const imagemUrl = imagem || 'https://via.placeholder.com/200x200?text=Sem+Imagem';

  return (
    <section className="product-card">
      <img src={imagemUrl} alt="product" className="card__image" />

      <div className="card__infos">
        <h2 className="card__price">{formatCurrency(preco, 'BRL')}</h2>
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
    precoVenda: propTypes.number,
  }).isRequired,
};