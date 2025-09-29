// SearchBar.js - mantém o original
import React, { useState, useContext } from 'react';
import { Search } from 'lucide-react';
import fetchProducts from '../../../api/fetchProdutos';
import AppContext from '../../../context/AppContext';
import './SearchBar.css';

function SearchBar() {
  const [searchValue, setSearchValue] = useState('');
  const { setProducts, setLoading } = useContext(AppContext);

  const handleSearch = async (event) => {
    event.preventDefault();
    setLoading(true);
    const products = await fetchProducts(searchValue);
    setProducts(products);
    setLoading(false);
    setSearchValue('');
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <input
        type="search"
        value={searchValue}
        placeholder="Buscar produtos"
        className="search__input"
        onChange={({ target }) => setSearchValue(target.value)}
        required
      />

      <button type="submit" className="search__button">
        <Search size={18} />
      </button>
    </form>
  );
}

export default SearchBar;