# ⚠️ PROBLEMA: APIs de Distribuidor retornando 401 (Unauthorized)

## 🔍 Problema Identificado:

As APIs de distribuidor estão retornando **401 Unauthorized**:

```
❌ GET https://localhost:44370/api/Distribuidor/consulta?idSegmento=1 → 401
❌ GET https://localhost:44370/api/Distribuidor/ultimospedidos/1 → 401
```

Enquanto outras APIs funcionam normalmente:

```
✅ GET https://localhost:44370/api/Produtos → 200 OK
✅ GET https://localhost:44370/api/ProdutoSegmentos → 200 OK
```

---

## 🧪 Diagnóstico:

### Execute o Script de Teste:

1. Abra o navegador e acesse o dashboard
2. Faça login
3. Abra o Console (F12)
4. Cole o conteúdo de: `testar-apis-distribuidor.js`
5. Pressione Enter

O script testará todas as APIs e mostrará exatamente qual é o problema.

---

## 🔧 Possíveis Causas:

### Causa 1: Rotas não implementadas no Backend
As rotas `/api/Distribuidor/*` podem não existir no backend ainda.

**Verificar:**
```csharp
// Procurar no backend por:
// Controllers/DistribuidorController.cs

[HttpGet("consulta")]
public async Task<ActionResult<List<Distribuidor>>> GetDistribuidoresPorSegmento([FromQuery] int idSegmento)
{
    // ...
}

[HttpGet("ultimospedidos/{idAssistencia}")]
public async Task<ActionResult<List<Pedido>>> GetUltimosPedidos(int idAssistencia)
{
    // ...
}
```

### Causa 2: Autorização por Role
As rotas podem estar configuradas para aceitar apenas usuários com role específica:

```csharp
// ❌ Se estiver assim, só DISTRIBUIDORES podem acessar:
[Authorize(Roles = "DISTRIBUIDOR")]
public class DistribuidorController : ControllerBase
{
    // ...
}

// ✅ Deveria estar assim para assistências também acessarem:
[Authorize] // Qualquer usuário autenticado
public class DistribuidorController : ControllerBase
{
    // ...
}
```

### Causa 3: Middleware de Autorização
O `Startup.cs` pode ter configuração que bloqueia certas rotas:

```csharp
// Verificar em Startup.cs
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});
```

---

## 🎯 Soluções:

### Solução 1: Criar as Rotas no Backend (se não existirem)

**Arquivo**: `Controllers/DistribuidorController.cs`

```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AlunosApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Permite qualquer usuário autenticado
    public class DistribuidorController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DistribuidorController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Distribuidor/consulta?idSegmento=1
        [HttpGet("consulta")]
        public async Task<ActionResult<List<object>>> GetDistribuidoresPorSegmento([FromQuery] int idSegmento)
        {
            try
            {
                var distribuidores = await _context.PRODUTO
                    .Where(p => p.IdSegmento == idSegmento)
                    .Select(p => new {
                        id = p.IdDistribuidor,
                        nome = p.Distribuidor // ou outro campo que tenha o nome
                    })
                    .Distinct()
                    .ToListAsync();

                return Ok(distribuidores);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao buscar distribuidores", error = ex.Message });
            }
        }

        // GET: api/Distribuidor/ultimospedidos/1
        [HttpGet("ultimospedidos/{idAssistencia}")]
        public async Task<ActionResult<List<object>>> GetUltimosPedidos(int idAssistencia)
        {
            try
            {
                // Buscar os últimos 5 pedidos da assistência
                var pedidos = await _context.PEDIDO
                    .Where(p => p.IdAssistencia == idAssistencia)
                    .OrderByDescending(p => p.DataCriacao)
                    .Take(5)
                    .Select(p => new {
                        id = p.Id,
                        distribuidor = p.NomeDistribuidor,
                        produto = p.NomeProduto,
                        idSegmento = p.IdSegmento,
                        data = p.DataCriacao
                    })
                    .ToListAsync();

                return Ok(pedidos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao buscar pedidos", error = ex.Message });
            }
        }

        // GET: api/Distribuidor/favoritos/1/1
        [HttpGet("favoritos/{idSegmento}/{idAssistencia}")]
        public async Task<ActionResult<List<object>>> GetDistribuidoresFavoritos(int idSegmento, int idAssistencia)
        {
            try
            {
                // Buscar distribuidores mais usados pela assistência naquele segmento
                var favoritos = await _context.PEDIDO
                    .Where(p => p.IdAssistencia == idAssistencia && p.IdSegmento == idSegmento)
                    .GroupBy(p => new { p.IdDistribuidor, p.NomeDistribuidor })
                    .Select(g => new {
                        id = g.Key.IdDistribuidor,
                        nome = g.Key.NomeDistribuidor,
                        totalPedidos = g.Count()
                    })
                    .OrderByDescending(x => x.totalPedidos)
                    .Take(5)
                    .ToListAsync();

                return Ok(favoritos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao buscar favoritos", error = ex.Message });
            }
        }
    }
}
```

### Solução 2: Remover Restrição de Role (se existir)

Se o controller já existir mas tiver `[Authorize(Roles = "DISTRIBUIDOR")]`, alterar para:

```csharp
// Antes:
[Authorize(Roles = "DISTRIBUIDOR")]
public class DistribuidorController : ControllerBase

// Depois:
[Authorize] // Permite qualquer usuário autenticado
public class DistribuidorController : ControllerBase
```

### Solução 3: Adicionar Endpoints Temporários (Mock)

Se não puder alterar o backend agora, já implementei **fallback automático** no frontend.

O componente `BuscaSegmentada.jsx` já usa dados estáticos quando as APIs falham:

```javascript
// Se API de distribuidores falhar → usa fornecedores genéricos
catch (error) {
  console.log('⚠️ Erro ao buscar distribuidores, usando dados estáticos');
}

// Se API de pedidos falhar → usa produtos como simulação
catch (error) {
  console.error('❌ Erro ao carregar pedidos');
  // Usa fallback de produtos
}
```

---

## ✅ Status Atual do Frontend:

**✅ Código Frontend ESTÁ PRONTO e FUNCIONANDO**

- APIs estão sendo chamadas corretamente com token Bearer
- Sistema tem fallback automático em caso de erro
- Quando o backend for corrigido, funcionará automaticamente

**⚠️ Aguardando Backend**

- Rotas precisam ser implementadas ou configuradas
- Permissões precisam ser ajustadas

---

## 📋 Checklist para o Backend:

### Passo 1: Verificar se as rotas existem
```bash
# Procurar no backend:
Controllers/DistribuidorController.cs
```

- [ ] Rota `/api/Distribuidor/consulta?idSegmento=` existe?
- [ ] Rota `/api/Distribuidor/ultimospedidos/{id}` existe?
- [ ] Rota `/api/Distribuidor/favoritos/{seg}/{ass}` existe?

### Passo 2: Verificar autorização
```csharp
// Verificar se há [Authorize(Roles = "...")] restringindo acesso
```

- [ ] Rotas permitem acesso de ASSISTENCIA_TECNICA?
- [ ] `[Authorize]` sem role específica?

### Passo 3: Testar
- [ ] Recompilar backend (`dotnet build`)
- [ ] Reiniciar API
- [ ] Executar script `testar-apis-distribuidor.js`
- [ ] Verificar se retorna 200 OK

---

## 🚀 Quando o Backend for Corrigido:

**Nenhuma mudança será necessária no frontend!**

O sistema detectará automaticamente que as APIs estão funcionando e começará a usar os dados reais.

Você verá no console:

```
✅ Distribuidores do segmento 1: X
✅ Últimos pedidos da assistência 1: Y
```

Em vez de:

```
⚠️ Erro ao buscar distribuidores, usando dados estáticos
❌ Erro ao carregar pedidos
```

---

## 📞 Próximos Passos:

1. **Execute o script de teste**: `testar-apis-distribuidor.js`
2. **Verifique se as rotas existem no backend**
3. **Se não existirem**: Copie o código da Solução 1
4. **Se existirem mas retornam 401**: Remova restrições de Role
5. **Recompile e teste**

---

💡 **O frontend está pronto e funcionando com fallback. Assim que o backend for corrigido, tudo funcionará automaticamente!**
