import axios from "axios";

const api = axios.create({
    baseURL : "https://localhost:44370/",
})

// ============================================
// SISTEMA DE MONITORAMENTO DE APIs EM TEMPO REAL
// ============================================

// Armazena estatísticas de uso das APIs
const apiMonitor = {
  calls: [],
  stats: {},
  startTime: Date.now(),

  addCall(method, url, status, duration) {
    const endpoint = `${method.toUpperCase()} ${url}`;
    const timestamp = new Date().toISOString();

    // Adiciona chamada ao histórico
    this.calls.push({
      method,
      url,
      status,
      duration,
      timestamp,
      endpoint
    });

    // Atualiza estatísticas
    if (!this.stats[endpoint]) {
      this.stats[endpoint] = {
        count: 0,
        totalDuration: 0,
        avgDuration: 0,
        errors: 0,
        success: 0,
        lastCalled: null
      };
    }

    const stat = this.stats[endpoint];
    stat.count++;
    stat.totalDuration += duration;
    stat.avgDuration = stat.totalDuration / stat.count;
    stat.lastCalled = timestamp;

    if (status >= 200 && status < 300) {
      stat.success++;
    } else {
      stat.errors++;
    }
  },

  // Mostra dashboard no console
  showDashboard() {
    console.clear();
    console.log('%c╔══════════════════════════════════════════════════════════╗', 'color: #4CAF50; font-weight: bold');
    console.log('%c║        MONITOR DE APIs - TEMPO REAL                     ║', 'color: #4CAF50; font-weight: bold');
    console.log('%c╚══════════════════════════════════════════════════════════╝', 'color: #4CAF50; font-weight: bold');
    console.log('');

    const uptime = ((Date.now() - this.startTime) / 1000 / 60).toFixed(2);
    console.log(`%c⏱️  Tempo de monitoramento: ${uptime} minutos`, 'color: #2196F3; font-weight: bold');
    console.log(`%c📊 Total de chamadas: ${this.calls.length}`, 'color: #2196F3; font-weight: bold');
    console.log(`%c🎯 Endpoints únicos: ${Object.keys(this.stats).length}`, 'color: #2196F3; font-weight: bold');
    console.log('');

    // Ordena por mais chamados
    const sorted = Object.entries(this.stats)
      .sort(([, a], [, b]) => b.count - a.count);

    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #FFC107');
    console.log('%c🔥 ENDPOINTS MAIS UTILIZADOS', 'color: #FF5722; font-weight: bold; font-size: 14px');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #FFC107');
    console.log('');

    sorted.forEach(([endpoint, stat], index) => {
      const color = stat.errors > 0 ? '#f44336' : '#4CAF50';
      const icon = stat.errors > 0 ? '❌' : '✅';

      console.groupCollapsed(
        `%c${index + 1}. ${icon} ${endpoint}`,
        `color: ${color}; font-weight: bold; font-size: 12px`
      );

      console.log(`   📞 Chamadas: ${stat.count}`);
      console.log(`   ✅ Sucessos: ${stat.success}`);
      console.log(`   ❌ Erros: ${stat.errors}`);
      console.log(`   ⚡ Tempo médio: ${stat.avgDuration.toFixed(2)}ms`);
      console.log(`   🕐 Última chamada: ${new Date(stat.lastCalled).toLocaleTimeString()}`);

      console.groupEnd();
    });

    console.log('');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #FFC107');
    console.log('%c📝 ÚLTIMAS 10 CHAMADAS', 'color: #9C27B0; font-weight: bold; font-size: 14px');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #FFC107');
    console.log('');

    const recent = this.calls.slice(-10).reverse();
    recent.forEach((call, index) => {
      const statusColor = call.status >= 200 && call.status < 300 ? '#4CAF50' : '#f44336';
      const time = new Date(call.timestamp).toLocaleTimeString();

      console.log(
        `%c${time} %c${call.method.toUpperCase().padEnd(6)} %c${call.status} %c${call.url} %c(${call.duration}ms)`,
        'color: #9E9E9E',
        'color: #2196F3; font-weight: bold',
        `color: ${statusColor}; font-weight: bold`,
        'color: #fff',
        'color: #FFC107'
      );
    });

    console.log('');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #FFC107');
    console.log('%c💡 Dica: Use window.apiMonitor para acessar os dados do monitor', 'color: #03A9F4; font-style: italic');
    console.log('%c    - window.apiMonitor.showDashboard()  → Mostrar este dashboard', 'color: #03A9F4; font-style: italic');
    console.log('%c    - window.apiMonitor.stats            → Ver estatísticas', 'color: #03A9F4; font-style: italic');
    console.log('%c    - window.apiMonitor.calls            → Ver histórico completo', 'color: #03A9F4; font-style: italic');
    console.log('%c    - window.apiMonitor.getUnusedAPIs()  → Ver APIs não utilizadas', 'color: #03A9F4; font-style: italic');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #FFC107');
    console.log('');
  },

  // Lista de todas as APIs disponíveis no backend
  availableAPIs: [
    // Account
    'POST /api/Account/CreateUser',
    'POST /api/Account/LoginUser',

    // Dashboard
    'GET /api/Dashboard/{papel}/{idPessoa}',

    // Pessoas
    'GET /api/Pessoas',
    'GET /api/Pessoas/{id}',
    'GET /api/Pessoas/GetByNome',
    'POST /api/Pessoas',
    'PUT /api/Pessoas/{id}',
    'DELETE /api/Pessoas/{id}',

    // Distribuidor
    'GET /api/Distribuidor/consulta',
    'GET /api/Distribuidor/favoritos/{idSegmento}/{idAssistencia}',
    'GET /api/Distribuidor/ultimospedidos/{idAssistencia}',

    // Produtos
    'GET /api/Produtos',
    'GET /api/Produtos/{id}',
    'GET /api/Produtos/distribuidor/{id}',
    'POST /api/Produtos',
    'PUT /api/Produtos/{id}',
    'DELETE /api/Produtos/{id}',

    // Fornecedores
    'GET /api/Fornecedores',

    // Produto Catálogos
    'GET /api/ProdutoSegmentos',
    'GET /api/ProdutoGrupos',
    'GET /api/ProdutoMarcas',
    'GET /api/ProdutoModelos',
    'GET /api/ProdutoTags',
    'GET /api/ProdutoEscolhaCarrinho',

    // Pedidos
    'GET /api/Pedidos',
    'GET /api/Pedidos/{id}',
    'GET /api/Pedidos/distribuidor/{id}',
    'GET /api/Pedidos/assistencia/{id}',
    'POST /api/Pedidos',
    'PUT /api/Pedidos/{id}',
    'DELETE /api/Pedidos/{id}',

    // Pedido Items
    'GET /api/PedidoItems',
    'GET /api/PedidoItems/{id}',
    'GET /api/PedidoItems/pedido/{idPedido}',
    'POST /api/PedidoItems',
    'PUT /api/PedidoItems/{id}',
    'DELETE /api/PedidoItems/{id}',

    // Pedido Grupos
    'GET /api/PedidoGrupos',
    'GET /api/PedidoGrupos/{id}',
    'POST /api/PedidoGrupos',
    'PUT /api/PedidoGrupos/{id}',
    'DELETE /api/PedidoGrupos/{id}',

    // Pedido Timelines
    'GET /api/PedidoTimelines/pedido/{pedidoId}',

    // Contatos
    'GET /api/Contatos',
    'GET /api/Contatos/{id}',
    'POST /api/Contatos',
    'PUT /api/Contatos/{id}',
    'DELETE /api/Contatos/{id}',

    // Endereços
    'GET /api/Enderecos',
    'GET /api/Enderecos/{id}',
    'POST /api/Enderecos',
    'PUT /api/Enderecos/{id}',
    'DELETE /api/Enderecos/{id}',

    // Documentos
    'GET /api/Documentos',
    'GET /api/Documentos/{id}',
    'POST /api/Documentos',
    'PUT /api/Documentos/{id}',
    'DELETE /api/Documentos/{id}',
  ],

  // Verifica APIs não utilizadas
  getUnusedAPIs() {
    const usedEndpoints = Object.keys(this.stats);

    // Normaliza os endpoints usados (remove parâmetros dinâmicos)
    const normalizedUsed = usedEndpoints.map(endpoint => {
      return endpoint.replace(/\/\d+/g, '/{id}')
                     .replace(/\/[0-9a-f-]{36}/g, '/{id}');
    });

    const unused = this.availableAPIs.filter(api => {
      const normalized = api.replace(/\{[^}]+\}/g, '/{id}');
      return !normalizedUsed.some(used => used.includes(normalized) || normalized.includes(used));
    });

    console.log('%c╔══════════════════════════════════════════════════════════╗', 'color: #FF9800; font-weight: bold');
    console.log('%c║        APIs NÃO UTILIZADAS NO FRONTEND                   ║', 'color: #FF9800; font-weight: bold');
    console.log('%c╚══════════════════════════════════════════════════════════╝', 'color: #FF9800; font-weight: bold');
    console.log('');
    console.log(`%c📊 Total de APIs disponíveis: ${this.availableAPIs.length}`, 'color: #2196F3; font-weight: bold');
    console.log(`%c✅ APIs sendo utilizadas: ${this.availableAPIs.length - unused.length}`, 'color: #4CAF50; font-weight: bold');
    console.log(`%c⚠️  APIs NÃO utilizadas: ${unused.length}`, 'color: #FF9800; font-weight: bold');
    console.log('');

    if (unused.length > 0) {
      console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #FF9800');
      unused.forEach((api, index) => {
        console.log(`%c${index + 1}. ${api}`, 'color: #FF9800');
      });
      console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #FF9800');
    } else {
      console.log('%c🎉 Todas as APIs estão sendo utilizadas!', 'color: #4CAF50; font-weight: bold');
    }

    return unused;
  },

  // Exporta relatório para download
  exportReport() {
    const report = {
      timestamp: new Date().toISOString(),
      uptime: (Date.now() - this.startTime) / 1000,
      totalCalls: this.calls.length,
      uniqueEndpoints: Object.keys(this.stats).length,
      stats: this.stats,
      calls: this.calls,
      unusedAPIs: this.getUnusedAPIs()
    };

    const dataStr = JSON.stringify(report, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `api-monitor-report-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    console.log('%c✅ Relatório exportado com sucesso!', 'color: #4CAF50; font-weight: bold');
  }
};

// Disponibiliza o monitor globalmente
window.apiMonitor = apiMonitor;

// Interceptor para adicionar token e registrar requests
api.interceptors.request.use(
  (config) => {
    // Adiciona token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Marca o tempo de início da requisição
    config.metadata = { startTime: Date.now() };

    // Log da requisição
    const url = config.url.replace(config.baseURL || '', '');
    console.log(
      `%c→ ${config.method.toUpperCase()} %c${url}`,
      'color: #2196F3; font-weight: bold',
      'color: #fff'
    );

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para registrar responses
api.interceptors.response.use(
  (response) => {
    const duration = Date.now() - response.config.metadata.startTime;
    const url = response.config.url.replace(response.config.baseURL || '', '');

    // Registra no monitor
    apiMonitor.addCall(
      response.config.method,
      url,
      response.status,
      duration
    );

    // Log da resposta
    console.log(
      `%c← ${response.config.method.toUpperCase()} %c${url} %c${response.status} %c(${duration}ms)`,
      'color: #4CAF50; font-weight: bold',
      'color: #fff',
      'color: #4CAF50; font-weight: bold',
      'color: #FFC107'
    );

    return response;
  },
  (error) => {
    if (error.config && error.config.metadata) {
      const duration = Date.now() - error.config.metadata.startTime;
      const url = error.config.url.replace(error.config.baseURL || '', '');
      const status = error.response ? error.response.status : 0;

      // Registra no monitor
      apiMonitor.addCall(
        error.config.method,
        url,
        status,
        duration
      );

      // Log do erro
      console.log(
        `%c← ${error.config.method.toUpperCase()} %c${url} %c${status} %c(${duration}ms) %cERRO`,
        'color: #f44336; font-weight: bold',
        'color: #fff',
        'color: #f44336; font-weight: bold',
        'color: #FFC107',
        'color: #f44336; font-weight: bold'
      );
    }

    return Promise.reject(error);
  }
);

// Atualiza o dashboard automaticamente a cada 30 segundos
// ⚠️ DESABILITADO TEMPORARIAMENTE PARA TESTES DE CADASTRO
// setInterval(() => {
//   if (apiMonitor.calls.length > 0) {
//     apiMonitor.showDashboard();
//   }
// }, 30000);

// Mostra mensagem de boas-vindas
console.log('%c╔══════════════════════════════════════════════════════════╗', 'color: #4CAF50; font-weight: bold; font-size: 14px');
console.log('%c║   🚀 MONITOR DE APIs ATIVADO - TEMPO REAL                ║', 'color: #4CAF50; font-weight: bold; font-size: 14px');
console.log('%c╚══════════════════════════════════════════════════════════╝', 'color: #4CAF50; font-weight: bold; font-size: 14px');
console.log('%c📊 Todas as chamadas de API serão monitoradas automaticamente', 'color: #2196F3');
console.log('%c💡 Use window.apiMonitor.showDashboard() para ver o painel', 'color: #03A9F4');
console.log('');

export default api;