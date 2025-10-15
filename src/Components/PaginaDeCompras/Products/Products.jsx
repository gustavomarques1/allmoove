import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppContext from '../../../context/AppContext';
import fetchProducts from '../../../api/fetchProdutos';
import ProductCard from '../ProductCard/ProductCard';
import ProductFilters from '../ProductFilters/ProductFilters';
import './Products.css';

function Products() {
  const { products, setProducts, loading, setLoading } = useContext(AppContext);
  const [searchParams] = useSearchParams();

  // Estados de filtros e ordenação
  const [sortBy, setSortBy] = useState('default');
  const [showFreeShippingOnly, setShowFreeShippingOnly] = useState(false);

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

  // Filtragem e ordenação de produtos
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Filtro de frete grátis
    if (showFreeShippingOnly) {
      filtered = filtered.filter(product => product.freteGratis === true);
    }

    // Ordenação
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => {
          const priceA = a.precoVenda || a.price || 0;
          const priceB = b.precoVenda || b.price || 0;
          return priceA - priceB;
        });
        break;
      case 'price-desc':
        filtered.sort((a, b) => {
          const priceA = a.precoVenda || a.price || 0;
          const priceB = b.precoVenda || b.price || 0;
          return priceB - priceA;
        });
        break;
      case 'discount':
        filtered.sort((a, b) => {
          const discountA = a.desconto || 0;
          const discountB = b.desconto || 0;
          return discountB - discountA;
        });
        break;
      case 'name':
        filtered.sort((a, b) => a.nome.localeCompare(b.nome));
        break;
      default:
        // Mantém ordem original
        break;
    }

    return filtered;
  }, [products, sortBy, showFreeShippingOnly]);

  if (loading) {
    return <div className="loading-message">Carregando produtos...</div>;
  }

  return (
    <>
      {/* Opcional: Renderiza uma barra de notificação se ela existir */}
      {notification && <div className="notification-bar">{notification}</div>}

      <div className="products-wrapper">
        {products.length > 0 && (
          <ProductFilters
            sortBy={sortBy}
            onSortChange={setSortBy}
            showFreeShippingOnly={showFreeShippingOnly}
            onFreeShippingToggle={() => setShowFreeShippingOnly(!showFreeShippingOnly)}
            totalProducts={filteredAndSortedProducts.length}
          />
        )}

        <section className="products container">
          {filteredAndSortedProducts.length > 0 ? (
            filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} data={product} />
            ))
          ) : (
            <div className="no-products-message">
              {showFreeShippingOnly
                ? 'Nenhum produto com frete grátis encontrado.'
                : 'Nenhum produto encontrado.'}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export default Products;