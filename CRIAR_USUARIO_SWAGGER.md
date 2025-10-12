# 🚀 Como Criar Usuário pelo Swagger (MAIS FÁCIL)

## Pré-requisito
- Backend rodando: `dotnet run` na pasta AllmooveApi

## Passo 1: Acessar o Swagger

1. Abra o navegador
2. Acesse: `https://localhost:44370/swagger`
3. Se der aviso de certificado → Clique "Avançado" → "Continuar"

---

## Passo 2: Criar Usuário no Identity

### 2.1 Localize o endpoint
- Procure por **"Account"** na lista
- Clique em **POST /api/account/CreateUser**
- Clique em **"Try it out"**

### 2.2 Preencha o JSON
```json
{
  "email": "distribuidor@teste.com",
  "password": "Senha@12345",
  "confirmPassword": "Senha@12345"
}
```

### 2.3 Execute
- Clique no botão **"Execute"**
- Você deve ver resposta **200** com: `"Usuario distribuidor@teste.com criado com sucesso"`

---

## Passo 3: Fazer Login

### 3.1 Localize o endpoint
- Ainda em **"Account"**
- Clique em **POST /api/account/LoginUser**
- Clique em **"Try it out"**

### 3.2 Preencha o JSON
```json
{
  "email": "distribuidor@teste.com",
  "password": "Senha@12345"
}
```

### 3.3 Execute e copie o token
- Clique em **"Execute"**
- Na resposta, você verá algo assim:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiration": "2025-10-11T15:30:00Z"
}
```
- **COPIE TODO O TOKEN** (o texto gigante que começa com eyJ...)

---

## Passo 4: Autorizar no Swagger

### 4.1 Clique no botão Authorize
- No topo da página do Swagger, tem um botão **"Authorize"** 🔓
- Clique nele

### 4.2 Cole o token
- No campo **Value**, cole: `Bearer SEU_TOKEN_AQUI`
- **IMPORTANTE:** Escreva `Bearer ` (com espaço) antes do token
- Exemplo: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- Clique em **"Authorize"**
- Clique em **"Close"**

---

## Passo 5: Criar a Pessoa

### 5.1 Localize o endpoint
- Procure por **"Pessoas"** na lista
- Clique em **POST /api/pessoas**
- Clique em **"Try it out"**

### 5.2 Preencha o JSON

**Para Distribuidor:**
```json
{
  "nome": "Distribuidora Teste",
  "login": "distribuidor@teste.com",
  "cpfCnpj": "12345678000100",
  "tipo": "DISTRIBUIDOR"
}
```

**Para Assistência Técnica:**
```json
{
  "nome": "Assistência TecCell",
  "login": "assistencia@teste.com",
  "cpfCnpj": "12345678000101",
  "tipo": "ASSISTENCIA_TECNICA"
}
```

**Para Entregador:**
```json
{
  "nome": "João Entregador",
  "login": "entregador@teste.com",
  "cpfCnpj": "98765432100",
  "tipo": "ENTREGADOR"
}
```

### 5.3 Execute
- Clique em **"Execute"**
- Você deve ver resposta **201** (Created) com os dados da pessoa criada

---

## ✅ Testar Login no Frontend

Agora você pode testar no sistema React:

1. Acesse: `http://localhost:5173`
2. Login: `distribuidor@teste.com`
3. Senha: `Senha@12345`
4. Deve redirecionar para: `/distribuidor/dashboard`

---

## 🐛 Troubleshooting

### Erro 401 ao criar pessoa
- Você não autorizou no Swagger (Passo 4)
- Ou o token expirou (20 minutos) - faça login novamente

### Erro 400: "Tipo de pessoa inválido"
- Certifique-se de usar exatamente: `ASSISTENCIA_TECNICA`, `DISTRIBUIDOR` ou `ENTREGADOR`
- Com letras maiúsculas e underline

### Erro: "Usuario já existe"
- Esse email já foi cadastrado antes
- Use outro email ou delete o usuário antigo do banco

### Frontend mostra "usando dados mock"
- A pessoa não foi criada no banco (Passo 5)
- Ou o email do login não corresponde ao campo `login` da pessoa

---

## 📝 Resumo dos Comandos

**Criar 3 usuários de teste completos:**

1. **Distribuidor:**
   - Email: `distribuidor@teste.com`
   - Senha: `Senha@12345`
   - Tipo: `DISTRIBUIDOR`

2. **Assistência:**
   - Email: `assistencia@teste.com`
   - Senha: `Senha@12345`
   - Tipo: `ASSISTENCIA_TECNICA`

3. **Entregador:**
   - Email: `entregador@teste.com`
   - Senha: `Senha@12345`
   - Tipo: `ENTREGADOR`

---

## ⏱️ Tempo Estimado
- Criar um usuário: **~3 minutos**
- Criar os 3 usuários: **~8 minutos**

**Criado em:** 2025-10-11
