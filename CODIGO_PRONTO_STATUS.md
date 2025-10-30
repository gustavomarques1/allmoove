# 📋 Código Pronto para Copiar - Sistema de Status

Código pronto para implementar rapidamente o sistema de cores de status no Dashboard do Distribuidor.

---

## 1️⃣ Importações (Início do arquivo)

```jsx
// Adicionar no início de DistribuidorDashboard.jsx
import { useState, useEffect } from 'react';
import StatusBadge from './StatusBadge';
import StatusTimeline from './StatusTimeline';
import StatusCounter from './StatusCounter';
import {
  countByStatus,
  filterByStatus,
  sortByStatusPriority,
  getStatusConfig,
  normalizeStatus,
  STATUS_TYPES
} from '../../../utils/statusUtils';
import statusStyles from './StatusColors.module.css';
```

---

## 2️⃣ Estado e Lógica de Filtros

```jsx
// Adicionar dentro do componente DistribuidorDashboard
const [filtroStatus, setFiltroStatus] = useState(null);
const [pedidosFiltrados, setPedidosFiltrados] = useState([]);

// Effect para filtrar e ordenar pedidos
useEffect(() => {
  if (!pedidos || pedidos.length === 0) {
    setPedidosFiltrados([]);
    return;
  }

  let resultado = pedidos;

  // Aplicar filtro de status se ativo
  if (filtroStatus) {
    resultado = filterByStatus(resultado, filtroStatus);
  }

  // Aplicar filtro de busca (se existir)
  if (searchTerm) {
    resultado = resultado.filter(pedido =>
      pedido.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.cliente?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Ordenar por prioridade de status (urgentes primeiro)
  resultado = sortByStatusPriority(resultado);

  setPedidosFiltrados(resultado);
}, [pedidos, filtroStatus, searchTerm]);

// Calcular contadores de status
const statusCounts = countByStatus(pedidos || []);
```

---

## 3️⃣ Barra de Filtros Completa

```jsx
{/* Seção de Filtros - Adicionar antes da listagem de pedidos */}
<div className={styles['filters-section']}>
  {/* Busca (se já existir, manter como está) */}
  {searchContainer && searchContainer}

  {/* Filtros por Status */}
  <div className={styles['status-filters']}>
    {/* Botão "Todos" */}
    <button
      className={`${styles['filter-btn']} ${!filtroStatus ? styles['active'] : ''}`}
      onClick={() => setFiltroStatus(null)}
      title="Mostrar todos os pedidos"
    >
      <span>Todos</span>
      <span className={statusStyles['status-counter']}>
        {pedidos?.length || 0}
      </span>
    </button>

    {/* Filtro: Aguardando Aceite */}
    <StatusCounter
      status={STATUS_TYPES.AGUARDANDO_ACEITE}
      count={statusCounts[STATUS_TYPES.AGUARDANDO_ACEITE]}
      active={filtroStatus === STATUS_TYPES.AGUARDANDO_ACEITE}
      onClick={() => setFiltroStatus(STATUS_TYPES.AGUARDANDO_ACEITE)}
    />

    {/* Filtro: Aceito */}
    <StatusCounter
      status={STATUS_TYPES.ACEITO}
      count={statusCounts[STATUS_TYPES.ACEITO]}
      active={filtroStatus === STATUS_TYPES.ACEITO}
      onClick={() => setFiltroStatus(STATUS_TYPES.ACEITO)}
    />

    {/* Filtro: Em Separação */}
    <StatusCounter
      status={STATUS_TYPES.EM_SEPARACAO}
      count={statusCounts[STATUS_TYPES.EM_SEPARACAO]}
      active={filtroStatus === STATUS_TYPES.EM_SEPARACAO}
      onClick={() => setFiltroStatus(STATUS_TYPES.EM_SEPARACAO)}
    />

    {/* Filtro: Aguardando Retirada */}
    <StatusCounter
      status={STATUS_TYPES.AGUARDANDO_RETIRADA}
      count={statusCounts[STATUS_TYPES.AGUARDANDO_RETIRADA]}
      active={filtroStatus === STATUS_TYPES.AGUARDANDO_RETIRADA}
      onClick={() => setFiltroStatus(STATUS_TYPES.AGUARDANDO_RETIRADA)}
    />

    {/* Filtro: Em Trânsito */}
    <StatusCounter
      status={STATUS_TYPES.EM_TRANSITO}
      count={statusCounts[STATUS_TYPES.EM_TRANSITO]}
      active={filtroStatus === STATUS_TYPES.EM_TRANSITO}
      onClick={() => setFiltroStatus(STATUS_TYPES.EM_TRANSITO)}
    />

    {/* Filtro: Concluído */}
    <StatusCounter
      status={STATUS_TYPES.CONCLUIDO}
      count={statusCounts[STATUS_TYPES.CONCLUIDO]}
      active={filtroStatus === STATUS_TYPES.CONCLUIDO}
      onClick={() => setFiltroStatus(STATUS_TYPES.CONCLUIDO)}
    />
  </div>
</div>
```

---

## 4️⃣ Atualizar Cards Superiores (Dashboard)

```jsx
{/* Card: Novos Pedidos (Aguardando Aceite) */}
<div className={styles['distribuidor-top-card']}>
  <div className={styles['distribuidor-top-card-header']}>
    <h3 className={styles['distribuidor-top-card-title']}>Novos Pedidos</h3>
    <div className={statusStyles['status-aguardando-aceite-icon']}>
      <FiClock size={24} />
    </div>
  </div>
  <p className={styles['distribuidor-top-card-number']}>
    {statusCounts[STATUS_TYPES.AGUARDANDO_ACEITE] || 0}
  </p>
  <p className={styles['distribuidor-top-card-description']}>
    Aguardando seu aceite
  </p>
</div>

{/* Card: Em Andamento (Aceito + Em Separação) */}
<div className={styles['distribuidor-top-card']}>
  <div className={styles['distribuidor-top-card-header']}>
    <h3 className={styles['distribuidor-top-card-title']}>Em Andamento</h3>
    <div className={statusStyles['status-em-separacao-icon']}>
      <FiPackage size={24} />
    </div>
  </div>
  <p className={styles['distribuidor-top-card-number']}>
    {(statusCounts[STATUS_TYPES.ACEITO] || 0) +
     (statusCounts[STATUS_TYPES.EM_SEPARACAO] || 0)}
  </p>
  <p className={styles['distribuidor-top-card-description']}>
    Aceitos e em separação
  </p>
</div>

{/* Card: Prontos para Retirada */}
<div className={styles['distribuidor-top-card']}>
  <div className={styles['distribuidor-top-card-header']}>
    <h3 className={styles['distribuidor-top-card-title']}>Prontos</h3>
    <div className={statusStyles['status-aguardando-retirada-icon']}>
      <FiBox size={24} />
    </div>
  </div>
  <p className={styles['distribuidor-top-card-number']}>
    {statusCounts[STATUS_TYPES.AGUARDANDO_RETIRADA] || 0}
  </p>
  <p className={styles['distribuidor-top-card-description']}>
    Aguardando retirada
  </p>
</div>

{/* Card: Concluídos */}
<div className={styles['distribuidor-top-card']}>
  <div className={styles['distribuidor-top-card-header']}>
    <h3 className={styles['distribuidor-top-card-title']}>Concluídos</h3>
    <div className={statusStyles['status-concluido-icon']}>
      <FiCheck size={24} />
    </div>
  </div>
  <p className={styles['distribuidor-top-card-number']}>
    {statusCounts[STATUS_TYPES.CONCLUIDO] || 0}
  </p>
  <p className={styles['distribuidor-top-card-description']}>
    Pedidos entregues
  </p>
</div>
```

---

## 5️⃣ Item de Pedido com Status Colorido

```jsx
{/* Mapear pedidosFiltrados em vez de pedidos */}
{pedidosFiltrados.length === 0 ? (
  <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
    <p>Nenhum pedido encontrado com os filtros aplicados.</p>
  </div>
) : (
  pedidosFiltrados.map((pedido) => {
    const config = getStatusConfig(pedido.status);
    const statusKey = normalizeStatus(pedido.status).replace(/_/g, '-');
    const pedidoNovo = isNovoPedido(pedido.dataCriacao);

    return (
      <div
        key={pedido.id}
        className={`
          ${styles['distribuidor-order-item']}
          ${statusStyles[`card-${statusKey}`]}
          ${pedidoNovo ? styles['pedido-novo'] : ''}
        `}
      >
        {/* Header do Pedido */}
        <div className={styles['distribuidor-order-header']}>
          <div className={styles['distribuidor-order-details']}>
            {/* Ícone do pedido */}
            <div className={styles['distribuidor-order-icon']}>
              <FiPackage size={24} />
            </div>

            {/* Informações principais */}
            <div className={styles['distribuidor-order-text']}>
              <h3 className={styles['distribuidor-order-plate']}>
                Pedido #{pedido.id}
              </h3>
              <p className={styles['distribuidor-order-model']}>
                {pedido.cliente || 'Cliente não informado'}
              </p>

              {/* Tags de status e categoria */}
              <div className={styles['distribuidor-order-tags']}>
                {/* Badge de Status */}
                <StatusBadge
                  status={pedido.status}
                  variant="light"
                  size="sm"
                  animated={config.requiresAction}
                />

                {/* Tag de novo pedido (se aplicável) */}
                {pedidoNovo && (
                  <span className={styles['distribuidor-order-tag-novo']}>
                    Novo
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Informações secundárias e ações */}
          <div className={styles['distribuidor-order-info']}>
            <p className={styles['distribuidor-order-price']}>
              {formatCurrency(pedido.valorTotal || 0, 'BRL')}
            </p>
            <p className={styles['distribuidor-order-date']}>
              {formatarData(pedido.dataCriacao)}
            </p>
          </div>

          {/* Botão de expandir */}
          <button
            className={styles['distribuidor-expand-button']}
            onClick={() => togglePedidoExpandido(pedido.id)}
            aria-label={
              pedidosExpandidos.includes(pedido.id)
                ? 'Recolher detalhes'
                : 'Expandir detalhes'
            }
          >
            {pedidosExpandidos.includes(pedido.id) ? (
              <FiChevronUp size={24} />
            ) : (
              <FiChevronDown size={24} />
            )}
          </button>
        </div>

        {/* Seção Expandida com Timeline */}
        {pedidosExpandidos.includes(pedido.id) && (
          <div className={styles['distribuidor-order-items']}>
            {/* Timeline de Progresso */}
            <div style={{ marginBottom: '20px' }}>
              <h4
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  marginBottom: '12px',
                  color: '#374151'
                }}
              >
                Progresso do Pedido
              </h4>
              <StatusTimeline currentStatus={pedido.status} showLabels={true} />
            </div>

            {/* Lista de itens (manter código existente) */}
            <h4 className={styles['distribuidor-items-title']}>
              Itens do Pedido
            </h4>
            <div className={styles['distribuidor-items-list']}>
              {/* ... itens do pedido ... */}
            </div>

            {/* Resumo (manter código existente) */}
            <div className={styles['distribuidor-items-summary']}>
              {/* ... resumo do pedido ... */}
            </div>
          </div>
        )}
      </div>
    );
  })
)}
```

---

## 6️⃣ Mensagem de Filtro Ativo

```jsx
{/* Mostrar feedback visual quando um filtro está ativo */}
{filtroStatus && (
  <div
    style={{
      padding: '12px 16px',
      background: getStatusConfig(filtroStatus).color.light,
      border: `2px solid ${getStatusConfig(filtroStatus).color.border}`,
      borderRadius: '8px',
      marginBottom: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '14px', color: getStatusConfig(filtroStatus).color.dark }}>
        Filtrando por:
      </span>
      <StatusBadge status={filtroStatus} size="sm" />
    </div>
    <button
      onClick={() => setFiltroStatus(null)}
      style={{
        background: 'transparent',
        border: 'none',
        color: getStatusConfig(filtroStatus).color.primary,
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 600,
        padding: '4px 8px',
        borderRadius: '4px',
        transition: 'background 0.2s'
      }}
      onMouseEnter={(e) => {
        e.target.style.background = 'rgba(0,0,0,0.05)';
      }}
      onMouseLeave={(e) => {
        e.target.style.background = 'transparent';
      }}
    >
      Limpar filtro ✕
    </button>
  </div>
)}
```

---

## 7️⃣ Função Helper para Determinar Pedido Novo

```jsx
// Adicionar no topo do componente
const isNovoPedido = (dataCriacao) => {
  if (!dataCriacao) return false;
  const data = new Date(dataCriacao);
  const agora = new Date();
  const diferencaHoras = (agora - data) / (1000 * 60 * 60);
  return diferencaHoras < 24;
};
```

---

## 8️⃣ PropTypes (Adicionar no final do arquivo)

```jsx
import PropTypes from 'prop-types';

// No final do arquivo, antes do export default
DistribuidorDashboard.propTypes = {
  // Adicionar propTypes se necessário
};
```

---

## 9️⃣ Importações de Ícones Necessárias

```jsx
// Verificar se já tem, senão adicionar:
import {
  FiPackage,
  FiClock,
  FiCheck,
  FiBox,
  FiTruck,
  FiChevronDown,
  FiChevronUp,
  FiSearch
} from 'react-icons/fi';
```

---

## 🔟 CSS Adicional (Se necessário)

```jsx
// Se não tiver a seção filters-section no CSS, adicionar ao DistribuidorDashboard.module.css:

.filters-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 20px 0;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.status-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #fff;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.filter-btn:hover:not(:disabled) {
  border-color: #d1d5db;
  background: #f9fafb;
  color: #374151;
}

.filter-btn.active {
  background: #ff6b35;
  border-color: #ff6b35;
  color: #fff;
}

.filter-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

---

## 1️⃣1️⃣ Teste Rápido

```jsx
// Adicionar temporariamente para testar o sistema:
console.log('Status Counts:', statusCounts);
console.log('Pedidos Filtrados:', pedidosFiltrados.length);
console.log('Filtro Ativo:', filtroStatus);
```

---

## 1️⃣2️⃣ Exemplo de Pedido Mock (Para testes)

```jsx
// Para testar sem API, criar pedidos mock:
const pedidosMock = [
  {
    id: 'PED001',
    status: 'aguardando_aceite',
    cliente: 'Assistência Técnica XYZ',
    valorTotal: 1500.00,
    dataCriacao: new Date().toISOString(),
    itens: [
      { nome: 'Tela LCD', quantidade: 2, preco: 450.00 },
      { nome: 'Bateria', quantidade: 1, preco: 600.00 }
    ]
  },
  {
    id: 'PED002',
    status: 'aceito',
    cliente: 'Assistência Técnica ABC',
    valorTotal: 800.00,
    dataCriacao: new Date(Date.now() - 3600000).toISOString(), // 1h atrás
    itens: [{ nome: 'Carregador', quantidade: 4, preco: 200.00 }]
  },
  {
    id: 'PED003',
    status: 'em_separacao',
    cliente: 'Assistência Técnica 123',
    valorTotal: 2200.00,
    dataCriacao: new Date(Date.now() - 7200000).toISOString(), // 2h atrás
    itens: [{ nome: 'Placa Mãe', quantidade: 1, preco: 2200.00 }]
  },
  {
    id: 'PED004',
    status: 'aguardando_retirada',
    cliente: 'Assistência Técnica Pro',
    valorTotal: 950.00,
    dataCriacao: new Date(Date.now() - 14400000).toISOString(), // 4h atrás
    itens: [{ nome: 'Cabo USB', quantidade: 10, preco: 95.00 }]
  },
  {
    id: 'PED005',
    status: 'em_transito',
    cliente: 'Assistência Técnica Master',
    valorTotal: 1800.00,
    dataCriacao: new Date(Date.now() - 28800000).toISOString(), // 8h atrás
    itens: [{ nome: 'Fone de Ouvido', quantidade: 6, preco: 300.00 }]
  },
  {
    id: 'PED006',
    status: 'concluido',
    cliente: 'Assistência Técnica Premium',
    valorTotal: 3500.00,
    dataCriacao: new Date(Date.now() - 86400000).toISOString(), // 24h atrás
    itens: [{ nome: 'Kit Ferramentas', quantidade: 1, preco: 3500.00 }]
  }
];

// Usar pedidosMock no lugar de pedidos para testar
```

---

## ✅ Checklist de Implementação

Marque conforme implementa:

```
[ ] 1. Importar componentes e utils
[ ] 2. Adicionar estado para filtros (filtroStatus, pedidosFiltrados)
[ ] 3. Criar useEffect para filtrar e ordenar
[ ] 4. Calcular statusCounts
[ ] 5. Adicionar barra de filtros com StatusCounter
[ ] 6. Atualizar cards superiores com contadores
[ ] 7. Modificar item de pedido para usar card-${statusKey}
[ ] 8. Substituir tags antigas por StatusBadge
[ ] 9. Adicionar StatusTimeline na seção expandida
[ ] 10. Adicionar mensagem de filtro ativo
[ ] 11. Testar com dados mock
[ ] 12. Testar filtros (clicar em cada status)
[ ] 13. Testar responsividade (mobile, tablet, desktop)
[ ] 14. Remover console.logs de teste
[ ] 15. Testar com dados reais da API
```

---

## 🚨 Problemas Comuns e Soluções

### Erro: "Cannot read property 'color' of undefined"
**Causa:** Status não reconhecido
**Solução:**
```javascript
// Adicionar mapeamento em statusUtils.js → normalizeStatus()
const statusMap = {
  // ... existentes
  'seu_status_do_backend': STATUS_TYPES.AGUARDANDO_ACEITE
};
```

### Filtros não funcionam
**Causa:** pedidosFiltrados não está sendo usado no map
**Solução:**
```javascript
// ERRADO
{pedidos.map(...)}

// CORRETO
{pedidosFiltrados.map(...)}
```

### Badges sem cor
**Causa:** CSS Module não importado
**Solução:**
```javascript
import statusStyles from './StatusColors.module.css';
```

### Animações não aparecem
**Causa:** Prop animated não está true
**Solução:**
```jsx
<StatusBadge status={pedido.status} animated={true} />
```

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique o console do navegador (F12)
2. Confirme que todos os arquivos foram criados
3. Verifique se as importações estão corretas
4. Use `console.log` para debugar os dados
5. Teste com dados mock primeiro

---

**Pronto! Agora é só copiar e colar! 🚀**