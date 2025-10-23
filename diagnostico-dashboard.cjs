const sql = require('mssql/msnodesqlv8');  // Usar driver Windows Auth

// Configuração para Windows Authentication
const config = {
  connectionString: 'Driver=SQL Server Native Client 11.0;Server=DESKTOP-8KVURGT\\MSSQLSERVER01;Database=AllMoove;Trusted_Connection=yes;'
};

async function diagnosticarDashboard() {
  console.log('🔍 Diagnóstico do Dashboard AllMoove\n');

  try {
    // Conectar ao banco
    await sql.connect(config);
    console.log('✅ Conectado ao SQL Server\n');

    // 1. Verificar se existem pedidos
    const totalResult = await sql.query('SELECT COUNT(*) as total FROM Pedidos');
    console.log(`📦 Total de pedidos no banco: ${totalResult.recordset[0].total}`);

    // 2. Verificar status dos pedidos
    const statusResult = await sql.query(`
      SELECT Status, COUNT(*) as Quantidade
      FROM Pedidos
      GROUP BY Status
      ORDER BY Quantidade DESC
    `);

    console.log('\n📊 Distribuição por Status:');
    statusResult.recordset.forEach(s => {
      console.log(`   ${s.Status || 'NULL'}: ${s.Quantidade} pedidos`);
    });

    // 3. Verificar problema do Dashboard (retornando zeros)
    console.log('\n🎯 Testando query do Dashboard:');

    // Simular assistência ID 1
    const idAssistencia = 1;
    const dashboardResult = await sql.query(`
      SELECT
        COUNT(*) as TotalPedidos,
        COUNT(CASE WHEN Status = 'Concluído' THEN 1 END) as ComAcento,
        COUNT(CASE WHEN Status = 'Concluido' THEN 1 END) as SemAcento,
        COUNT(CASE WHEN Status IN ('Em Andamento', 'Aceito') THEN 1 END) as EmAndamento
      FROM Pedidos
      WHERE IdAssistencia = ${idAssistencia}
    `);

    const dash = dashboardResult.recordset[0];
    console.log(`\n   Para Assistência ID ${idAssistencia}:`);
    console.log(`   - Total: ${dash.TotalPedidos}`);
    console.log(`   - Concluídos (com acento): ${dash.ComAcento}`);
    console.log(`   - Concluidos (sem acento): ${dash.SemAcento}`);
    console.log(`   - Em Andamento: ${dash.EmAndamento}`);

    // 4. Verificar se existe a coluna IdAssistencia
    const columnResult = await sql.query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'Pedidos'
      AND COLUMN_NAME LIKE '%Assist%'
    `);

    console.log('\n🔍 Colunas relacionadas a Assistência:');
    columnResult.recordset.forEach(col => {
      console.log(`   - ${col.COLUMN_NAME}`);
    });

    // 5. Produtos mais vendidos
    console.log('\n🏆 Top 5 Produtos Mais Vendidos:');
    const produtosResult = await sql.query(`
      SELECT TOP 5
        p.Nome,
        COUNT(pi.Id) as Vendas,
        SUM(pi.Quantidade) as QtdTotal
      FROM Produtos p
      INNER JOIN PedidoItems pi ON p.Id = pi.IdProduto
      GROUP BY p.Nome
      ORDER BY Vendas DESC
    `);

    produtosResult.recordset.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.Nome}: ${p.Vendas} vendas (${p.QtdTotal} unidades)`);
    });

    // 6. Diagnóstico final
    console.log('\n💡 Possíveis problemas identificados:');

    if (dash.TotalPedidos === 0) {
      console.log('   ⚠️ Nenhum pedido para Assistência ID 1');
      console.log('      → Talvez o campo seja IdAssistenciaTecnica ou outro nome');
    }

    if (dash.ComAcento !== dash.SemAcento) {
      console.log('   ⚠️ Inconsistência na acentuação do Status');
      console.log('      → Padronizar para "Concluido" sem acento');
    }

    if (columnResult.recordset.length === 0) {
      console.log('   ⚠️ Campo IdAssistencia pode não existir');
      console.log('      → Verificar nome correto do campo');
    }

  } catch (error) {
    console.error('❌ Erro na conexão:');
    console.error('   Mensagem:', error.message || error);
    if (error.code) console.error('   Código:', error.code);
    if (error.originalError) console.error('   Erro original:', error.originalError.message);

    console.log('\n📝 Dicas para resolver:');
    console.log('   1. Verifique se o SQL Server está rodando');
    console.log('   2. Confirme o nome da instância: DESKTOP-8KVURGT\\MSSQLSERVER01');
    console.log('   3. Verifique se o serviço SQL Server Browser está ativo');
    console.log('   4. Nome do banco está correto? (AllMoove)');
  } finally {
    await sql.close();
  }
}

// Executar diagnóstico
diagnosticarDashboard().then(() => {
  console.log('\n✅ Diagnóstico concluído!');
  process.exit(0);
}).catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});