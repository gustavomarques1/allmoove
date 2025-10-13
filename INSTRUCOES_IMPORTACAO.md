# 📦 Instruções para Importação de Produtos

## ⚠️ IMPORTANTE: Como resolver o erro "Failed to fetch"

O erro acontece quando você abre o HTML diretamente do sistema de arquivos. Para resolver:

### Solução 1: Usar através do servidor Vite (RECOMENDADO)

1. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

2. **Faça login na aplicação:**
   - Acesse `http://localhost:5173`
   - Faça login para ter o token no localStorage

3. **Acesse o importador:**
   - Navegue para `http://localhost:5173/importar-produtos.html`
   - Agora o CORS funcionará corretamente!

4. **Faça upload** do arquivo Excel (arraste ou clique)

5. **Configure** as opções (URL da API, IDs padrão, etc.)

6. **Clique em "Importar Produtos"** e aguarde

### Solução 2: Desativar autenticação (se a API permitir)

Se a API não exigir autenticação, você pode:
1. Abrir o HTML diretamente
2. Desmarcar "Usar autenticação"
3. Tentar importar

## Como usar o importador

## Colunas esperadas no Excel

O script tenta mapear automaticamente os nomes das colunas. Você pode usar qualquer uma das variações:

### Obrigatórias:

| Coluna | Variações aceitas | Exemplo |
|--------|-------------------|---------|
| **Nome** | nome, Nome, NOME | "Tela LCD iPhone 12" |
| **Preço** | precoVenda, PrecoVenda, preco, Preco, preco_venda | 350.00 |

### Opcionais:

| Coluna | Variações aceitas | Exemplo |
|--------|-------------------|---------|
| **Descrição** | descricao, Descricao, DESCRICAO | "Tela de alta qualidade" |
| **SKU/Código** | sku, SKU, codigo, Codigo | "TEL-IP12-001" |
| **EAN/Código de Barras** | ean, EAN, codigoBarras | "7898123456789" |
| **Preço Custo** | precoCusto, PrecoCusto, preco_custo | 200.00 |
| **Quantidade/Estoque** | quantidade, Quantidade, estoque, Estoque | 50 |
| **ID Distribuidor** | idDistribuidor, distribuidor | 1 |
| **ID Segmento** | idSegmento, segmento | 2 |
| **ID Marca** | idMarca, marca | 3 |
| **ID Modelo** | idModelo, modelo | 4 |
| **ID Grupo** | idGrupo, grupo | 1 |
| **ID Tag** | idTag, tag | 1 |
| **Posição** | posicao, Posicao | "A1-B2" |

## Exemplo de estrutura do Excel

```
| nome              | descricao           | sku         | precoVenda | quantidade |
|-------------------|---------------------|-------------|------------|------------|
| Tela iPhone 12    | LCD Original        | TEL-IP12    | 350.00     | 10         |
| Bateria iPhone 12 | Alta capacidade     | BAT-IP12    | 120.00     | 25         |
| Camera iPhone 13  | 12MP Frontal        | CAM-IP13    | 180.00     | 15         |
```

## Configurações da interface

### URL da API
- Padrão: `https://localhost:44370`
- Altere se sua API estiver em outra porta

### ID Distribuidor (padrão)
- Valor padrão para produtos sem `idDistribuidor` na planilha
- Sugestão: use o ID do distribuidor principal

### ID Segmento (padrão)
- Valor padrão para produtos sem `idSegmento` na planilha
- Segmentos comuns: Telas (1), Baterias (2), Câmeras (3), etc.

### Situação
- **ATIVO**: Produto disponível para venda
- **INATIVO**: Produto cadastrado mas não visível

### Autenticação
- ✅ Marcado: Usa o token JWT do `localStorage` (faça login antes)
- ❌ Desmarcado: Tenta importar sem autenticação

## Dicas importantes

1. **Faça login primeiro**: Antes de importar, faça login na aplicação para ter o token no `localStorage`

2. **Teste com poucos produtos**: Comece importando 5-10 produtos para testar

3. **Verifique o log**: O console mostra o progresso e possíveis erros

4. **IDs de relações**: Os valores de `idDistribuidor`, `idSegmento`, `idMarca`, etc. devem existir no banco de dados

5. **Backup**: Sempre mantenha uma cópia do Excel original

## Troubleshooting

### "Token não encontrado"
- Faça login na aplicação primeiro
- Ou desmarque "Usar autenticação" (se a API permitir)

### "Erro 401 - Unauthorized"
- Token expirado - faça login novamente
- API requer autenticação - certifique-se que o token é válido

### "Erro 400 - Bad Request"
- Verifique se os dados estão no formato correto
- IDs de relações (segmento, marca, etc.) podem não existir no banco

### "Erro de conexão"
- Verifique se a API está rodando
- Confirme a URL da API (porta, protocolo https/http)
- Aceite o certificado SSL se estiver usando `localhost` com https

### "Nenhum produto importado"
- Verifique se o Excel tem dados na primeira aba
- Certifique-se que há pelo menos as colunas `nome` e `preco`

## Script de exemplo para criar segmentos/marcas

Se você precisar criar os metadados primeiro (segmentos, marcas, grupos), pode fazer via Swagger ou criar endpoints:

```javascript
// Criar segmentos
POST https://localhost:44370/api/ProdutoSegmentos
{
  "nome": "Telas"
}

// Criar marcas
POST https://localhost:44370/api/ProdutoMarcas
{
  "nome": "Apple"
}

// Criar grupos
POST https://localhost:44370/api/ProdutoGrupos
{
  "nome": "Smartphones"
}
```

## Próximos passos após importação

1. Verifique os produtos no dashboard: `GET /api/Produtos`
2. Teste a busca: `GET /api/ProdutoEscolhaCarrinho?campoConsulta=iPhone`
3. Configure os segmentos no carrossel se ainda não tiver feito
