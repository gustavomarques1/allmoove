# 🔧 Configurar CORS no Startup.cs (ASP.NET Core Antigo)

## ⚠️ SEU PROJETO USA O PADRÃO ANTIGO

Seu projeto usa `Program.cs` com `Startup.cs` separado (padrão antes do .NET 6).

Nesse caso, **a configuração de CORS vai no arquivo `Startup.cs`**, não no Program.cs!

---

## 📝 Exemplo de Startup.cs com CORS

```csharp
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace AlunosApi // ou AllmooveApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // ========================================
        // ConfigureServices - Adicionar serviços
        // ========================================
        public void ConfigureServices(IServiceCollection services)
        {
            // ✅ 1. ADICIONAR CORS AQUI!
            services.AddCors(options =>
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
                        .AllowAnyMethod()                 // GET, POST, PUT, DELETE
                        .AllowAnyHeader()                 // Authorization, Content-Type
                        .AllowCredentials();              // Permite cookies/auth
                });
            });

            // Outros serviços (manter os que já existem)
            services.AddControllers();
            services.AddSwaggerGen();

            // Autenticação JWT (se existir, manter)
            // services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            //     .AddJwtBearer(options => { ... });

            // DbContext (se existir, manter)
            // services.AddDbContext<AppDbContext>(options => { ... });
        }

        // ========================================
        // Configure - Configurar pipeline HTTP
        // ========================================
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // ✅ 2. USAR CORS AQUI! (ANTES DE UseAuthentication)
            app.UseCors("AllowAllMooveFrontend");

            app.UseHttpsRedirection();
            app.UseRouting();

            // Autenticação e Autorização (se existir, manter DEPOIS do CORS)
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
```

---

## 🎯 Onde Adicionar CORS

### 1️⃣ No método **`ConfigureServices`**

Adicione **ANTES** de `services.AddControllers()`:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    // ✅ ADICIONE AQUI
    services.AddCors(options =>
    {
        options.AddPolicy("AllowAllMooveFrontend", policy =>
        {
            policy
                .WithOrigins("http://localhost:5173")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
        });
    });

    services.AddControllers(); // Já existe
    // ... outros serviços
}
```

---

### 2️⃣ No método **`Configure`**

Adicione **ANTES** de `app.UseAuthentication()`:

```csharp
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    // ✅ ADICIONE AQUI (ANTES de UseAuthentication)
    app.UseCors("AllowAllMooveFrontend");

    app.UseHttpsRedirection();
    app.UseRouting();

    app.UseAuthentication(); // Já existe
    app.UseAuthorization();  // Já existe

    app.UseEndpoints(endpoints =>
    {
        endpoints.MapControllers();
    });
}
```

---

## ⚠️ ORDEM IMPORTA!

No método `Configure`, use esta ordem EXATA:

```csharp
// ✅ ORDEM CORRETA
1. app.UseCors("AllowAllMooveFrontend");    // 1º - CORS
2. app.UseHttpsRedirection();                // 2º - HTTPS
3. app.UseRouting();                         // 3º - Roteamento
4. app.UseAuthentication();                  // 4º - Autenticação
5. app.UseAuthorization();                   // 5º - Autorização
6. app.UseEndpoints(...);                    // 6º - Endpoints
```

**❌ Se UseCors vier depois de UseAuthentication, NÃO FUNCIONA!**

---

## 📋 Checklist

Antes de rodar, confirme:

- [ ] Adicionou `services.AddCors(...)` no método `ConfigureServices`
- [ ] Adicionou `app.UseCors(...)` no método `Configure`
- [ ] `UseCors` está ANTES de `UseAuthentication`
- [ ] Origem é exatamente `"http://localhost:5173"` (sem barra no final)
- [ ] Salvou o arquivo
- [ ] Vai reiniciar o backend: `dotnet run`

---

## 🧪 Teste Depois de Adicionar

1. Reinicie o backend:
```bash
cd AllmooveApi
dotnet run
```

2. Abra `testar-backend.html`

3. Clique em "🔐 Testar Login"

4. Deve dar **✅ Sucesso!**

---

## 🆘 Se Ainda Não Funcionar

Me mande o arquivo `Startup.cs` completo para eu ajustar exatamente onde precisa.

---

**Próximo passo:** Me envie o conteúdo do seu `Startup.cs` para eu fazer a versão corrigida.
