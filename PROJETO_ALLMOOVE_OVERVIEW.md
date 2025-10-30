# 📚 AllMoove - Visão Geral Completa do Projeto

**Data da Documentação:** 28/10/2025
**Versão:** 1.0

---

## 📋 Índice

1. [Visão Geral do Projeto](#visão-geral-do-projeto)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Frontend - React](#frontend---react)
4. [Backend - ASP.NET Core](#backend---aspnet-core)
5. [Banco de Dados - SQL Server](#banco-de-dados---sql-server)
6. [Fluxos de APIs](#fluxos-de-apis)
7. [Problemas Conhecidos e Soluções](#problemas-conhecidos-e-soluções)
8. [Estado Atual do Desenvolvimento](#estado-atual-do-desenvolvimento)

---

## 🎯 Visão Geral do Projeto

**Nome:** AllMoove
**Tipo:** Plataforma de delivery e pedidos de peças técnicas
**Objetivo:** Conectar Assistências Técnicas, Distribuidores e Entregadores para compra/venda de peças

### Usuários do Sistema

1. **Assistência Técnica** - Compra peças para reparos
2. **Distribuidor** - Vende produtos, gerencia estoque e pedidos
3. **Entregador** - Realiza entregas (ainda não implementado)

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React 19)                       │
│                  http://localhost:5173                       │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Assistência  │  │ Distribuidor │  │  Entregador  │     │
│  │  Técnica     │  │              │  │  (Placeholder)│     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (ASP.NET Core Web API)                  │
│              https://localhost:44370                         │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Controllers  │  │   Services   │  │   Models     │     │
│  │  (30+ APIs)  │  │              │  │  (Entities)  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕ Entity Framework
┌─────────────────────────────────────────────────────────────┐
│           BANCO DE DADOS (SQL Server)                        │
│                    allmoove                                  │
│                                                              │
│  PESSOAS | PRODUTOS | PEDIDOS | PRODUTO_* (classificação)   │
└─────────────────────────────────────────────────────────────┘
```

---

## 💻 Frontend - React

### Tecnologias

- **React:** 19
- **Bundler:** Vite
- **Roteamento:** React Router DOM v6
- **HTTP Client:** Axios
- **State Management:** Context API
- **Estilos:** CSS Modules + CSS puro

### Estrutura de Pastas

```
my-app/
├── public/
│   └── data/
│       └── products.json          # 48 produtos estáticos (usado na loja)
├── src/
│   ├── api/                       # Services de integração com backend
│   │   ├── api.js                 # Configuração Axios (baseURL)
│   │   ├── distribuidorServices.js
│   │   ├── estoqueServices.js     # ⭐ CRUD de produtos do distribuidor
│   │   ├── fetchProdutos.js
│   │   ├── pedidosServices.js
│   │   └── produtosServices.js    # APIs de classificação (Segmentos, Marcas, etc)
│   ├── Components/
│   │   ├── PaginaDeCompras/       # Loja da Assistência Técnica
│   │   │   ├── Products/
│   │   │   ├── Cart/
│   │   │   └── SearchBar/
│   │   ├── TelaDistribuidor/      # Dashboard e funcionalidades do distribuidor
│   │   │   ├── TelaDistribuidorDashboard/
│   │   │   ├── TelaEstoque/       # ⭐ Gestão de estoque (FOCO ATUAL)
│   │   │   │   ├── TelaEstoque.jsx
│   │   │   │   ├── ModalCadastrarProduto.jsx  # Formulário completo
│   │   │   │   └── ModalCadastrarProduto.module.css
│   │   │   └── TelaPedidosDistribuidor/
│   │   ├── TelaCheckout/          # Fluxo de checkout da Assistência
│   │   │   ├── DeliveryOptions.jsx
│   │   │   ├── TelaPagamento.jsx
│   │   │   └── PaymentSuccess.jsx
│   │   ├── TelaDashboard/         # Dashboard da Assistência Técnica
│   │   └── Shared/                # Componentes reutilizáveis
│   │       ├── Header/
│   │       ├── Toast/
│   │       └── Loading/
│   ├── context/
│   │   └── Provider.jsx           # Context API para carrinho de compras
│   ├── hooks/                     # Custom hooks
│   │   ├── usePedidosDistribuidor.js
│   │   └── useProdutosMaisVendidos.js
│   ├── utils/
│   │   ├── formatCurrency.js      # Formata valores (R$ 1.234,56)
│   │   └── logger.js              # Console logs estruturados
│   ├── App.jsx                    # Rotas principais
│   └── main.jsx                   # Entry point
├── CLAUDE.md                      # Instruções para Claude Code
└── package.json
```

### Rotas Principais

```javascript
// Assistência Técnica
/                               → Login (Inicial)
/assistencia/dashboard          → Dashboard com busca e resumo de pedidos
/assistencia/loja               → Loja com 48 produtos (products.json)
/assistencia/delivery-options   → Seleção de entrega (Normal/Urgente)
/assistencia/pagamento          → Checkout (PIX/Cartão)
/assistencia/payment-success    → Confirmação com código de entrega

// Distribuidor
/distribuidor/dashboard         → Dashboard com estatísticas e pedidos
/distribuidor/estoque           → Gestão de estoque (CRUD produtos) ⭐
/distribuidor/pedidos           → Lista de pedidos recebidos

// Entregador (placeholder)
/entregador                     → "oi" (não implementado)
```

### Estado Atual - Tela de Estoque do Distribuidor

**Arquivo Principal:** `TelaEstoque.jsx`
**Modal de Cadastro:** `ModalCadastrarProduto.jsx`

#### Campos do Formulário (14 campos em 4 seções)

**Seção 1: Informações Básicas**
- Nome do Produto* (obrigatório)
- SKU (Código)* (obrigatório)
- Descrição (opcional)
- EAN (Código de Barras) (opcional)

**Seção 2: Classificação**
- Segmento* (dropdown - API: `/api/ProdutoSegmentos`)
- Marca* (dropdown - API: `/api/ProdutoMarcas`)
- Modelo (dropdown - API: `/api/ProdutoModelos`)
- Grupo (dropdown - API: `/api/ProdutoGrupos`)
- Tag (dropdown - API: `/api/ProdutoTags`)

**Seção 3: Precificação e Estoque**
- Preço de Custo (R$)
- Preço de Venda (R$)* (obrigatório)
- Quantidade em Estoque

**Seção 4: Localização e Imagem**
- Posição/Local Físico
- URL da Imagem (com preview)

#### Funcionalidades Implementadas

✅ Carregamento automático de dropdowns ao abrir modal
✅ Validação de campos obrigatórios
✅ Preview de imagem quando URL é preenchida
✅ Loading states durante carregamento
✅ Conversão automática de tipos (string → number)
✅ Mensagens de erro claras

---

## 🔧 Backend - ASP.NET Core

### Tecnologias

- **Framework:** ASP.NET Core 6.0+
- **ORM:** Entity Framework Core
- **Autenticação:** JWT Bearer Token + ASP.NET Identity
- **Banco de Dados:** SQL Server

### Caminho do Projeto

```
C:\devtemp\allmoove1_2025.10.11_10.57\allmoove1\allmoove1\AllmooveApi\
```

### Estrutura de Pastas

```
AllmooveApi/
├── Controllers/
│   ├── ProdutosConstroller.cs        # CRUD de produtos
│   ├── ProdutoSegmentosController.cs # Classificações
│   ├── ProdutoMarcasController.cs
│   ├── ProdutoModelosController.cs
│   ├── ProdutoGruposController.cs
│   ├── ProdutoTagsController.cs
│   ├── PedidosController.cs
│   └── AccountController.cs          # Login/Auth
├── Models/
│   ├── Produto.cs                    # ⚠️ Mapeamento com ERRO (linhas 53-57)
│   ├── ProdutoDTO.cs
│   ├── Pedido.cs
│   ├── Pessoa.cs
│   └── ... (outros models)
├── Services/
│   ├── ProdutosService.cs
│   ├── PedidosService.cs
│   └── ... (outros services)
├── Context/
│   └── AppDbContext.cs               # Entity Framework DbContext
├── Program.cs                        # Configuração da aplicação
└── appsettings.json                  # Connection string
```

### Controllers Principais

#### ProdutosConstroller.cs

```csharp
// GET: api/Produtos
[HttpGet]
[AllowAnonymous]
public async Task<ActionResult<IEnumerable<ProdutoDTO>>> GetProdutos()

// GET: api/Produtos/{id}
[HttpGet("{id}")]
public async Task<ActionResult<Produto>> GetProduto(long id)

// POST: api/Produtos
[HttpPost]
public async Task<ActionResult<Produto>> PostProduto(Produto produto)
// ⚠️ Retorna texto simples em erro: "Erro ao criar produto"
// ⚠️ Erro real está no console: Console.WriteLine($"Erro: {ex.Message}");

// PUT: api/Produtos/{id}
[HttpPut("{id}")]
public async Task<IActionResult> PutProduto(long id, Produto produto)

// DELETE: api/Produtos/{id}
[HttpDelete("{id}")]
public async Task<IActionResult> DeleteProduto(long id)
```

#### APIs de Classificação (todas com [AllowAnonymous])

```csharp
// GET: api/ProdutoSegmentos
// GET: api/ProdutoMarcas
// GET: api/ProdutoModelos
// GET: api/ProdutoGrupos
// GET: api/ProdutoTags
```

### ⚠️ PROBLEMA CRÍTICO NO MODEL

**Arquivo:** `Models/Produto.cs` (linhas 53-57)

**ERRO:**
```csharp
[Column("MARCA")]        // ❌ Esta coluna NÃO existe no banco!
public int? Marca { get; set; }

[Column("MODELO")]       // ❌ Esta coluna NÃO existe no banco!
public int? Modelo { get; set; }
```

**CORRETO (colunas reais do banco):**
```csharp
[Column("ID_MARCA")]     // ✅ Existe
public int? IdMarca { get; set; }

[Column("ID_MODELO")]    // ✅ Existe
public int? IdModelo { get; set; }

[Column("ID_GRUPO")]     // ✅ Existe (faltando no model)
public int? IdGrupo { get; set; }

[Column("ID_TAG")]       // ✅ Existe (faltando no model)
public int? IdTag { get; set; }

[Column("PRECO_CUSTO")]  // ✅ Existe (faltando no model)
public decimal? PrecoCusto { get; set; }
```

**Este erro causa o 500 Internal Server Error ao tentar criar produtos!**

---

## 💾 Banco de Dados - SQL Server

### Database: `allmoove`

### Tabelas Principais

#### PESSOA
```
Armazena todos os usuários do sistema (Assistências, Distribuidores, Entregadores)
Relacionamento com PESSOA_PAPEL define o tipo de usuário
```

**Colunas principais:**
- ID (bigint, PK)
- NOME (varchar)
- CPFCNPJ (varchar, unique)
- EMAIL (varchar)
- SITUACAO_REGISTRO (varchar)

#### PESSOA_PAPEL
```
Define os papéis/perfis de cada pessoa
```

**ID_PAPEL:**
- 1 = Assistência Técnica
- 2 = Entregador
- 3 = Admin
- 4 = Distribuidor

#### PRODUTO

**Estrutura Completa (29 colunas):**

```sql
ID                              bigint      PK
EMPRESA                         int
ESTABELECIMENTO                 int
CODIGO                          varchar
DATA_HORA_CRICAO_REGISTRO       datetime    -- ⚠️ Typo: "CRICAO" sem segundo "A"
DATA_HORA_ALTERACAO_REGISTRO    datetime
USUARIO_CRIACAO                 varchar
USUARIO_ALTERACAO               varchar
SITUACAO_REGISTRO               varchar
ID_DISTRIBUIDOR                 bigint      FK → PESSOA.ID
ID_SEGMENTO                     int         FK → PRODUTO_SEGMENTO.ID
ID_MARCA                        int         FK → PRODUTO_MARCA.ID
ID_MODELO                       int         FK → PRODUTO_MODELO.ID
ID_GRUPO                        int         FK → PRODUTO_GRUPO.ID
ID_TAG                          int         FK → PRODUTO_TAG.ID
NOME                            varchar(100)
DESCRICAO                       varchar(1000)
SKU                             varchar(50)
EAN                             varchar(50)
POSICAO                         varchar(50)
SITUACAO                        varchar(50)
PRECO_CUSTO                     numeric
PRECO_VENDA_PIX                 numeric
PRECO_VENDA_DEBITO              numeric
PRECO_VENDA_CREDITO             numeric
PRECO_VENDA_BOLETO              numeric
QUANTIDADE                      numeric
QUANTIDADE_ESTOQUE_MINIMO       numeric
FRETE_GRATIS                    bit
IMAGEM                          varchar(500)
```

#### PRODUTO_SEGMENTO (Classificação)
```sql
ID                  bigint      PK
NOME                varchar(50)
CODIGO              varchar(50)
SITUACAO            varchar(50)
EMPRESA             int
ESTABELECIMENTO     int
...campos de auditoria
```

**Exemplos:** Celulares, Notebooks, Acessórios, Telas

#### PRODUTO_MARCA (Classificação)
```sql
ID                  bigint      PK
NOME                varchar(50)
CODIGO              varchar(50)
ID_SEGMENTO         int         FK → PRODUTO_SEGMENTO.ID
SITUACAO            varchar(50)
...
```

**Exemplos:** Apple, Samsung, Motorola

**Relacionamento:** Marca → Segmento (muitos para um)

#### PRODUTO_MODELO (Classificação)
```sql
ID                  bigint      PK
NOME                varchar(50)
CODIGO              varchar(50)
ID_MARCA            int         FK → PRODUTO_MARCA.ID
SITUACAO            varchar(50)
...
```

**Exemplos:** iPhone 14 Pro, Galaxy S23, Moto G

**Relacionamento:** Modelo → Marca (muitos para um)

#### PRODUTO_GRUPO (Classificação)
```sql
ID                  bigint      PK
NOME                varchar(50)
CODIGO              varchar(50)
SITUACAO            varchar(50)
...
```

**Exemplos:** Telas, Placas, Baterias, Acessórios

**Independente** (sem relacionamento com outras tabelas)

#### PRODUTO_TAG (Classificação)
```sql
ID                  bigint      PK
NOME                varchar(50)
CODIGO              varchar(50)
SITUACAO            varchar(50)
...
```

**Exemplos:** Original, Compatível, Premium, Promoção

**Independente** (sem relacionamento com outras tabelas)

#### PEDIDO
```sql
ID                              bigint      PK
ID_PESSOA                       bigint      FK → PESSOA.ID (Assistência)
ID_DISTRIBUIDOR                 bigint      FK → PESSOA.ID (Distribuidor)
DATA_PEDIDO                     datetime
STATUS                          varchar
VALOR_TOTAL                     numeric
CODIGO_RASTREIO                 varchar
TIPO_ENTREGA                    varchar     -- 'Normal' ou 'Urgente'
...
```

#### PEDIDO_ITEM
```sql
ID                  bigint      PK
ID_PEDIDO           bigint      FK → PEDIDO.ID
ID_PRODUTO          bigint      FK → PRODUTO.ID
QUANTIDADE          numeric
PRECO_UNITARIO      numeric
SUBTOTAL            numeric
...
```

### Hierarquia de Classificação

```
PRODUTO_SEGMENTO (ex: Celulares)
    ↓ 1:N
PRODUTO_MARCA (ex: Apple)
    ↓ 1:N
PRODUTO_MODELO (ex: iPhone 14 Pro)

PRODUTO_GRUPO (ex: Telas) ← Independente
PRODUTO_TAG (ex: Original) ← Independente
```

---

## 🔌 Fluxos de APIs

### Autenticação

**Endpoint:** `POST /api/account/loginuser`

**Request:**
```json
{
  "email": "distribuidor@example.com",
  "password": "senha123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1...",
  "expiration": "2025-10-29T14:00:00Z",
  "email": "distribuidor@example.com",
  "idPessoa": 20,
  "idDistribuidor": 20
}
```

**localStorage após login:**
- `token` → JWT token
- `email` → Email do usuário
- `idPessoa` → ID na tabela PESSOA
- `idDistribuidor` → ID do distribuidor (se for distribuidor)
- `expiration` → Data de expiração do token

### Classificação de Produtos (5 APIs)

#### 1. Segmentos
```
GET /api/ProdutoSegmentos
Auth: ❌ Não requer (AllowAnonymous)
```

**Response:**
```json
[
  {
    "id": 1,
    "nome": "Celulares",
    "codigo": "CEL",
    "situacao": "ATIVO"
  }
]
```

#### 2. Marcas
```
GET /api/ProdutoMarcas
Auth: ❌ Não requer
```

**Response:**
```json
[
  {
    "id": 1,
    "nome": "Apple",
    "codigo": "APPL",
    "idSegmento": 1,
    "situacao": "ATIVO"
  }
]
```

#### 3. Modelos
```
GET /api/ProdutoModelos
Auth: ❌ Não requer
```

**Response:**
```json
[
  {
    "id": 4,
    "nome": "iPhone 16 Pro 128GB",
    "codigo": "IP16PRO128",
    "idMarca": 1,
    "situacao": "ATIVO"
  }
]
```

#### 4. Grupos
```
GET /api/ProdutoGrupos
Auth: ❌ Não requer
```

#### 5. Tags
```
GET /api/ProdutoTags
Auth: ❌ Não requer
```

### CRUD de Produtos

#### Criar Produto

```
POST /api/Produtos
Auth: ✅ Bearer Token obrigatório
Content-Type: application/json
```

**Request Body:**
```json
{
  "nome": "Tela iPhone 16 Pro",
  "sku": "TIP16PRO001",
  "descricao": "Tela OLED original",
  "ean": "7891234567890",
  "quantidade": 25,
  "precoCusto": 899.00,
  "precoVenda": 1299.00,
  "posicao": "A1-B2-C3",
  "imagem": "https://exemplo.com/imagem.jpg",
  "idSegmento": 1,
  "idMarca": 1,
  "idModelo": 4,
  "idGrupo": 1,
  "idTag": 1,
  "idDistribuidor": 20,
  "empresa": 1,
  "estabelecimento": 1,
  "situacaoRegistro": "ATIVO",
  "situacao": "ATIVO"
}
```

**Response (201 Created):**
```json
{
  "id": 123,
  "nome": "Tela iPhone 16 Pro",
  "sku": "TIP16PRO001",
  ...
}
```

**Response (500 Internal Server Error) - ERRO ATUAL:**
```
Erro ao criar produto
```
(Mensagem real está no console do backend)

#### Listar Produtos

```
GET /api/Produtos
Auth: ❌ Não requer
```

**Response:**
```json
[
  {
    "id": 1,
    "nome": "iPhone 12 Pro Max",
    "price": 5499.90,
    "imagem": "https://...",
    "sku": "IP12PROMAX",
    "descricao": "Categoria: celulares",
    "estoque": 10,
    "idDistribuidor": 20,
    "idSegmento": 1,
    "categoria": "celulares",
    "fornecedor": "Nome do Distribuidor",
    "freteGratis": true
  }
]
```

#### Buscar Produto por ID

```
GET /api/Produtos/{id}
Auth: ✅ Bearer Token
```

#### Atualizar Produto

```
PUT /api/Produtos/{id}
Auth: ✅ Bearer Token
Content-Type: application/json
```

#### Deletar Produto

```
DELETE /api/Produtos/{id}
Auth: ✅ Bearer Token
```

---

## ⚠️ Problemas Conhecidos e Soluções

### Problema 1: Erro 500 ao Criar Produto

**Status:** 🔴 **CRÍTICO - EM ANDAMENTO**

**Sintomas:**
```
POST /api/Produtos → 500 Internal Server Error
Response: "Erro ao criar produto"
```

**Causa Raiz:**
O Model `Produto.cs` está mapeando para colunas que **não existem** no banco:

```csharp
// ❌ ERRADO (Produto.cs linhas 53-57)
[Column("MARCA")]
public int? Marca { get; set; }

[Column("MODELO")]
public int? Modelo { get; set; }
```

**Colunas Reais do Banco:**
- `ID_MARCA` (não `MARCA`)
- `ID_MODELO` (não `MODELO`)
- `ID_GRUPO` (faltando no model)
- `ID_TAG` (faltando no model)
- `PRECO_CUSTO` (faltando no model)

**Solução:**

1. **Frontend (✅ JÁ CORRIGIDO):**
   - `estoqueServices.js` agora envia `idMarca`, `idModelo`, `idGrupo`, `idTag`, `precoCusto`

2. **Backend (❌ PENDENTE - CORREÇÃO NECESSÁRIA):**
   - Corrigir `Models/Produto.cs` para mapear as colunas corretas
   - Adicionar os campos faltantes

**Código Correto para Produto.cs:**

```csharp
[Column("ID_MARCA")]
public int? IdMarca { get; set; }

[Column("ID_MODELO")]
public int? IdModelo { get; set; }

[Column("ID_GRUPO")]
public int? IdGrupo { get; set; }

[Column("ID_TAG")]
public int? IdTag { get; set; }

[Column("PRECO_CUSTO")]
public decimal? PrecoCusto { get; set; }
```

**Próximos Passos:**
1. Editar `C:\devtemp\allmoove1_2025.10.11_10.57\allmoove1\allmoove1\AllmooveApi\Models\Produto.cs`
2. Substituir linhas 53-57 pelo código correto acima
3. Adicionar os campos faltantes (ID_GRUPO, ID_TAG, PRECO_CUSTO)
4. Reiniciar o backend
5. Testar cadastro de produto novamente

---

### Problema 2: Triggers Causando Erro 500 (RESOLVIDO)

**Status:** ✅ **RESOLVIDO PARA PEDIDO E PEDIDO_ITEM**

**Observação:** Verificamos que a tabela `PRODUTO` **não tem triggers**, então não precisa da solução abaixo.

**Solução Aplicada (para referência):**
```csharp
// AppDbContext.cs (linhas 60-66)
modelBuilder.Entity<Pedido>()
    .ToTable(tb => tb.UseSqlOutputClause(false));

modelBuilder.Entity<PedidoItem>()
    .ToTable(tb => tb.UseSqlOutputClause(false));
```

---

### Problema 3: Nome da Coluna com Typo no Banco

**Status:** ⚠️ **CONHECIDO - NÃO CRÍTICO**

**Detalhe:**
- Coluna no banco: `DATA_HORA_CRICAO_REGISTRO` (falta o segundo "A")
- Model correto: `[Column("DATA_HORA_CRICAO_REGISTRO")]` ✅

O Model `Produto.cs` já está correto na linha 24, então **não precisa corrigir**.

---

## 📊 Estado Atual do Desenvolvimento

### ✅ Funcionalidades Completas

#### Assistência Técnica
- ✅ Login/Autenticação
- ✅ Dashboard com busca de produtos
- ✅ Loja com 48 produtos (products.json)
- ✅ Carrinho de compras com Context API
- ✅ Seleção de método de entrega (Normal/Urgente)
- ✅ Tela de pagamento (PIX/Cartão - UI apenas)
- ✅ Confirmação de pedido com código de entrega

#### Distribuidor
- ✅ Login/Autenticação
- ✅ Dashboard com estatísticas visuais
- ✅ Listagem de pedidos recebidos
- ✅ Timeline de status dos pedidos
- ✅ **Formulário completo de cadastro de produtos** (14 campos)
- ✅ Carregamento automático de dropdowns de classificação
- ✅ Validação de campos obrigatórios
- ✅ Preview de imagem de produtos

#### Backend
- ✅ 30+ endpoints REST funcionando
- ✅ JWT Authentication
- ✅ CRUD completo de Produtos
- ✅ APIs de classificação (Segmentos, Marcas, Modelos, Grupos, Tags)
- ✅ CRUD de Pedidos
- ✅ Views otimizadas para dashboards

---

### 🚧 Em Desenvolvimento

#### Cadastro de Produtos (Distribuidor)
- 🔴 **BLOQUEADO:** Erro 500 ao tentar criar produto
- 🔧 **Causa:** Mapeamento incorreto no `Produto.cs`
- 📝 **Status:** Frontend corrigido, aguardando correção do backend

---

### ❌ Não Implementado

#### Entregador
- ❌ Interface do entregador (rota `/entregador` só mostra "oi")
- ❌ Sistema de rastreamento de entregas
- ❌ Notificações de pedidos para entregadores

#### Assistência Técnica
- ❌ Histórico completo de pedidos (dashboard mostra "0" pedidos)
- ❌ Integração real com gateway de pagamento
- ❌ Validação de CEP/endereço via API externa

#### Distribuidor
- ❌ Aceitar/Rejeitar pedidos (botões existem mas não funcionam)
- ❌ Editar produtos do estoque
- ❌ Excluir produtos do estoque
- ❌ Relatórios e gráficos de vendas

---

## 🔐 Segurança

### Autenticação
- JWT Bearer Token
- Token armazenado em `localStorage`
- Expiração configurável
- Middleware de autenticação no backend

### Autorização
- Endpoints protegidos com `[Authorize]`
- APIs de classificação públicas com `[AllowAnonymous]`
- Validação de papéis via `PESSOA_PAPEL`

### CORS
- Configurado no backend para aceitar requests do frontend
- Headers permitidos: Authorization, Content-Type

---

## 📝 Documentação Complementar

### Arquivos de Documentação Criados

1. **CADASTRO_PRODUTOS_COMPLETO.md**
   - Implementação completa do formulário de produtos
   - 14 campos em 4 seções
   - Validações e fluxos

2. **API_CLASSIFICACAO_PRODUTOS.md**
   - Estrutura das 5 APIs de classificação
   - Relacionamentos entre tabelas
   - Como testar cada endpoint

3. **APIS_UTILIZADAS_CADASTRO_PRODUTO.md**
   - Detalhamento das 6 APIs usadas no cadastro
   - Request/Response de cada uma
   - Campos obrigatórios e opcionais

4. **DEBUG_500_ERRO_CADASTRO_PRODUTO.md**
   - Guia completo de troubleshooting
   - 5 possíveis causas do erro 500
   - 4 métodos para descobrir o erro
   - Checklist de validação SQL

5. **PROJETO_ALLMOOVE_OVERVIEW.md** (este arquivo)
   - Visão geral completa do projeto
   - Arquitetura, estrutura, APIs
   - Problemas conhecidos e soluções

---

## 🚀 Comandos Úteis

### Frontend
```bash
# Iniciar desenvolvimento
cd "C:\Users\Gustavo Marques\Documents\Tela inicial Allmoove\my-app"
npm run dev
# Acessa: http://localhost:5173

# Build de produção
npm run build

# Lint
npm run lint
```

### Backend
```bash
# Navegar para o projeto
cd "C:\devtemp\allmoove1_2025.10.11_10.57\allmoove1\allmoove1\AllmooveApi"

# Rodar backend
dotnet run
# Acessa: https://localhost:44370
# Swagger: https://localhost:44370/swagger/index.html

# Build
dotnet build

# Clean
dotnet clean
```

### Banco de Dados
```sql
-- Conexão
USE allmoove;

-- Ver estrutura de uma tabela
EXEC sp_help 'PRODUTO';

-- Ou via INFORMATION_SCHEMA
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'PRODUTO'
ORDER BY ORDINAL_POSITION;

-- Ver triggers em uma tabela
SELECT t.name AS TriggerName, m.definition
FROM sys.triggers t
INNER JOIN sys.sql_modules m ON t.object_id = m.object_id
WHERE OBJECT_NAME(t.parent_id) = 'PRODUTO';
```

---

## 📞 Próximas Ações Recomendadas

### Prioridade 1 - URGENTE
1. ✅ Corrigir `Produto.cs` no backend (linhas 53-57)
   - Substituir `MARCA` → `ID_MARCA`
   - Substituir `MODELO` → `ID_MODELO`
   - Adicionar `ID_GRUPO`, `ID_TAG`, `PRECO_CUSTO`

2. ✅ Testar cadastro de produto após correção

### Prioridade 2 - IMPORTANTE
3. Implementar edição de produtos no estoque
4. Implementar exclusão de produtos no estoque
5. Adicionar funcionalidade "Aceitar/Rejeitar Pedido" no dashboard do distribuidor

### Prioridade 3 - MELHORIAS
6. Implementar histórico de pedidos para Assistência Técnica
7. Criar interface completa do Entregador
8. Adicionar paginação na listagem de produtos
9. Implementar filtros avançados de produtos

---

**Última Atualização:** 28/10/2025 - 14:45h
**Desenvolvedor:** Gustavo Marques
**Assistente:** Claude Code (Anthropic)

---

## 🔖 Tags para Busca Rápida

`#frontend` `#react` `#backend` `#aspnet` `#sqlserver` `#crud` `#distribuidor` `#estoque` `#produtos` `#erro500` `#bug` `#model` `#entityframework` `#api` `#jwt` `#authentication` `#allmoove`
