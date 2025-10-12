# 🧪 Como Criar Usuário de Teste - Distribuidor

## Método 1: Via API (Recomendado para Teste)

### Passo 1: Criar Usuário no Identity (para poder fazer login)

**Endpoint:** `POST https://localhost:44370/api/account/CreateUser`

**Body (JSON):**
```json
{
  "email": "distribuidor@teste.com",
  "password": "Senha@12345",
  "confirmPassword": "Senha@12345"
}
```

**Validações:**
- Email deve ser válido
- Senha: mínimo 10 caracteres, máximo 20
- Password deve ser igual a ConfirmPassword

**Resposta esperada:**
```
"Usuario distribuidor@teste.com criado com sucesso"
```

---

### Passo 2: Fazer Login para Obter Token

**Endpoint:** `POST https://localhost:44370/api/account/LoginUser`

**Body (JSON):**
```json
{
  "email": "distribuidor@teste.com",
  "password": "Senha@12345"
}
```

**Resposta esperada:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiration": "2025-10-11T15:30:00Z"
}
```

**⚠️ COPIE O TOKEN!** Você vai usar no próximo passo.

---

### Passo 3: Criar Pessoa com Tipo DISTRIBUIDOR

**Endpoint:** `POST https://localhost:44370/api/pessoas`

**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "nome": "Distribuidora Teste",
  "login": "distribuidor@teste.com",
  "cpfCnpj": "12345678000100",
  "tipo": "DISTRIBUIDOR"
}
```

**Resposta esperada:**
```json
{
  "id": 5,
  "nome": "Distribuidora Teste",
  "login": "distribuidor@teste.com",
  "tipo": "DISTRIBUIDOR",
  "cpfCnpj": "12345678000100",
  "situacao": "ATIVO",
  "dataHoraCriacaoRegistro": "2025-10-11T12:00:00"
}
```

---

### ✅ Passo 4: Testar Login no Frontend

1. Abra o projeto React: `http://localhost:5173`
2. Faça login com:
   - Email: `distribuidor@teste.com`
   - Senha: `Senha@12345`
3. Deve redirecionar para `/distribuidor/dashboard`
4. Abra o console do navegador (F12) e veja:
   ```
   ✅ Login bem-sucedido! Papel do usuário: DISTRIBUIDOR
   ```

---

## Método 2: Via Script SQL (Direto no Banco)

Se você tiver acesso ao SQL Server:

```sql
-- 1. Inserir pessoa
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
    'distribuidor@teste.com',
    '12345678000100',
    'DISTRIBUIDOR',
    'ATIVO',
    'ATIVO',
    GETDATE()
);

-- 2. Ver o registro criado
SELECT * FROM PESSOA WHERE Login = 'distribuidor@teste.com';
```

**⚠️ IMPORTANTE:** Ainda precisa criar o usuário no Identity (Passo 1) para conseguir fazer login!

---

## 🧪 Outros Usuários de Teste Sugeridos

### Assistência Técnica
```json
{
  "email": "assistencia@teste.com",
  "password": "Senha@12345",
  "nome": "Assistência TecCell",
  "tipo": "ASSISTENCIA_TECNICA"
}
```

### Entregador
```json
{
  "email": "entregador@teste.com",
  "password": "Senha@12345",
  "nome": "João Entregador",
  "tipo": "ENTREGADOR"
}
```

---

## 🐛 Troubleshooting

### Erro: "Email ou senha incorretos"
- Certifique-se de criar o usuário no Identity primeiro (Passo 1)
- Verifique se a senha tem entre 10-20 caracteres

### Erro: "Pessoa não encontrada na API"
- Certifique-se de criar a pessoa na tabela PESSOA (Passo 3)
- O campo `login` deve ser igual ao email usado no Identity

### Erro: 401 Unauthorized no Passo 3
- Certifique-se de incluir o token no header Authorization
- Token expira em 20 minutos, se expirou, faça login novamente

### Console mostra "Usando dados mock"
- A pessoa não foi encontrada na tabela PESSOA
- Execute o Passo 3 corretamente com o token válido

---

## 📱 Usando Thunder Client (VS Code)

Se você usa VS Code, instale a extensão "Thunder Client" e use assim:

1. Abra Thunder Client (ícone de raio na barra lateral)
2. New Request
3. Selecione POST
4. Cole a URL
5. Vá em "Body" → "JSON"
6. Cole o JSON
7. Click "Send"

---

## 📬 Usando curl (Terminal)

### Passo 1:
```bash
curl -X POST https://localhost:44370/api/account/CreateUser \
  -H "Content-Type: application/json" \
  -d '{
    "email": "distribuidor@teste.com",
    "password": "Senha@12345",
    "confirmPassword": "Senha@12345"
  }'
```

### Passo 2:
```bash
curl -X POST https://localhost:44370/api/account/LoginUser \
  -H "Content-Type: application/json" \
  -d '{
    "email": "distribuidor@teste.com",
    "password": "Senha@12345"
  }'
```

### Passo 3 (substitua SEU_TOKEN):
```bash
curl -X POST https://localhost:44370/api/pessoas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "nome": "Distribuidora Teste",
    "login": "distribuidor@teste.com",
    "cpfCnpj": "12345678000100",
    "tipo": "DISTRIBUIDOR"
  }'
```

---

**Criado em:** 2025-10-11
**Objetivo:** Criar usuários de teste para validar sistema de roles
