import React, { useContext } from 'react';
import { ShoppingCart } from 'lucide-react'; // Ícone para o cabeçalho
import { useNavigate } from 'react-router-dom'; // 1. Importe o useNavigate

import './Cart.css';
import CartItem from '../CartItem/CartItem';
import AppContext from '../../../context/AppContext';
import formatCurrency from '../../../utils/formatCurrency';

function Cart() {
  const { cartItems, isCartVisible, setIsCartVisible } = useContext(AppContext);
  const navigate = useNavigate(); // Hook para navegação

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => {
    const preco = item.precoVenda || item.price || 0;
    return acc + (preco * item.quantity);
  }, 0);

  // Função para navegar para a próxima tela, passando os dados
  const handleContinue = () => {
    setIsCartVisible(false);
    // A mágica está aqui: 'state: { cartItems }' envia os dados para a próxima rota
    navigate('/assistencia/pagamento', { state: { cartItems } });
  };

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
            <button 
              type="button" 
              className="action-button primary" 
              onClick={handleContinue} // Adicionamos o onClick aqui
            >
              Continuar Pedido
            </button>
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