import React, { useContext } from 'react';

import './Cart.css';
import CartItem from '../CartItem/CartItem';
import AppContext from '../../../context/AppContext';
import formatCurrency from '../../../utils/formatCurrency';

function Cart() {
  const { cartItems, isCartVisible } = useContext(AppContext);

  // Corrigido: converte price para número sempre
  const totalPrice = cartItems.reduce((acc, item) => {
    return acc + Number(item.price || 0);
  }, 0);

  console.log("Itens no carrinho:", cartItems);
  console.log("Total calculado:", totalPrice);

  return (
    <section className={`cart ${isCartVisible ? 'cart--active' : ''}`}>
      <div className="cart-items">
        {cartItems.length > 0 ? (
          cartItems.map((cartItem) => <CartItem key={cartItem.id} data={cartItem} />)
        ) : (
          <h2 className="cart-empty">Seu carrinho está vazio</h2>
        )}
      </div>

      {/* Bloco do total corrigido */}
      {cartItems.length > 0 && (
        <div className="cart-resume">
          <span>Total:</span> {formatCurrency(totalPrice, 'BRL')}
        </div>
      )}
    </section>
  );
}

export default Cart;
