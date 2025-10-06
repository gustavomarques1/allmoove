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

      const categoriaQuery = searchParams.get('categoria');
      const fornecedorQuery = searchParams.get('fornecedor');
      const termoDeBusca = categoriaQuery || '';

      // 1. Busca produtos pela categoria
      let fetchedProducts = await fetchProducts(termoDeBusca);

      // 2. Filtra por fornecedor se especificado
      if (fornecedorQuery && fetchedProducts.length > 0) {
        fetchedProducts = fetchedProducts.filter(
          product => product.fornecedor === fornecedorQuery
        );

        // Se após filtrar por fornecedor não houver produtos
        if (fetchedProducts.length === 0) {
          setNotification(
            `Nenhum produto encontrado para a categoria "${categoriaQuery || 'todas'}" do fornecedor "${fornecedorQuery}".`
          );
        }
      }

      // 3. Fallback se categoria não retornar nada
      if ((!fetchedProducts || fetchedProducts.length === 0) && termoDeBusca !== '' && !fornecedorQuery) {
        setNotification(`Nenhum produto encontrado para "${termoDeBusca}". Exibindo todos os produtos.`);
        fetchedProducts = await fetchProducts('');
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