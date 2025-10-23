# 📋 CONTEXTO DO PROJETO ALLMOOVE

## 🎯 Visão Geral
**AllMoove** - Sistema de delivery de peças técnicas conectando Assistências Técnicas, Distribuidores e Entregadores.

## 🏗️ Arquitetura

### Frontend
- **Framework**: React 19 + Vite
- **Roteamento**: React Router DOM
- **Estado**: Context API + Hooks customizados
- **Estilização**: CSS Modules
- **HTTP**: Axios

### Backend
- **API**: ASP.NET Core (https://localhost:44370)
- **Banco**: SQL Server
- **Autenticação**: JWT Bearer Token

## 👥 Tipos de Usuário

### 1. Assistência Técnica
- **Dashboard**: `/assistencia/dashboard`
- **Funcionalidades**: Comprar peças, fazer pedidos, acompanhar entregas
- **ID no localStorage**: `idPessoa`

### 2. Distribuidor
- **Dashboard**: `/distribuidor/dashboard`
- **Funcionalidades**: Gerenciar estoque, aceitar/recusar pedidos
- **ID no localStorage**: `idDistribuidor` ou `idPessoa`

### 3. Entregador
- **Dashboard**: `/entregador/dashboard`
- **Funcionalidades**: Ver entregas, atualizar status
- **Status**: ⚠️ Usando mock data (implementação pendente)

## 📊 Estrutura de Dados

### Hierarquia de Pedidos
```
PedidoGrupo
  └── Pedido
      └── PedidoItem
```

### Status de Pedidos
- Aguardando Aceite
- Aceito
- Em Separação
- Em Trânsito
- Entregue
- Concluído
- Cancelado

## 🔑 APIs Principais

### Autenticação
- `POST /api/account/loginuser`

### Pedidos
- `GET /api/Pedidos/assistencia/{id}`
- `GET /api/Pedidos/distribuidor/{id}`
- `POST /api/Pedidos`
- `GET /api/PedidoItems/pedido/{id}`

### Produtos
- `GET /api/Produtos`
- `GET /api/Produtos/segmento/{id}`
- `GET /api/ProdutoSegmentos`

### Dashboard
- `GET /api/Dashboard/{papel}/{id}`
- Retorna indicadores agregados
- ⚠️ Backend retornando zeros (workaround implementado)

### Estoque
- `GET /api/Estoque/distribuidor/{id}`
- `PUT /api/Estoque/{id}`

## 🐛 Problemas Conhecidos

1. **Dashboard API**: Retorna valores zerados (usando cálculo local como fallback)
2. **TelaEntregador**: Usando mock data (endpoint não implementado)
3. **Console.logs**: 288 instâncias em produção (impacta performance)
4. **CartButtom**: Typo no nome da pasta (deveria ser CartButton)

## 🚀 Otimizações Implementadas

1. **Logger Configurável**: `src/utils/logger.js`
2. **Sistema de Cache**: `src/utils/cache.js`
3. **Lazy Loading**: `src/AppOptimized.jsx`
4. **Workaround Dashboard**: Cálculo local quando API falha

## 📂 Estrutura de Pastas

```
src/
├── api/            # Serviços de API
├── Components/     # Componentes React
│   ├── InicialTela/         # Login
│   ├── TelaDashboard/       # Dashboard Assistência
│   ├── TelaDistribuidor/    # Distribuidor
│   ├── TelaEntregador/      # Entregador
│   ├── PaginaDeCompras/     # Loja
│   ├── TelaCheckout/        # Pagamento
│   └── Shared/              # Componentes compartilhados
├── context/        # Context API (Provider)
├── hooks/          # Hooks customizados
└── utils/          # Utilitários

```

## 🔄 Fluxo de Compra

1. Login → Dashboard
2. Dashboard → Loja (busca produtos)
3. Loja → Carrinho
4. Carrinho → Opções de Entrega
5. Entrega → Pagamento
6. Pagamento → Confirmação

## 💾 LocalStorage

- `token`: JWT de autenticação
- `email`: Email do usuário
- `papel`: Role (ASSISTENCIA_TECNICA, DISTRIBUIDOR, ENTREGADOR)
- `idPessoa`: ID do usuário
- `expiration`: Expiração do token

## 🎨 Padrões de Código

- **Componentes**: PascalCase
- **Hooks**: camelCase com prefixo `use`
- **Serviços API**: camelCase com sufixo `Services`
- **CSS Modules**: `.module.css`
- **Ícones**: Lucide React

## 📦 Dependências Principais

```json
{
  "react": "^19.0.0",
  "react-router-dom": "^7.1.0",
  "axios": "^1.7.9",
  "lucide-react": "^0.468.0",
  "vite": "^7.1.5"
}
```

## 🔐 Segurança

- Autenticação via JWT Bearer Token
- Token enviado em todos requests: `Authorization: Bearer {token}`
- Logout limpa localStorage
- Rotas protegidas por papel (implementação básica)

## 📈 Métricas Atuais

- **Pedidos no sistema**: 68
- **Produtos disponíveis**: 48
- **Categorias**: 4 (Celulares, Notebooks, Acessórios, Telas)
- **Console.logs**: 288 (precisa limpeza)
- **Arquivos .md**: 3 (após limpeza)

## 🎯 Próximas Melhorias

1. [ ] Remover console.logs (usar Logger)
2. [ ] Implementar TelaEntregador real
3. [ ] Corrigir typo CartButtom → CartButton
4. [ ] Implementar cache nas APIs
5. [ ] Adicionar testes unitários
6. [ ] Melhorar tratamento de erros
7. [ ] Implementar notificações push
8. [ ] Adicionar PWA support

---

**Última atualização**: 2025-10-22