import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppContext from '../../../context/AppContext';
import fetchProducts from '../../../api/fetchProdutos';
import ProductCard from '../ProductCard/ProductCard';
import './Products.css';

function Products() {
  const { products, setProducts, loading, setLoading } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  
  // Opcional: Estado para notificar o usuário sobre o fallback
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setNotification('');

      const idSegmentoQuery = searchParams.get('idSegmento');
      const idDistribuidorQuery = searchParams.get('idDistribuidor');

      // 1. Busca TODOS os produtos
      let fetchedProducts = await fetchProducts('');

      // 2. Filtra por idSegmento se especificado
      if (idSegmentoQuery) {
        const idSegmento = parseInt(idSegmentoQuery);
        fetchedProducts = fetchedProducts.filter(
          product => product.idSegmento === idSegmento
        );

        console.log(`📊 Filtrado por idSegmento ${idSegmento}:`, fetchedProducts.length, 'produtos');
      }

      // 3. Filtra por idDistribuidor se especificado
      if (idDistribuidorQuery && fetchedProducts.length > 0) {
        const idDistribuidor = parseInt(idDistribuidorQuery);
        console.log(`🔍 Filtrando por idDistribuidor: ${idDistribuidor}`);

        const produtosAntes = fetchedProducts.length;
        fetchedProducts = fetchedProducts.filter(
          product => product.idDistribuidor === idDistribuidor
        );

        console.log(`📊 Produtos antes: ${produtosAntes}, depois: ${fetchedProducts.length}`);
      }

      // 4. Notificação se não encontrar produtos
      if (fetchedProducts.length === 0 && idSegmentoQuery) {
        setNotification(`Nenhum produto encontrado para o segmento selecionado.`);
      }

      setProducts(fetchedProducts || []);
      setLoading(false);
    };

    loadProducts();
  }, [searchParams, setProducts, setLoading]);

  if (loading) {
    return <div className="loading-message">Carregando produtos...</div>;
  }

  return (
    <>
      {/* Opcional: Renderiza uma barra de notificação se ela existir */}
      {notification && <div className="notification-bar">{notification}</div>}

      <section className="products container">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} data={product} />
          ))
        ) : (
          <div className="no-products-message">Nenhum produto encontrado.</div>
        )}
      </section>
    </>
  );
}

export default Products;