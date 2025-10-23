# 🔐 Sistema de Roles/Papéis - AllMoove

## 📋 Visão Geral

O AllMoove possui **3 jornadas diferentes** baseadas no papel (role) do usuário:

| Papel | Descrição | Dashboard |
|---|---|---|
| **ASSISTENCIA_TECNICA** | Assistências técnicas que fazem pedidos de peças | `/assistencia/dashboard` |
| **DISTRIBUIDOR** | Distribuidores que gerenciam pedidos e estoque | `/distribuidor/dashboard` |
| **ENTREGADOR** | Entregadores que realizam as entregas | `/entregador/dashboard` |

---

## 🔄 Fluxo de Autenticação e Redirecionamento

### 1. **Login (Tela Inicial)**

**Arquivo:** `src/Components/InicialTela/Inicial.jsx`

```javascript
const handleLogin = async (event) => {
  event.preventDefault();

  // 1. Chama o hook useAuth para fazer login
  const result = await login(email, password);

  if (result.success) {
    // 2. Obtém a rota do dashboard baseada no papel
    const dashboardRoute = getDashboardRoute(result.role);

    // 3. Redireciona para o dashboard correto
    navigate(dashboardRoute);
  }
};
```

**Exemplo de redirecionamento:**
- Usuário com `tipo: "DISTRIBUIDOR"` → `/distribuidor/dashboard`
- Usuário com `tipo: "ASSISTENCIA_TECNICA"` → `/assistencia/dashboard`
- Usuário com `tipo: "ENTREGADOR"` → `/entregador/dashboard`

---

### 2. **Hook de Autenticação (useAuth)**

**Arquivo:** `src/hooks/useAuth.js`

#### **Função `login()` - Linhas 67-184**

```javascript
const login = async (email, password) => {
  // 1. Autentica com /api/account/LoginUser
  const { token, expiration } = loginResponse.data;
  localStorage.setItem('token', token);

  // 2. Busca dados da pessoa em /api/pessoas
  const pessoasResponse = await api.get('/api/pessoas');
  const pessoa = pessoas.find(p => p.login === email);

  // 3. Extrai o papel (role) do campo "tipo"
  const role = pessoa.tipo || 'ASSISTENCIA_TECNICA';

  // 4. Salva role no localStorage
  localStorage.setItem('userRole', role);
  localStorage.setItem('idPessoa', pessoa.id);
  localStorage.setItem('userName', pessoa.nome);

  // 5. Retorna sucesso com o role
  return { success: true, role };
};
```

#### **Função `getDashboardRoute()` - Linhas 227-240**

```javascript
const getDashboardRoute = (role = null) => {
  const effectiveRole = role || userRole;

  switch (effectiveRole) {
    case 'ASSISTENCIA_TECNICA':
      return '/assistencia/dashboard';
    case 'DISTRIBUIDOR':
      return '/distribuidor/dashboard';
    case 'ENTREGADOR':
      return '/entregador/dashboard';
    default:
      return '/assistencia/dashboard'; // Fallback
  }
};
```

#### **Outras funções úteis:**

```javascript
// Verifica se usuário tem um papel específico
const hasRole = (role) => {
  return userRole === role;
};

// Verifica se usuário tem algum dos papéis fornecidos
const hasAnyRole = (roles) => {
  return roles.includes(userRole);
};
```

---

## 🗺️ Estrutura de Rotas

**Arquivo:** `src/App.jsx`

### **1. Jornada ASSISTÊNCIA TÉCNICA**

```javascript
// Dashboard principal
/assistencia/dashboard → <TelaDashboard />

// Fluxo de compra
/assistencia/loja → <PaginaLoja />
/assistencia/delivery-options → <TelaEntrega />
/assistencia/pagamento → <TelaPagamento />
/assistencia/payment-success → <TelaConfirmacao />
```

### **2. Jornada DISTRIBUIDOR**

```javascript
// Dashboard de pedidos
/distribuidor/dashboard → <DistribuidorDashboard />

// Gestão de estoque
/distribuidor/estoque → <TelaEstoque />
```

### **3. Jornada ENTREGADOR**

```javascript
// Dashboard de entregas
/entregador/dashboard → <TelaEntregador />
```

---

## 📊 Como o Backend Define o Role

**Endpoint:** `GET /api/pessoas`

**Estrutura esperada:**

```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "login": "joao@assistencia.com",
    "cpfCnpj": "12345678900",
    "tipo": "ASSISTENCIA_TECNICA"  ← Campo que define o papel
  },
  {
    "id": 2,
    "nome": "Maria Distribuidora LTDA",
    "login": "maria@distribuidor.com",
    "cpfCnpj": "12345678000190",
    "tipo": "DISTRIBUIDOR"  ← Campo que define o papel
  },
  {
    "id": 3,
    "nome": "Carlos Entregador",
    "login": "carlos@entregador.com",
    "cpfCnpj": "98765432100",
    "tipo": "ENTREGADOR"  ← Campo que define o papel
  }
]
```

**⚠️ IMPORTANTE:** O campo `tipo` da tabela `PESSOA` no banco de dados **DEVE** conter um dos valores:
- `ASSISTENCIA_TECNICA`
- `DISTRIBUIDOR`
- `ENTREGADOR`

---

## 🔒 Proteção de Rotas (Atualmente Desabilitada)

**Arquivo:** `src/App.jsx` - Linhas 12-14

```javascript
// import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
// import NaoAutorizado from "./Components/NaoAutorizado/NaoAutorizado";
// import { ROLES } from "./hooks/useAuth";
```

**Status:** As rotas **NÃO estão protegidas** atualmente. Qualquer pessoa pode acessar qualquer rota diretamente pela URL.

### **Como ativar proteção de rotas:**

1. **Descomentar as importações** (linhas 12-14)
2. **Envolver rotas com ProtectedRoute:**

```javascript
// Exemplo: Proteger rota do distribuidor
<Route
  path="/distribuidor/dashboard"
  element={
    <ProtectedRoute allowedRoles={[ROLES.DISTRIBUIDOR]}>
      <Layout userType="distribuidor">
        <DistribuidorDashboard />
      </Layout>
    </ProtectedRoute>
  }
/>
```

---

## 💾 Dados Salvos no localStorage

Após login bem-sucedido:

```javascript
localStorage.setItem('token', '<JWT_TOKEN>');
localStorage.setItem('expiration', '2025-10-25T10:30:00Z');
localStorage.setItem('email', 'usuario@email.com');
localStorage.setItem('idPessoa', '123');
localStorage.setItem('userRole', 'DISTRIBUIDOR');
localStorage.setItem('userName', 'Nome do Usuário');
```

**Acesso aos dados:**

```javascript
import { useAuth } from '../hooks/useAuth';

function MeuComponente() {
  const { userRole, userId, userName, hasRole } = useAuth();

  // Verificar papel
  if (hasRole('DISTRIBUIDOR')) {
    // Lógica específica para distribuidor
  }

  return (
    <div>
      <p>Olá, {userName}!</p>
      <p>Seu papel: {userRole}</p>
    </div>
  );
}
```

---

## 🧪 Testando o Sistema de Roles

### **Teste 1: Login como Distribuidor**

1. No SQL Server, encontre um usuário distribuidor:
```sql
SELECT * FROM PESSOA WHERE Tipo = 'DISTRIBUIDOR'
```

2. Faça login com o email/login do distribuidor
3. Verifique se foi redirecionado para `/distribuidor/dashboard`
4. Abra DevTools > Application > Local Storage
5. Confirme: `userRole = "DISTRIBUIDOR"`

### **Teste 2: Login como Assistência Técnica**

1. No SQL Server, encontre um usuário assistência:
```sql
SELECT * FROM PESSOA WHERE Tipo = 'ASSISTENCIA_TECNICA'
```

2. Faça login com o email/login da assistência
3. Verifique se foi redirecionado para `/assistencia/dashboard`
4. Confirme: `userRole = "ASSISTENCIA_TECNICA"`

### **Teste 3: Fallback quando pessoa não encontrada**

**Comportamento atual (useAuth.js:124-144):**
- Se pessoa NÃO for encontrada em `/api/pessoas`
- Sistema usa **mock** com `ASSISTENCIA_TECNICA` como padrão
- Usuário é redirecionado para `/assistencia/dashboard`

---

## 🐛 Diagnóstico de Problemas

### **Problema: Sempre redireciona para /assistencia/dashboard**

**Possíveis causas:**

1. **Campo `tipo` vazio no banco:**
```sql
-- Verificar valores do campo tipo
SELECT Id, Nome, Login, Tipo FROM PESSOA;

-- Atualizar tipo se estiver NULL
UPDATE PESSOA SET Tipo = 'DISTRIBUIDOR' WHERE Id = 2;
```

2. **API `/api/pessoas` não retorna campo `tipo`:**
```javascript
// Adicionar log no console
console.log('Pessoa encontrada:', pessoa);
console.log('Tipo da pessoa:', pessoa.tipo);
```

3. **Email/Login não corresponde:**
```javascript
// useAuth.js:94-97
const pessoa = pessoas.find(
  p => p.login === email ||
       p.cpfCnpj === email.replace(/[^0-9]/g, '')
);
```

### **Problema: Erro ao buscar /api/pessoas**

**Fallback automático:**
- Sistema usa `ASSISTENCIA_TECNICA` como padrão
- Usuário consegue fazer login mesmo com erro
- Logs mostram: `⚠️ Pessoa não encontrada na API. Usando dados mock.`

---

## 📝 Checklist de Implementação

### **Backend:**
- [ ] Tabela `PESSOA` tem campo `Tipo` (VARCHAR)
- [ ] Campo `Tipo` contém valores válidos: `ASSISTENCIA_TECNICA`, `DISTRIBUIDOR`, `ENTREGADOR`
- [ ] Endpoint `/api/pessoas` retorna campo `tipo` no JSON
- [ ] Endpoint `/api/account/LoginUser` retorna token JWT válido

### **Frontend:**
- [x] Hook `useAuth` implementado
- [x] Função `getDashboardRoute()` implementada
- [x] Redirecionamento automático após login
- [x] localStorage salvando `userRole`
- [x] 3 jornadas com rotas configuradas
- [ ] ProtectedRoute implementado (opcional)
- [ ] Testes E2E para cada jornada

---

## 🚀 Próximos Passos Recomendados

1. **Ativar proteção de rotas** para evitar acessos não autorizados
2. **Implementar logout** em todas as telas
3. **Adicionar verificação de expiração do token** em todas as páginas
4. **Criar página 403 (Não Autorizado)** para acessos negados
5. **Adicionar testes E2E** para cada jornada de usuário

---

**Última atualização:** 2025-10-22
**Desenvolvedor:** Gustavo (gustavocode.dev@gmail.com)
