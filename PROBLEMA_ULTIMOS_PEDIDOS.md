# ⚠️ Problema: "Últimos Pedidos" não Exibe Dados

## 🔍 Diagnóstico Completo

### Problema Relatado:
A aba "Últimos Pedidos" no dashboard não está atualizando e mostra "Nenhum produto encontrado para esta seleção".

### Causa Raiz:

A API `/api/Distribuidor/ultimospedidos/{idAssistencia}` **NÃO retorna os pedidos reais**, ela retorna apenas **distribuidores com quem a assistência já fez pedidos**.

#### Estrutura da VIEW Atual:
```sql
CREATE VIEW VIEW_DISTRIBUIDOR_ULTIMOS_PEDIDOS AS
SELECT DISTINCT
    p.ID_DISTRIBUIDOR AS ID_DISTRIBUIDOR,
    ped.ID_PESSOA AS ID_ASSISTENCIA,
    COALESCE(pes.NOME, 'Distribuidor Desconhecido') AS NOME,
    pes.CPFCNPJ AS CPFCNPJ
FROM PEDIDO ped
INNER JOIN PEDIDO_ITEM pi ON pi.ID_PEDIDO = ped.ID
INNER JOIN PRODUTO p ON p.ID = pi.ID_PRODUTO
LEFT JOIN PESSOA pes ON pes.ID = p.ID_DISTRIBUIDOR
```

**O que retorna:**
```json
[
  {
    "idDistribuidor": 11,
    "idAssistencia": 1,
    "nome": "F9",
    "cpfCnpj": "0000000011"
  }
]
```

**Problema:** Não tem informações dos pedidos nem dos produtos! Apenas lista distribuidores.

---

## ✅ Soluções Disponíveis

### Solução 1: Usar API de Pedidos Existente (IMPLEMENTADA AGORA)

**Status:** ✅ Implementado temporariamente

A API `/api/Pedidos/assistencia/{id}` já existe e retorna os pedidos:

```json
[
  {
    "id": 1,
    "codigo": "1",
    "situacao": "ATIVO",
    "dataHoraCriacaoRegistro": "2025-10-11T00:00:00",
    "idDistribuidor": 11,
    "idPessoa": 1,
    ...
  }
]
```

**Limitação:** Não retorna os **items/produtos** do pedido (precisa buscar separadamente).

**Implementação Atual:**
- Exibe: "Pedido #codigo" + "Status"
- Mostra os 5 mais recentes
- Não filtra por categoria (pois não tem acesso aos produtos)

---

### Solução 2: Criar Nova VIEW Completa (RECOMENDADO) ⭐

**Status:** ✅ SQL script criado, aguardando execução no banco

Criar VIEW que retorna produtos dos pedidos: `VIEW_ULTIMOS_PEDIDOS_PRODUTOS`

**O que retorna:**
```json
[
  {
    "idPedido": 1,
    "idAssistencia": 1,
    "codigoPedido": "1",
    "dataPedido": "2025-10-11T00:00:00",
    "statusPedido": "ATIVO",
    "idPedidoItem": 101,
    "idProduto": 50,
    "quantidade": 2,
    "precoUnitario": 150.00,
    "nomeProduto": "Display iPhone 12",
    "idDistribuidor": 11,
    "idSegmento": 1,
    "nomeDistribuidor": "F9",
    "valorTotalItem": 300.00
  }
]
```

**Vantagens:**
- ✅ Retorna produtos dos pedidos
- ✅ Permite filtrar por segmento
- ✅ Retorna distribuidor associado
- ✅ Calcula valor total do item

**Passos para implementar:**

#### 1. Executar SQL no banco:
```bash
sqlcmd -S localhost -U sa -P sua_senha -d allmoove -i CRIAR_VIEW_ULTIMOS_PEDIDOS_COMPLETA.sql
```

Ou executar manualmente no SQL Server Management Studio.

#### 2. Criar modelo no backend:

**Arquivo:** `AllmooveApi/Models/ViewUltimosPedidosProdutos.cs`

```csharp
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace AllMoveApi.Models
{
    [Table("VIEW_ULTIMOS_PEDIDOS_PRODUTOS")]
    public class ViewUltimosPedidosProdutos
    {
        [Column("ID_PEDIDO")]
        public long IdPedido { get; set; }

        [Column("ID_ASSISTENCIA")]
        public long IdAssistencia { get; set; }

        [Column("CODIGO_PEDIDO")]
        public string CodigoPedido { get; set; }

        [Column("DATA_PEDIDO")]
        public DateTime? DataPedido { get; set; }

        [Column("STATUS_PEDIDO")]
        public string StatusPedido { get; set; }

        [Column("ID_PEDIDO_ITEM")]
        public long IdPedidoItem { get; set; }

        [Column("ID_PRODUTO")]
        public long IdProduto { get; set; }

        [Column("QUANTIDADE")]
        public int Quantidade { get; set; }

        [Column("PRECO_UNITARIO")]
        public decimal PrecoUnitario { get; set; }

        [Column("NOME_PRODUTO")]
        public string NomeProduto { get; set; }

        [Column("ID_DISTRIBUIDOR")]
        public long? IdDistribuidor { get; set; }

        [Column("ID_SEGMENTO")]
        public long? IdSegmento { get; set; }

        [Column("NOME_DISTRIBUIDOR")]
        public string NomeDistribuidor { get; set; }

        [Column("VALOR_TOTAL_ITEM")]
        public decimal ValorTotalItem { get; set; }
    }
}
```

#### 3. Criar Service:

**Arquivo:** `AllmooveApi/Services/ViewsUltimosPedidosService.cs`

```csharp
using AllMoveApi.Context;
using AllMoveApi.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AllMoveApi.Services
{
    public class ViewsUltimosPedidosService
    {
        private readonly AppDbContext _context;

        public ViewsUltimosPedidosService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ViewUltimosPedidosProdutos>> GetUltimosPedidosByAssistencia(long idAssistencia)
        {
            return await _context.Set<ViewUltimosPedidosProdutos>()
                .Where(v => v.IdAssistencia == idAssistencia)
                .OrderByDescending(v => v.DataPedido)
                .Take(50) // Últimos 50 itens
                .ToListAsync();
        }

        public async Task<IEnumerable<ViewUltimosPedidosProdutos>> GetUltimosPedidosByAssistenciaESegmento(
            long idAssistencia,
            long idSegmento)
        {
            return await _context.Set<ViewUltimosPedidosProdutos>()
                .Where(v => v.IdAssistencia == idAssistencia && v.IdSegmento == idSegmento)
                .OrderByDescending(v => v.DataPedido)
                .Take(50)
                .ToListAsync();
        }
    }
}
```

#### 4. Adicionar endpoint no Controller:

**Arquivo:** `AllmooveApi/Controllers/PedidosController.cs`

```csharp
// Adicionar no construtor
private readonly ViewsUltimosPedidosService _ultimosPedidosService;

public PedidosController(
    PedidosService pedidoService,
    ViewsUltimosPedidosService ultimosPedidosService)
{
    _pedidoService = pedidoService;
    _ultimosPedidosService = ultimosPedidosService;
}

// Adicionar endpoint
[HttpGet("ultimospedidos-produtos/{idAssistencia:int}")]
[AllowAnonymous]
public async Task<ActionResult<IEnumerable<ViewUltimosPedidosProdutos>>> GetUltimosPedidosProdutos(long idAssistencia)
{
    try
    {
        var pedidos = await _ultimosPedidosService.GetUltimosPedidosByAssistencia(idAssistencia);
        return Ok(pedidos);
    }
    catch (Exception ex)
    {
        return BadRequest(ex.Message);
    }
}

[HttpGet("ultimospedidos-produtos/{idAssistencia:int}/segmento/{idSegmento:int}")]
[AllowAnonymous]
public async Task<ActionResult<IEnumerable<ViewUltimosPedidosProdutos>>> GetUltimosPedidosProdutosPorSegmento(
    long idAssistencia,
    long idSegmento)
{
    try
    {
        var pedidos = await _ultimosPedidosService.GetUltimosPedidosByAssistenciaESegmento(
            idAssistencia,
            idSegmento);
        return Ok(pedidos);
    }
    catch (Exception ex)
    {
        return BadRequest(ex.Message);
    }
}
```

#### 5. Registrar Service no Startup.cs:

```csharp
services.AddScoped<ViewsUltimosPedidosService>();
```

#### 6. Atualizar Frontend:

**Arquivo:** `src/api/produtosServices.js`

```javascript
/**
 * Busca últimos pedidos com produtos de uma assistência
 * @param {number} idAssistencia - ID da assistência técnica
 * @param {number} idSegmento - ID do segmento (opcional)
 * @returns {Promise<Array>} Lista dos últimos pedidos com produtos
 */
export const getUltimosPedidosProdutos = async (idAssistencia, idSegmento = null) => {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const url = idSegmento
      ? `/api/Pedidos/ultimospedidos-produtos/${idAssistencia}/segmento/${idSegmento}`
      : `/api/Pedidos/ultimospedidos-produtos/${idAssistencia}`;

    const response = await api.get(url, { headers });

    console.log(`✅ Últimos pedidos com produtos:`, response.data.length);
    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao buscar últimos pedidos com produtos:`, error);
    throw error;
  }
};
```

**Arquivo:** `src/Components/TelaDashboard/BuscaSegmentada/BuscaSegmentada.jsx`

```javascript
import { getUltimosPedidosProdutos } from '../../../api/produtosServices';

// No useEffect de carregamento de pedidos:
const pedidosAPI = await getUltimosPedidosProdutos(userId, selectedSegmento);

// Processar os dados:
const pedidosParaExibicao = pedidosAPI.map(item => ({
  id: item.idPedidoItem,
  distribuidor: item.nomeDistribuidor,
  produto: item.nomeProduto,
  dataPedido: item.dataPedido,
  quantidade: item.quantidade,
  valor: item.valorTotalItem
}));
```

---

### Solução 3: Modificar VIEW Existente (Alternativa)

**Status:** Não recomendado (pode quebrar código existente)

Modificar `VIEW_DISTRIBUIDOR_ULTIMOS_PEDIDOS` para retornar produtos em vez de distribuidores.

**Risco:** Código existente que usa essa VIEW pode parar de funcionar.

---

## 📊 Comparação das Soluções

| Solução | Prós | Contras | Recomendação |
|---------|------|---------|--------------|
| **1. Usar /api/Pedidos/assistencia** | ✅ Já existe<br>✅ Não requer mudanças no backend | ❌ Não retorna produtos<br>❌ Não pode filtrar por categoria | Temporária |
| **2. Nova VIEW completa** | ✅ Retorna produtos<br>✅ Permite filtro por categoria<br>✅ Não quebra código existente | ⚠️ Requer mudanças no backend | ⭐ **MELHOR** |
| **3. Modificar VIEW existente** | ✅ Usa endpoint existente | ❌ Pode quebrar código<br>❌ Requer testes extensivos | Não recomendado |

---

## 🎯 Status Atual

✅ **Solução 1 implementada** - Dashboard mostra pedidos básicos sem filtro
🔧 **Solução 2 preparada** - SQL pronto, aguardando execução e implementação backend
⏳ **Aguardando decisão** - Qual solução você prefere implementar?

---

## 📝 Próximos Passos Recomendados

1. **Executar SQL** no banco de dados (`CRIAR_VIEW_ULTIMOS_PEDIDOS_COMPLETA.sql`)
2. **Criar modelo** ViewUltimosPedidosProdutos.cs no backend
3. **Criar service** ViewsUltimosPedidosService.cs
4. **Adicionar endpoint** no PedidosController
5. **Atualizar frontend** para usar nova API
6. **Testar** filtro por categoria funcionando

---

**Data:** 2025-01-13
**Arquivos criados:**
- `CRIAR_VIEW_ULTIMOS_PEDIDOS_COMPLETA.sql`
- `PROBLEMA_ULTIMOS_PEDIDOS.md` (este arquivo)
