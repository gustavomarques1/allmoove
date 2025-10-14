import { useState, useEffect, useCallback } from 'react';
import { getEstoqueDoDistribuidor } from '../api/estoqueServices';

/**
 * Hook customizado para gerenciar o estoque do distribuidor
 *
 * @param {number|string} idDistribuidor - ID do distribuidor (opcional)
 * @returns {Object} Objeto com estoque, loading, error e função de recarregar
 */
export const useEstoque = (idDistribuidor = null) => {
  const [estoque, setEstoque] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Carrega o estoque da API
   */
  const carregarEstoque = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔄 Carregando estoque...');

      const data = await getEstoqueDoDistribuidor(idDistribuidor);
      setEstoque(data);

      console.log('✅ Estoque carregado com sucesso:', data.length, 'itens');
    } catch (err) {
      console.error('❌ Erro ao carregar estoque:', err);
      setError(err.message || 'Erro ao carregar estoque');
      setEstoque([]);
    } finally {
      setIsLoading(false);
    }
  }, [idDistribuidor]);

  /**
   * Carrega estoque na montagem do componente
   */
  useEffect(() => {
    carregarEstoque();
  }, [carregarEstoque]);

  /**
   * Função para recarregar o estoque manualmente
   */
  const recarregar = useCallback(() => {
    carregarEstoque();
  }, [carregarEstoque]);

  return {
    estoque,
    isLoading,
    error,
    recarregar
  };
};
