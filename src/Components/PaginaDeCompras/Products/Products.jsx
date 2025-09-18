import React, { useContext, useEffect } from 'react';
import AppContext from '../../../context/AppContext';
import fetchProducts from '../../../api/fetchProdutos';
import ProductCard from '../ProductCard/ProductCard'; // Importando o card individual
import './Products.css';

function Products() {
  const { products, setProducts, loading, setLoading } = useContext(AppContext);

  // Busca os produtos iniciais quando a página carrega
  useEffect(() => {
    fetchProducts('celulares').then((response) => {
      setProducts(response);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <section className="products container">
      {products.map((product) => (
        // Usando o componente ProductCard para cada item da lista
        <ProductCard key={product.id} data={product} />
      ))}
    </section>
  );
}

export default Products;
