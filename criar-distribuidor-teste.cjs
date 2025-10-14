const https = require('https');
const readline = require('readline');

// Ignora certificado SSL self-signed em desenvolvimento
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const API_BASE = 'https://localhost:44370';

// Cores para terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE);

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const response = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function criarDistribuidor() {
  log('\n===========================================', 'cyan');
  log('  🏢 CRIAR USUÁRIO DISTRIBUIDOR DE TESTE', 'cyan');
  log('===========================================\n', 'cyan');

  const email = 'distrib@teste.com'; // Reduzido para caber em 20 caracteres
  const login = 'distribuidor'; // Login curto (12 caracteres)
  const senha = 'Senha@12345';
  const nome = 'Distribuidora Teste Ltda';
  const cnpj = '12345678000100';

  log(`📧 Email: ${email}`, 'blue');
  log(`👤 Login: ${login}`, 'blue');
  log(`🔒 Senha: ${senha}`, 'blue');
  log(`🏢 Nome: ${nome}`, 'blue');
  log(`📄 CNPJ: ${cnpj}\n`, 'blue');

  // Passo 1: Criar usuário no Identity
  log('📝 Passo 1: Criando usuário no Identity...', 'yellow');
  try {
    const createUserRes = await makeRequest('POST', '/api/account/CreateUser', {
      email: email,
      password: senha,
      confirmPassword: senha
    });

    if (createUserRes.status === 200 || createUserRes.status === 201) {
      log('✅ Usuário criado no Identity com sucesso!', 'green');
    } else if (createUserRes.status === 400 && JSON.stringify(createUserRes.data).includes('already')) {
      log('⚠️  Usuário já existe no Identity (ok, continuando...)', 'yellow');
    } else {
      log(`❌ Erro ao criar usuário: ${JSON.stringify(createUserRes.data)}`, 'red');
      return;
    }
  } catch (error) {
    log(`❌ Erro na requisição: ${error.message}`, 'red');
    return;
  }

  // Passo 2: Fazer login para obter token
  log('\n🔐 Passo 2: Fazendo login para obter token...', 'yellow');
  let token;
  try {
    const loginRes = await makeRequest('POST', '/api/account/LoginUser', {
      email: email,
      password: senha
    });

    if (loginRes.status === 200 && loginRes.data.token) {
      token = loginRes.data.token;
      log('✅ Login realizado com sucesso!', 'green');
      log(`🎟️  Token obtido: ${token.substring(0, 50)}...`, 'green');
    } else {
      log(`❌ Erro no login: ${JSON.stringify(loginRes.data)}`, 'red');
      return;
    }
  } catch (error) {
    log(`❌ Erro na requisição: ${error.message}`, 'red');
    return;
  }

  // Passo 3: Criar pessoa com tipo DISTRIBUIDOR
  log('\n🏢 Passo 3: Criando pessoa com tipo DISTRIBUIDOR...', 'yellow');
  try {
    const createPessoaRes = await makeRequest('POST', '/api/pessoas', {
      empresa: 1,
      estabelecimento: 1,
      codigo: 'DIST001',
      tipo: 'DISTRIBUIDOR',
      nome: nome,
      cpfCnpj: cnpj,
      dataNascimento: '1990-01-01T00:00:00.000Z',
      contatoPreferido: 0,
      enderecoPreferido: 0,
      login: login,
      senha: senha,
      situacao: 'ATIVO',
      situacaoRegistro: 'ATIVO',
      usuarioCriacao: 'SISTEMA',
      usuarioAlteracao: 'SISTEMA'
    }, token);

    if (createPessoaRes.status === 200 || createPessoaRes.status === 201) {
      log('✅ Pessoa criada com sucesso!', 'green');
      log(`👤 ID da Pessoa: ${createPessoaRes.data.id}`, 'green');
      log(`📝 Nome: ${createPessoaRes.data.nome}`, 'green');
      log(`🎭 Tipo: ${createPessoaRes.data.tipo}`, 'green');
    } else if (createPessoaRes.status === 400 && JSON.stringify(createPessoaRes.data).includes('já existe')) {
      log('⚠️  Pessoa já existe no sistema (ok!)', 'yellow');
    } else {
      log(`❌ Erro ao criar pessoa: ${JSON.stringify(createPessoaRes.data)}`, 'red');
      log('\n💡 Dica: Se der erro 404, verifique se o endpoint /api/pessoas existe no backend', 'yellow');
      return;
    }
  } catch (error) {
    log(`❌ Erro na requisição: ${error.message}`, 'red');
    return;
  }

  // Sucesso!
  log('\n===========================================', 'cyan');
  log('  ✅ USUÁRIO DISTRIBUIDOR CRIADO!', 'green');
  log('===========================================\n', 'cyan');

  log('📋 CREDENCIAIS DE LOGIN:', 'blue');
  log(`   Email: ${email}`, 'blue');
  log(`   Senha: ${senha}`, 'blue');
  log('', '');
  log('🚀 Próximos passos:', 'yellow');
  log('   1. Abra o projeto React: http://localhost:5173', 'yellow');
  log('   2. Faça login com as credenciais acima', 'yellow');
  log('   3. Você será redirecionado para /distribuidor/dashboard', 'yellow');
  log('   4. Clique em "Gerenciar" para acessar a tela de estoque\n', 'yellow');
}

// Executar
criarDistribuidor()
  .then(() => {
    log('✅ Script concluído!', 'green');
    process.exit(0);
  })
  .catch((error) => {
    log(`❌ Erro fatal: ${error.message}`, 'red');
    process.exit(1);
  });
