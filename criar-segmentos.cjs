/**
 * Script para criar segmentos específicos de produtos no backend
 */

const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });

const API_URL = 'https://localhost:44370';

// Segmentos que queremos criar
const novosSegmentos = [
  { nome: 'TELAS', descricao: 'Telas, LCD, OLED, AMOLED para dispositivos' },
  { nome: 'BATERIAS', descricao: 'Baterias para smartphones e tablets' },
  { nome: 'CAMERAS', descricao: 'Câmeras frontais e traseiras' },
  { nome: 'CONECTORES', descricao: 'Conectores, placas e flexíveis' },
  { nome: 'CELULARES_COMPLETOS', descricao: 'Smartphones completos' },
  { nome: 'ACESSORIOS', descricao: 'Acessórios diversos para celulares' },
  { nome: 'NOTEBOOKS', descricao: 'Notebooks e peças' },
  { nome: 'AUDIO', descricao: 'Fones, alto-falantes e componentes de áudio' },
];

async function criarSegmentos() {
  console.log('🚀 Criando segmentos específicos no backend...\n');

  const fetch = (await import('node-fetch')).default;

  // 1. Verificar segmentos existentes
  console.log('📋 Verificando segmentos existentes...');
  try {
    const response = await fetch(`${API_URL}/api/ProdutoSegmentos`, { agent });

    if (!response.ok) {
      console.error('❌ Erro ao buscar segmentos:', response.status);
      return;
    }

    const segmentosExistentes = await response.json();
    console.log(`✅ Segmentos existentes: ${segmentosExistentes.length}`);
    segmentosExistentes.forEach(seg => {
      console.log(`  - [${seg.id}] ${seg.nome}`);
    });

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }

  // 2. Criar novos segmentos
  console.log('\n📦 Criando novos segmentos...\n');

  let sucessos = 0;
  let erros = 0;

  for (const segmento of novosSegmentos) {
    try {
      const response = await fetch(`${API_URL}/api/ProdutoSegmentos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: segmento.nome,
          descricao: segmento.descricao,
          situacao: 'ATIVO'
        }),
        agent
      });

      if (response.ok) {
        const resultado = await response.json();
        console.log(`✅ [${resultado.id}] ${segmento.nome}`);
        sucessos++;
      } else {
        const errorText = await response.text();
        console.error(`❌ ${segmento.nome} - ${response.status}: ${errorText.substring(0, 100)}`);
        erros++;
      }
    } catch (error) {
      console.error(`❌ ${segmento.nome} - ${error.message}`);
      erros++;
    }

    // Pequeno delay
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // 3. Listar todos os segmentos após criação
  console.log('\n📊 Segmentos após criação:');
  try {
    const response = await fetch(`${API_URL}/api/ProdutoSegmentos`, { agent });
    const segmentos = await response.json();

    console.log(`\nTotal: ${segmentos.length} segmentos`);
    segmentos.forEach(seg => {
      console.log(`  [${seg.id}] ${seg.nome} - ${seg.descricao || ''}`);
    });
  } catch (error) {
    console.error('❌ Erro ao listar segmentos:', error.message);
  }

  // 4. Resumo
  console.log('\n========================================');
  console.log('🏁 CRIAÇÃO DE SEGMENTOS CONCLUÍDA!');
  console.log('========================================');
  console.log(`✅ Sucessos: ${sucessos}`);
  console.log(`❌ Erros: ${erros}`);
}

criarSegmentos();
