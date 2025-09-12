import React from 'react';
import styles from './Carrinho.module.css';
import { Trash2, Minus, Plus } from 'lucide-react';

export default function Carrinho({
  itens,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveItem
}) {
  const total = itens.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);

  return (
    <div className={styles.carrinhoContainer}>
      <h2 className={styles.carrinhoHeader}>Carrinho ({itens.reduce((acc, item) => acc + item.quantidade, 0)})</h2>
      {itens.length === 0 ? (
        <p className={styles.carrinhoVazio}>Carrinho vazio</p>
      ) : (
        <>
          <ul className={styles.carrinhoLista}>
            {itens.map((item) => (
              <li key={item.id} className={styles.carrinhoItemCard}>
                <div className={styles.itemHeader}>
                  <div className={styles.itemTitle}>{item.nome}</div>
                  <button className={styles.removeButton} onClick={() => onRemoveItem(item.id)}>
                    <Trash2 size={18} color="#ef4444" />
                  </button>
                </div>
                <div className={styles.itemDescription}>{item.descricao || 'Descrição do item'}</div>
                
                <div className={styles.itemControls}>
                  <div className={styles.quantityControl}>
                    <button className={styles.quantityButton} onClick={() => onDecreaseQuantity(item.id)}>
                      <Minus size={16} />
                    </button>
                    <span className={styles.quantityDisplay}>{item.quantidade}</span>
                    <button className={styles.quantityButton} onClick={() => onIncreaseQuantity(item.id)}>
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className={styles.itemPrices}>
                    <span className={styles.itemPriceEach}>R$ {item.preco.toFixed(2)} each</span>
                    <span className={styles.itemPriceTotal}>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className={styles.carrinhoTotal}>
            <strong>Total:</strong> R$ {total.toFixed(2)}
          </div>
          <button className={styles.finalizarBtn}>Finalizar pedido</button>
        </>
      )}
    </div>
  );
}