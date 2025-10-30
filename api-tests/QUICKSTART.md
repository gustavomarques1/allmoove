# 🚀 Guia Rápido - Testar APIs

## 3 Passos Simples

### 1️⃣ Instalar Dependências

```bash
cd api-tests
npm install
```

### 2️⃣ Configurar Credenciais

Abra `api-tests/config.js` e ajuste:

```javascript
testCredentials: {
  assistenciaTecnica: {
    email: 'seu-email@test.com',     // ← Email válido do banco
    password: 'sua-senha'             // ← Senha válida
  }
},

testIds: {
  assistenciaId: 1,    // ← ID válido de uma assistência técnica
  distribuidorId: 1,   // ← ID válido de um distribuidor
  produtoId: 1,        // ← ID válido de um produto
}
```

### 3️⃣ Executar Testes

```bash
npm test
```

## ✅ Checklist Antes de Rodar

- [ ] Backend API está rodando em `https://localhost:44370/`
- [ ] Você tem um usuário cadastrado no banco de dados
- [ ] As credenciais em `config.js` estão corretas
- [ ] Os IDs em `config.js` correspondem a dados reais

## 🔍 Como Descobrir IDs Válidos

### Descobrir ID da Assistência Técnica

```sql
-- Execute no SQL Server
SELECT TOP 5 Id, Nome FROM Pessoas WHERE TipoPessoa = 'AssistenciaTecnica';
```

### Descobrir ID do Distribuidor

```sql
SELECT TOP 5 Id, Nome FROM Distribuidores;
```

### Descobrir ID do Produto

```sql
SELECT TOP 5 Id, Nome FROM Produtos;
```

### Verificar Usuário/Email

```sql
SELECT TOP 5 Id, Email FROM AspNetUsers;
```

## 🎯 O Que Esperar

Se tudo estiver configurado corretamente:

```
═══════════════════════════════════════════════════════
          ALLMOOVE - TESTE DE APIs
═══════════════════════════════════════════════════════

=== TESTES DE AUTENTICAÇÃO ===
→ Teste 1: Login com credenciais válidas
✓ Status 200 OK
✓ Token JWT recebido
✓ Teste 1 PASSOU

=== RESUMO - AUTENTICAÇÃO ===
ℹ Total de testes: 4
✓ Passou: 4
✗ Falhou: 0
ℹ Taxa de sucesso: 100.0%
```

## ❌ Se Algo Der Errado

### "ECONNREFUSED"
→ A API não está rodando. Inicie o backend:
```bash
cd AllmooveApi
dotnet run
```

### "401 Unauthorized" no login
→ Email/senha incorretos. Verifique em `config.js`

### "404 Not Found"
→ Endpoint não implementado ou ID não existe no banco

### "Cannot find module 'axios'"
→ Execute `npm install` dentro da pasta `api-tests/`

## 🆘 Ajuda

Leia o `README.md` completo para mais detalhes e troubleshooting.
