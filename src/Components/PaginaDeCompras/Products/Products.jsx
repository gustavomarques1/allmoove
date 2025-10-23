import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppContext from '../../../context/AppContext';
import fetchProducts from '../../../api/fetchProdutos';
import logger from '../../../utils/logger';
import ProductCard from '../ProductCard/ProductCard';
import ProductFilters from '../ProductFilters/ProductFilters';
import { useProdutosMaisVendidos } from '../../../hooks/useProdutosMaisVendidos';
import api from '../../../api/api';
import './Products.css';

function Products() {
  const { products, setProducts, loading, setLoading } = useContext(AppContext);
  const [searchParams] = useSearchParams();

  // Estados de filtros e ordenação
  const [sortBy, setSortBy] = useState('default');
  const [showFreeShippingOnly, setShowFreeShippingOnly] = useState(false);
  const [segmentoFilter, setSegmentoFilter] = useState('todos');
  const [segmentos, setSegmentos] = useState([]);

  // Pega o idSegmento da URL para filtrar "mais vendidos" por categoria
  const idSegmentoQuery = searchParams.get('idSegmento');
  const idSegmento = idSegmentoQuery ? parseInt(idSegmentoQuery) : null;

  // Top 10 produtos mais vendidos (global ou filtrado por categoria)
  const { produtosMaisVendidos } = useProdutosMaisVendidos(10, idSegmento);

  // Opcional: Estado para notificar o usuário sobre o fallback
  const [notification, setNotification] = useState('');

  // Busca segmentos da API
  useEffect(() => {
    const fetchSegmentos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await api.get('/api/ProdutoSegmentos', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const segmentosData = response.data || [];
        setSegmentos(segmentosData);
        logger.info('✅ Segmentos carregados para filtro:', segmentosData.length);
      } catch (error) {
        logger.warn('⚠️ Erro ao carregar segmentos:', error.message);
      }
    };

    fetchSegmentos();
  }, []);

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

        logger.info(`📊 Filtrado por idSegmento ${idSegmento}:`, fetchedProducts.length, 'produtos');
      }

      // 3. Filtra por idDistribuidor se especificado
      if (idDistribuidorQuery && fetchedProducts.length > 0) {
        const idDistribuidor = parseInt(idDistribuidorQuery);
        logger.info(`🔍 Filtrando por idDistribuidor: ${idDistribuidor}`);

        const produtosAntes = fetchedProducts.length;
        fetchedProducts = fetchedProducts.filter(
          product => product.idDistribuidor === idDistribuidor
        );

        logger.info(`📊 Produtos antes: ${produtosAntes}, depois: ${fetchedProducts.length}`);
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

    // Filtro de segmento/categoria
    if (segmentoFilter !== 'todos') {
      const idSegmento = parseInt(segmentoFilter);
      filtered = filtered.filter(product => product.idSegmento === idSegmento);
    }

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
  }, [products, sortBy, showFreeShippingOnly, segmentoFilter]);

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
            segmentoFilter={segmentoFilter}
            onSegmentoChange={setSegmentoFilter}
            segmentos={segmentos}
            totalProducts={filteredAndSortedProducts.length}
          />
        )}

        <section className="products container">
          {filteredAndSortedProducts.length > 0 ? (
            filteredAndSortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                data={product}
                isMaisVendido={produtosMaisVendidos.has(product.id)}
              />
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