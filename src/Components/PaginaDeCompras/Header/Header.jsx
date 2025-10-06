import React from 'react';
import CartButton from '../../PaginaDeCompras/CartButtom/CartButtom';
import SearchBar from '../SearchBar/SearchBar';
import CepInput from '../SearchBar/CepInput';

import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="container">
        {/* Agrupa SearchBar e CEPInput */}
        <div className="search-section">
          <SearchBar />
          <CepInput />
          <CartButton />
        </div>
      </div>
    </header>
  );
}

export default Header;