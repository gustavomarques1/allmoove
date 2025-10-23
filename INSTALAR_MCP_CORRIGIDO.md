# 🔌 Guia CORRETO de MCP para AllMoove

## MCPs Disponíveis no NPM (Reais)

### 1. **MCP Filesystem** ✅ (JÁ INSTALADO)
```bash
npm install @modelcontextprotocol/server-filesystem --save-dev
```
**Você já tem este!** Permite navegação e edição de arquivos.

### 2. **MCP Puppeteer** (Para Testes)
```bash
npm install @modelcontextprotocol/server-puppeteer --save-dev
```
**Para que serve:**
- Automatizar navegador
- Testar fluxos de usuário
- Fazer screenshots

### 3. **MCP SDK** (Para criar seu próprio)
```bash
npm install @modelcontextprotocol/sdk --save-dev
```

## 🎯 SOLUÇÃO PARA SQL SERVER

Como não existe MCP oficial para SQL Server, vamos criar uma solução alternativa:

### Opção 1: API Query Endpoint (Recomendado)

Criar um endpoint na sua API que execute queries:

```javascript
// src/api/databaseQuery.js
import api from './api';

export const executarQuery = async (query) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.post('/api/Database/query',
      { sql: query },
      { headers: { Authorization: `Bearer ${token}` }}
    );
    return response.data;
  } catch (error) {
    console.error('Erro na query:', error);
    throw error;
  }
};
```

### Opção 2: Usar Node.js com mssql

```bash
npm install mssql dotenv --save-dev
```

Criar arquivo `database-helper.js`:

```javascript
const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER || 'seu_usuario',
  password: process.env.DB_PASSWORD || 'sua_senha',
  server: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'AllMoove',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    port: parseInt(process.env.DB_PORT) || 1433
  }
};

async function executarQuery(query) {
  try {
    await sql.connect(config);
    const result = await sql.query(query);
    return result.recordset;
  } catch (err) {
    console.error('Erro SQL:', err);
    throw err;
  } finally {
    await sql.close();
  }
}

// Queries úteis
const queries = {
  // Dashboard Assistência - Ver por que retorna zero
  dashboardAssistencia: (idAssistencia) => `
    SELECT
      COUNT(*) as totalPedidos,
      COUNT(CASE WHEN Status = 'Concluido' THEN 1 END) as pedidosConcluidos,
      COUNT(CASE WHEN Status IN ('Em Andamento', 'Aceito') THEN 1 END) as pedidosEmAndamento
    FROM Pedidos
    WHERE IdAssistencia = ${idAssistencia}
  `,

  // Ver pedidos recentes
  pedidosRecentes: () => `
    SELECT TOP 10 * FROM Pedidos
    ORDER BY DataCriacao DESC
  `,

  // Produtos mais vendidos
  produtosMaisVendidos: () => `
    SELECT TOP 10
      p.Nome,
      COUNT(pi.Id) as TotalVendido,
      SUM(pi.Quantidade) as QuantidadeTotal
    FROM Produtos p
    JOIN PedidoItems pi ON p.Id = pi.IdProduto
    GROUP BY p.Nome
    ORDER BY TotalVendido DESC
  `,

  // Verificar distribuidor com estoque
  distribuidoresComEstoque: () => `
    SELECT
      d.Nome as Distribuidor,
      COUNT(p.Id) as TotalProdutos,
      SUM(p.QuantidadeEstoque) as EstoqueTotal
    FROM Distribuidores d
    JOIN Produtos p ON p.IdDistribuidor = d.Id
    WHERE p.QuantidadeEstoque > 0
    GROUP BY d.Nome
    ORDER BY EstoqueTotal DESC
  `
};

module.exports = { executarQuery, queries };
```

### Como Usar:

```bash
# Criar arquivo de teste
node -e "
const { executarQuery, queries } = require('./database-helper');
(async () => {
  try {
    // Ver dashboard da assistência ID 1
    const dashboard = await executarQuery(queries.dashboardAssistencia(1));
    console.log('Dashboard:', dashboard);

    // Ver pedidos recentes
    const pedidos = await executarQuery(queries.pedidosRecentes());
    console.log('Pedidos recentes:', pedidos.length);
  } catch (error) {
    console.error('Erro:', error);
  }
})();
"
```

## 📊 Script de Diagnóstico do Problema

Criar `diagnostico-dashboard.js`:

```javascript
const { executarQuery } = require('./database-helper');

async function diagnosticarDashboard() {
  console.log('🔍 Diagnóstico do Dashboard AllMoove\n');

  try {
    // 1. Verificar se existem pedidos
    const totalPedidos = await executarQuery('SELECT COUNT(*) as total FROM Pedidos');
    console.log(`✅ Total de pedidos no banco: ${totalPedidos[0].total}`);

    // 2. Verificar estrutura da tabela
    const colunas = await executarQuery(`
      SELECT COLUMN_NAME, DATA_TYPE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'Pedidos'
    `);
    console.log(`✅ Colunas da tabela Pedidos: ${colunas.length}`);

    // 3. Verificar valores únicos de Status
    const statusList = await executarQuery(`
      SELECT DISTINCT Status, COUNT(*) as Quantidade
      FROM Pedidos
      GROUP BY Status
    `);
    console.log('\n📊 Status dos pedidos:');
    statusList.forEach(s => console.log(`   ${s.Status}: ${s.Quantidade} pedidos`));

    // 4. Verificar problema específico do Dashboard
    const idTeste = 1; // ID da assistência para teste
    const dashboard = await executarQuery(`
      SELECT
        COUNT(*) as Total,
        COUNT(CASE WHEN Status = 'Concluído' THEN 1 END) as Concluidos,
        COUNT(CASE WHEN Status = 'Concluido' THEN 1 END) as ConcluidosSemAcento,
        COUNT(CASE WHEN Status LIKE '%Conc%' THEN 1 END) as ConcluidosLike
      FROM Pedidos
      WHERE IdAssistencia = ${idTeste}
    `);

    console.log('\n🎯 Dashboard para Assistência ID', idTeste);
    console.log('   Total:', dashboard[0].Total);
    console.log('   Concluídos (com acento):', dashboard[0].Concluidos);
    console.log('   Concluidos (sem acento):', dashboard[0].ConcluidosSemAcento);
    console.log('   Concluidos (LIKE):', dashboard[0].ConcluidosLike);

    // 5. Possível problema: Case sensitive ou encoding
    console.log('\n⚠️ Possíveis problemas:');
    if (dashboard[0].Concluidos !== dashboard[0].ConcluidosSemAcento) {
      console.log('   - Problema com acentuação no Status');
    }
    if (dashboard[0].Total === 0) {
      console.log('   - Nenhum pedido para esta assistência');
    }

  } catch (error) {
    console.error('❌ Erro no diagnóstico:', error.message);
  }
}

diagnosticarDashboard();
```

## 🚀 Comando para Executar Diagnóstico

```bash
# 1. Instalar dependência
npm install mssql --save-dev

# 2. Executar diagnóstico
node diagnostico-dashboard.js
```

## 💡 Por que o Dashboard retorna zeros?

Possíveis causas:
1. **Case sensitive**: Status está como "Concluído" mas API busca "Concluido"
2. **ID incorreto**: API usa IdAssistencia errado
3. **Joins faltando**: Query não faz join correto com outras tabelas
4. **Dados de teste**: Banco não tem dados reais

O script de diagnóstico vai descobrir!

---
**Atualizado:** Com soluções reais e funcionais