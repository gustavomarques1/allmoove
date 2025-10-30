# Código para Copiar e Colar Manualmente

## 1. Produto.cs

**Abra:** `AllmooveApi/Models/Produto.cs`

**Substitua TODO o conteúdo por:**

```csharp
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AlunosApi.Models
{
    [Table("PRODUTO")]
    public class Produto
    {
        [Key]
        [Column("ID")]
        public long Id { get; set; }

        [Column("EMPRESA")]
        public int? Empresa { get; set; }

        [Column("ESTABELECIMENTO")]
        public int? Estabelecimento { get; set; }

        [Column("CODIGO")]
        [MaxLength(50)]
        public string? Codigo { get; set; }

        [Column("DATA_HORA_CRICAO_REGISTRO")]
        public DateTime? DataHoraCriacaoRegistro { get; set; }

        [Column("DATA_HORA_ALTERACAO_REGISTRO")]
        public DateTime? DataHoraAlteracaoRegistro { get; set; }

        [Column("USUARIO_CRIACAO")]
        [MaxLength(50)]
        public string? UsuarioCriacao { get; set; }

        [Column("USUARIO_ALTERACAO")]
        [MaxLength(50)]
        public string? UsuarioAlteracao { get; set; }

        [Column("SITUACAO_REGISTRO")]
        [MaxLength(50)]
        public string? SituacaoRegistro { get; set; }

        [Column("ID_DISTRIBUIDOR")]
        public long? IdDistribuidor { get; set; }

        [Column("ID_SEGMENTO")]
        public int? Segmento { get; set; }

        [Column("ID_MARCA")]
        public int? Marca { get; set; }

        [Column("ID_MODELO")]
        public int? Modelo { get; set; }

        [Column("ID_GRUPO")]
        public int? Grupo { get; set; }

        [Column("ID_TAG")]
        public int? Tag { get; set; }

        [Column("NOME")]
        [MaxLength(100)]
        public string? Nome { get; set; }

        [Column("DESCRICAO")]
        [MaxLength(1000)]
        public string? Descricao { get; set; }

        [Column("SKU")]
        [MaxLength(50)]
        public string? Sku { get; set; }

        [Column("EAN")]
        [MaxLength(50)]
        public string? Ean { get; set; }

        [Column("POSICAO")]
        [MaxLength(50)]
        public string? Posicao { get; set; }

        [Column("SITUACAO")]
        [MaxLength(50)]
        public string? Situacao { get; set; }

        [Column("PRECO_CUSTO")]
        public decimal? PrecoCusto { get; set; }

        [Column("PRECO_VENDA_PIX")]
        public decimal? PrecoVendaPix { get; set; }

        [Column("PRECO_VENDA_DEBITO")]
        public decimal? PrecoVendaDebito { get; set; }

        [Column("PRECO_VENDA_CREDITO")]
        public decimal? PrecoVendaCredito { get; set; }

        [Column("PRECO_VENDA_BOLETO")]
        public decimal? PrecoVendaBoleto { get; set; }

        [Column("QUANTIDADE")]
        public decimal? Quantidade { get; set; }

        [Column("QUANTIDADE_ESTOQUE_MINIMO")]
        public decimal? QuantidadeEstoqueMinimo { get; set; }

        [Column("FRETE_GRATIS")]
        public bool? FreteGratis { get; set; }

        [Column("IMAGEM")]
        [MaxLength(500)]
        public string? Imagem { get; set; }

        // Campos legados (não mapeados no banco)
        [NotMapped]
        public string? Categoria { get; set; }

        [NotMapped]
        public decimal? Price { get; set; }

        [NotMapped]
        public string? Fornecedor { get; set; }

        [NotMapped]
        public int Estoque { get; set; } = 0;
    }
}
```

---

## 2. ProdutoService.cs

**Abra:** `AllmooveApi/Services/ProdutoService.cs`

**Adicione este método ANTES do método `Createproduto` (linha 28):**

```csharp
// Retorna produtos com JOIN de distribuidor e categoria parseada
public async Task<IEnumerable<ProdutoDTO>> GetProdutosComDistribuidor()
{
    try
    {
        var produtos = await (from p in _context.Produtos
                             join d in _context.Pessoas on p.IdDistribuidor equals d.Id into distribuidores
                             from distribuidor in distribuidores.DefaultIfEmpty()
                             where p.SituacaoRegistro == "ATIVO"
                             select new ProdutoDTO
                             {
                                 Id = p.Id,
                                 Nome = p.Nome,
                                 Price = p.PrecoVendaPix,
                                 Imagem = p.Imagem,
                                 Sku = p.Sku,
                                 Descricao = p.Descricao,
                                 Estoque = (int)(p.Quantidade ?? 0),
                                 IdDistribuidor = p.IdDistribuidor,
                                 Fornecedor = distribuidor != null ? distribuidor.Nome : "Sem fornecedor",
                                 FreteGratis = p.FreteGratis ?? false,
                                 Categoria = p.Descricao != null && p.Descricao.Contains("Categoria:")
                                           ? p.Descricao.Replace("Categoria:", "").Trim().ToLower()
                                           : "outros"
                             }).ToListAsync();

        return produtos;
    }
    catch
    {
        throw;
    }
}
```

---

## 3. ProdutosController.cs

**Abra:** `AllmooveApi/Controllers/ProdutosConstroller.cs`

**SUBSTITUIR o método GetProdutos (linhas 26-70) por:**

```csharp
// GET: api/Produtos
[HttpGet]
[AllowAnonymous]
[ProducesResponseType(StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
public async Task<ActionResult<IEnumerable<ProdutoDTO>>> GetProdutos(
    [FromQuery] string categoria = null,
    [FromQuery] string fornecedor = null)
{
    try
    {
        var produtos = await _produtoService.GetProdutosComDistribuidor();

        // Aplicar filtro de categoria
        if (!string.IsNullOrEmpty(categoria))
        {
            produtos = produtos.Where(p =>
                p.Categoria != null &&
                p.Categoria.Equals(categoria, StringComparison.OrdinalIgnoreCase)
            );
        }

        // Aplicar filtro de fornecedor
        if (!string.IsNullOrEmpty(fornecedor))
        {
            produtos = produtos.Where(p =>
                p.Fornecedor != null &&
                p.Fornecedor.Equals(fornecedor, StringComparison.OrdinalIgnoreCase)
            );
        }

        return Ok(produtos.ToList());
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Erro: {ex.Message}");
        return BadRequest("Request inválido");
    }
}
```

---

## 4. Testar

Após fazer as alterações:

```bash
cd "C:\Users\Gustavo Marques\Downloads\allmoove1\allmoove1\AllmooveApi"
dotnet build
```

Se compilar sem erros:

```bash
dotnet run
```

Acesse no navegador:
```
https://localhost:44370/api/Produtos
```

Deve retornar JSON com os 48 produtos, cada um com:
- `id`, `nome`, `price`, `imagem`, `sku`
- `categoria` (extraído de DESCRICAO)
- `fornecedor` (nome do distribuidor via JOIN)
- `idDistribuidor` (ID numérico)
- `freteGratis`, `estoque`

---

## 📝 Observações

- **ProdutoDTO.cs** já foi criado automaticamente no diretório Models
- Os campos `Categoria`, `Price`, `Fornecedor`, `Estoque` ficam como `[NotMapped]` para compatibilidade
- Os campos reais do banco foram adicionados: `PrecoVendaPix`, `FreteGratis`, `Quantidade`, etc.
- O JOIN é feito automaticamente no backend, sem precisar de colunas extras

---

## 🐛 Se der erro de compilação

Possíveis problemas:

1. **"ProdutoDTO não encontrado"** → Verifique se o arquivo foi criado em `Models/ProdutoDTO.cs`
2. **"_context.Pessoas não existe"** → Verifique o nome do DbSet no `AppDbContext.cs`
3. **Erro de sintaxe** → Verifique se copiou o código completo

---

Pronto! Com esses 3 arquivos alterados, o backend estará funcionando e retornando produtos com categoria e fornecedor automaticamente! 🚀
