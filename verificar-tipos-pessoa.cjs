const sql = require('mssql/msnodesqlv8');

// Configuração para Windows Authentication
const config = {
  connectionString: 'Driver=SQL Server Native Client 11.0;Server=DESKTOP-8KVURGT\\MSSQLSERVER01;Database=allmoove;Trusted_Connection=yes;'
};

async function verificarTiposPessoa() {
  console.log('🔍 Verificando tipos de pessoa no banco de dados\n');

  try {
    const pool = await sql.connect(config);
    console.log('✅ Conectado ao SQL Server\n');

    // 1. Verificar quais tipos existem
    const tiposResult = await sql.query(`
      SELECT DISTINCT Tipo, COUNT(*) as Quantidade
      FROM PESSOA
      GROUP BY Tipo
      ORDER BY Quantidade DESC
    `);

    console.log('📊 Tipos de pessoa encontrados:');
    tiposResult.recordset.forEach(t => {
      console.log(`   ${t.Tipo || 'NULL'}: ${t.Quantidade} pessoas`);
    });

    // 2. Exemplos de cada tipo
    console.log('\n👥 Exemplos de pessoas por tipo:\n');

    const tipos = tiposResult.recordset.map(t => t.Tipo).filter(t => t);

    for (const tipo of tipos) {
      const exemplosResult = await sql.query(`
        SELECT TOP 3 Id, Nome, Login, Email, Tipo
        FROM PESSOA
        WHERE Tipo = '${tipo}'
      `);

      console.log(`\n📌 ${tipo}:`);
      exemplosResult.recordset.forEach(p => {
        console.log(`   - ID ${p.Id}: ${p.Nome}`);
        console.log(`     Login: ${p.Login || 'N/A'}`);
        console.log(`     Email: ${p.Email || 'N/A'}`);
      });
    }

    // 3. Verificar pessoas sem tipo definido
    const semTipoResult = await sql.query(`
      SELECT COUNT(*) as Total
      FROM PESSOA
      WHERE Tipo IS NULL OR Tipo = ''
    `);

    const semTipo = semTipoResult.recordset[0].Total;
    if (semTipo > 0) {
      console.log(`\n⚠️ ${semTipo} pessoas SEM tipo definido`);

      const exemplosSemTipo = await sql.query(`
        SELECT TOP 3 Id, Nome, Login, Email
        FROM PESSOA
        WHERE Tipo IS NULL OR Tipo = ''
      `);

      console.log('\nExemplos:');
      exemplosSemTipo.recordset.forEach(p => {
        console.log(`   - ID ${p.Id}: ${p.Nome} (${p.Login || p.Email || 'sem login'})`);
      });
    } else {
      console.log('\n✅ Todas as pessoas têm tipo definido!');
    }

    // 4. Verificar mapeamento de roles esperados
    console.log('\n\n🎯 Mapeamento de Roles Esperados:');
    console.log('   - ASSISTENCIA_TECNICA → /assistencia/dashboard');
    console.log('   - DISTRIBUIDOR → /distribuidor/dashboard');
    console.log('   - ENTREGADOR → /entregador/dashboard');

    console.log('\n💡 Tipos encontrados no banco vs Esperados:');
    const esperados = ['ASSISTENCIA_TECNICA', 'DISTRIBUIDOR', 'ENTREGADOR'];
    const encontrados = tiposResult.recordset.map(t => t.Tipo).filter(t => t);

    esperados.forEach(esperado => {
      if (encontrados.includes(esperado)) {
        console.log(`   ✅ ${esperado} - ENCONTRADO`);
      } else {
        console.log(`   ⚠️ ${esperado} - NÃO ENCONTRADO`);
      }
    });

    encontrados.forEach(encontrado => {
      if (!esperados.includes(encontrado)) {
        console.log(`   ❓ ${encontrado} - TIPO DESCONHECIDO (não mapeado no frontend)`);
      }
    });

  } catch (error) {
    console.error('❌ Erro:', error.message || error);
  } finally {
    await sql.close();
  }
}

// Executar
verificarTiposPessoa().then(() => {
  console.log('\n✅ Verificação concluída!');
  process.exit(0);
}).catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
