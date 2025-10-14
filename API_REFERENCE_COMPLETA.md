# 📚 Referência Completa de APIs - AllMoove Backend

> **Gerado automaticamente do Swagger** - `https://localhost:44370/swagger/v1/swagger.json`
> **Data:** 2025-10-14
> **Total de Recursos:** 21
> **Total de Endpoints:** 110

---

## 🎯 Índice por Recurso

1. [Account](#account) - Autenticação
2. [Contas](#contas) - Gerenciamento de contas
3. [Contatos](#contatos) - Contatos de pessoas
4. [Dashboard](#dashboard) - Dados do dashboard
5. [Distribuidor](#distribuidor) - **APIs do Distribuidor** ⭐
6. [Documentos](#documentos) - Documentos de pessoas
7. [Enderecos](#enderecos) - Endereços de entrega
8. [Fornecedores](#fornecedores) - Lista de fornecedores
9. [PedidoGrupos](#pedidogrupos) - Grupos de pedidos
10. [PedidoItems](#pedidoitems) - Itens de pedidos
11. [PedidoTimelines](#pedidotimelines) - Histórico de pedidos
12. [Pedidos](#pedidos) - **Gerenciamento de Pedidos** ⭐
13. [PessoaPapeis](#pessoapapeis) - Papéis/Roles de usuários
14. [Pessoas](#pessoas) - Cadastro de pessoas
15. [ProdutoEscolhaCarrinho](#produtoescolhacarrinho) - Busca inteligente de produtos
16. [ProdutoGrupos](#produtogrupos) - Grupos de produtos
17. [ProdutoMarcas](#produtomarcas) - Marcas de produtos
18. [ProdutoModelos](#produtomodelos) - Modelos de produtos
19. [ProdutoSegmentos](#produtosegmentos) - Segmentos/Categorias
20. [ProdutoTags](#produtotags) - Tags de produtos
21. [Produtos](#produtos) - **Catálogo de Produtos** ⭐

---

## 🔐 Account

**Autenticação e gerenciamento de usuários**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/Account/CreateUser` | Criar novo usuário |
| POST | `/api/Account/LoginUser` | Login (retorna JWT token) |

---

## 💳 Contas

**Gerenciamento de contas financeiras/bancárias**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/Contas` | Listar todas as contas |
| POST | `/api/Contas` | Criar nova conta |
| GET | `/api/Contas/ContasPorNome` | Buscar contas por nome |
| GET | `/api/Contas/{id}` | Buscar conta específica |
| PUT | `/api/Contas/{id}` | Atualizar conta |
| DELETE | `/api/Contas/{id}` | Excluir conta |

---

## 📞 Contatos

**Contatos (telefone, email, etc.) de pessoas**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/Contatos` | Listar todos os contatos |
| POST | `/api/Contatos` | Criar novo contato |
| GET | `/api/Contatos/{id}` | Buscar contato específico |
| PUT | `/api/Contatos/{id}` | Atualizar contato |
| DELETE | `/api/Contatos/{id}` | Excluir contato |
| GET | `/api/Contatos/pessoa/{id}` | Listar contatos de uma pessoa |

---

## 📊 Dashboard

**Dados agregados para dashboards**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/Dashboard/{papel}/{id}` | Obter dados do dashboard por papel (assistencia, distribuidor, entregador) |

**Exemplo:**
```
GET /api/Dashboard/distribuidor/42
GET /api/Dashboard/assistencia/15
GET /api/Dashboard/entregador/8
```

---

## 🏢 Distribuidor

**APIs específicas do distribuidor** ⭐

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/Distribuidor/consulta` | Consultar distribuidores (com filtros) |
| GET | `/api/Distribuidor/favoritos/{idSegmento}/{idAssistencia}` | Listar distribuidores favoritos por segmento |
| GET | `/api/Distribuidor/ultimospedidos/{idAssistencia}` | Últimos pedidos de uma assistência |

**Query Parameters para `/consulta`:**
- `idSegmento` - Filtrar por segmento/categoria
- Outros filtros disponíveis

---

## 📄 Documentos

**Documentos (CPF, CNPJ, RG, etc.) de pessoas**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/Documentos` | Listar todos os documentos |
| POST | `/api/Documentos` | Criar novo documento |
| GET | `/api/Documentos/{id}` | Buscar documento específico |
| PUT | `/api/Documentos/{id}` | Atualizar documento |
| DELETE | `/api/Documentos/{id}` | Excluir documento |
| GET | `/api/Documentos/pessoa/{id}` | Listar documentos de uma pessoa |

---

## 📍 Enderecos

**Endereços de entrega e cobrança**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/Enderecos` | Listar todos os endereços |
| POST | `/api/Enderecos` | Criar novo endereço |
| GET | `/api/Enderecos/{id}` | Buscar endereço específico |
| PUT | `/api/Enderecos/{id}` | Atualizar endereço |
| DELETE | `/api/Enderecos/{id}` | Excluir endereço |
| GET | `/api/Enderecos/pessoa/{id}` | Listar endereços de uma pessoa |

**Modelo:**
```json
{
  "cep": "01310-100",
  "logradouro": "Av. Paulista",
  "numero": "1578",
  "complemento": "Sala 501",
  "bairro": "Bela Vista",
  "cidade": "São Paulo",
  "estado": "SP",
  "pessoaId": 42
}
```

---

## 🏭 Fornecedores

**Lista de fornecedores/distribuidores**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/Fornecedores` | Listar todos os fornecedores únicos |

**Retorno:** Array de strings com nomes dos fornecedores

---

## 📦 PedidoGrupos

**Agrupamento de pedidos**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/PedidoGrupos` | Listar todos os grupos |
| POST | `/api/PedidoGrupos` | Criar novo grupo |
| GET | `/api/PedidoGrupos/{id}` | Buscar grupo específico |
| PUT | `/api/PedidoGrupos/{id}` | Atualizar grupo |
| DELETE | `/api/PedidoGrupos/{id}` | Excluir grupo |

---

## 📋 PedidoItems

**Itens de pedidos (produtos no pedido)**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/PedidoItems` | Listar todos os itens |
| POST | `/api/PedidoItems` | Criar novo item |
| GET | `/api/PedidoItems/{id}` | Buscar item específico |
| PUT | `/api/PedidoItems/{id}` | Atualizar item |
| DELETE | `/api/PedidoItems/{id}` | Excluir item |
| GET | `/api/PedidoItems/pedido/{id}` | Listar itens de um pedido |
| PUT | `/api/PedidoItems/setdevolucao/{id}` | Marcar item como devolução |

---

## 📅 PedidoTimelines

**Histórico e timeline de pedidos**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/PedidoTimelines` | Listar todos os registros |
| POST | `/api/PedidoTimelines` | Criar novo registro |
| GET | `/api/PedidoTimelines/{id}` | Buscar registro específico |
| PUT | `/api/PedidoTimelines/{id}` | Atualizar registro |
| DELETE | `/api/PedidoTimelines/{id}` | Excluir registro |
| GET | `/api/PedidoTimelines/pedido/{id}` | Listar histórico de um pedido |

---

## 🛒 Pedidos

**Gerenciamento completo de pedidos** ⭐

### Endpoints CRUD Básicos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/Pedidos` | Listar todos os pedidos |
| POST | `/api/Pedidos` | Criar novo pedido |
| GET | `/api/Pedidos/{id}` | Buscar pedido específico |
| PUT | `/api/Pedidos/{id}` | Atualizar pedido |
| DELETE | `/api/Pedidos/{id}` | Excluir/Cancelar pedido |

### Endpoints por Papel (Role)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/Pedidos/assistencia/{id}` | Pedidos da assistência técnica |
| GET | `/api/Pedidos/distribuidor/{id}` | Pedidos do distribuidor |
| GET | `/api/Pedidos/entregador/{id}` | Pedidos do entregador |

### Endpoints de Relatórios e Consultas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/Pedidos/periodo` | Pedidos por período (query params: dataInicio, dataFim) |
| GET | `/api/Pedidos/ultimos-produtos/{idAssistencia}` | Últimos produtos pedidos por assistência |
| GET | `/api/Pedidos/ultimos-produtos/{idAssistencia}/segmento/{idSegmento}` | Últimos produtos filtrados por segmento |

### Endpoints de Atualização de Status

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| PUT | `/api/Pedidos/setsituacao/{id}` | Atualizar situação geral do pedido |
| PUT | `/api/Pedidos/setcoleta/{id}` | Marcar como coletado |
| PUT | `/api/Pedidos/setentrega/{id}` | Marcar como entregue |
| PUT | `/api/Pedidos/setdevolucao/{id}` | Marcar como devolvido |

**Status válidos:** `Aguardando Aceite`, `Aceito`, `Em Separação`, `Aguardando Retirada`, `Em Trânsito`, `Entregue ao Cliente`, `Concluído`, `Cancelado`, `Recusado`

---

## 👥 PessoaPapeis

**Papéis/Roles de usuários** (Assistência, Distribuidor, Entregador, etc.)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/PessoaPapeis` | Listar todos os papéis |
| POST | `/api/PessoaPapeis` | Atribuir novo papel a pessoa |
| GET | `/api/PessoaPapeis/{id}` | Buscar papel específico |
| PUT | `/api/PessoaPapeis/{id}` | Atualizar papel |
| DELETE | `/api/PessoaPapeis/{id}` | Remover papel |
| GET | `/api/PessoaPapeis/pessoa/{id}` | Listar papéis de uma pessoa |

---

## 👤 Pessoas

**Cadastro de pessoas (assistências, distribuidores, entregadores)**

### CRUD Básico

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/Pessoas` | Listar todas as pessoas |
| POST | `/api/Pessoas` | Criar nova pessoa |
| GET | `/api/Pessoas/{id}` | Buscar pessoa específica |
| PUT | `/api/Pessoas/{id}` | Atualizar pessoa |
| DELETE | `/api/Pessoas/{id}` | Excluir pessoa |

### Consultas Específicas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/Pessoas/GetByNome` | Buscar por nome (query param: nome) |
| GET | `/api/Pessoas/GetpessoaByEmail` | Buscar por email (query param: email) |
| GET | `/api/Pessoas/GetpessoaByLogin` | Buscar por login (query param: login) |
| GET | `/api/Pessoas/GetByCpfCnpj` | Buscar por CPF/CNPJ (query param: cpfCnpj) |

---

## 🔍 ProdutoEscolhaCarrinho

**Busca inteligente de produtos para adicionar ao carrinho**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/ProdutoEscolhaCarrinho` | Busca multi-campo (query param: campoConsulta) |

**Query Parameters:**
- `campoConsulta` - Busca em nome, SKU, EAN, marca, modelo, descrição

**Retorno:** Lista de produtos com informações completas (grupo, tag, segmento, marca, modelo, distribuidor)

---

## 🏷️ ProdutoGrupos

**Grupos/Famílias de produtos**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/ProdutoGrupos` | Listar todos os grupos |
| POST | `/api/ProdutoGrupos` | Criar novo grupo |
| GET | `/api/ProdutoGrupos/{id}` | Buscar grupo específico |
| PUT | `/api/ProdutoGrupos/{id}` | Atualizar grupo |
| DELETE | `/api/ProdutoGrupos/{id}` | Excluir grupo |

---

## 🏭 ProdutoMarcas

**Marcas de produtos**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/ProdutoMarcas` | Listar todas as marcas |
| POST | `/api/ProdutoMarcas` | Criar nova marca |
| GET | `/api/ProdutoMarcas/{id}` | Buscar marca específica |
| PUT | `/api/ProdutoMarcas/{id}` | Atualizar marca |
| DELETE | `/api/ProdutoMarcas/{id}` | Excluir marca |

---

## 📱 ProdutoModelos

**Modelos de produtos**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/ProdutoModelos` | Listar todos os modelos |
| POST | `/api/ProdutoModelos` | Criar novo modelo |
| GET | `/api/ProdutoModelos/{id}` | Buscar modelo específico |
| PUT | `/api/ProdutoModelos/{id}` | Atualizar modelo |
| DELETE | `/api/ProdutoModelos/{id}` | Excluir modelo |

---

## 📂 ProdutoSegmentos

**Segmentos/Categorias de produtos**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/ProdutoSegmentos` | Listar todos os segmentos |
| POST | `/api/ProdutoSegmentos` | Criar novo segmento |
| GET | `/api/ProdutoSegmentos/{id}` | Buscar segmento específico |
| PUT | `/api/ProdutoSegmentos/{id}` | Atualizar segmento |
| DELETE | `/api/ProdutoSegmentos/{id}` | Excluir segmento |

---

## 🏷️ ProdutoTags

**Tags de produtos**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/ProdutoTags` | Listar todas as tags |
| POST | `/api/ProdutoTags` | Criar nova tag |
| GET | `/api/ProdutoTags/{id}` | Buscar tag específica |
| PUT | `/api/ProdutoTags/{id}` | Atualizar tag |
| DELETE | `/api/ProdutoTags/{id}` | Excluir tag |

---

## 📦 Produtos

**Catálogo de produtos** ⭐

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/Produtos` | Listar todos os produtos (suporta query params) |
| POST | `/api/Produtos` | Criar novo produto |
| GET | `/api/Produtos/{id}` | Buscar produto específico |
| PUT | `/api/Produtos/{id}` | Atualizar produto |
| DELETE | `/api/Produtos/{id}` | Excluir produto |

**Query Parameters suportados em GET `/api/Produtos`:**
- `categoria` - Filtrar por categoria
- `fornecedor` - Filtrar por fornecedor
- `idSegmento` - Filtrar por segmento
- `idGrupo` - Filtrar por grupo
- `idMarca` - Filtrar por marca

---

## 🔒 Autenticação

Todos os endpoints (exceto `/api/Account/LoginUser` e `/api/Account/CreateUser`) requerem autenticação via **Bearer Token JWT**.

**Header obrigatório:**
```
Authorization: Bearer {token}
```

**Como obter o token:**
```bash
POST /api/Account/LoginUser
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiration": "2025-10-15T10:30:00Z"
}
```

**Armazenar no localStorage:**
```javascript
localStorage.setItem('token', response.token);
localStorage.setItem('expiration', response.expiration);
```

---

## 📚 Recursos Adicionais

- **Swagger UI:** `https://localhost:44370/swagger`
- **Swagger JSON:** `https://localhost:44370/swagger/v1/swagger.json`
- **Base URL:** `https://localhost:44370/`

---

**Última atualização:** 2025-10-14
**Versão da API:** v1
