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
    // Usamos uma função async para poder usar 'await' e simplificar a lógica
    const loadProducts = async () => {
      setLoading(true);
      setNotification(''); // Limpa a notificação a cada nova busca
      
      const categoriaQuery = searchParams.get('categoria');
      const termoDeBusca = categoriaQuery || '';

      // 1. Tenta buscar pela categoria especificada na URL
      let fetchedProducts = await fetchProducts(termoDeBusca);

      // 2. Verifica se a busca não retornou nada E se não era uma busca por "todos"
      if ((!fetchedProducts || fetchedProducts.length === 0) && termoDeBusca !== '') {
        // Opcional: Avisa o usuário que a categoria não foi encontrada
        setNotification(`Nenhum produto encontrado para "${termoDeBusca}". Exibindo todos os produtos.`);
        
        // 3. Plano B: Busca todos os produtos
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