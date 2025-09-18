import React from 'react';

// Importando o Provider para envolver a página
import Provider from '../../context/Provider'; 

// Importando os componentes que formam a nova tela
import Header from '../../Components/PaginaDeCompras/Header/Header';
import Products from '../../Components/PaginaDeCompras/Products/Products';
import Cart from '../../Components/PaginaDeCompras/Cart/Cart';

function PaginaLoja() {
  return (
    <Provider>
      <Header />
      <Products />
      <Cart />
    </Provider>
  );
}

export default PaginaLoja;