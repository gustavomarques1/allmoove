# 📡 API AllMoove - Mapeamento Completo

**Data da Análise:** 2025-10-12
**Backend:** https://localhost:44370
**Total de Endpoints:** 100+

---

## 🔐 1. Autenticação (/api/Account)

| Endpoint | Método | Status | Usado no Frontend |
|----------|--------|--------|-------------------|
| `/api/Account/CreateUser` | POST | ✅ Disponível | ⚠️ Swagger only |
| `/api/Account/LoginUser` | POST | ✅ Disponível | ✅ `useAuth.js:71` |

**Schemas:**
```typescript
LoginModel {
  email: string (email, required)
  password: string (password, required, min: 10, max: 20)
}

RegisterModel {
  email: string (email, required)
  password: string (password, required)
  confirmPassword?: string (password)
}

UserToken {
  token: string
  expiration: datetime
}
```

---

## 👥 2. Pessoas (/api/Pessoas)

| Endpoint | Método | Status | Usado no Frontend |
|----------|--------|--------|-------------------|
| `/api/Pessoas` | GET | ✅ Disponível | ✅ `useAuth.js:85` |
| `/api/Pessoas/{id}` | GET | ✅ Disponível | ❌ Não usado |
| `/api/Pessoas` | POST | ✅ Disponível | ⚠️ Swagger only |
| `/api/Pessoas/{id}` | PUT | ✅ Disponível | ❌ Não usado |
| `/api/Pessoas/{id}` | DELETE | ✅ Disponível | ❌ Não usado |
| `/api/Pessoas/GetByNome?nome={nome}` | GET | ✅ Disponível | ❌ Não usado |
| `/api/Pessoas/GetpessoaByEmail?emailTelefone={email}` | GET | ✅ Disponível | ❌ Não usado |
| `/api/Pessoas/GetpessoaByLogin?nome={login}` | GET | ✅ Disponível | ❌ Não usado |
| `/api/Pessoas/GetByCpfCnpj?cpfCnpj={cpf}` | GET | ✅ Disponível | ❌ Não usado |

**Schema Pessoa:**
```typescript
Pessoa {
  id: number
  empresa?: number
  estabelecimento?: number
  codigo?: string (max: 50)
  tipo?: string (max: 50)  // "ASSISTENCIA_TECNICA", "DISTRIBUIDOR", "ENTREGADOR"
  nome?: string (max: 100)
  cpfCnpj?: string (max: 30)
  dataNascimento?: datetime
  contatoPreferido?: number
  enderecoPreferido?: number
  login?: string (max: 20)
  senha?: string (max: 20)
  situacao?: string (max: 50)  // "ATIVO", "INATIVO"
  situacaoRegistro?: string (max: 50)
  dataHoraCriacaoRegistro?: datetime
  dataHoraAlteracaoRegistro?: datetime
  usuarioCriacao?: string
  usuarioAlteracao?: string
}
```

---

## 📦 3. Pedidos (/api/Pedidos)

| Endpoint | Método | Status | Usado no Frontend |
|----------|--------|--------|-------------------|
| `/api/Pedidos` | GET | ✅ Disponível | ❌ Não usado |
| `/api/Pedidos/{id}` | GET | ✅ Disponível | ✅ `pedidosServices.js:190` |
| `/api/Pedidos` | POST | ✅ Disponível | ✅ `pedidosServices.js:148` |
| `/api/Pedidos/{id}` | PUT | ✅ Disponível | ❌ Não usado |
| `/api/Pedidos/{id}` | DELETE | ✅ Disponível | ✅ `pedidosServices.js:286` |
| `/api/Pedidos/assistencia/{id}` | GET | ✅ Disponível | ✅ `pedidosServices.js:75` |
| `/api/Pedidos/distribuidor/{id}` | GET | ✅ Disponível | ✅ `pedidosServices.js:32` |
| `/api/Pedidos/entregador/{id}` | GET | ✅ Disponível | ❌ **NOVO!** |
| `/api/Pedidos/periodo?inicio={date}&fim={date}` | GET | ✅ Disponível | ❌ **NOVO!** |
| `/api/Pedidos/setsituacao/{id}?codigo={situacao}` | PUT | ✅ Disponível | ⚠️ Parcial (pedidosServices.js:233) |
| `/api/Pedidos/setcoleta/{id}?codigo={codigo}` | PUT | ✅ Disponível | ❌ **NOVO!** |
| `/api/Pedidos/setentrega/{id}?codigo={codigo}` | PUT | ✅ Disponível | ❌ **NOVO!** |
| `/api/Pedidos/setdevolucao/{id}?codigo={codigo}` | PUT | ✅ Disponível | ❌ **NOVO!** |

**Schema Pedido:**
```typescript
Pedido {
  id: number
  empresa?: number
  estabelecimento?: number
  codigo?: string (max: 50)
  dataHoraConfirmacaoPedido?: datetime
  idDistribuidor?: number
  idPessoa?: number  // ID da Assistência Técnica
  idEntregador?: number
  idEnderecoColeta?: number
  idEnderecoEntrega?: number
  formaPagamento?: number
  codigoColeta?: string (max: 50)
  codigoEntrega?: string (max: 50)
  codigoDevolucao?: string (max: 50)
  dataHoraColeta?: datetime
  dataHoraEntrega?: datetime
  testePeca?: string (max: 50)
  testePecaConfirmacao?: string (max: 50)
  valorFrete?: number
  situacao?: string (max: 50)
  situacaoRegistro?: string
  dataHoraCriacaoRegistro?: datetime
}
```

---

## 🛒 4. Produtos (/api/Produtos)

| Endpoint | Método | Status | Usado no Frontend |
|----------|--------|--------|-------------------|
| `/api/Produtos` | GET | ✅ Disponível | ✅ `produtosServices.js:13` |
| `/api/Produtos/{id}` | GET | ✅ Disponível | ✅ `produtosServices.js:74` |
| `/api/Produtos` | POST | ✅ Disponível | ❌ Não usado |
| `/api/Produtos/{id}` | PUT | ✅ Disponível | ❌ Não usado |
| `/api/Produtos/{id}` | DELETE | ✅ Disponível | ❌ Não usado |

**Schema Produto:**
```typescript
Produto {
  id: number
  empresa?: number
  estabelecimento?: number
  codigo?: string (max: 50)
  idDistribuidor?: number
  idSegmento?: number
  idMarca?: number
  idModelo?: number
  idGrupo?: number
  idTag?: number
  nome?: string (max: 100)
  descricao?: string (max: 1000)
  sku?: string (max: 50)
  ean?: string (max: 50)
  posicao?: string (max: 50)
  situacao?: string (max: 50)
  precoCusto?: number
  precoVenda?: number
  quantidade?: number
}
```

---

## 🛍️ 5. Produto Escolha Carrinho (/api/ProdutoEscolhaCarrinho)

| Endpoint | Método | Status | Usado no Frontend |
|----------|--------|--------|-------------------|
| `/api/ProdutoEscolhaCarrinho?campoConsulta={texto}` | GET | ✅ Disponível | ❌ **NOVO!** Importante! |

**Schema ViewProdutoEscolhaCarrinho:**
```typescript
ViewProdutoEscolhaCarrinho {
  idDistribuidor?: number
  idSegmento?: number
  idMarca?: number
  idModelo?: number
  idGrupo?: number
  idTag?: number
  nome?: string
  descricao?: string
  sku?: string
  ean?: string
  posicao?: string
  situacao?: string
  precoCusto?: number
  precoVenda?: number
  quantidade?: number
  grupo?: string
  tag?: string
  segmento?: string
  marca?: string
  modelo?: string
  distribuidor?: string
  campoConsulta?: string  // Campo de busca
}
```

**⚠️ IMPORTANTE:** Este endpoint retorna produtos com informações completas de grupo, marca, modelo, etc. É ideal para o carrinho!

---

## 📊 6. Dashboard (/api/Dashboard)

| Endpoint | Método | Status | Usado no Frontend |
|----------|--------|--------|-------------------|
| `/api/Dashboard/{papel}/{id}` | GET | ✅ Disponível | ❌ **NOVO!** Importante! |

**Papéis válidos:** `ASSISTENCIA_TECNICA`, `DISTRIBUIDOR`, `ENTREGADOR`

**Schema DashboardResult:**
```typescript
DashboardResult {
  chave?: string
  valor?: string
  pagina?: string
  ordem: number
  posicaoLinha: number
  posicaoColuna: number
  fato?: string
}
```

**Exemplo de uso:**
```
GET /api/Dashboard/DISTRIBUIDOR/5
GET /api/Dashboard/ASSISTENCIA_TECNICA/10
```

---

## 🏢 7. Distribuidor (/api/Distribuidor)

| Endpoint | Método | Status | Usado no Frontend |
|----------|--------|--------|-------------------|
| `/api/Distribuidor/favoritos/{idSegmento}/{idAssistencia}` | GET | ✅ Disponível | ❌ **NOVO!** |
| `/api/Distribuidor/ultimospedidos/{idAssistencia}` | GET | ✅ Disponível | ❌ **NOVO!** |
| `/api/Distribuidor/consulta?idSegmento={id}` | GET | ✅ Disponível | ❌ **NOVO!** |

**Schemas:**
```typescript
ViewDistribuidorFavorito {
  idDistribuidor: number
  idAssistencia: number
  idSegmento: number
  nome?: string
  cpfCnpj?: string
}

ViewDistribuidorUltimosPedidos {
  idDistribuidor: number
  idAssistencia: number
  nome?: string
  cpfCnpj?: string
}

ViewDistribuidorConsulta {
  idDistribuidor: number
  idSegmento: number
  nome?: string
  cpfCnpj?: string
}
```

---

## 📍 8. Endereços (/api/Enderecos)

| Endpoint | Método | Status | Usado no Frontend |
|----------|--------|--------|-------------------|
| `/api/Enderecos` | GET | ✅ Disponível | ❌ Não usado |
| `/api/Enderecos/{id}` | GET | ✅ Disponível | ❌ Não usado |
| `/api/Enderecos` | POST | ✅ Disponível | ❌ **NOVO!** Importante! |
| `/api/Enderecos/{id}` | PUT | ✅ Disponível | ❌ **NOVO!** Importante! |
| `/api/Enderecos/{id}` | DELETE | ✅ Disponível | ❌ **NOVO!** Importante! |
| `/api/Enderecos/pessoa/{id}` | GET | ✅ Disponível | ❌ **NOVO!** Importante! |

**Schema Endereco:**
```typescript
Endereco {
  id: number
  empresa?: number
  estabelecimento?: number
  codigo?: string (max: 50)
  idPessoa?: number
  descricao?: string (max: 100)  // "Casa", "Trabalho", etc.
  logradouro?: string (max: 150)
  numero?: string (max: 20)
  complemento?: string (max: 150)
  bairro?: string (max: 150)
  cidade?: string (max: 150)
  estado?: string (max: 100)
  cep?: string (max: 20)
  situacao?: string (max: 50)
}
```

**⚠️ IMPORTANTE:** Use `/api/Enderecos/pessoa/{id}` para listar todos os endereços de uma pessoa!

---

## 📞 9. Contatos (/api/Contatos)

| Endpoint | Método | Status | Usado no Frontend |
|----------|--------|--------|-------------------|
| `/api/Contatos` | GET | ✅ Disponível | ❌ Não usado |
| `/api/Contatos/{id}` | GET | ✅ Disponível | ❌ Não usado |
| `/api/Contatos` | POST | ✅ Disponível | ❌ Não usado |
| `/api/Contatos/{id}` | PUT | ✅ Disponível | ❌ Não usado |
| `/api/Contatos/{id}` | DELETE | ✅ Disponível | ❌ Não usado |
| `/api/Contatos/pessoa/{id}` | GET | ✅ Disponível | ❌ **NOVO!** |

**Schema Contato:**
```typescript
Contato {
  id: number
  idPessoa?: number
  tipo?: string (max: 50)  // "EMAIL", "TELEFONE", "CELULAR"
  descricao?: string (max: 100)  // "Pessoal", "Trabalho"
  numeroEndereco?: string (max: 100)  // Email ou número
  situacao?: string (max: 50)
}
```

---

## 📄 10. Documentos (/api/Documentos)

| Endpoint | Método | Status | Usado no Frontend |
|----------|--------|--------|-------------------|
| `/api/Documentos` | GET | ✅ Disponível | ❌ Não usado |
| `/api/Documentos/{id}` | GET | ✅ Disponível | ❌ Não usado |
| `/api/Documentos` | POST | ✅ Disponível | ❌ Não usado |
| `/api/Documentos/{id}` | PUT | ✅ Disponível | ❌ Não usado |
| `/api/Documentos/{id}` | DELETE | ✅ Disponível | ❌ Não usado |
| `/api/Documentos/pessoa/{id}` | GET | ✅ Disponível | ❌ **NOVO!** |

**Schema Documento:**
```typescript
Documento {
  id: number
  idPessoa?: number
  descricao?: string (max: 100)  // "CPF", "RG", "CNH", etc.
  dataEmissao?: datetime
  dataValidade?: datetime
  numero?: string (max: 100)
  complementoObservacoes?: string (max: 200)
  orgaoExpedidor?: string (max: 100)
  situacao?: string (max: 50)
}
```

---

## 📦 11. Itens de Pedido (/api/PedidoItems)

| Endpoint | Método | Status | Usado no Frontend |
|----------|--------|--------|-------------------|
| `/api/PedidoItems` | GET | ✅ Disponível | ❌ Não usado |
| `/api/PedidoItems/{id}` | GET | ✅ Disponível | ❌ Não usado |
| `/api/PedidoItems` | POST | ✅ Disponível | ❌ Não usado |
| `/api/PedidoItems/{id}` | PUT | ✅ Disponível | ❌ Não usado |
| `/api/PedidoItems/{id}` | DELETE | ✅ Disponível | ❌ Não usado |
| `/api/PedidoItems/pedido/{id}` | GET | ✅ Disponível | ❌ **NOVO!** Importante! |
| `/api/PedidoItems/setdevolucao/{id}?quantidade={qtd}` | PUT | ✅ Disponível | ❌ **NOVO!** |

**Schema PedidoItem:**
```typescript
PedidoItem {
  id: number
  idProduto?: number
  idPedido?: number
  quantidade?: number
  preco?: number
  desconto?: number
  situacao?: string (max: 50)
}
```

---

## ⏱️ 12. Timeline de Pedido (/api/PedidoTimelines)

| Endpoint | Método | Status | Usado no Frontend |
|----------|--------|--------|-------------------|
| `/api/PedidoTimelines` | GET | ✅ Disponível | ❌ Não usado |
| `/api/PedidoTimelines/{id}` | GET | ✅ Disponível | ❌ Não usado |
| `/api/PedidoTimelines` | POST | ✅ Disponível | ❌ Não usado |
| `/api/PedidoTimelines/{id}` | PUT | ✅ Disponível | ❌ Não usado |
| `/api/PedidoTimelines/{id}` | DELETE | ✅ Disponível | ❌ Não usado |
| `/api/PedidoTimelines/pedido/{id}` | GET | ✅ Disponível | ❌ **NOVO!** Importante! |

**Schema PedidoTimeline:**
```typescript
PedidoTimeline {
  id: number
  idPedido?: number
  etapa?: string (max: 50)  // "PEDIDO_CRIADO", "EM_SEPARACAO", etc.
  situacao?: string (max: 50)
  dataHoraCriacaoRegistro?: datetime
}
```

**⚠️ IMPORTANTE:** Use `/api/PedidoTimelines/pedido/{id}` para mostrar o histórico de um pedido!

---

## 👤 13. Papéis de Pessoa (/api/PessoaPapeis)

| Endpoint | Método | Status | Usado no Frontend |
|----------|--------|--------|-------------------|
| `/api/PessoaPapeis` | GET | ✅ Disponível | ❌ Não usado |
| `/api/PessoaPapeis/{id}` | GET | ✅ Disponível | ❌ Não usado |
| `/api/PessoaPapeis` | POST | ✅ Disponível | ❌ Não usado |
| `/api/PessoaPapeis/{id}` | PUT | ✅ Disponível | ❌ Não usado |
| `/api/PessoaPapeis/{id}` | DELETE | ✅ Disponível | ❌ Não usado |
| `/api/PessoaPapeis/pessoa/{id}` | GET | ✅ Disponível | ❌ **NOVO!** |

**Schema PessoaPapel:**
```typescript
PessoaPapel {
  id: number
  idPessoa?: number
  papel?: string (max: 50)  // "ASSISTENCIA_TECNICA", "DISTRIBUIDOR", "ENTREGADOR"
  situacao?: string (max: 50)
}
```

**⚠️ NOTA:** Uma pessoa pode ter múltiplos papéis!

---

## 🏷️ 14. Produtos - Metadados

### ProdutoSegmentos (/api/ProdutoSegmentos)
### ProdutoGrupos (/api/ProdutoGrupos)
### ProdutoMarcas (/api/ProdutoMarcas)
### ProdutoModelos (/api/ProdutoModelos)
### ProdutoTags (/api/ProdutoTags)

**Todos têm CRUD completo:** GET, POST, PUT, DELETE

| Controller | Endpoints | Status |
|-----------|-----------|--------|
| ProdutoSegmentos | GET/POST/PUT/DELETE `/api/ProdutoSegmentos` | ❌ **NOVO!** |
| ProdutoGrupos | GET/POST/PUT/DELETE `/api/ProdutoGrupos` | ❌ **NOVO!** |
| ProdutoMarcas | GET/POST/PUT/DELETE `/api/ProdutoMarcas` | ❌ **NOVO!** |
| ProdutoModelos | GET/POST/PUT/DELETE `/api/ProdutoModelos` | ❌ **NOVO!** |
| ProdutoTags | GET/POST/PUT/DELETE `/api/ProdutoTags` | ❌ **NOVO!** |

---

## 📦 15. Grupos de Pedido (/api/PedidoGrupos)

| Endpoint | Método | Status | Usado no Frontend |
|----------|--------|--------|-------------------|
| `/api/PedidoGrupos` | GET | ✅ Disponível | ❌ **NOVO!** |
| `/api/PedidoGrupos/{id}` | GET | ✅ Disponível | ❌ **NOVO!** |
| `/api/PedidoGrupos` | POST | ✅ Disponível | ❌ **NOVO!** |
| `/api/PedidoGrupos/{id}` | PUT | ✅ Disponível | ❌ **NOVO!** |
| `/api/PedidoGrupos/{id}` | DELETE | ✅ Disponível | ❌ **NOVO!** |

**Schema PedidoGrupo:**
```typescript
PedidoGrupo {
  id: number
  transacao?: string (max: 50)
  idPedido?: number
  situacao?: string (max: 50)
}
```

---

## 📊 Resumo Estatístico

| Categoria | Total | Integrados | Não Integrados | % Uso |
|-----------|-------|------------|----------------|-------|
| **Account** | 2 | 1 | 1 | 50% |
| **Pessoas** | 9 | 1 | 8 | 11% |
| **Pedidos** | 13 | 6 | 7 | 46% |
| **Produtos** | 5 | 3 | 2 | 60% |
| **Produto Carrinho** | 1 | 0 | 1 | 0% ⚠️ |
| **Dashboard** | 1 | 0 | 1 | 0% ⚠️ |
| **Distribuidor** | 3 | 0 | 3 | 0% ⚠️ |
| **Endereços** | 6 | 0 | 6 | 0% ⚠️ |
| **Contatos** | 6 | 0 | 6 | 0% |
| **Documentos** | 6 | 0 | 6 | 0% |
| **PedidoItems** | 7 | 0 | 7 | 0% ⚠️ |
| **PedidoTimelines** | 6 | 0 | 6 | 0% ⚠️ |
| **PessoaPapeis** | 6 | 0 | 6 | 0% |
| **Produto Metadados** | 25 | 0 | 25 | 0% |
| **PedidoGrupos** | 5 | 0 | 5 | 0% |
| **TOTAL** | **101** | **11** | **90** | **11%** |

---

## 🚨 Endpoints CRÍTICOS Não Integrados

### Alta Prioridade (Usar AGORA):
1. ✅ **`GET /api/ProdutoEscolhaCarrinho`** - Busca de produtos para carrinho (COM filtros!)
2. ✅ **`GET /api/Dashboard/{papel}/{id}`** - Dados do dashboard por papel
3. ✅ **`GET /api/Enderecos/pessoa/{id}`** - Listar endereços da pessoa
4. ✅ **`POST /api/Enderecos`** - Criar novo endereço
5. ✅ **`GET /api/PedidoItems/pedido/{id}`** - Itens de um pedido específico
6. ✅ **`GET /api/PedidoTimelines/pedido/{id}`** - Histórico do pedido
7. ✅ **`GET /api/Pedidos/entregador/{id}`** - Pedidos do entregador
8. ✅ **`GET /api/Pedidos/periodo`** - Relatórios por período

### Média Prioridade:
1. **`GET /api/Distribuidor/consulta`** - Buscar distribuidores
2. **`GET /api/Distribuidor/favoritos`** - Distribuidores favoritos
3. **`GET /api/Distribuidor/ultimospedidos`** - Últimos pedidos de uma assistência
4. **`PUT /api/Pedidos/setcoleta`** - Marcar coleta
5. **`PUT /api/Pedidos/setentrega`** - Marcar entrega
6. **`GET /api/Pessoas/GetByNome`** - Buscar pessoa por nome

### Baixa Prioridade:
1. Metadados de produtos (Segmentos, Grupos, Marcas, Modelos, Tags)
2. CRUD de Contatos
3. CRUD de Documentos
4. PessoaPapeis (múltiplos papéis)

---

## 💡 Próximos Passos Sugeridos

1. **Criar `enderecosServices.js`** para gerenciar endereços
2. **Criar `dashboardServices.js`** para dados do dashboard
3. **Atualizar `produtosServices.js`** para usar endpoint de carrinho
4. **Criar `pedidoItemsServices.js`** para itens e timeline
5. **Criar `distribuidorServices.js`** para funcionalidades de distribuidor

---

**Criado em:** 2025-10-12
**Fonte:** Swagger JSON - https://localhost:44370/swagger/v1/swagger.json
