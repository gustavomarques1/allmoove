# 🔧 Configuração CORS no Backend - AllMoove API

## ⚠️ PROBLEMA DETECTADO

Erro no frontend:
```
Access to XMLHttpRequest at 'https://localhost:44370/api/account/LoginUser'
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Causa:** O backend ASP.NET Core não está configurado para aceitar requisições do frontend.

---

## ✅ SOLUÇÃO: Configurar CORS no Backend

O desenvolvedor backend precisa adicionar CORS no arquivo **`Program.cs`** do projeto ASP.NET Core.

---

## 📝 Passo 1: Configuração no Program.cs

Abra o arquivo `Program.cs` na pasta **AllmooveApi** e adicione as configurações abaixo:

### Código Completo (Program.cs)

```csharp
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// ========================================
// 1️⃣ ADICIONAR CORS (IMPORTANTE!)
// ========================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllMooveFrontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",      // Vite dev server
                "http://localhost:3000",      // React fallback
                "http://127.0.0.1:5173",      // Localhost alternativo
                "https://localhost:5173"      // HTTPS se necessário
            )
            .AllowAnyMethod()                 // GET, POST, PUT, DELETE, etc.
            .AllowAnyHeader()                 // Authorization, Content-Type, etc.
            .AllowCredentials();              // Permite cookies e autenticação
    });
});

// ========================================
// 2️⃣ ADICIONAR OUTROS SERVIÇOS
// ========================================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Autenticação JWT (se já existir, manter)
// builder.Services.AddAuthentication(...)
// builder.Services.AddAuthorization(...)

var app = builder.Build();

// ========================================
// 3️⃣ USAR CORS (ANTES DE TUDO!)
// ========================================
// ⚠️ IMPORTANTE: UseCors DEVE vir ANTES de UseAuthentication e UseAuthorization
app.UseCors("AllowAllMooveFrontend");

// ========================================
// 4️⃣ CONFIGURAR MIDDLEWARE
// ========================================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Autenticação (se já existir, manter nesta ordem)
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
```

---

## 🔍 Explicação Detalhada

### **WithOrigins(...)**
Lista de URLs do frontend que podem acessar a API:
- `http://localhost:5173` → Vite (principal)
- `http://localhost:3000` → React fallback
- `http://127.0.0.1:5173` → Variação do localhost

### **AllowAnyMethod()**
Permite todos os métodos HTTP: GET, POST, PUT, DELETE, PATCH, OPTIONS

### **AllowAnyHeader()**
Permite todos os headers, incluindo:
- `Authorization: Bearer {token}`
- `Content-Type: application/json`

### **AllowCredentials()**
Permite envio de cookies e credenciais (necessário para JWT)

---

## 🚨 IMPORTANTE: Ordem dos Middlewares

A ordem **IMPORTA MUITO** no ASP.NET Core! Use esta sequência:

```csharp
// ✅ ORDEM CORRETA
app.UseCors("AllowAllMooveFrontend");    // 1º - CORS primeiro!
app.UseHttpsRedirection();                // 2º - Redirecionamento HTTPS
app.UseAuthentication();                  // 3º - Autenticação
app.UseAuthorization();                   // 4º - Autorização
app.MapControllers();                     // 5º - Controllers
```

**❌ Se UseCors vier depois, NÃO FUNCIONA!**

---

## 🔒 Configuração para Produção

Para produção, **NUNCA use AllowAnyOrigin()**. Configure origens específicas:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("Production", policy =>
    {
        policy
            .WithOrigins(
                "https://allmoove.com.br",           // Domínio de produção
                "https://app.allmoove.com.br"        // Subdomínio
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// No app:
if (app.Environment.IsDevelopment())
{
    app.UseCors("AllowAllMooveFrontend");  // Dev
}
else
{
    app.UseCors("Production");              // Produção
}
```

---

## 📋 Checklist para o Backend

Passe isso para o desenvolvedor backend:

- [ ] Abrir `Program.cs` no projeto AllmooveApi
- [ ] Adicionar `builder.Services.AddCors(...)` ANTES de `builder.Build()`
- [ ] Adicionar `app.UseCors("AllowAllMooveFrontend")` DEPOIS de `builder.Build()`
- [ ] Garantir que `UseCors` vem ANTES de `UseAuthentication` e `UseAuthorization`
- [ ] Reiniciar o backend: `dotnet run`
- [ ] Testar com o arquivo `testar-backend.html`
- [ ] Verificar que não há erros de CORS no console do navegador

---

## 🧪 Como Testar Depois de Configurar

### 1. Reinicie o backend
```bash
cd AllmooveApi
dotnet run
```

### 2. Abra o arquivo de teste
Abra no navegador: `testar-backend.html`

### 3. Clique nos botões de teste
- ✅ Teste 1: Verificar se está online
- ✅ Teste 2: Verificar Swagger
- ✅ Teste 3: Testar Login (verifica CORS)

### 4. Se funcionar, teste no app React
```bash
cd my-app
npm run dev
```

Tente fazer login normalmente.

---

## 🐛 Troubleshooting

### Erro: "No 'Access-Control-Allow-Origin' header"
**Causa:** CORS não foi adicionado ou está na ordem errada

**Solução:**
1. Verifique se `AddCors()` está no código
2. Verifique se `UseCors()` vem ANTES de `UseAuthentication()`

---

### Erro: "CORS preflight request failed"
**Causa:** Origem não está na lista de `WithOrigins()`

**Solução:**
Adicione a origem exata que aparece no erro. Por exemplo:
```csharp
.WithOrigins("http://localhost:5173") // Deve ser EXATO
```

---

### Backend está rodando mas ainda dá erro
**Solução:**
1. Limpe o cache do navegador: Ctrl+Shift+Delete
2. Reinicie o backend: `dotnet run`
3. Recarregue a página: Ctrl+F5

---

### Erro 401 Unauthorized (mas sem erro de CORS)
**Causa:** CORS está OK! O problema é autenticação

**Solução:**
1. ✅ CORS funcionando!
2. Verifique se o usuário existe no banco
3. Crie usuário no Swagger: `POST /api/account/CreateUser`

---

## 📦 Dependências Necessárias

Se o backend NÃO tiver o pacote CORS instalado:

```bash
dotnet add package Microsoft.AspNetCore.Cors
```

**Mas provavelmente já está incluído** no template padrão do ASP.NET Core 6+.

---

## 🎯 Resumo Rápido

Para resolver CORS rapidamente:

1. Abra `Program.cs`
2. Adicione antes de `builder.Build()`:
```csharp
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAllMooveFrontend", policy => {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});
```

3. Adicione depois de `builder.Build()` e ANTES de `UseAuthentication()`:
```csharp
app.UseCors("AllowAllMooveFrontend");
```

4. Reinicie o backend: `dotnet run`

---

**Criado em:** 2025-10-12
**Para:** Resolver erro CORS entre frontend (localhost:5173) e backend (localhost:44370)
