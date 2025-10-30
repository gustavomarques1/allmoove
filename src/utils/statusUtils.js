/**
 * STATUS UTILS - Sistema de Cores e Estados de Pedidos
 * AllMoove Dashboard Distribuidor
 *
 * Gerencia cores, ícones e estados para os diferentes status de pedidos
 */

import {
  Clock as FiClock,
  CheckCircle as FiCheckCircle,
  Package as FiPackage,
  Package as FiBox,
  Truck as FiTruck,
  Check as FiCheck
} from 'lucide-react';

// ========================================
// DEFINIÇÕES DE STATUS
// ========================================

export const STATUS_TYPES = {
  AGUARDANDO_ACEITE: 'aguardando_aceite',
  ACEITO: 'aceito',
  EM_SEPARACAO: 'em_separacao',
  AGUARDANDO_RETIRADA: 'aguardando_retirada',
  EM_TRANSITO: 'em_transito',
  CONCLUIDO: 'concluido'
};

// ========================================
// MAPEAMENTO DE STATUS DO BACKEND
// ========================================

/**
 * Normaliza status vindos do backend para o formato padrão
 * @param {string} backendStatus - Status retornado pela API
 * @returns {string} Status normalizado
 */
export const normalizeStatus = (backendStatus) => {
  const statusMap = {
    'aguardando aceite': STATUS_TYPES.AGUARDANDO_ACEITE,
    'aguardando_aceite': STATUS_TYPES.AGUARDANDO_ACEITE,
    'pendente': STATUS_TYPES.AGUARDANDO_ACEITE,
    'novo': STATUS_TYPES.AGUARDANDO_ACEITE,

    'aceito': STATUS_TYPES.ACEITO,
    'confirmado': STATUS_TYPES.ACEITO,

    'em separacao': STATUS_TYPES.EM_SEPARACAO,
    'em_separacao': STATUS_TYPES.EM_SEPARACAO,
    'preparando': STATUS_TYPES.EM_SEPARACAO,
    'processando': STATUS_TYPES.EM_SEPARACAO,

    'aguardando retirada': STATUS_TYPES.AGUARDANDO_RETIRADA,
    'aguardando_retirada': STATUS_TYPES.AGUARDANDO_RETIRADA,
    'pronto': STATUS_TYPES.AGUARDANDO_RETIRADA,
    'pronto para retirada': STATUS_TYPES.AGUARDANDO_RETIRADA,

    'em transito': STATUS_TYPES.EM_TRANSITO,
    'em_transito': STATUS_TYPES.EM_TRANSITO,
    'saiu para entrega': STATUS_TYPES.EM_TRANSITO,
    'em rota': STATUS_TYPES.EM_TRANSITO,

    'concluido': STATUS_TYPES.CONCLUIDO,
    'entregue': STATUS_TYPES.CONCLUIDO,
    'entregue ao cliente': STATUS_TYPES.CONCLUIDO,
    'finalizado': STATUS_TYPES.CONCLUIDO
  };

  const normalized = backendStatus?.toLowerCase().trim();
  return statusMap[normalized] || STATUS_TYPES.AGUARDANDO_ACEITE;
};

// ========================================
// CONFIGURAÇÕES DE STATUS
// ========================================

export const STATUS_CONFIG = {
  [STATUS_TYPES.AGUARDANDO_ACEITE]: {
    label: 'Aguardando Aceite',
    shortLabel: 'Pendente',
    description: 'Pedido novo esperando ser aceito',
    icon: FiClock,
    color: {
      primary: '#FF3600',
      light: '#FFF4F0',
      dark: '#C02900',
      border: '#FF6B3D',
      shadow: 'rgba(255, 54, 0, 0.15)'
    },
    priority: 6, // Mais alto
    urgency: 'high',
    requiresAction: true,
    showGlow: true,
    showPulse: true
  },

  [STATUS_TYPES.ACEITO]: {
    label: 'Aceito',
    shortLabel: 'Aceito',
    description: 'Pedido aceito, aguardando separação',
    icon: FiCheckCircle,
    color: {
      primary: '#3B82F6',
      light: '#EFF6FF',
      dark: '#1E40AF',
      border: '#60A5FA',
      shadow: 'rgba(59, 130, 246, 0.15)'
    },
    priority: 5,
    urgency: 'medium-high',
    requiresAction: true,
    showGlow: false,
    showPulse: false
  },

  [STATUS_TYPES.EM_SEPARACAO]: {
    label: 'Em Separação',
    shortLabel: 'Separando',
    description: 'Pedido sendo preparado',
    icon: FiPackage,
    color: {
      primary: '#8B5CF6',
      light: '#F5F3FF',
      dark: '#6D28D9',
      border: '#A78BFA',
      shadow: 'rgba(139, 92, 246, 0.15)'
    },
    priority: 4,
    urgency: 'medium',
    requiresAction: true,
    showGlow: false,
    showPulse: true
  },

  [STATUS_TYPES.AGUARDANDO_RETIRADA]: {
    label: 'Aguardando Retirada',
    shortLabel: 'Pronto',
    description: 'Pronto para o entregador retirar',
    icon: FiBox,
    color: {
      primary: '#F59E0B',
      light: '#FFFBEB',
      dark: '#B45309',
      border: '#FBBF24',
      shadow: 'rgba(245, 158, 11, 0.15)'
    },
    priority: 3,
    urgency: 'medium',
    requiresAction: false,
    showGlow: false,
    showPulse: false
  },

  [STATUS_TYPES.EM_TRANSITO]: {
    label: 'Em Trânsito',
    shortLabel: 'Em Rota',
    description: 'Pedido com o entregador',
    icon: FiTruck,
    color: {
      primary: '#06B6D4',
      light: '#ECFEFF',
      dark: '#0E7490',
      border: '#22D3EE',
      shadow: 'rgba(6, 182, 212, 0.15)'
    },
    priority: 2,
    urgency: 'low',
    requiresAction: false,
    showGlow: false,
    showPulse: false
  },

  [STATUS_TYPES.CONCLUIDO]: {
    label: 'Concluído',
    shortLabel: 'Entregue',
    description: 'Pedido entregue ao cliente',
    icon: FiCheck,
    color: {
      primary: '#10B981',
      light: '#F0FDF4',
      dark: '#047857',
      border: '#34D399',
      shadow: 'rgba(16, 185, 129, 0.15)'
    },
    priority: 1, // Mais baixo
    urgency: 'none',
    requiresAction: false,
    showGlow: false,
    showPulse: false
  }
};

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

/**
 * Obtém a configuração completa de um status
 * @param {string} status - Status do pedido
 * @returns {object} Configuração do status
 */
export const getStatusConfig = (status) => {
  const normalized = normalizeStatus(status);
  return STATUS_CONFIG[normalized] || STATUS_CONFIG[STATUS_TYPES.AGUARDANDO_ACEITE];
};

/**
 * Obtém o componente de ícone para um status
 * @param {string} status - Status do pedido
 * @returns {React.Component} Componente de ícone (não JSX)
 */
export const getStatusIcon = (status) => {
  const config = getStatusConfig(status);
  return config.icon; // Retorna o componente, não JSX
};

/**
 * Obtém a cor primária de um status
 * @param {string} status - Status do pedido
 * @returns {string} Código hexadecimal da cor
 */
export const getStatusColor = (status) => {
  const config = getStatusConfig(status);
  return config.color.primary;
};

/**
 * Obtém o label de um status
 * @param {string} status - Status do pedido
 * @param {boolean} short - Se deve retornar o label curto
 * @returns {string} Label do status
 */
export const getStatusLabel = (status, short = false) => {
  const config = getStatusConfig(status);
  return short ? config.shortLabel : config.label;
};

/**
 * Verifica se um status requer ação do usuário
 * @param {string} status - Status do pedido
 * @returns {boolean} True se requer ação
 */
export const statusRequiresAction = (status) => {
  const config = getStatusConfig(status);
  return config.requiresAction;
};

/**
 * Obtém a classe CSS para um status
 * @param {string} status - Status do pedido
 * @param {string} variant - Variante da classe ('badge', 'card', 'dot', 'icon')
 * @returns {string} Nome da classe CSS
 */
export const getStatusClass = (status, variant = 'badge') => {
  const normalized = normalizeStatus(status);
  const statusKey = normalized.replace(/_/g, '-');

  const variantMap = {
    'badge': `status-${statusKey}`,
    'badge-light': `status-${statusKey}-light`,
    'badge-outline': `status-${statusKey}-outline`,
    'card': `card-${statusKey}`,
    'dot': `dot-${statusKey}`,
    'icon': `status-${statusKey}-icon`,
    'counter': `counter-${statusKey}`,
    'filter': `filter-btn-${statusKey}`
  };

  return variantMap[variant] || variantMap['badge'];
};

/**
 * Ordena pedidos por prioridade de status
 * @param {array} pedidos - Array de pedidos
 * @returns {array} Array ordenado
 */
export const sortByStatusPriority = (pedidos) => {
  return [...pedidos].sort((a, b) => {
    const priorityA = getStatusConfig(a.status).priority;
    const priorityB = getStatusConfig(b.status).priority;
    return priorityB - priorityA; // Maior prioridade primeiro
  });
};

/**
 * Agrupa pedidos por status
 * @param {array} pedidos - Array de pedidos
 * @returns {object} Objeto com pedidos agrupados por status
 */
export const groupByStatus = (pedidos) => {
  return pedidos.reduce((acc, pedido) => {
    const normalized = normalizeStatus(pedido.status);
    if (!acc[normalized]) {
      acc[normalized] = [];
    }
    acc[normalized].push(pedido);
    return acc;
  }, {});
};

/**
 * Conta pedidos por status
 * @param {array} pedidos - Array de pedidos
 * @returns {object} Objeto com contagem por status
 */
export const countByStatus = (pedidos) => {
  const counts = Object.keys(STATUS_TYPES).reduce((acc, key) => {
    acc[STATUS_TYPES[key]] = 0;
    return acc;
  }, {});

  pedidos.forEach(pedido => {
    const normalized = normalizeStatus(pedido.status);
    counts[normalized] = (counts[normalized] || 0) + 1;
  });

  return counts;
};

/**
 * Filtra pedidos por status
 * @param {array} pedidos - Array de pedidos
 * @param {string|array} status - Status para filtrar (ou array de status)
 * @returns {array} Array filtrado
 */
export const filterByStatus = (pedidos, status) => {
  const statusArray = Array.isArray(status) ? status : [status];
  const normalizedStatuses = statusArray.map(normalizeStatus);

  return pedidos.filter(pedido =>
    normalizedStatuses.includes(normalizeStatus(pedido.status))
  );
};

/**
 * Obtém o próximo status na sequência
 * @param {string} currentStatus - Status atual
 * @returns {string|null} Próximo status ou null se for o último
 */
export const getNextStatus = (currentStatus) => {
  const sequence = [
    STATUS_TYPES.AGUARDANDO_ACEITE,
    STATUS_TYPES.ACEITO,
    STATUS_TYPES.EM_SEPARACAO,
    STATUS_TYPES.AGUARDANDO_RETIRADA,
    STATUS_TYPES.EM_TRANSITO,
    STATUS_TYPES.CONCLUIDO
  ];

  const normalized = normalizeStatus(currentStatus);
  const currentIndex = sequence.indexOf(normalized);

  if (currentIndex === -1 || currentIndex === sequence.length - 1) {
    return null;
  }

  return sequence[currentIndex + 1];
};

/**
 * Verifica se pode avançar para o próximo status
 * @param {string} currentStatus - Status atual
 * @returns {boolean} True se pode avançar
 */
export const canAdvanceStatus = (currentStatus) => {
  return getNextStatus(currentStatus) !== null;
};

/**
 * Calcula a porcentagem de progresso baseado no status
 * @param {string} status - Status do pedido
 * @returns {number} Porcentagem de 0 a 100
 */
export const getStatusProgress = (status) => {
  const progressMap = {
    [STATUS_TYPES.AGUARDANDO_ACEITE]: 0,
    [STATUS_TYPES.ACEITO]: 20,
    [STATUS_TYPES.EM_SEPARACAO]: 40,
    [STATUS_TYPES.AGUARDANDO_RETIRADA]: 60,
    [STATUS_TYPES.EM_TRANSITO]: 80,
    [STATUS_TYPES.CONCLUIDO]: 100
  };

  const normalized = normalizeStatus(status);
  return progressMap[normalized] || 0;
};

/**
 * Verifica se o pedido é urgente baseado no status e tempo
 * @param {object} pedido - Objeto do pedido com status e dataCriacao
 * @returns {boolean} True se é urgente
 */
export const isPedidoUrgente = (pedido) => {
  const config = getStatusConfig(pedido.status);

  // Sempre urgente se status tem alta urgência
  if (config.urgency === 'high') {
    return true;
  }

  // Verifica tempo desde criação
  if (pedido.dataCriacao) {
    const dataCriacao = new Date(pedido.dataCriacao);
    const horasDesdeCreacao = (Date.now() - dataCriacao.getTime()) / (1000 * 60 * 60);

    // Urgente se está há mais de 24h no mesmo status (exceto concluído)
    if (config.urgency !== 'none' && horasDesdeCreacao > 24) {
      return true;
    }
  }

  return false;
};

// ========================================
// EXPORTAÇÕES PADRÃO
// ========================================

export default {
  STATUS_TYPES,
  STATUS_CONFIG,
  normalizeStatus,
  getStatusConfig,
  getStatusIcon,
  getStatusColor,
  getStatusLabel,
  getStatusClass,
  statusRequiresAction,
  sortByStatusPriority,
  groupByStatus,
  countByStatus,
  filterByStatus,
  getNextStatus,
  canAdvanceStatus,
  getStatusProgress,
  isPedidoUrgente
};