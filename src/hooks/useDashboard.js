import { useState, useEffect, useCallback } from 'react';
import { getDashboardData, processarDadosDashboard, extrairIndicador } from '../api/dashboardServices';
import logger from '../utils/logger';

/**
 * Hook customizado para gerenciar dados do dashboard
 *
 * @param {string} papel - Papel do usuário (ASSISTENCIA_TECNICA, DISTRIBUIDOR, ENTREGADOR)
 * @param {number|string} idPessoa - ID da pessoa (opcional, busca do localStorage se não fornecido)
 * @returns {Object} Objeto com dados, loading, error e funções auxiliares
 */
export const useDashboard = (papel, idPessoa = null) => {
  const [dadosBrutos, setDadosBrutos] = useState([]);
  const [dadosProcessados, setDadosProcessados] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Carrega os dados do dashboard da API
   */
  const carregarDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const id = idPessoa || localStorage.getItem('idPessoa');

      if (!id) {
        throw new Error('ID da pessoa não encontrado. Faça login novamente.');
      }

      logger.info(`🔄 Carregando dashboard (${papel}) para ID: ${id}`);

      const dados = await getDashboardData(papel, id);
      setDadosBrutos(dados);

      const processados = processarDadosDashboard(dados);
      setDadosProcessados(processados);

      logger.info(`✅ Dashboard carregado: ${dados.length} indicadores`);
    } catch (err) {
      logger.error('❌ Erro ao carregar dashboard:', err);
      setError(err.message || 'Erro ao carregar dashboard');
      setDadosBrutos([]);
      setDadosProcessados({});
    } finally {
      setIsLoading(false);
    }
  }, [papel, idPessoa]);

  /**
   * Carrega dashboard na montagem do componente
   */
  useEffect(() => {
    carregarDashboard();
  }, [carregarDashboard]);

  /**
   * Função auxiliar para obter valor de um indicador específico
   * @param {string} chave - Chave do indicador
   * @returns {string|number|null} Valor do indicador
   */
  const getIndicador = useCallback((chave) => {
    return extrairIndicador(dadosBrutos, chave);
  }, [dadosBrutos]);

  /**
   * Função auxiliar para obter dados de uma página específica
   * @param {string} pagina - Nome da página
   * @returns {Array} Dados da página
   */
  const getDadosPagina = useCallback((pagina) => {
    return dadosProcessados[pagina] || [];
  }, [dadosProcessados]);

  /**
   * Função para recarregar o dashboard manualmente
   */
  const recarregar = useCallback(() => {
    carregarDashboard();
  }, [carregarDashboard]);

  return {
    // Dados
    dadosBrutos,
    dadosProcessados,

    // Estado
    isLoading,
    error,

    // Funções auxiliares
    getIndicador,
    getDadosPagina,
    recarregar
  };
};

/**
 * Hook específico para dashboard da assistência técnica
 */
export const useDashboardAssistencia = (idPessoa = null) => {
  return useDashboard('ASSISTENCIA_TECNICA', idPessoa);
};

/**
 * Hook específico para dashboard do distribuidor
 */
export const useDashboardDistribuidor = (idPessoa = null) => {
  return useDashboard('DISTRIBUIDOR', idPessoa);
};

/**
 * Hook específico para dashboard do entregador
 */
export const useDashboardEntregador = (idPessoa = null) => {
  return useDashboard('ENTREGADOR', idPessoa);
};
