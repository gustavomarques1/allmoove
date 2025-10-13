# 📋 Checklist de Endpoints - AllMoove API

## 🎯 Objetivo
Verificar quais endpoints da API já estão integrados no frontend e quais podem ter mudado com as atualizações do backend.

---

## ✅ Endpoints Atualmente em Uso no Frontend

### 1. **Autenticação** (`/api/account`)

| Endpoint | Método | Status | Arquivo |
|----------|--------|--------|---------|
| `/api/account/LoginUser` | POST | ✅ Implementado | `useAuth.js:71` |
| `/api/account/CreateUser` | POST | ⚠️ Swagger only | - |

**Payload LoginUser:**
```json
{
  "email": "user@example.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "token": "eyJhbG...",
  "expiration": "2025-10-12T15:30:00"
}
```

---

### 2. **Pessoas** (`/api/pessoas`)

| Endpoint | Método | Status | Arquivo |
|----------|--------|--------|---------|
| `/api/pessoas` | GET | ✅ Implementado | `useAuth.js:85` |
| `/api/pessoas/{id}` | GET | ❌ Não usado | - |
| `/api/pessoas` | POST | ⚠️ Swagger only | - |
| `/api/pessoas/{id}` | PUT | ❌ Não usado | - |

**Response GET /api/pessoas:**
```json
[
  {
    "id": 1,
    "nome": "Distribuidora Teste",
    "login": "distribuidor@teste.com",
    "cpfCnpj": "12345678000100",
    "tipo": "DISTRIBUIDOR",
    "situacao": "ATIVO"
  }
]
```

---

### 3. **Pedidos** (`/api/Pedidos`)

| Endpoint | Método | Status | Arquivo |
|----------|--------|--------|---------|
| `/api/Pedidos/assistencia/{id}` | GET | ✅ Implementado | `pedidosServices.js:75` |
| `/api/Pedidos/distribuidor/{id}` | GET | ✅ Implementado | `pedidosServices.js:32` |
| `/api/Pedidos` | POST | ✅ Implementado | `pedidosServices.js:148` |
| `/api/Pedidos/{id}` | GET | ✅ Implementado | `pedidosServices.js:190` |
| `/api/Pedidos/{id}/status` | PUT | ✅ Implementado | `pedidosServices.js:233` |
| `/api/Pedidos/{id}` | DELETE | ✅ Implementado | `pedidosServices.js:286` |

**Payload POST /api/Pedidos:**
```json
{
  "idPessoa": 1,
  "empresa": 1,
  "estabelecimento": 1,
  "fornecedor": "Fornecedor Teste",
  "tipoEntrega": "Normal",
  "metodoPagamento": "Pix",
  "items": [
    {
      "produtoId": 1,
      "nome": "Produto Teste",
      "quantidade": 2,
      "preco": 100.00
    }
  ],
  "endereco": {
    "cep": "01001-000",
    "logradouro": "Praça da Sé",
    "numero": "100",
    "complemento": "",
    "bairro": "Sé",
    "cidade": "São Paulo",
    "estado": "SP"
  },
  "valorFrete": 10.00,
  "valorProdutos": 200.00,
  "totalPago": 210.00
}
```

---

### 4. **Produtos** (`/api/Produtos`)

| Endpoint | Método | Status | Arquivo |
|----------|--------|--------|---------|
| `/api/Produtos` | GET | ✅ Implementado | `produtosServices.js:13` |
| `/api/Produtos?categoria={cat}` | GET | ✅ Implementado | `produtosServices.js:28` |
| `/api/Produtos?fornecedor={forn}` | GET | ✅ Implementado | `produtosServices.js:43` |
| `/api/Produtos/{id}` | GET | ✅ Implementado | `produtosServices.js:74` |

**Response GET /api/Produtos:**
```json
[
  {
    "id": 1,
    "nome": "Produto Teste",
    "categoria": "celulares",
    "price": 1500.00,
    "imagem": "url_da_imagem",
    "fornecedor": "Fornecedor Teste"
  }
]
```

---

### 5. **Fornecedores** (`/api/Fornecedores`)

| Endpoint | Método | Status | Arquivo |
|----------|--------|--------|---------|
| `/api/Fornecedores` | GET | ✅ Implementado | `produtosServices.js:88` |

**Response:**
```json
[
  "Fornecedor A",
  "Fornecedor B",
  "Fornecedor C"
]
```

---

## ⚠️ Endpoints que Podem ter Mudado

Se o backend foi atualizado, verifique se estes endpoints mudaram:

### Verificar com o Dev Backend:

1. **LoginUser**
   - Campo ainda é `email` e `password`?
   - Response ainda retorna `token` e `expiration`?
   - Método ainda é POST?

2. **Pessoas**
   - Campo `tipo` ainda existe?
   - Valores válidos ainda são: ASSISTENCIA_TECNICA, DISTRIBUIDOR, ENTREGADOR?
   - Campo `login` ainda existe?

3. **Pedidos**
   - Estrutura do payload mudou?
   - Novos campos foram adicionados?
   - Status válidos mudaram?

4. **Produtos**
   - Estrutura mudou?
   - Novos filtros foram adicionados?

---

## 🆕 Possíveis Novos Endpoints

Pergunte ao dev backend se foram adicionados:

- [ ] `/api/entregadores` - Lista de entregadores
- [ ] `/api/enderecos` - CRUD de endereços
- [ ] `/api/notificacoes` - Sistema de notificações
- [ ] `/api/relatorios` - Relatórios e dashboards
- [ ] `/api/categorias` - Categorias de produtos
- [ ] `/api/estoque` - Controle de estoque

---

## 🧪 Como Testar Endpoints

### 1. Usar o Swagger
```
https://localhost:44370/swagger
```

### 2. Usar o arquivo de teste
Abra `testar-backend.html` no navegador

### 3. Usar curl (Terminal)
```bash
# Fazer login
curl -X POST https://localhost:44370/api/account/LoginUser \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123"}' \
  -k

# Buscar pessoas (com token)
curl https://localhost:44370/api/pessoas \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -k
```

### 4. Usar Postman/Insomnia
1. Crie uma coleção "AllMoove API"
2. Adicione todos os endpoints
3. Configure variável de ambiente para o token
4. Teste um por um

---

## 📝 Campos que o Frontend Espera

### Pessoa:
```typescript
{
  id: number
  nome: string
  login: string
  cpfCnpj: string
  tipo: 'ASSISTENCIA_TECNICA' | 'DISTRIBUIDOR' | 'ENTREGADOR'
  situacao: 'ATIVO' | 'INATIVO'
}
```

### Pedido:
```typescript
{
  id: number
  idPessoa: number
  fornecedor: string
  tipoEntrega: 'Normal' | 'Urgente'
  metodoPagamento: 'Pix' | 'Cartão de Crédito'
  status: string
  codigoEntrega: string
  dataHora: string
  items: PedidoItem[]
  endereco: Endereco
  valorFrete: number
  valorProdutos: number
  totalPago: number
}
```

### Produto:
```typescript
{
  id: number
  nome: string
  categoria: string
  price: number
  imagem: string
  fornecedor: string
}
```

---

## 🔄 Atualizar Frontend se Backend Mudou

Se o backend mudou a estrutura, você precisará atualizar:

### 1. Services (`src/api/`)
- `pedidosServices.js`
- `produtosServices.js`
- Criar novos services se necessário

### 2. Hooks (`src/hooks/`)
- `useAuth.js` (se autenticação mudou)

### 3. Componentes
- Atualizar campos nos formulários
- Atualizar validações
- Atualizar exibição de dados

---

## 📞 Perguntas para o Dev Backend

Envie esta lista para o desenvolvedor backend:

1. Quais endpoints foram adicionados?
2. Quais endpoints foram modificados?
3. Quais campos foram adicionados/removidos?
4. A estrutura de autenticação mudou?
5. Novos status de pedidos foram adicionados?
6. Há breaking changes que eu preciso saber?
7. Existe documentação atualizada da API?
8. Os endpoints antigos ainda funcionam?

---

## ✅ Checklist Pós-Atualização Backend

Depois que o backend for atualizado e CORS configurado:

- [ ] Testar login com usuário válido
- [ ] Testar listagem de pedidos
- [ ] Testar criação de pedido
- [ ] Testar listagem de produtos
- [ ] Testar filtros de produtos
- [ ] Verificar se redirecionamento por role funciona
- [ ] Verificar se todos os campos estão sendo exibidos
- [ ] Verificar se não há erros no console
- [ ] Limpar localStorage e testar do zero

---

**Criado em:** 2025-10-12
**Para:** Documentar endpoints e facilitar integração com backend atualizado
