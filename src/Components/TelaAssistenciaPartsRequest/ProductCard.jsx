// src/Components/ProductCard/ProductCard.jsx
import React from 'react';
import styles from './ProductCard.module.css';
import { ShoppingCart } from 'lucide-react';

export default function ProductCard({ produto, adicionarAoCarrinho }) {
  return (
    <div className={styles.produtoCard}>
      <div className={styles.produtoInfo}>
        <h3 className={styles.produtoNome}>{produto.nome}</h3>
        <p className={styles.descricao}>{produto.descricao}</p>
      </div>
      <div className={styles.produtoPreco}>
        <p className={styles.preco}>R$ {produto.preco.toFixed(2)}</p>
      </div>
      <button
        className={styles.adicionarBtn}
        // A função é chamada no evento de clique, passando o produto
        onClick={() => adicionarAoCarrinho(produto)}
      >
        <ShoppingCart size={20} />
        Adicionar
      </button>
    </div>
  );
}