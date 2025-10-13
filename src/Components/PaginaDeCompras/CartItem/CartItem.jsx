import React, { useContext } from 'react';
import propTypes from 'prop-types';
// 1. Importando os ícones de Mais e Menos
import { Trash2, Plus, Minus } from 'lucide-react';

import './CartItem.css';
import formatCurrency from '../../../utils/formatCurrency';
import AppContext from '../../../context/AppContext';

function CartItem({ data }) {
  // 2. Pegando todas as funções necessárias do Provider
  const { handleAddItem, handleDecreaseItem, handleRemoveItem } = useContext(AppContext);
  
  // 3. Pegando a descrição e a quantidade dos dados
  const { id, nome, imagem, descricao, price, precoVenda, quantity } = data;

  // Usa precoVenda da API ou price do fallback
  const preco = precoVenda || price || 0;

  return (
    <section className="cart-item">
      <img
        src={imagem}
        alt="imagem do produto"
        className="cart-item-image"
      />

      <div className="cart-item-content">
        <h3 className="cart-item-title">{nome}</h3>
        <p className="cart-item-description">{descricao}</p> {/* Adicionada a descrição */}
        
        {/* 4. Nova seção para os controles */}
        <div className="cart-item-controls">
          <div className="quantity-control">
            <button 
              type="button" 
              className="quantity-button"
              onClick={() => handleDecreaseItem(data)}
            >
              <Minus size={14} />
            </button>
            <span className="quantity-display">{quantity}</span>
            <button 
              type="button" 
              className="quantity-button"
              onClick={() => handleAddItem(data)} // handleAddItem também incrementa
            >
              <Plus size={14} />
            </button>
          </div>
          
          <div className="price-details">
            <span className="item-price-each">{formatCurrency(preco, 'BRL')} each</span>
            <span className="item-price-total">{formatCurrency(preco * quantity, 'BRL')}</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="button__remove-item"
        onClick={() => handleRemoveItem(id)}
      >
        <Trash2 size={20} />
      </button>
    </section>
  );
}

export default CartItem;

// 5. Atualizando os propTypes para incluir os novos campos
CartItem.propTypes = {
  data: propTypes.shape({
    id: propTypes.number,
    nome: propTypes.string,
    imagem: propTypes.string,
    descricao: propTypes.string,
    price: propTypes.number,
    precoVenda: propTypes.number,
    quantity: propTypes.number,
  }).isRequired,
};