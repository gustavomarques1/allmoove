const sql = require('mssql/msnodesqlv8');

// Configuração para Windows Authentication
const config = {
  connectionString: 'Driver=SQL Server Native Client 11.0;Server=DESKTOP-8KVURGT\\MSSQLSERVER01;Database=allmoove;Trusted_Connection=yes;'
};

async function diagnosticarDashboard() {
  console.log('🔍 Diagnóstico do Dashboard AllMoove\n');

  try {
    // Conectar ao banco
    await sql.connect(config);
    console.log('✅ Conectado ao SQL Server\n');

    // 1. Total de pedidos
    const totalResult = await sql.query('SELECT COUNT(*) as total FROM PEDIDO');
    console.log(`📦 Total de pedidos: ${totalResult.recordset[0].total}`);

    // 2. Distribuição por status
    const statusResult = await sql.query(`
      SELECT Status, COUNT(*) as Quantidade
      FROM PEDIDO
      GROUP BY Status
      ORDER BY Quantidade DESC
    `);

    console.log('\n📊 Distribuição por Status:');
    statusResult.recordset.forEach(s => {
      console.log(`   ${s.Status || 'NULL'}: ${s.Quantidade} pedidos`);
    });

    // 3. Total de produtos
    const produtosResult = await sql.query('SELECT COUNT(*) as total FROM PRODUTO');
    console.log(`\n📦 Total de produtos: ${produtosResult.recordset[0].total}`);

    // 4. Pedidos por Assistência
    const assistenciaResult = await sql.query(`
      SELECT TOP 10
        p.IdAssistenciaTecnica,
        pes.Nome,
        COUNT(*) as TotalPedidos
      FROM PEDIDO p
      LEFT JOIN PESSOA pes ON p.IdAssistenciaTecnica = pes.Id
      GROUP BY p.IdAssistenciaTecnica, pes.Nome
      ORDER BY TotalPedidos DESC
    `);

    console.log('\n🏢 Top Assistências com mais pedidos:');
    assistenciaResult.recordset.forEach((a, i) => {
      console.log(`   ${i + 1}. ${a.Nome || 'ID: ' + a.IdAssistenciaTecnica}: ${a.TotalPedidos} pedidos`);
    });

    // 5. Produtos mais vendidos
    const maisVendidosResult = await sql.query(`
      SELECT TOP 10
        prod.Nome,
        COUNT(pi.Id) as Vendas,
        SUM(pi.Quantidade) as QtdTotal
      FROM PRODUTO prod
      INNER JOIN PEDIDO_ITEM pi ON prod.Id = pi.IdProduto
      GROUP BY prod.Nome
      ORDER BY Vendas DESC
    `);

    console.log('\n🏆 Produtos Mais Vendidos:');
    maisVendidosResult.recordset.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.Nome}: ${p.Vendas} vendas (${p.QtdTotal} unidades)`);
    });

    // 6. Verificar estrutura das colunas do PEDIDO
    const colunasResult = await sql.query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'PEDIDO'
      AND COLUMN_NAME LIKE '%Assist%'
    `);

    console.log('\n🔍 Colunas relacionadas a Assistência na tabela PEDIDO:');
    colunasResult.recordset.forEach(col => {
      console.log(`   - ${col.COLUMN_NAME}`);
    });

    // 7. Dashboard - Simulando query da API
    const idTeste = 1;
    const dashResult = await sql.query(`
      SELECT
        COUNT(*) as TotalPedidos,
        COUNT(CASE WHEN Status = 'Concluído' THEN 1 END) as Concluidos,
        COUNT(CASE WHEN Status = 'Em Andamento' THEN 1 END) as EmAndamento,
        COUNT(CASE WHEN Status = 'Aceito' THEN 1 END) as Aceitos
      FROM PEDIDO
      WHERE IdAssistenciaTecnica = ${idTeste}
    `);

    console.log(`\n📊 Dashboard para Assistência ID ${idTeste}:`);
    const d = dashResult.recordset[0];
    console.log(`   - Total: ${d.TotalPedidos}`);
    console.log(`   - Concluídos: ${d.Concluidos}`);
    console.log(`   - Em Andamento: ${d.EmAndamento}`);
    console.log(`   - Aceitos: ${d.Aceitos}`);

    // 8. Verificar últimos pedidos
    const ultimosResult = await sql.query(`
      SELECT TOP 5
        Id,
        IdAssistenciaTecnica,
        IdDistribuidor,
        Status,
        DataCriacao,
        ValorTotal
      FROM PEDIDO
      ORDER BY DataCriacao DESC
    `);

    console.log('\n📅 Últimos 5 Pedidos:');
    ultimosResult.recordset.forEach(p => {
      const data = p.DataCriacao ? new Date(p.DataCriacao).toLocaleDateString('pt-BR') : 'Sem data';
      console.log(`   ID ${p.Id}: Status "${p.Status}" - R$ ${p.ValorTotal || 0} - ${data}`);
    });

    // 9. Diagnóstico final
    console.log('\n💡 Análise do problema do Dashboard:');

    if (d.TotalPedidos === 0) {
      console.log('   ⚠️ Nenhum pedido encontrado para Assistência ID 1');
      console.log('      → Verificar se IdAssistenciaTecnica está correto');
    }

    if (d.Concluidos === 0 && d.TotalPedidos > 0) {
      console.log('   ⚠️ Nenhum pedido com status "Concluído"');
      console.log('      → Verificar valores exatos do campo Status');
    }

  } catch (error) {
    console.error('❌ Erro:');
    console.error('   ', error.message || error);

    if (error.message && error.message.includes('Invalid object name')) {
      console.log('\n💡 Dica: Verifique os nomes das tabelas (PEDIDO, não Pedidos)');
    }
  } finally {
    await sql.close();
  }
}

// Executar
diagnosticarDashboard().then(() => {
  console.log('\n✅ Diagnóstico concluído!');
  process.exit(0);
}).catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});