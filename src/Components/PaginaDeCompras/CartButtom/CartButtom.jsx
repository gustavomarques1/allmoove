import React, { useContext } from 'react';
// 1. Importando o ícone 'ShoppingCart' da lucide-react
import { ShoppingCart } from 'lucide-react';

import './CartButton.css';
import AppContext from '../../../context/AppContext';

function CartButton() {
  const { cartItems, isCartVisible, setIsCartVisible } = useContext(AppContext);

  return (
    <button
      type="button"
      className="cart__button"
      onClick={() => setIsCartVisible(!isCartVisible)}
    >
      {/* 2. Usando o novo ícone */}
      <ShoppingCart size={24} />
      
      {cartItems.length > 0 && <span className="cart-status">{cartItems.length}</span>}
    </button>
  );
}

export default CartButton;