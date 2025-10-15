import React, { useContext, useState } from 'react';
import propTypes from 'prop-types';
import { ShoppingCart, Check } from 'lucide-react';

import './ProductCard.css';
import AppContext from '../../../context/AppContext';
import formatCurrency from '../../../utils/formatCurrency';

function ProductCard({ data }) {
  const { nome, imagem, precoVenda, price, precoOriginal, desconto, parcelas, valorParcela, freteGratis } = data;
  const { handleAddItem, cartItems } = useContext(AppContext);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Verifica se o produto está no carrinho e qual a quantidade
  const itemInCart = cartItems.find(item => item.id === data.id);
  const quantityInCart = itemInCart ? itemInCart.quantity : 0;

  // Usa precoVenda da API ou price do fallback JSON
  const preco = precoVenda || price || 0;

  // Calcula preço original e desconto se não estiverem no JSON
  const precoAnterior = precoOriginal || (preco * 1.25); // Simula 20% de desconto se não houver
  const percentualDesconto = desconto || Math.round(((precoAnterior - preco) / precoAnterior) * 100);

  // Calcula parcelamento se não estiver no JSON
  const numeroParcelas = parcelas || (preco > 1000 ? 10 : preco > 500 ? 6 : 3);
  const valorDaParcela = valorParcela || (preco / numeroParcelas);

  // Imagem: usa imagem da API ou placeholder
  const imagemUrl = imagem || 'https://via.placeholder.com/200x200?text=Sem+Imagem';

  // Handler para adicionar com feedback visual
  const handleAddToCart = () => {
    setIsAdding(true);
    handleAddItem(data);

    // Mostra ícone de sucesso
    setTimeout(() => {
      setIsAdding(false);
      setShowSuccess(true);
    }, 400);

    // Remove ícone de sucesso após 2s
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  return (
    <section className={`product-card ${isAdding ? 'product-card--adding' : ''}`}>
      {/* Badge de desconto */}
      {percentualDesconto > 0 && (
        <div className="card__discount-badge">
          {percentualDesconto}% OFF
        </div>
      )}

      {/* Badge de frete grátis */}
      {freteGratis && (
        <div className="card__free-shipping">
          Frete grátis
        </div>
      )}

      {/* Badge de produto no carrinho */}
      {quantityInCart > 0 && (
        <div className="card__in-cart-badge">
          {quantityInCart} no carrinho
        </div>
      )}

      <img src={imagemUrl} alt={nome} className="card__image" />

      <div className="card__infos">
        {/* Preço original riscado (sempre mostra quando há desconto) */}
        {percentualDesconto > 0 && (
          <p className="card__price-original">
            De {formatCurrency(precoAnterior, 'BRL')}
          </p>
        )}

        {/* Preço promocional em destaque */}
        <h2 className="card__price">
          {percentualDesconto > 0 ? 'por ' : ''}{formatCurrency(preco, 'BRL')}
        </h2>

        {/* Parcelamento */}
        <p className="card__installments">
          em até <strong>{numeroParcelas}x</strong> de{' '}
          <strong>{formatCurrency(valorDaParcela, 'BRL')}</strong> sem juros
        </p>

        {/* Nome do produto */}
        <h3 className="card__title">{nome}</h3>
      </div>

      <button
        type="button"
        className={`button__add-cart ${showSuccess ? 'button__add-cart--success' : ''}`}
        onClick={handleAddToCart}
        aria-label={`Adicionar ${nome} ao carrinho`}
        disabled={isAdding}
      >
        {showSuccess ? (
          <Check className="icone_cor icone_success" />
        ) : (
          <ShoppingCart className="icone_cor" />
        )}
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
    precoOriginal: propTypes.number,
    desconto: propTypes.number,
    parcelas: propTypes.number,
    valorParcela: propTypes.number,
    freteGratis: propTypes.bool,
  }).isRequired,
};