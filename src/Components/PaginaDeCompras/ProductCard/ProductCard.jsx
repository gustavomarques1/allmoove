import React, { useContext, useState } from 'react';
import propTypes from 'prop-types';
import { ShoppingCart, Check, Flame } from 'lucide-react';

import './ProductCard.css';
import AppContext from '../../../context/AppContext';
import formatCurrency from '../../../utils/formatCurrency';

/**
 * 🏷️ CONTROLE DE PROMOÇÕES
 *
 * Lista de produtos em promoção com badge "X% OFF"
 *
 * Para ADICIONAR um produto em promoção:
 * 1. Adicione o ID do produto como chave
 * 2. Defina o desconto (percentual) e precoOriginal (valor antes do desconto)
 *
 * Para REMOVER um produto da promoção:
 * 1. Delete ou comente a linha do produto
 *
 * Exemplo:
 *   10: { desconto: 15, precoOriginal: 500 }  // Produto ID 10 com 15% OFF
 */
const PRODUTOS_EM_PROMOCAO = {
  // ID: { desconto: percentual, precoOriginal: valor }
  1: { desconto: 20, precoOriginal: 1875 },   // iPhone 16
  2: { desconto: 15, precoOriginal: 1176 },   // FOG Preto
  5: { desconto: 25, precoOriginal: 2000 },
  8: { desconto: 30, precoOriginal: 1500 },
  12: { desconto: 10, precoOriginal: 800 },
  15: { desconto: 35, precoOriginal: 3000 },
  20: { desconto: 15, precoOriginal: 1200 },
  25: { desconto: 20, precoOriginal: 2500 },
};

function ProductCard({ data, isMaisVendido = false }) {
  const { nome, imagem, precoVenda, price, precoOriginal, desconto, parcelas, valorParcela, freteGratis, fornecedor } = data;
  const { handleAddItem, cartItems } = useContext(AppContext);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Verifica se o produto está no carrinho e qual a quantidade
  const itemInCart = cartItems.find(item => item.id === data.id);
  const quantityInCart = itemInCart ? itemInCart.quantity : 0;

  // Usa precoVenda da API ou price do fallback JSON
  const preco = precoVenda || price || 0;

  // 🏷️ Verifica se o produto está na lista de promoções
  const promocao = PRODUTOS_EM_PROMOCAO[data.id];

  // Calcula preço original e desconto:
  // 1. Se vier do produto (desconto ou precoOriginal)
  // 2. Se estiver na lista de promoções
  // 3. Caso contrário, não tem desconto
  const precoAnterior = precoOriginal || promocao?.precoOriginal;
  const percentualDesconto = desconto || promocao?.desconto ||
    (precoAnterior ? Math.round(((precoAnterior - preco) / precoAnterior) * 100) : 0);

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

      {/* Badge de Mais Vendido */}
      {isMaisVendido && (
        <div className="card__best-seller">
          <Flame size={14} />
          Mais Vendido
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

        {/* Fornecedor */}
        {fornecedor && (
          <p className="card__supplier">
            Fornecedor: <strong>{fornecedor}</strong>
          </p>
        )}
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

      {/* Badge de frete grátis - CANTO INFERIOR DIREITO */}
      {freteGratis && (
        <div className="card__free-shipping-footer">
          Frete grátis
        </div>
      )}
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
    fornecedor: propTypes.string,
  }).isRequired,
  isMaisVendido: propTypes.bool,
};