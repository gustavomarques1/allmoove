import React, { useState } from 'react';
import propTypes from 'prop-types';
import AppContext from './AppContext';

function Provider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);

  const handleAddItem = (product) => {
    setCartItems((prevCartItems) => {
      const existingItem = prevCartItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        return [...prevCartItems, { ...product, quantity: 1 }];
      }
    });
  };

  const handleRemoveItem = (productId) => {
    setCartItems((prevCartItems) => 
      prevCartItems.filter((item) => item.id !== productId)
    );
  };

  const handleDecreaseItem = (product) => {
    setCartItems((prevCartItems) => {
      const existingItem = prevCartItems.find((item) => item.id === product.id);
      if (existingItem && existingItem.quantity === 1) {
        return prevCartItems.filter((item) => item.id !== product.id);
      }
      return prevCartItems.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  const value = {
    products,
    setProducts,
    loading,
    setLoading,
    cartItems,
    setCartItems,
    isCartVisible,
    setIsCartVisible,
    handleAddItem,
    handleRemoveItem,
    handleDecreaseItem,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export default Provider;

Provider.propTypes = {
  children: propTypes.node.isRequired,
};