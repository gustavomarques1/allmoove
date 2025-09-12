import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import styles from './TelaPartsRequest.module.css'; 
import CategoriaSelect from '../TelaAssistenciaPartsRequest/CategoriaSelect';
import ProductList from '../TelaAssistenciaPartsRequest/ProductCardList';
import Carrinho from '../TelaAssistenciaPartsRequest/Carrinho';
import { ArrowLeft } from 'lucide-react';

function TelaPartsRequest() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // Adiciona um item ao carrinho ou aumenta sua quantidade se já existir
  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantidade += 1;
        return updatedItems;
      } else {
        return [...prevItems, { ...product, quantidade: 1 }];
      }
    });
  };

  // Aumenta a quantidade de um item específico
  const handleIncreaseQuantity = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantidade: item.quantidade + 1 } : item
      )
    );
  };

  // Diminui a quantidade de um item, removendo-o se a quantidade for 1
  const handleDecreaseQuantity = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantidade: item.quantidade - 1 } : item
      ).filter(item => item.quantidade > 0)
    );
  };

  // Remove um item completamente do carrinho
  const handleRemoveItem = (itemId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== itemId));
  };
  
  const handleGoBack = () => {
    navigate('/assistencia/dashboard');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <ArrowLeft className={styles.icon} onClick={handleGoBack} />
        <h1>Solicitar peças</h1>
      </header>
      <main className={styles.mainContent}>
        <div className={styles.productsSection}>
          <CategoriaSelect onSelect={setSelectedCategory} />
          <ProductList 
            categoriaId={selectedCategory} 
            adicionarAoCarrinho={handleAddToCart} 
          />
        </div>
        <aside className={styles.cartSection}>
          <Carrinho 
            itens={cartItems}
            onIncreaseQuantity={handleIncreaseQuantity}
            onDecreaseQuantity={handleDecreaseQuantity}
            onRemoveItem={handleRemoveItem}
          />
        </aside>
      </main>
    </div>
  );
}

export default TelaPartsRequest;