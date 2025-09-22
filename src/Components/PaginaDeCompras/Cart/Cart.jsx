import React, { useContext } from 'react';
import { ShoppingCart } from 'lucide-react'; // Ícone para o cabeçalho

import './Cart.css';
import CartItem from '../CartItem/CartItem';
import AppContext from '../../../context/AppContext';
import formatCurrency from '../../../utils/formatCurrency';

function Cart() {
  // 1. Pegamos a função 'setIsCartVisible' do contexto, além dos outros dados.
  const { cartItems, isCartVisible, setIsCartVisible } = useContext(AppContext);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <section className={`cart ${isCartVisible ? 'cart--active' : ''}`}>
      <div className="cart__header">
        <ShoppingCart size={24} />
        <h2>Carrinho ({totalItems} itens)</h2>
      </div>
      
      <div className="cart__body">
        {cartItems.length > 0 ? (
          cartItems.map((cartItem) => <CartItem key={cartItem.id} data={cartItem} />)
        ) : (
          <h2 className="cart-empty">Seu carrinho está vazio</h2>
        )}
      </div>

      {cartItems.length > 0 && (
        <footer className="cart__footer">
          <div className="summary-row">
            <span>Total de itens:</span>
            <span>{totalItems} peças</span>
          </div>
          <div className="summary-row total-row">
            <span>Valor Total:</span>
            <span>{formatCurrency(totalPrice, 'BRL')}</span>
          </div>
          <div className="cart__actions">
            <button type="button" className="action-button primary">Continuar Pedido</button>
            
            {/* 2. Adicionamos o onClick para chamar setIsCartVisible(false) */}
            <button 
              type="button" 
              className="action-button secondary"
              onClick={() => setIsCartVisible(false)}
            >
              Cancelar
            </button>
          </div>
        </footer>
      )}
    </section>
  );
}

export default Cart;