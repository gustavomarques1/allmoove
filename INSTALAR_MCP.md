# 🔌 Guia de Instalação MCP para AllMoove

## ⚠️ CORREÇÃO: MCPs para SQL Server

Os MCPs oficiais do Model Context Protocol ainda não têm um servidor SQL Server público no npm.
Mas temos alternativas:

### Passo 2: Configurar no .env
```env
# MCP SQL Server Configuration
MCP_SQLSERVER_HOST=localhost
MCP_SQLSERVER_PORT=1433
MCP_SQLSERVER_DATABASE=AllMoove
MCP_SQLSERVER_USER=seu_usuario
MCP_SQLSERVER_PASSWORD=sua_senha
MCP_SQLSERVER_ENCRYPT=false
MCP_SQLSERVER_TRUST_SERVER_CERTIFICATE=true
```

### Passo 3: Criar arquivo de configuração
Crie `mcp.config.json` na raiz:
```json
{
  "servers": {
    "sqlserver": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-sqlserver"],
      "env": {
        "CONNECTION_STRING": "Server=localhost,1433;Database=AllMoove;User Id=seu_usuario;Password=sua_senha;Encrypt=false;TrustServerCertificate=true"
      }
    }
  }
}
```

### Passo 4: Configurar no Claude Desktop
1. Abra as configurações do Claude Desktop
2. Vá em "Developer" → "MCP Servers"
3. Adicione:
```json
{
  "sqlserver": {
    "command": "node",
    "args": ["C:/Users/Gustavo Marques/Documents/Tela inicial Allmoove/my-app/node_modules/@modelcontextprotocol/server-sqlserver/dist/index.js"],
    "env": {
      "CONNECTION_STRING": "Server=localhost,1433;Database=AllMoove;User Id=seu_usuario;Password=sua_senha;Encrypt=false;TrustServerCertificate=true"
    }
  }
}
```

## 2. MCP Memory (Para Contexto Persistente)

### Instalar
```bash
npm install @modelcontextprotocol/server-memory --save-dev
```

### Configurar
```json
{
  "memory": {
    "command": "npx",
    "args": ["@modelcontextprotocol/server-memory", "--storage", "./mcp-memory.json"]
  }
}
```

## 3. Teste se Funcionou

Depois de configurar, reinicie o Claude Desktop e digite:
```
/mcp list
```

Se aparecer os servidores, está funcionando!

## Benefícios para o AllMoove

### Com SQL Server MCP você poderá:
- `SELECT * FROM Pedidos WHERE Status = 'Pendente'`
- `SELECT COUNT(*) FROM Produtos WHERE Categoria = 'Celulares'`
- Analisar performance de queries
- Verificar integridade de dados

### Com Memory MCP você poderá:
- Salvar contexto entre conversas
- Lembrar de bugs conhecidos
- Manter histórico de mudanças

## Queries Úteis para Começar

```sql
-- Ver pedidos recentes
SELECT TOP 10 * FROM Pedidos
ORDER BY DataCriacao DESC;

-- Produtos mais vendidos
SELECT p.Nome, COUNT(pi.Id) as TotalVendido
FROM Produtos p
JOIN PedidoItems pi ON p.Id = pi.IdProduto
GROUP BY p.Nome
ORDER BY TotalVendido DESC;

-- Dashboard da assistência
SELECT
  COUNT(CASE WHEN Status = 'Concluido' THEN 1 END) as PedidosConcluidos,
  COUNT(CASE WHEN Status IN ('Em Andamento', 'Aceito') THEN 1 END) as PedidosEmAndamento,
  COUNT(*) as TotalPedidos
FROM Pedidos
WHERE IdAssistencia = @idAssistencia;
```

## Problemas Comuns

### Erro de Conexão
- Verifique se SQL Server está rodando
- Confirme porta 1433 está aberta
- Usuario tem permissões corretas

### MCP não aparece
- Reinicie Claude Desktop
- Verifique caminho dos arquivos
- Olhe logs em: `%APPDATA%/Claude/logs/`

---

**Última atualização:** 2025-10-22
**Status:** Pronto para instalar