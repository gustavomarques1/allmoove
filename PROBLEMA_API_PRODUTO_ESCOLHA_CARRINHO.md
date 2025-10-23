# ⚠️ Problema com API `/api/ProdutoEscolhaCarrinho`

## 📋 Resumo

O endpoint `/api/ProdutoEscolhaCarrinho` está retornando **401 Unauthorized** mesmo com token JWT válido sendo enviado corretamente.

---

## 🔍 Diagnóstico Completo

### ✅ O que está funcionando:

1. **Token JWT está sendo gerado corretamente** no login
   - Formato: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imd1c3Rhdm9jb2RlLmRldkBnbWFpbC5jb20iLCJtZXVUb2tlbiI6InRva2VuIEY5IiwianRpIjoiNDY5NTBhY2YtZjkyZS00YzkwLTg3NjQtMzc2Njc2ODExNWU0IiwiZXhwIjoxNzYxMTcwMjgyLCJpc3MiOiJodHRwOi8vZjkubmV0IiwiYXVkIjoiaHR0cDovL2Y5Lm5ldCJ9.ez_eXC16-2qJ2vd2V6Q53E6cwMPq8FfQ4IwhzJ0dkMI`
   - Claims: email, meuToken, jti, exp, iss, aud

2. **Token está sendo enviado no header** de todas as requisições
   - Header: `Authorization: Bearer <token>`
   - Implementado via Axios Interceptor em `src/api/api.js`

3. **Outros endpoints funcionam perfeitamente** com o mesmo token:
   - ✅ `/api/Produtos` - 200 OK
   - ✅ `/api/Produtos?categoria=X` - 200 OK
   - ✅ `/api/ProdutoSegmentos` - 200 OK
   - ✅ `/api/Dashboard/{papel}/{id}` - 200 OK (retorna dados)

### ❌ O que NÃO está funcionando:

- ❌ `/api/ProdutoEscolhaCarrinho?campoConsulta=` - **401 Unauthorized**
- ❌ `/api/ProdutoEscolhaCarrinho?campoConsulta=motorola` - **401 Unauthorized**

---

## 📊 Evidências

### Request que FALHA:
```http
GET https://localhost:44370/api/ProdutoEscolhaCarrinho?campoConsulta=
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response: 401 Unauthorized
```

### Request que FUNCIONA (mesmo token):
```http
GET https://localhost:44370/api/Produtos
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response: 200 OK
Body: [{ "Id": 1, "Nome": "Produto 1", ... }, ...]
```

---

## 🐛 Possíveis Causas (Backend)

### 1. **Autorização específica por Role/Claim**
```csharp
// ❌ Se o endpoint tiver:
[Authorize(Roles = "Admin")] // Mas o usuário é "AssistenciaTecnica"
public async Task<IActionResult> GetProdutoEscolhaCarrinho(string campoConsulta)
```

**Verificar:** O endpoint exige alguma role/claim específica?

### 2. **Endpoint não implementado ou comentado**
```csharp
// ❌ Endpoint pode estar retornando 401 propositalmente
[HttpGet("ProdutoEscolhaCarrinho")]
public async Task<IActionResult> GetProdutoEscolhaCarrinho(string campoConsulta)
{
    return Unauthorized(); // Placeholder enquanto não implementado
}
```

### 3. **Configuração de autenticação diferente**
```csharp
// ❌ Endpoint pode estar usando outro esquema de autenticação
[Authorize(AuthenticationSchemes = "Bearer,ApiKey")] // Requer 2 esquemas
```

---

## ✅ Solução Temporária (Frontend)

Voltamos a usar os endpoints antigos que funcionam:

**Arquivo:** `src/api/fetchProdutos.js`
```javascript
// Usando endpoints que funcionam:
const produtos = query
  ? await getProdutosPorCategoria(query)  // /api/Produtos?categoria=X
  : await getProdutos();                   // /api/Produtos
```

**Fallback automático:**
```javascript
// Se /api/ProdutoEscolhaCarrinho retornar 401 ou 404
if (error.response?.status === 404 || error.response?.status === 401) {
  logger.warn('⚠️ Endpoint não disponível. Usando fallback.');
  return getProdutos();
}
```

---

## 🔧 Solução Permanente (Backend)

### Opção 1: Remover autenticação do endpoint
```csharp
[AllowAnonymous]
[HttpGet("ProdutoEscolhaCarrinho")]
public async Task<IActionResult> GetProdutoEscolhaCarrinho(string campoConsulta)
{
    // Permite acesso sem autenticação
}
```

### Opção 2: Usar mesma política dos outros endpoints
```csharp
[Authorize] // Mesma política de /api/Produtos
[HttpGet("ProdutoEscolhaCarrinho")]
public async Task<IActionResult> GetProdutoEscolhaCarrinho(string campoConsulta)
{
    // Requer apenas token JWT válido (qualquer role)
}
```

### Opção 3: Adicionar claim específica ao token
```csharp
// No momento da geração do token (LoginUser):
var claims = new List<Claim>
{
    new Claim(ClaimTypes.Email, user.Email),
    new Claim(ClaimTypes.Role, user.Papel),
    new Claim("CanAccessProdutoEscolhaCarrinho", "true") // Nova claim
};

// No endpoint:
[Authorize(Policy = "CanAccessProdutoEscolhaCarrinho")]
[HttpGet("ProdutoEscolhaCarrinho")]
```

---

## 📝 Checklist para Backend

- [ ] Verificar atributo `[Authorize]` no controller/endpoint
- [ ] Comparar com configuração de `/api/Produtos` (que funciona)
- [ ] Verificar se endpoint está implementado ou é placeholder
- [ ] Testar endpoint com Postman/Insomnia usando o token JWT
- [ ] Verificar logs do backend para mensagem de erro específica
- [ ] Confirmar que token está sendo validado corretamente

---

## 🎯 Objetivo do Endpoint

Segundo a documentação interna, `/api/ProdutoEscolhaCarrinho` deveria:

1. Buscar produtos por **múltiplos campos**: Nome, Marca, Modelo, SKU, Categoria, Tag
2. Retornar **informações completas**:
   - Dados do produto (Id, Nome, Preco, etc.)
   - Nome do distribuidor
   - Informações de grupo, segmento, tag
3. Ser usado no **SearchBar** para busca inteligente

**Exemplo de uso esperado:**
```http
GET /api/ProdutoEscolhaCarrinho?campoConsulta=motorola
→ Retorna todos produtos que tenham "motorola" no nome, marca, modelo, SKU, etc.

GET /api/ProdutoEscolhaCarrinho?campoConsulta=
→ Retorna TODOS os produtos com informações completas
```

---

## 📞 Contato

**Desenvolvedor Frontend:** Gustavo (gustavocode.dev@gmail.com)
**Data do problema:** 2025-10-22
**Versão do frontend:** AllMoove v1.0
**Token de teste usado:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imd1c3Rhdm9jb2RlLmRldkBnbWFpbC5jb20i...
