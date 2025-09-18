import React, { useContext } from 'react';
import propTypes from 'prop-types';
import { Trash2 } from 'lucide-react';

import './CartItem.css';
import formatCurrency from '../../../utils/formatCurrency';
import AppContext from '../../../context/AppContext';

function CartItem({ data }) {
  const { handleRemoveItem } = useContext(AppContext);
  const { id, nome, imagem, price } = data;

  return (
    <section className="cart-item">
      <img
        src={imagem}
        alt="imagem do produto"
        className="cart-item-image"
      />

      <div className="cart-item-content">
        <h3 className="cart-item-title">{nome}</h3>
        <h3 className="cart-item-price">{formatCurrency(price, 'BRL')}</h3>
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

CartItem.propTypes = {
  data: propTypes.shape({
    id: propTypes.number,
    nome: propTypes.string,
    imagem: propTypes.string,
    price: propTypes.number,
  }).isRequired,
};
