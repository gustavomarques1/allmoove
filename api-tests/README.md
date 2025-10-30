# AllMoove - Testes de API

Suite completa de testes para validar os endpoints da API do AllMoove.

## 📋 Pré-requisitos

1. **API Backend rodando** em `https://localhost:44370/`
2. **Node.js** instalado (v18 ou superior)
3. **Dados de teste** configurados no banco de dados

## 🚀 Instalação

```bash
# Navegue até a pasta de testes
cd api-tests

# Instale as dependências
npm install
```

## ⚙️ Configuração

Antes de executar os testes, ajuste o arquivo `config.js`:

```javascript
export const API_CONFIG = {
  baseURL: 'https://localhost:44370',

  // Ajuste com credenciais válidas do seu banco
  testCredentials: {
    assistenciaTecnica: {
      email: 'assistencia@test.com',
      password: 'Test@123'
    },
    distribuidor: {
      email: 'distribuidor@test.com',
      password: 'Test@123'
    }
  },

  // Ajuste com IDs existentes no seu banco
  testIds: {
    assistenciaId: 1,
    distribuidorId: 1,
    produtoId: 1,
    pedidoId: 1
  }
};
```

## 🧪 Executando os Testes

### Todos os testes

```bash
npm test
```

### Testes específicos

```bash
# Apenas autenticação
npm run test:auth

# Apenas pedidos
npm run test:pedidos

# Apenas produtos
npm run test:produtos
```

### Executar arquivo individual

```bash
node auth.test.js
node pedidos.test.js
node produtos.test.js
```

## 📊 Estrutura dos Testes

```
api-tests/
├── config.js           # Configurações globais
├── auth.test.js        # Testes de autenticação
├── pedidos.test.js     # Testes de pedidos
├── produtos.test.js    # Testes de produtos
├── run-all-tests.js    # Executor principal
├── package.json        # Dependências
└── README.md          # Este arquivo
```

## 🔍 O que é Testado

### 1. Autenticação (`auth.test.js`)

- ✅ Login com credenciais válidas
- ✅ Validação de token JWT
- ✅ Login com senha incorreta (deve falhar)
- ✅ Login com email inexistente (deve falhar)
- ✅ Login sem dados (deve falhar)

### 2. Pedidos (`pedidos.test.js`)

- ✅ Buscar pedidos com autenticação
- ✅ Validação de estrutura dos pedidos
- ✅ Tentativa sem autenticação (deve falhar)
- ✅ Busca com ID inválido
- ✅ Tentativa com token inválido (deve falhar)

### 3. Produtos (`produtos.test.js`)

- ✅ Listar todos os produtos
- ✅ Buscar produto por ID
- ✅ Filtrar produtos por categoria
- ✅ Buscar produtos de um distribuidor

## 📝 Exemplo de Saída

```
═══════════════════════════════════════════════════════
          ALLMOOVE - TESTE DE APIs
═══════════════════════════════════════════════════════

=== TESTES DE AUTENTICAÇÃO ===

→ Teste 1: Login com credenciais válidas
✓ Status 200 OK
✓ Token JWT recebido
✓ Email confirmado: assistencia@test.com
✓ Expiração: 2025-10-28T12:00:00
✓ Token JWT no formato correto (3 partes)
✓ Teste 1 PASSOU

→ Teste 2: Login com senha incorreta
✓ Status 401 Unauthorized (esperado)
✓ Mensagem: Invalid credentials
✓ Teste 2 PASSOU

=== RESUMO - AUTENTICAÇÃO ===
ℹ Total de testes: 4
✓ Passou: 4
✗ Falhou: 0
ℹ Taxa de sucesso: 100.0%
```

## 🐛 Troubleshooting

### Erro: "ECONNREFUSED"

**Problema:** A API não está rodando.

**Solução:**
```bash
# Navegue até a pasta do backend e execute:
cd AllmooveApi
dotnet run
```

### Erro: "401 Unauthorized" nos testes de login

**Problema:** Credenciais incorretas ou usuário não existe.

**Solução:**
1. Verifique se o usuário existe no banco: `SELECT * FROM AspNetUsers WHERE Email = 'assistencia@test.com'`
2. Crie o usuário se necessário ou ajuste as credenciais em `config.js`

### Erro: "Self-signed certificate"

**Problema:** Certificado SSL não confiável (normal em desenvolvimento).

**Solução:** O código já está configurado para aceitar certificados auto-assinados via:
```javascript
httpsAgent: new https.Agent({ rejectUnauthorized: false })
```

### Nenhum pedido/produto encontrado

**Problema:** Banco de dados vazio.

**Solução:**
1. Popule o banco com dados de teste
2. Execute os scripts SQL de migração/seed
3. Ajuste os IDs em `config.js` conforme os dados reais

## 🎯 Cenários de Teste Cobertos

| Cenário | Status Esperado | Descrição |
|---------|----------------|-----------|
| Login válido | 200 | Retorna token JWT |
| Login inválido | 401 | Credenciais incorretas |
| Buscar pedidos com auth | 200 | Lista de pedidos |
| Buscar pedidos sem auth | 401 | Não autorizado |
| Listar produtos | 200 | Array de produtos |
| Produto inexistente | 404 | Not Found |

## 📈 Próximos Passos

Para expandir os testes, você pode adicionar:

1. **Testes de criação de pedidos** (POST)
2. **Testes de atualização** (PUT)
3. **Testes de exclusão** (DELETE)
4. **Testes de permissões por role** (Distribuidor vs Assistência)
5. **Testes de validação de dados** (campos obrigatórios, formatos)
6. **Testes de performance** (tempo de resposta)
7. **Testes de carga** (múltiplas requisições simultâneas)

## 🤝 Contribuindo

Para adicionar novos testes:

1. Crie um novo arquivo `*.test.js`
2. Importe `axiosInstance` e `logger`
3. Exporte uma função async com os testes
4. Adicione a função em `run-all-tests.js`

## 📚 Recursos

- [Axios Documentation](https://axios-http.com/docs/intro)
- [Node.js HTTP/HTTPS](https://nodejs.org/api/https.html)
- [HTTP Status Codes](https://httpstatuses.com/)
- [JWT.io](https://jwt.io/) - Para decodificar tokens JWT
