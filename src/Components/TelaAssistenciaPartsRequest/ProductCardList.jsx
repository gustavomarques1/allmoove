import React from 'react';
import styles from './ProductCardList.module.css'; // CSS para o layout da lista de produtos
import ProductCard from './ProductCard'; // Importa o card individual

export default function ProductList({ categoriaId, adicionarAoCarrinho }) {
  const produtos = [
    { id: 101, nome: "Câmera Frontal", descricao: "Compatível com modelo X", preco: 38.90, categoriaId: 1 },
    { id: 102, nome: "Câmera Traseira", descricao: "Compatível com modelo X", preco: 78.50, categoriaId: 1 },
    { id: 103, nome: "Tela OLED", descricao: "Compatível com modelo Y", preco: 150.00, categoriaId: 2 },
    { id: 104, nome: "Bateria de longa duração", descricao: "Compatível com modelo Z", preco: 45.00, categoriaId: 3 },
  ];

  const produtosFiltrados = categoriaId
    ? produtos.filter(p => p.categoriaId === parseInt(categoriaId))
    : produtos;
    
  return (
    <div className={styles.productList}>
      <h2>
        {produtosFiltrados.length > 0 ? produtosFiltrados[0].nome : 'Nenhum item encontrado'}
        ({produtosFiltrados.length} itens)
      </h2>
      <div className={styles.produtosGrid}>
        {produtosFiltrados.map((produto) => (
          <ProductCard
            key={produto.id}
            produto={produto}
            adicionarAoCarrinho={adicionarAoCarrinho}
          />
        ))}
      </div>
    </div>
  );
}