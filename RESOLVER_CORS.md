# 🚨 GUIA COMPLETO: Resolver Erro de CORS

## 🎯 Objetivo
Resolver o erro de CORS que está impedindo o login no AllMoove:
```
Access to XMLHttpRequest at 'https://localhost:44370/api/account/LoginUser'
from origin 'http://localhost:5173' has been blocked by CORS policy
```

---

## 📋 Passo a Passo (Você Mesmo)

### **Passo 1: Diagnóstico Rápido** ⏱️ 2 minutos

1. Abra o arquivo `testar-backend.html` no navegador
2. Clique em "🔍 Testar Conexão"
3. Veja o resultado:

**Se der ✅ "Backend está ONLINE":**
→ O backend está rodando, o problema é só CORS
→ Vá para o Passo 2

**Se der ❌ "Backend está OFFLINE":**
→ O backend não está rodando
→ Siga as instruções na seção "Backend Offline" abaixo

---

### **Passo 2: Verificar se Backend está Rodando** ⏱️ 1 minuto

Abra um terminal na pasta do backend:

```bash
cd C:\Users\Gustavo Marques\Downloads\allmoove1\allmoove1\AllmooveApi
dotnet run
```

**Saída esperada:**
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:44370
info: Microsoft.Hosting.Lifetime[0]
      Application started.
```

**Se der erro:**
- Verifique se a porta 44370 já está em uso
- Verifique se o .NET SDK está instalado: `dotnet --version`

---

### **Passo 3: Passar Informações para o Dev Backend** ⏱️ 5 minutos

Envie o arquivo **`CORS_BACKEND_CONFIG.md`** para o desenvolvedor backend com a mensagem:

```
Olá! O frontend não consegue fazer login por causa de um erro de CORS.

Preciso que você adicione a configuração de CORS no Program.cs do backend.

Segue o arquivo com as instruções completas:
CORS_BACKEND_CONFIG.md

Resumo do que precisa ser feito:
1. Adicionar builder.Services.AddCors(...) no Program.cs
2. Adicionar app.UseCors(...) ANTES de UseAuthentication
3. Reiniciar o backend

Obrigado!
```

---

### **Passo 4: Aguardar Backend ser Atualizado** ⏱️ Depende do dev

Enquanto isso, você pode:
- Revisar o código do frontend
- Verificar se há outros erros no console
- Testar outras funcionalidades que não dependem de API

---

### **Passo 5: Testar Após Correção** ⏱️ 2 minutos

Depois que o dev backend confirmar que fez a correção:

1. **Abra `testar-backend.html` novamente**
2. Clique em "🔐 Testar Login"
3. Use as credenciais:
   - Email: `distribuidor@teste.com`
   - Senha: `Senha@12345`

**Se der ✅ "Login funcionou! CORS está OK!":**
→ Problema resolvido! 🎉

**Se der ❌ ainda:**
→ Veja a seção "Troubleshooting" abaixo

---

## 🔧 Troubleshooting

### 1. Backend está rodando mas continua dando erro CORS

**Causa:** Backend ainda não foi configurado corretamente

**Solução:**
- Confirme com o dev backend que ele adicionou a configuração
- Peça para ele reiniciar o backend: `dotnet run`
- Limpe o cache do navegador: Ctrl+Shift+Delete

---

### 2. Erro 401 Unauthorized (mas sem erro de CORS)

**Isso é ÓTIMO!** CORS está funcionando!

**Causa:** Usuário não existe ou senha incorreta

**Solução:**
1. Abra: https://localhost:44370/swagger
2. Aceite o certificado SSL
3. Vá em `POST /api/account/CreateUser`
4. Clique "Try it out"
5. Cole:
```json
{
  "email": "distribuidor@teste.com",
  "password": "Senha@12345",
  "confirmPassword": "Senha@12345"
}
```
6. Execute
7. Crie a pessoa no banco (veja SOLUCAO_DEFINITIVA.md)
8. Tente fazer login novamente

---

### 3. Backend não inicia (erro de porta)

**Causa:** Porta 44370 já está em uso

**Solução:**
```bash
# Windows
netstat -ano | findstr :44370
taskkill /PID <PID> /F

# Ou altere a porta no backend e no frontend
```

---

### 4. Certificado SSL não confiável

**Causa:** Certificado auto-assinado do desenvolvimento

**Solução:**
1. Abra: https://localhost:44370/swagger
2. Clique em "Avançado"
3. Clique em "Continuar para localhost"
4. O navegador vai aceitar o certificado

---

### 5. "Network Error" genérico

**Causas possíveis:**
- Backend não está rodando
- Firewall bloqueando
- Antivírus bloqueando
- Porta errada

**Solução:**
1. Verifique se o backend está rodando: `dotnet run`
2. Desative temporariamente o antivírus
3. Confirme a porta no backend e no frontend

---

## 🆘 Se NADA Funcionar

### Opção 1: Solução Temporária (Desabilitar CORS no Navegador)

**⚠️ APENAS PARA DESENVOLVIMENTO! NUNCA USE EM PRODUÇÃO!**

**Chrome:**
```bash
# Windows
"C:\Program Files\Google\Chrome\Application\chrome.exe" --disable-web-security --user-data-dir="C:\temp\chrome-dev"

# Mac
open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome-dev" --disable-web-security
```

**Firefox:**
1. Abra: `about:config`
2. Aceite o aviso
3. Procure: `security.fileuri.strict_origin_policy`
4. Altere para `false`

---

### Opção 2: Proxy Temporário

Crie um arquivo `vite.config.js` no frontend:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:44370',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
```

Depois altere `src/api/api.js`:
```javascript
const api = axios.create({
    baseURL: "/api" // Remove https://localhost:44370
})
```

Reinicie o frontend: `npm run dev`

**⚠️ Isso é um workaround! A solução correta é configurar CORS no backend.**

---

## ✅ Checklist Final

Antes de chamar o desenvolvedor backend, confirme:

- [ ] Backend está rodando na porta 44370
- [ ] Consegue acessar https://localhost:44370/swagger
- [ ] Frontend está rodando na porta 5173
- [ ] Certificado SSL foi aceito no navegador
- [ ] Enviou o arquivo CORS_BACKEND_CONFIG.md para o dev backend
- [ ] Testou com `testar-backend.html`

---

## 📞 Informações para o Dev Backend

Se o dev backend perguntar detalhes, envie isso:

**Erro completo:**
```
Access to XMLHttpRequest at 'https://localhost:44370/api/account/LoginUser'
from origin 'http://localhost:5173' has been blocked by CORS policy:
Response to preflight request doesn't pass access control check:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**O que ele precisa fazer:**
1. Abrir `Program.cs` no projeto AllmooveApi
2. Adicionar configuração de CORS (ver CORS_BACKEND_CONFIG.md)
3. Reiniciar o backend
4. Testar com curl ou Postman:

```bash
curl -X POST https://localhost:44370/api/account/LoginUser \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{"email":"test@test.com","password":"Test123"}' \
  -k -v
```

A resposta DEVE incluir:
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
```

---

## 🎯 Próximos Passos Após Resolver CORS

Depois que o login funcionar:

1. ✅ Limpar localStorage: `localStorage.clear()`
2. ✅ Fazer login com usuário válido
3. ✅ Verificar se redireciona para o dashboard correto
4. ✅ Testar outras funcionalidades (pedidos, produtos, etc.)
5. ✅ Criar usuários de teste para cada tipo (Assistência, Distribuidor, Entregador)

---

**Criado em:** 2025-10-12
**Tempo estimado:** 10-15 minutos (dependendo do backend)
