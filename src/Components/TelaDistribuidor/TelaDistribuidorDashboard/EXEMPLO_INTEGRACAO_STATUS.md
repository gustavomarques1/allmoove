# 🎨 Guia de Integração - Sistema de Cores de Status

Este guia mostra como integrar o sistema de cores de status no Dashboard do Distribuidor.

## 📦 Componentes Criados

### 1. `StatusBadge.jsx`
Badge reutilizável para exibir status de pedidos com cores e ícones dinâmicos.

### 2. `StatusTimeline.jsx`
Timeline visual mostrando o progresso do pedido através dos status.

### 3. `StatusCounter.jsx`
Contador de pedidos por status para filtros.

### 4. `StatusColors.module.css`
CSS Module completo com todas as classes de cores e animações.

### 5. `statusUtils.js`
Funções utilitárias para gerenciar status, cores e filtros.

---

## 🚀 Como Integrar no `DistribuidorDashboard.jsx`

### Passo 1: Importar Componentes e Utilidades

```jsx
// No início do arquivo DistribuidorDashboard.jsx
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

### Passo 2: Adicionar Estado para Filtros

```jsx
const [filtroStatus, setFiltroStatus] = useState(null);
const [pedidosFiltrados, setPedidosFiltrados] = useState([]);
```

### Passo 3: Filtrar Pedidos por Status

```jsx
useEffect(() => {
  if (!pedidos || pedidos.length === 0) {
    setPedidosFiltrados([]);
    return;
  }

  let resultado = pedidos;

  // Filtrar por status se um filtro estiver ativo
  if (filtroStatus) {
    resultado = filterByStatus(resultado, filtroStatus);
  }

  // Ordenar por prioridade de status
  resultado = sortByStatusPriority(resultado);

  setPedidosFiltrados(resultado);
}, [pedidos, filtroStatus]);
```

### Passo 4: Criar Seção de Filtros com Contadores

```jsx
// Adicionar antes da listagem de pedidos
const statusCounts = countByStatus(pedidos || []);

<div className={styles['filters-section']}>
  <div className={styles['status-filters']}>
    {/* Botão "Todos" */}
    <button
      className={`${styles['filter-btn']} ${!filtroStatus ? styles['active'] : ''}`}
      onClick={() => setFiltroStatus(null)}
    >
      Todos
      <span className={statusStyles['status-counter']}>
        {pedidos?.length || 0}
      </span>
    </button>

    {/* Filtros por status */}
    <StatusCounter
      status={STATUS_TYPES.AGUARDANDO_ACEITE}
      count={statusCounts[STATUS_TYPES.AGUARDANDO_ACEITE]}
      active={filtroStatus === STATUS_TYPES.AGUARDANDO_ACEITE}
      onClick={() => setFiltroStatus(STATUS_TYPES.AGUARDANDO_ACEITE)}
    />

    <StatusCounter
      status={STATUS_TYPES.ACEITO}
      count={statusCounts[STATUS_TYPES.ACEITO]}
      active={filtroStatus === STATUS_TYPES.ACEITO}
      onClick={() => setFiltroStatus(STATUS_TYPES.ACEITO)}
    />

    <StatusCounter
      status={STATUS_TYPES.EM_SEPARACAO}
      count={statusCounts[STATUS_TYPES.EM_SEPARACAO]}
      active={filtroStatus === STATUS_TYPES.EM_SEPARACAO}
      onClick={() => setFiltroStatus(STATUS_TYPES.EM_SEPARACAO)}
    />

    <StatusCounter
      status={STATUS_TYPES.AGUARDANDO_RETIRADA}
      count={statusCounts[STATUS_TYPES.AGUARDANDO_RETIRADA]}
      active={filtroStatus === STATUS_TYPES.AGUARDANDO_RETIRADA}
      onClick={() => setFiltroStatus(STATUS_TYPES.AGUARDANDO_RETIRADA)}
    />

    <StatusCounter
      status={STATUS_TYPES.EM_TRANSITO}
      count={statusCounts[STATUS_TYPES.EM_TRANSITO]}
      active={filtroStatus === STATUS_TYPES.EM_TRANSITO}
      onClick={() => setFiltroStatus(STATUS_TYPES.EM_TRANSITO)}
    />

    <StatusCounter
      status={STATUS_TYPES.CONCLUIDO}
      count={statusCounts[STATUS_TYPES.CONCLUIDO]}
      active={filtroStatus === STATUS_TYPES.CONCLUIDO}
      onClick={() => setFiltroStatus(STATUS_TYPES.CONCLUIDO)}
    />
  </div>
</div>
```

### Passo 5: Substituir Tags de Status Antigas por StatusBadge

```jsx
// ANTES (exemplo):
<span className={styles['distribuidor-order-tag-novo']}>
  {pedido.status}
</span>

// DEPOIS:
<StatusBadge
  status={pedido.status}
  variant="light"
  size="md"
  showIcon={true}
  animated={true}
/>
```

### Passo 6: Adicionar Timeline de Progresso (Opcional)

```jsx
// Dentro da seção expandida do pedido (distribuidor-order-items)
<div style={{ marginTop: '16px', marginBottom: '16px' }}>
  <h4 style={{ fontSize: '14px', marginBottom: '12px', color: '#374151' }}>
    Progresso do Pedido
  </h4>
  <StatusTimeline currentStatus={pedido.status} showLabels={true} />
</div>
```

### Passo 7: Aplicar Cores aos Cards de Pedidos

```jsx
// Modificar a div do pedido para incluir a classe de status
const config = getStatusConfig(pedido.status);
const statusKey = normalizeStatus(pedido.status).replace(/_/g, '-');

<div
  className={`
    ${styles['distribuidor-order-item']}
    ${statusStyles[`card-${statusKey}`]}
    ${pedidoNovo ? styles['pedido-novo'] : ''}
  `}
>
  {/* Conteúdo do pedido */}
</div>
```

---

## 🎯 Exemplos de Uso Avançado

### Exemplo 1: Badge com Diferentes Variantes

```jsx
{/* Badge padrão (fundo colorido) */}
<StatusBadge status={pedido.status} />

{/* Badge light (fundo claro) */}
<StatusBadge status={pedido.status} variant="light" />

{/* Badge outline (apenas borda) */}
<StatusBadge status={pedido.status} variant="outline" />

{/* Badge pequeno sem ícone */}
<StatusBadge status={pedido.status} size="sm" showIcon={false} />

{/* Badge com dot pulsante */}
<StatusBadge status={pedido.status} showDot={true} animated={true} />
```

### Exemplo 2: Cores Dinâmicas Inline

```jsx
import { getStatusColor } from '../../../utils/statusUtils';

// Usar cor do status diretamente
<div style={{ borderLeftColor: getStatusColor(pedido.status) }}>
  {/* Conteúdo */}
</div>
```

### Exemplo 3: Filtros Múltiplos

```jsx
// Permitir filtrar por múltiplos status ao mesmo tempo
const [filtrosAtivos, setFiltrosAtivos] = useState([]);

const toggleFiltro = (status) => {
  setFiltrosAtivos(prev =>
    prev.includes(status)
      ? prev.filter(s => s !== status)
      : [...prev, status]
  );
};

// Filtrar pedidos
const pedidosFiltrados = filtrosAtivos.length > 0
  ? filterByStatus(pedidos, filtrosAtivos)
  : pedidos;
```

### Exemplo 4: Indicador de Urgência

```jsx
import { isPedidoUrgente } from '../../../utils/statusUtils';

{isPedidoUrgente(pedido) && (
  <span
    className={statusStyles['status-badge']}
    style={{
      background: '#FEF3C7',
      color: '#92400E',
      border: '2px solid #FCD34D'
    }}
  >
    ⚠️ Urgente
  </span>
)}
```

---

## 📊 Cards Superiores (Dashboard)

### Adicionar Contadores Coloridos nos Cards do Topo

```jsx
// No card "Novos Pedidos"
<div className={styles['distribuidor-top-card']}>
  <div className={styles['distribuidor-top-card-header']}>
    <h3 className={styles['distribuidor-top-card-title']}>Novos Pedidos</h3>
    <div className={statusStyles['status-aguardando-aceite-icon']}>
      <FiClock size={24} />
    </div>
  </div>
  <p className={styles['distribuidor-top-card-number']}>
    {statusCounts[STATUS_TYPES.AGUARDANDO_ACEITE]}
  </p>
  <p className={styles['distribuidor-top-card-description']}>
    Aguardando aceite
  </p>
</div>

// No card "Em Andamento"
<div className={styles['distribuidor-top-card']}>
  <div className={styles['distribuidor-top-card-header']}>
    <h3 className={styles['distribuidor-top-card-title']}>Em Andamento</h3>
    <div className={statusStyles['status-em-separacao-icon']}>
      <FiPackage size={24} />
    </div>
  </div>
  <p className={styles['distribuidor-top-card-number']}>
    {statusCounts[STATUS_TYPES.ACEITO] + statusCounts[STATUS_TYPES.EM_SEPARACAO]}
  </p>
  <p className={styles['distribuidor-top-card-description']}>
    Aceitos e em separação
  </p>
</div>

// No card "Concluídos"
<div className={styles['distribuidor-top-card']}>
  <div className={styles['distribuidor-top-card-header']}>
    <h3 className={styles['distribuidor-top-card-title']}>Concluídos</h3>
    <div className={statusStyles['status-concluido-icon']}>
      <FiCheck size={24} />
    </div>
  </div>
  <p className={styles['distribuidor-top-card-number']}>
    {statusCounts[STATUS_TYPES.CONCLUIDO]}
  </p>
  <p className={styles['distribuidor-top-card-description']}>
    Pedidos entregues
  </p>
</div>
```

---

## ✨ Animações Aplicadas Automaticamente

O sistema aplica animações automaticamente baseado no status:

- **Aguardando Aceite**: Glow pulsante (chama atenção)
- **Em Separação**: Pulse suave (indica atividade)
- **Novos pedidos**: Bounce-in ao carregar
- **Transições**: Fade-in suave ao filtrar

---

## 🎨 Paleta de Cores Rápida

```css
/* Aguardando Aceite */ #FF3600
/* Aceito */            #3B82F6
/* Em Separação */      #8B5CF6
/* Aguardando Retirada*/ #F59E0B
/* Em Trânsito */       #06B6D4
/* Concluído */         #10B981
```

---

## 🔧 Funções Úteis de `statusUtils.js`

```javascript
// Normalizar status vindo do backend
normalizeStatus('aguardando aceite') // → 'aguardando_aceite'

// Obter configuração completa
getStatusConfig('aceito') // → { label, icon, color, priority, ... }

// Obter label
getStatusLabel('em_separacao') // → 'Em Separação'
getStatusLabel('em_separacao', true) // → 'Separando' (short)

// Obter cor
getStatusColor('concluido') // → '#10B981'

// Verificar se requer ação
statusRequiresAction('aguardando_aceite') // → true

// Ordenar por prioridade
sortByStatusPriority(pedidos) // Prioriza urgentes

// Agrupar por status
groupByStatus(pedidos) // { 'aguardando_aceite': [...], 'aceito': [...] }

// Contar por status
countByStatus(pedidos) // { 'aguardando_aceite': 5, 'aceito': 3, ... }

// Próximo status
getNextStatus('aceito') // → 'em_separacao'

// Progresso em %
getStatusProgress('em_transito') // → 80
```

---

## 🌐 Acessibilidade

O sistema já inclui suporte para:

- **High Contrast Mode**: Bordas mais grossas e cores mais fortes
- **Reduced Motion**: Remove animações para usuários sensíveis
- **ARIA Labels**: Todos os badges têm labels descritivos
- **Keyboard Navigation**: Filtros navegáveis por teclado

---

## 📱 Responsividade

O sistema é totalmente responsivo:

- **Desktop**: Badges completos com ícones e labels
- **Tablet**: Filtros com scroll horizontal
- **Mobile**: Badges menores, timeline compacta, labels ocultas quando necessário

---

## 🚨 Tratamento de Status do Backend

O sistema normaliza automaticamente qualquer variação de status vinda do backend:

```javascript
// Todos estes são normalizados para 'aguardando_aceite':
'Aguardando Aceite'
'aguardando aceite'
'pendente'
'novo'
'PENDENTE'
```

Adicione mais mapeamentos em `statusUtils.js` → função `normalizeStatus()` se necessário.

---

## 💡 Dicas de UX

1. **Priorize visualmente**: Status urgentes (laranja) devem estar no topo
2. **Use animações com moderação**: Apenas para chamar atenção quando necessário
3. **Mantenha consistência**: Use sempre os mesmos componentes (StatusBadge, etc.)
4. **Feedback visual**: Cards com hover e bordas coloridas melhoram a experiência
5. **Timeline**: Mostre apenas em detalhes do pedido, não na lista principal

---

## 🎯 Resultado Esperado

Após a integração completa, você terá:

✅ Cores distintas e consistentes para cada status
✅ Filtros interativos com contadores visuais
✅ Timeline de progresso do pedido
✅ Animações sutis para status urgentes
✅ Cards com bordas coloridas por prioridade
✅ Sistema escalável e fácil de manter
✅ Totalmente acessível e responsivo

---

**Criado para AllMoove Dashboard Distribuidor**
*Sistema de cores profissional com foco em UX e performance*