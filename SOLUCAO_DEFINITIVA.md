# 🎯 SOLUÇÃO DEFINITIVA - Criar Usuário Distribuidor

## Problema Identificado

O sistema está usando dados MOCK porque a pessoa não está sendo encontrada na tabela PESSOA, ou o campo `tipo` está vazio.

---

## ✅ SOLUÇÃO MÉTODO 1: SQL Direto (MAIS RÁPIDO)

Se você tem acesso ao SQL Server, execute esses comandos:

### Passo 1: Ver se a pessoa existe

```sql
-- Ver todas as pessoas
SELECT
    Id,
    Nome,
    Login,
    CpfCnpj,
    Tipo,
    Situacao
FROM PESSOA
WHERE SituacaoRegistro = 'ATIVO';
```

### Passo 2: Se a pessoa NÃO existe, criar

```sql
-- Inserir distribuidor
INSERT INTO PESSOA (
    Nome,
    Login,
    CpfCnpj,
    Tipo,
    Situacao,
    SituacaoRegistro,
    DataHoraCriacaoRegistro
)
VALUES (
    'Distribuidora Teste',
    'distribuidor@teste.com',  -- DEVE SER O MESMO EMAIL DO IDENTITY!
    '12345678000100',
    'DISTRIBUIDOR',
    'ATIVO',
    'ATIVO',
    GETDATE()
);

-- Ver o ID criado
SELECT * FROM PESSOA WHERE Login = 'distribuidor@teste.com';
```

### Passo 3: Se a pessoa EXISTE mas sem tipo, atualizar

```sql
-- Atualizar tipo da pessoa
UPDATE PESSOA
SET Tipo = 'DISTRIBUIDOR'
WHERE Login = 'distribuidor@teste.com';

-- Confirmar
SELECT Id, Nome, Login, Tipo FROM PESSOA WHERE Login = 'distribuidor@teste.com';
```

---

## ✅ SOLUÇÃO MÉTODO 2: Via Swagger (PASSO A PASSO)

### IMPORTANTE: Siga NA ORDEM EXATA

#### 1️⃣ Verificar se pessoa existe

1. Abra: `https://localhost:44370/swagger`
2. Aceite o certificado SSL se necessário
3. Vá em **GET /api/pessoas**
4. Clique **"Try it out"**
5. Clique **"Execute"**
6. **PROCURE** por `"login": "distribuidor@teste.com"` na resposta

**Se NÃO encontrou a pessoa:**
- Vá para o Passo 2

**Se ENCONTROU a pessoa:**
- Anote o `"id"` dela
- Veja se tem `"tipo": "DISTRIBUIDOR"`
- Se o tipo está vazio ou errado, vá para o Passo 4

---

#### 2️⃣ Fazer login para obter token

1. Vá em **POST /api/account/LoginUser**
2. Clique **"Try it out"**
3. Cole:
```json
{
  "email": "distribuidor@teste.com",
  "password": "Senha@12345"
}
```
4. Clique **"Execute"**

**SE DER ERRO 400/401:**
- O usuário não existe no Identity
- Volte e crie: **POST /api/account/CreateUser**
```json
{
  "email": "distribuidor@teste.com",
  "password": "Senha@12345",
  "confirmPassword": "Senha@12345"
}
```
- Depois faça login novamente

**SE DEU CERTO:**
- **COPIE TODO O TOKEN** (o texto gigante que começa com eyJ...)
- Vá para o Passo 3

---

#### 3️⃣ Autorizar no Swagger

1. Clique no botão **Authorize** 🔓 (canto superior direito)
2. No campo **Value**, cole:
```
Bearer SEU_TOKEN_AQUI
```
**IMPORTANTE:** Escreva `Bearer ` (com espaço) antes do token

Exemplo:
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Clique **"Authorize"**
4. Clique **"Close"**
5. Vá para o Passo 4 (se pessoa não existe) ou Passo 5 (se pessoa existe mas sem tipo)

---

#### 4️⃣ Criar pessoa (se não existe)

1. Vá em **POST /api/pessoas**
2. Clique **"Try it out"**
3. Cole este JSON EXATO:
```json
{
  "nome": "Distribuidora Teste",
  "login": "distribuidor@teste.com",
  "cpfCnpj": "12345678000100",
  "tipo": "DISTRIBUIDOR"
}
```

**⚠️ ATENÇÃO:**
- O campo `login` DEVE ser EXATAMENTE o mesmo email que você usou no Identity
- Não adicione outros campos além desses 4
- O campo `tipo` DEVE ser uma dessas opções:
  - `ASSISTENCIA_TECNICA`
  - `DISTRIBUIDOR`
  - `ENTREGADOR`

4. Clique **"Execute"**

**SE DER ERRO 401:**
- O token expirou (20 minutos)
- Volte ao Passo 2 e faça login novamente

**SE DER SUCESSO (201 Created):**
- Anote o `"id"` retornado
- Pule para o Passo 6

---

#### 5️⃣ Atualizar pessoa (se existe mas sem tipo)

1. Vá em **GET /api/pessoas**
2. Execute e encontre sua pessoa
3. **COPIE TODO O JSON** dela
4. Vá em **PUT /api/pessoas/{id}**
5. Clique **"Try it out"**
6. No campo `id`, coloque o ID da pessoa
7. No campo JSON, cole o JSON que você copiou e MODIFIQUE apenas o campo `tipo`:
```json
{
  "id": 5,  // Mantenha o ID original
  "nome": "Nome Original",  // Mantenha
  "login": "distribuidor@teste.com",  // Mantenha
  "cpfCnpj": "12345678000100",  // Mantenha
  "tipo": "DISTRIBUIDOR",  // <-- ADICIONE OU CORRIJA ESTE
  "situacao": "ATIVO"  // Mantenha
  // ... outros campos que já existiam
}
```
8. Clique **"Execute"**

---

#### 6️⃣ Confirmar que funcionou

1. Vá em **GET /api/pessoas**
2. Clique **"Execute"**
3. Procure sua pessoa
4. Confirme que tem:
   - `"login": "distribuidor@teste.com"`
   - `"tipo": "DISTRIBUIDOR"`

---

#### 7️⃣ Testar no Frontend

1. **LIMPE o localStorage do navegador:**
   - F12 → Application → Local Storage → http://localhost:5173
   - Clique com botão direito → Clear

2. Acesse: `http://localhost:5173`

3. Faça login:
   - Email: `distribuidor@teste.com`
   - Senha: `Senha@12345`

4. **DEVE redirecionar para:** `/distribuidor/dashboard`

5. **Abra o console (F12) e veja:**
```
✅ Login bem-sucedido! Papel do usuário: DISTRIBUIDOR
```

---

## 🐛 Troubleshooting

### Erro: "Pessoa não encontrada na API"
**Causa:** A pessoa não existe na tabela PESSOA ou o campo `login` está diferente do email

**Solução:**
1. Execute Passo 1 (ver se existe)
2. Se não existe, execute Passo 2-4
3. Se existe mas o `login` está diferente, execute Passo 5 e corrija o `login`

---

### Erro: "Usando dados mock"
**Causa:** Mesma acima

**Solução:** Mesma acima

---

### Erro: "401 Unauthorized"
**Causa:** Token expirou ou não autorizou no Swagger

**Solução:**
1. Faça login novamente (Passo 2)
2. Autorize no Swagger (Passo 3)
3. Tente novamente

---

### Papel ainda vem como ASSISTENCIA_TECNICA
**Causas possíveis:**
1. Campo `tipo` está vazio na tabela PESSOA
2. Campo `tipo` tem valor diferente de "DISTRIBUIDOR"
3. Campo `login` da pessoa está diferente do email usado no login
4. localStorage do navegador ainda tem dados antigos

**Soluções:**
1. Execute o SQL do Método 1 ou Passo 5 do Método 2
2. Limpe o localStorage (F12 → Application → Local Storage → Clear)
3. Faça logout e login novamente

---

### Não consigo acessar o Swagger
**Causa:** Backend não está rodando ou certificado SSL

**Solução:**
1. Verifique se o backend está rodando: `dotnet run` na pasta AllmooveApi
2. Abra `https://localhost:44370/swagger`
3. Se der aviso de certificado, clique "Avançado" → "Continuar para localhost"

---

## 📊 Checklist Final

Antes de testar no frontend, confirme:

- [ ] Usuário criado no Identity (POST /api/account/CreateUser funcionou)
- [ ] Login funciona no Swagger (POST /api/account/LoginUser retorna token)
- [ ] Pessoa existe na tabela PESSOA (GET /api/pessoas mostra ela)
- [ ] Campo `login` da pessoa = email usado no Identity
- [ ] Campo `tipo` da pessoa = "DISTRIBUIDOR"
- [ ] Campo `situacao` da pessoa = "ATIVO"
- [ ] localStorage do navegador foi limpo

---

## 🎯 Atalho SQL Completo

Se você quer fazer TUDO de uma vez pelo SQL:

```sql
-- 1. Ver situação atual
SELECT * FROM PESSOA WHERE Login = 'distribuidor@teste.com';

-- 2. Se não existe, criar
INSERT INTO PESSOA (Nome, Login, CpfCnpj, Tipo, Situacao, SituacaoRegistro, DataHoraCriacaoRegistro)
VALUES ('Distribuidora Teste', 'distribuidor@teste.com', '12345678000100', 'DISTRIBUIDOR', 'ATIVO', 'ATIVO', GETDATE());

-- 3. Se existe mas sem tipo, atualizar
UPDATE PESSOA SET Tipo = 'DISTRIBUIDOR' WHERE Login = 'distribuidor@teste.com';

-- 4. Confirmar
SELECT Id, Nome, Login, Tipo, Situacao FROM PESSOA WHERE Login = 'distribuidor@teste.com';
```

**⚠️ IMPORTANTE:** O usuário também precisa existir no Identity!
Use o Swagger para criar: POST /api/account/CreateUser

---

**Criado em:** 2025-10-12
**Última atualização:** 2025-10-12
