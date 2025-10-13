using System.Text;
using AllMoveApi.Services;
using AlunosApi.Context;
using AlunosApi.Controllers;
using AlunosApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace AlunosApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            services.AddIdentity<IdentityUser, IdentityRole>()
              .AddEntityFrameworkStores<AppDbContext>()
              .AddDefaultTokenProviders();

            // Configurar Identity para APIs REST (retornar 401 em vez de redirecionar)
            services.ConfigureApplicationCookie(options =>
            {
                options.Events.OnRedirectToLogin = context =>
                {
                    context.Response.StatusCode = 401;
                    return Task.CompletedTask;
                };
                options.Events.OnRedirectToAccessDenied = context =>
                {
                    context.Response.StatusCode = 403;
                    return Task.CompletedTask;
                };
            });

           services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
           .AddJwtBearer(options =>
           {
               options.TokenValidationParameters = new TokenValidationParameters
               {
                   ValidateIssuer = true,
                   ValidateAudience = true,
                   ValidateLifetime = true,
                   ValidateIssuerSigningKey = true,
                   ValidIssuer = Configuration["Jwt:Issuer"],
                   ValidAudience = Configuration["Jwt:Audience"],
                   IssuerSigningKey = new SymmetricSecurityKey(
                       Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]))
               };
           });

            // ========================================
            // SERVICES - Apenas os que realmente existem
            // ========================================
            services.AddScoped<IAuthenticate, AuthenticateService>();
            services.AddScoped<AlunosService>();
            services.AddScoped<ContatoService>();
            services.AddScoped<DocumentoService>();
            services.AddScoped<EnderecoService>();
            services.AddScoped<PedidoItemService>();
            services.AddScoped<PedidosService>();
            services.AddScoped<PessoaService>();
            services.AddScoped<ProdutoService>();
            services.AddScoped<PessoaPapelService>();
            services.AddScoped<PedidoTimelineService>();
            services.AddScoped<DashboardService>();

            // ⚠️ Services abaixo NÃO EXISTEM - comentados temporariamente
            // TODO: Criar esses services e controllers quando necessário
            // services.AddScoped<ProdutoSegmentosService>();
            // services.AddScoped<ViewsDistribuidorService>();
            // services.AddScoped<ProdutoGrupoService>();
            // services.AddScoped<ProdutoMarcaService>();
            // services.AddScoped<ProdutoModeloService>();
            // services.AddScoped<ProdutoTagService>();
            // services.AddScoped<PedidoGruposService>();
            // services.AddScoped<ViewProdutoEscolhaCarrinhoService>();

            // ========================================
            // CORS CONFIGURADO CORRETAMENTE
            // ========================================
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAllMooveFrontend", policy =>
                {
                    policy
                        .WithOrigins(
                            "http://localhost:5173",      // Vite dev server (porta correta)
                            "http://localhost:3000",      // React fallback
                            "http://127.0.0.1:5173",      // Localhost alternativo
                            "https://localhost:5173"      // HTTPS se necessário
                        )
                        .AllowAnyMethod()                 // GET, POST, PUT, DELETE, etc.
                        .AllowAnyHeader()                 // Authorization, Content-Type, etc.
                        .AllowCredentials();              // Permite cookies e autenticação JWT
                });
            });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Allmoove.API", Version = "v1" });

                // Habilitar autorização usando Swagger (JWT)
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "JWT Authorization header using the Bearer scheme." +
                    " \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below." +
                    "\r\n\r\nExample: \"Bearer 12345abcdef\"",
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                          new OpenApiSecurityScheme
                            {
                                Reference = new OpenApiReference
                                {
                                    Type = ReferenceType.SecurityScheme,
                                    Id = "Bearer"
                                }
                            },
                            new string[] {}
                    }
               });
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Allmoove v1"));
            }

            // ========================================
            // CORS - DEVE VIR ANTES DE UseAuthentication
            // ========================================
            app.UseCors("AllowAllMooveFrontend");

            app.UseHttpsRedirection();
            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
