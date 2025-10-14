# 🏢 Jornada do Distribuidor - Plano de Implementação Completo

> **Data:** 2025-10-14
> **Status:** Análise Completa e Plano de Ação Definido
> **Backend Base URL:** `https://localhost:44370/`

---

## 📋 Sumário Executivo

A jornada do distribuidor possui **2 telas principais**:
1. **Dashboard do Distribuidor** - Gerenciar pedidos, visualizar métricas
2. **Tela de Estoque** - Gerenciar inventário de peças

**Status Atual:**
- ✅ Dashboard: **90% integrado com API**
- ⚠️ Estoque: **100% mockado** (precisa integração completa)
- ✅ Pedidos: **API funcional** (`getPedidosDoDistribuidor` já implementada)

---

## 🎯 Análise das Telas

### 1. Dashboard do Distribuidor
**Arquivo:** `src/Components/TelaDistribuidor/TelaDistribuidorDashboard/DistribuidorDashboard.jsx`

**Funcionalidades:**
- ✅ **Cards de indicadores** (Novos Pedidos, Em Andamento, Concluídos)
- ✅ **Listagem de pedidos** do distribuidor
- ✅ **Aceitar pedido** (botão "Aceitar Pedido")
- ❌ **Faturamento** (valores mockados: R$ 35.75 / R$ 130.50 / R$ 166.25)
- ❌ **Peças por Segmento** (valores mockados: 25% cada categoria)
- ✅ **Botão de Estoque** (navega para `/distribuidor/estoque`)
- ❌ **Botão Detalhes** (não implementado)

**APIs Utilizadas:**
- ✅ `GET /api/Pedidos/distribuidor/{id}` - via `getPedidosDoDistribuidor()`
- ✅ `PUT /api/Pedidos/setsituacao/{id}` - via `updateStatusPedido()`

**Dados Mockados:**
```javascript
// Faturamento (linhas 160, 172, 177)
R$ 35.75  // Valor Recebido (mockado)
R$ 130.50 // A Receber (mockado)
R$ 166.25 // Total (mockado)

// Peças por Segmento (linhas 197-240)
Eletrônicos: 1 (25%) (mockado)
Automotivo: 1 (25%) (mockado)
Informática: 1 (25%) (mockado)
Eletrodomésticos: 1 (25%) (mockado)
```

---

### 2. Tela de Estoque
**Arquivo:** `src/Components/TelaDistribuidor/TelaEstoque/TelaEstoque.jsx`

**Funcionalidades:**
- ❌ **Cards de métricas** (Total de Itens, Alertas, Valor do Estoque) - MOCK
- ❌ **Cadastrar produto** (botão existe, função não implementada)
- ❌ **Listagem de produtos** - MOCK (5 produtos fictícios)
- ❌ **Editar produto** (botão existe, função não implementada)
- ❌ **Excluir produto** (botão existe, função não implementada)
- ❌ **Filtros** (busca por nome/marca, filtro por status) - MOCK
- ✅ **Botão Voltar** (navega para `/distribuidor/dashboard`)

**Dados Mockados:**
```javascript
// Mock de estoque (linhas 8-64)
const mockEstoque = [
  {
    id: 1,
    nome: 'Placa Principal',
    descricao: 'Placa principal para smartphone Samsung Galaxy A54',
    marca: 'Samsung',
    quantidade: 25,
    valorUnitario: 89.90,
    localFisico: 'A1-B2',
    lote: 'LOT-001',
    status: 'disponivel'
  },
  // ... mais 4 itens mockados
];
```

---

## 🔌 Endpoints Disponíveis no Backend

### ✅ Endpoints JÁ UTILIZADOS

| Endpoint | Método | Função Frontend | Status |
|----------|--------|-----------------|--------|
| `/api/Pedidos/distribuidor/{id}` | GET | `getPedidosDoDistribuidor()` | ✅ Funcionando |
| `/api/Pedidos/setsituacao/{id}` | PUT | `updateStatusPedido()` | ✅ Funcionando |

---

### 🟡 Endpoints DISPONÍVEIS (não utilizados ainda)

#### **Dashboard - Faturamento e Métricas**

| Endpoint | Método | Descrição | Uso Sugerido |
|----------|--------|-----------|--------------|
| `/api/Dashboard/{papel}/{id}` | GET | Dados agregados do dashboard | 🔥 **USAR ESTE** para substituir cálculos manuais de indicadores |

**Exemplo de uso:**
```javascript
GET /api/Dashboard/distribuidor/42
```

**Resposta esperada:**
```json
{
  "novosPedidos": 5,
  "emAndamento": 12,
  "concluidos": 89,
  "valorRecebido": 35750.00,
  "valorAReceber": 130500.00,
  "totalFaturamento": 166250.00,
  "pecasPorSegmento": [
    { "segmento": "Eletrônicos", "quantidade": 45, "percentual": 35 },
    { "segmento": "Automotivo", "quantidade": 32, "percentual": 25 },
    { "segmento": "Informática", "quantidade": 28, "percentual": 22 },
    { "segmento": "Eletrodomésticos", "quantidade": 23, "percentual": 18 }
  ]
}
```

---

#### **Pedidos - Consultas Adicionais**

| Endpoint | Método | Descrição | Uso Sugerido |
|----------|--------|-----------|--------------|
| `/api/Pedidos/{id}` | GET | Detalhes completos do pedido | 🔥 **USAR** no botão "Detalhes" |
| `/api/PedidoItems/pedido/{id}` | GET | Listar itens de um pedido | Detalhes do pedido |
| `/api/PedidoTimelines/pedido/{id}` | GET | Histórico/timeline do pedido | Detalhes do pedido |
| `/api/Pedidos/periodo` | GET | Pedidos por período (query params) | Relatórios futuros |

---

#### **Pedidos - Atualização de Status Específicos**

| Endpoint | Método | Descrição | Quando Usar |
|----------|--------|-----------|-------------|
| `/api/Pedidos/setsituacao/{id}` | PUT | ✅ **JÁ USADO** - Status geral | Aceitar/Recusar pedido |
| `/api/Pedidos/setcoleta/{id}` | PUT | Marcar como coletado pelo entregador | Quando entregador coleta |
| `/api/Pedidos/setentrega/{id}` | PUT | Marcar como entregue ao cliente | Quando cliente recebe |
| `/api/Pedidos/setdevolucao/{id}` | PUT | Marcar pedido/item como devolução | Devolução de produto |

---

#### **Estoque - Produtos**

**⚠️ IMPORTANTE:** Backend NÃO tem endpoint específico `/api/Estoque`, mas pode usar `/api/Produtos`:

| Endpoint | Método | Descrição | Uso Sugerido |
|----------|--------|-----------|--------------|
| `/api/Produtos` | GET | Listar todos os produtos | 🔥 **USAR** para listar estoque |
| `/api/Produtos/{id}` | GET | Buscar produto específico | Detalhes do produto |
| `/api/Produtos` | POST | Criar novo produto | Cadastrar produto no estoque |
| `/api/Produtos/{id}` | PUT | Atualizar produto | Editar produto do estoque |
| `/api/Produtos/{id}` | DELETE | Excluir produto | Excluir produto do estoque |

**Filtros disponíveis em GET `/api/Produtos`:**
- `?categoria=Eletrônicos`
- `?fornecedor=TechParts SP`
- `?idSegmento=1`
- `?idGrupo=5`
- `?idMarca=3`

---

## 🚨 APIs que PRECISAM SER CRIADAS

### ❌ **API de Estoque Específica do Distribuidor**

**Problema:** Backend não tem endpoint `/api/Estoque/distribuidor/{id}`

**Soluções possíveis:**

#### **Opção 1: Usar `/api/Produtos` existente** (⭐ Recomendado)
- **Vantagem:** Backend já está pronto
- **Desvantagem:** Não filtra por distribuidor automaticamente
- **Implementação:** Adicionar filtro no frontend

```javascript
// src/api/estoqueServices.js (NOVO)

export const getEstoqueDoDistribuidor = async (idDistribuidor) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get('/api/Produtos', {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Filtrar produtos do distribuidor no frontend
    const produtosDoDistribuidor = response.data.filter(
      p => p.distribuidorId === idDistribuidor || p.fornecedor === 'Nome do Distribuidor'
    );

    return produtosDoDistribuidor;
  } catch (error) {
    console.error('Erro ao buscar estoque:', error);
    throw error;
  }
};
```

#### **Opção 2: Backend criar endpoint novo** `/api/Estoque/distribuidor/{id}`
- **Vantagem:** Mais semântico e performático
- **Desvantagem:** Requer modificação no backend
- **Quando usar:** Se o backend tiver tempo para implementar

**Modelo de dados esperado:**
```typescript
interface EstoqueItem {
  id: number;
  nome: string;
  descricao: string;
  marca: string;
  quantidade: number;
  valorUnitario: number;
  localFisico: string;  // "A1-B2" (prateleira)
  lote: string;          // "LOT-001"
  status: 'disponivel' | 'estoque-baixo' | 'sem-estoque';
  distribuidorId: number;
}
```

---

### ❌ **API de Dashboard Agregado**

**Problema:** Endpoint `/api/Dashboard/{papel}/{id}` existe, mas não sabemos o formato da resposta.

**Ação Necessária:**
1. Testar endpoint no Swagger: `GET /api/Dashboard/distribuidor/42`
2. Verificar formato da resposta
3. Criar service `src/api/dashboardServices.js`

**Se o endpoint NÃO existir ou não retornar dados corretos:**
- Manter cálculo atual no `usePedidosDistribuidor.js` ✅
- Adicionar API para calcular faturamento no backend (futuro)

---

## 📝 Plano de Implementação - Passo a Passo

### 🔴 **FASE 1: Integração de Dashboard** (1-2 horas)

#### Task 1.1: Testar endpoint de Dashboard
```bash
# Verificar se endpoint retorna dados
curl -X GET "https://localhost:44370/api/Dashboard/distribuidor/42" \
  -H "Authorization: Bearer {SEU_TOKEN}"
```

#### Task 1.2: Criar `dashboardServices.js` (se endpoint funcionar)
```javascript
// src/api/dashboardServices.js

export const getDashboardDistribuidor = async (idDistribuidor) => {
  try {
    const token = localStorage.getItem('token');
    const id = idDistribuidor || localStorage.getItem('idPessoa');

    const response = await api.get(`/api/Dashboard/distribuidor/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dashboard:', error);
    throw error;
  }
};
```

#### Task 1.3: Atualizar `usePedidosDistribuidor.js`
- Adicionar chamada `getDashboardDistribuidor()` se disponível
- Ou manter cálculo manual atual se endpoint não funcionar

#### Task 1.4: Implementar botão "Detalhes" do pedido
```javascript
// src/api/pedidosServices.js (ADICIONAR)

export const getDetalhesPedido = async (pedidoId) => {
  try {
    const token = localStorage.getItem('token');

    const [pedido, items, timeline] = await Promise.all([
      api.get(`/api/Pedidos/${pedidoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      api.get(`/api/PedidoItems/pedido/${pedidoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      api.get(`/api/PedidoTimelines/pedido/${pedidoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    ]);

    return {
      ...pedido.data,
      items: items.data,
      timeline: timeline.data
    };
  } catch (error) {
    console.error('Erro ao buscar detalhes do pedido:', error);
    throw error;
  }
};
```

**Criar componente modal ou nova rota para exibir detalhes**

---

### 🟡 **FASE 2: Integração de Estoque** (2-3 horas)

#### Task 2.1: Criar `estoqueServices.js`
```javascript
// src/api/estoqueServices.js (NOVO ARQUIVO)

import api from './api';

/**
 * Busca estoque do distribuidor
 * @param {number} idDistribuidor - ID do distribuidor
 * @returns {Promise<Array>} Lista de produtos no estoque
 */
export const getEstoqueDoDistribuidor = async (idDistribuidor = null) => {
  try {
    const token = localStorage.getItem('token');
    const id = idDistribuidor || localStorage.getItem('idPessoa');

    const response = await api.get('/api/Produtos', {
      headers: { Authorization: `Bearer ${token}` }
    });

    // TODO: Adicionar filtro por distribuidor quando backend suportar
    // Por enquanto, retorna todos os produtos
    return response.data.map(produto => ({
      id: produto.id,
      nome: produto.nome,
      descricao: produto.descricao || '',
      marca: produto.marca || '',
      quantidade: produto.quantidade || 0,
      valorUnitario: produto.precoVenda || 0,
      localFisico: produto.localizacao || '-',
      lote: produto.lote || '-',
      status: calcularStatus(produto.quantidade)
    }));
  } catch (error) {
    console.error('Erro ao buscar estoque:', error);
    throw error;
  }
};

/**
 * Cria novo produto no estoque
 * @param {Object} produto - Dados do produto
 * @returns {Promise<Object>} Produto criado
 */
export const createProdutoEstoque = async (produto) => {
  try {
    const token = localStorage.getItem('token');

    const response = await api.post('/api/Produtos', produto, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    throw error;
  }
};

/**
 * Atualiza produto do estoque
 * @param {number} id - ID do produto
 * @param {Object} produto - Dados atualizados
 * @returns {Promise<Object>} Produto atualizado
 */
export const updateProdutoEstoque = async (id, produto) => {
  try {
    const token = localStorage.getItem('token');

    const response = await api.put(`/api/Produtos/${id}`, produto, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    throw error;
  }
};

/**
 * Exclui produto do estoque
 * @param {number} id - ID do produto
 * @returns {Promise<void>}
 */
export const deleteProdutoEstoque = async (id) => {
  try {
    const token = localStorage.getItem('token');

    await api.delete(`/api/Produtos/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    throw error;
  }
};

// Função auxiliar para calcular status
const calcularStatus = (quantidade) => {
  if (quantidade === 0) return 'sem-estoque';
  if (quantidade <= 5) return 'estoque-baixo';
  return 'disponivel';
};
```

#### Task 2.2: Criar `useEstoque.js` hook
```javascript
// src/hooks/useEstoque.js (NOVO ARQUIVO)

import { useState, useEffect } from 'react';
import { getEstoqueDoDistribuidor } from '../api/estoqueServices';

export const useEstoque = () => {
  const [estoque, setEstoque] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    carregarEstoque();
  }, []);

  const carregarEstoque = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getEstoqueDoDistribuidor();
      setEstoque(data);
    } catch (err) {
      console.error('Erro ao carregar estoque:', err);
      setError(err.message || 'Erro ao carregar estoque');
      setEstoque([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    estoque,
    isLoading,
    error,
    recarregar: carregarEstoque
  };
};
```

#### Task 2.3: Atualizar `TelaEstoque.jsx`
```javascript
// Substituir mockEstoque por hook

import { useEstoque } from '../../../hooks/useEstoque';
import {
  createProdutoEstoque,
  updateProdutoEstoque,
  deleteProdutoEstoque
} from '../../../api/estoqueServices';

function TelaEstoque() {
  const { estoque, isLoading, error, recarregar } = useEstoque();

  // ... resto do código
}
```

#### Task 2.4: Implementar modal de Cadastrar Produto
- Criar componente `ModalCadastroProduto.jsx`
- Formulário com campos: nome, descrição, marca, quantidade, valorUnitario, localFisico, lote
- Chamar `createProdutoEstoque()` ao salvar

#### Task 2.5: Implementar funções Editar e Excluir
```javascript
const handleEditar = async (id) => {
  // Abrir modal de edição
  setModalAberto(true);
  setProdutoSelecionado(estoque.find(p => p.id === id));
};

const handleSalvarEdicao = async (produtoEditado) => {
  try {
    await updateProdutoEstoque(produtoEditado.id, produtoEditado);
    alert('Produto atualizado com sucesso!');
    recarregar(); // Recarrega a lista
  } catch (error) {
    alert('Erro ao atualizar produto: ' + error.message);
  }
};

const handleExcluir = async (id) => {
  if (!window.confirm('Tem certeza que deseja excluir este produto?')) {
    return;
  }

  try {
    await deleteProdutoEstoque(id);
    alert('Produto excluído com sucesso!');
    recarregar(); // Recarrega a lista
  } catch (error) {
    alert('Erro ao excluir produto: ' + error.message);
  }
};
```

---

### 🟢 **FASE 3: Melhorias e Polimento** (1-2 horas)

#### Task 3.1: Adicionar loading states
- Skeleton loaders nos cards do dashboard
- Spinner na listagem de estoque

#### Task 3.2: Melhorar tratamento de erros
- Toast notifications ao invés de `alert()`
- Mensagens de erro amigáveis

#### Task 3.3: Validações de formulários
- Validar campos obrigatórios
- Validar formatos (preço, quantidade, etc.)

#### Task 3.4: Testes manuais
- Testar fluxo completo: listar → criar → editar → excluir
- Testar filtros de busca e status
- Testar aceitar pedidos
- Testar navegação entre telas

---

## 📊 Checklist de Implementação

### ✅ Dashboard do Distribuidor

- [x] Listar pedidos do distribuidor (API integrada)
- [x] Aceitar pedido (API integrada)
- [ ] Buscar dados do dashboard agregado (`/api/Dashboard`)
- [ ] Implementar botão "Detalhes" do pedido
- [ ] Substituir valores mockados de faturamento por API
- [ ] Substituir valores mockados de peças por segmento por API
- [ ] Adicionar loading states
- [ ] Melhorar tratamento de erros

### ❌ Tela de Estoque

- [ ] Criar `src/api/estoqueServices.js`
- [ ] Criar `src/hooks/useEstoque.js`
- [ ] Substituir `mockEstoque` por API real
- [ ] Implementar modal/formulário de Cadastrar Produto
- [ ] Implementar função de Editar Produto
- [ ] Implementar função de Excluir Produto
- [ ] Integrar filtros (busca e status) com API
- [ ] Adicionar loading states
- [ ] Melhorar tratamento de erros
- [ ] Testes end-to-end

---

## 🎯 Próximos Passos Recomendados

### **AGORA (Prioridade Máxima)**

1. **Testar endpoint `/api/Dashboard/distribuidor/{id}`**
   - Verificar se retorna dados
   - Validar formato da resposta

2. **Criar `src/api/estoqueServices.js`**
   - Implementar funções CRUD para estoque
   - Usar `/api/Produtos` como backend

3. **Migrar TelaEstoque para API real**
   - Substituir mock por `useEstoque()` hook
   - Implementar CRUD completo

### **DEPOIS (Melhorias Futuras)**

4. Implementar modal de detalhes do pedido
5. Adicionar relatórios e gráficos
6. Implementar notificações em tempo real (SignalR/WebSocket)
7. Adicionar paginação na listagem de pedidos/estoque

---

## 📚 Arquivos de Referência

### Já Existentes
- ✅ `src/api/pedidosServices.js` - API de pedidos
- ✅ `src/hooks/usePedidosDistribuidor.js` - Hook de pedidos do distribuidor
- ✅ `API_PEDIDOS_SPEC.md` - Documentação da API de pedidos
- ✅ `API_REFERENCE_COMPLETA.md` - Referência completa de todos os endpoints

### A Criar
- ❌ `src/api/estoqueServices.js` - API de estoque (NOVO)
- ❌ `src/api/dashboardServices.js` - API de dashboard agregado (NOVO)
- ❌ `src/hooks/useEstoque.js` - Hook de estoque (NOVO)
- ❌ `API_ESTOQUE_SPEC.md` - Documentação da API de estoque (NOVO)

---

## 🤝 Como Pedir Ajuda ao API Integrator

**Exemplo 1: Criar API de Estoque**
```
Crie src/api/estoqueServices.js completo com funções CRUD usando /api/Produtos
```

**Exemplo 2: Migrar componente para API**
```
Migre TelaEstoque.jsx para usar API real ao invés de mockEstoque
```

**Exemplo 3: Testar endpoint**
```
Teste o endpoint /api/Dashboard/distribuidor/42 e crie dashboardServices.js se funcionar
```

---

**Última atualização:** 2025-10-14
**Próxima revisão:** Após implementação da Fase 1
