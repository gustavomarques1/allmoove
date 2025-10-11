# Sistema de Roles/Papéis - AllMoove

## Visão Geral

O sistema AllMoove agora possui um sistema completo de autenticação baseado em papéis (roles), permitindo que diferentes tipos de usuários acessem funcionalidades específicas do sistema.

## Papéis Disponíveis

### 1. ASSISTENCIA_TECNICA
**Descrição:** Assistências técnicas que fazem pedidos de peças

**Rotas Acessíveis:**
- `/assistencia/dashboard` - Dashboard com resumo de pedidos
- `/assistencia/loja` - Loja de produtos
- `/assistencia/delivery-options` - Opções de entrega
- `/assistencia/pagamento` - Processamento de pagamento
- `/assistencia/payment-success` - Confirmação do pedido

**Funcionalidades:**
- Visualizar produtos e fazer pedidos
- Gerenciar carrinho de compras
- Selecionar opções de entrega
- Processar pagamento
- Visualizar histórico de pedidos

---

### 2. DISTRIBUIDOR
**Descrição:** Distribuidores que gerenciam pedidos e estoque

**Rotas Acessíveis:**
- `/distribuidor/dashboard` - Dashboard de gestão de pedidos

**Funcionalidades:**
- Visualizar pedidos recebidos
- Aceitar ou rejeitar pedidos
- Gerenciar estoque
- Atribuir entregadores aos pedidos

---

### 3. ENTREGADOR
**Descrição:** Entregadores que realizam as entregas

**Rotas Acessíveis:**
- `/entregador/dashboard` - Dashboard de entregas

**Funcionalidades:**
- Visualizar entregas atribuídas
- Atualizar status de entregas
- Confirmar coletas e entregas
- Visualizar histórico de entregas

---

## Arquitetura Implementada

### 1. Hook useAuth (`src/hooks/useAuth.js`)

Hook customizado que gerencia toda a autenticação e controle de papéis.

**Principais funcionalidades:**
```javascript
const {
  isAuthenticated,  // Boolean: usuário está autenticado?
  userRole,         // String: papel do usuário (ASSISTENCIA_TECNICA, etc)
  userId,           // Number: ID da pessoa no banco
  userEmail,        // String: email do usuário
  userName,         // String: nome do usuário
  loading,          // Boolean: carregando dados?

  login,            // Function: fazer login
  logout,           // Function: fazer logout
  hasRole,          // Function: verificar papel específico
  hasAnyRole,       // Function: verificar múltiplos papéis
  getDashboardRoute // Function: obter rota do dashboard apropriado
} = useAuth();
```

**Fluxo de Login:**
1. Usuário faz login com email/senha
2. API retorna token JWT
3. Hook busca dados da pessoa na API `/api/pessoas`
4. Identifica papel pelo campo `tipo` da pessoa
5. Armazena dados no localStorage
6. Redireciona para dashboard apropriado

---

### 2. Componente ProtectedRoute (`src/Components/ProtectedRoute/ProtectedRoute.jsx`)

Componente wrapper que protege rotas baseado em autenticação e papéis.

**Exemplo de uso:**
```jsx
<ProtectedRoute allowedRoles={[ROLES.ASSISTENCIA_TECNICA]}>
  <MinhaTelaProtegida />
</ProtectedRoute>
```

**Comportamento:**
- Se não autenticado → redireciona para `/` (login)
- Se autenticado mas sem papel correto → redireciona para `/nao-autorizado`
- Se autenticado e com papel correto → renderiza componente

---

### 3. Página Não Autorizado (`src/Components/NaoAutorizado/NaoAutorizado.jsx`)

Página exibida quando usuário tenta acessar rota sem permissão.

**Funcionalidades:**
- Exibe papel atual do usuário
- Botão para voltar ao dashboard correto
- Botão para fazer logout

---

## Como Usar

### Proteger uma Nova Rota

```jsx
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import { ROLES } from './hooks/useAuth';

// Rota acessível apenas por distribuidores
<Route
  path="/distribuidor/nova-funcionalidade"
  element={
    <ProtectedRoute allowedRoles={[ROLES.DISTRIBUIDOR]}>
      <NovaFuncionalidade />
    </ProtectedRoute>
  }
/>

// Rota acessível por múltiplos papéis
<Route
  path="/relatorios"
  element={
    <ProtectedRoute allowedRoles={[ROLES.DISTRIBUIDOR, ROLES.ASSISTENCIA_TECNICA]}>
      <Relatorios />
    </ProtectedRoute>
  }
/>
```

### Usar o Hook useAuth em um Componente

```jsx
import { useAuth } from '../hooks/useAuth';

function MeuComponente() {
  const { userName, userRole, userId, logout } = useAuth();

  return (
    <div>
      <h1>Olá, {userName}!</h1>
      <p>Seu papel: {userRole}</p>
      <p>Seu ID: {userId}</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
```

### Verificar Papel Condicionalmente

```jsx
import { useAuth, ROLES } from '../hooks/useAuth';

function MeuComponente() {
  const { hasRole, hasAnyRole } = useAuth();

  return (
    <div>
      {hasRole(ROLES.DISTRIBUIDOR) && (
        <button>Funcionalidade apenas para Distribuidor</button>
      )}

      {hasAnyRole([ROLES.DISTRIBUIDOR, ROLES.ENTREGADOR]) && (
        <div>Conteúdo para Distribuidor ou Entregador</div>
      )}
    </div>
  );
}
```

---

## Dados Armazenados no localStorage

O sistema armazena os seguintes dados após login bem-sucedido:

```javascript
{
  token: "JWT_TOKEN",           // Token de autenticação
  expiration: "2025-10-11...",  // Data de expiração do token
  email: "usuario@email.com",   // Email do usuário
  idPessoa: "123",              // ID da pessoa no banco
  userRole: "ASSISTENCIA_TECNICA", // Papel do usuário
  userName: "João Silva"        // Nome do usuário
}
```

---

## Workarounds Implementados

Como o backend ainda não retorna o papel do usuário no login, implementamos os seguintes workarounds:

### 1. Busca Adicional de Dados

Após login bem-sucedido, o sistema faz uma chamada adicional para `/api/pessoas` para buscar o papel do usuário.

### 2. Mock para Desenvolvimento

Se não encontrar a pessoa na API, usa dados mock para permitir desenvolvimento:
```javascript
{
  idPessoa: 1,
  userRole: 'ASSISTENCIA_TECNICA',
  userName: email.split('@')[0]
}
```

---

## Pendências no Backend

Para remover os workarounds e ter um sistema completo, o backend precisa implementar:

### 1. Retornar Dados no Login

**Endpoint:** `POST /api/account/LoginUser`

**Response atual:**
```json
{
  "token": "...",
  "expiration": "..."
}
```

**Response desejada:**
```json
{
  "token": "...",
  "expiration": "...",
  "idPessoa": 123,
  "tipo": "ASSISTENCIA_TECNICA",
  "nome": "João Silva",
  "email": "joao@assistencia.com"
}
```

### 2. Endpoint de Pedidos por Assistência

**Endpoint faltando:** `GET /api/Pedidos/assistencia/{idPessoa}`

O frontend já está chamando este endpoint, mas ele não existe no backend.

**Implementação necessária:**
```csharp
[HttpGet("assistencia/{idPessoa}")]
[Authorize(Roles = "ASSISTENCIA_TECNICA")]
public async Task<ActionResult<IEnumerable<Pedido>>> GetPedidosPorAssistencia(long idPessoa)
{
    var pedidos = await _context.Pedidos
        .Where(p => p.IdPessoa == idPessoa)
        .OrderByDescending(p => p.DataHoraCriacaoRegistro)
        .ToListAsync();
    return Ok(pedidos);
}
```

### 3. Endpoints para Distribuidor e Entregador

**Endpoints recomendados:**
- `GET /api/Pedidos/distribuidor/{idDistribuidor}` - Pedidos do distribuidor
- `GET /api/Pedidos/entregador/{idEntregador}` - Entregas do entregador
- `PATCH /api/Pedidos/{id}/aceitar` - Distribuidor aceitar pedido
- `PATCH /api/Pedidos/{id}/atribuir-entregador` - Atribuir entregador
- `PATCH /api/Pedidos/{id}/confirmar-coleta` - Entregador confirmar coleta
- `PATCH /api/Pedidos/{id}/confirmar-entrega` - Entregador confirmar entrega

### 4. Validação de Campo Tipo

**Adicionar validação** para garantir que o campo `Tipo` em `Pessoa` só aceite valores válidos:
- `ASSISTENCIA_TECNICA`
- `DISTRIBUIDOR`
- `ENTREGADOR`

### 5. Integração Identity + Pessoa

**Vincular** tabela `AspNetUsers` (Identity) com tabela `PESSOA`:
- Adicionar campo `IdentityUserId` em `Pessoa`
- Ou adicionar campo `IdPessoa` em `ApplicationUser`

### 6. Adicionar Claims ao JWT

**Incluir no token JWT:**
```csharp
var claims = new[]
{
    new Claim("email", userInfo.Email),
    new Claim("idPessoa", pessoa.Id.ToString()),
    new Claim("tipo", pessoa.Tipo),
    new Claim(ClaimTypes.Role, pessoa.Tipo), // Para [Authorize(Roles = "...")]
    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
};
```

---

## Testando o Sistema

### Teste 1: Login e Redirecionamento

1. Faça login na aplicação
2. Verifique se foi redirecionado para o dashboard correto baseado no papel
3. Verifique o console do navegador para ver o papel identificado

### Teste 2: Proteção de Rotas

1. Faça login como Assistência Técnica
2. Tente acessar manualmente `/distribuidor/dashboard`
3. Deve ser redirecionado para `/nao-autorizado`

### Teste 3: Dados do Usuário

1. Faça login
2. Abra DevTools → Application → Local Storage
3. Verifique se os dados estão armazenados corretamente

### Teste 4: Expiração do Token

1. Faça login
2. Altere manualmente o `expiration` no localStorage para uma data passada
3. Recarregue a página
4. Deve ser redirecionado para a página de login

---

## Próximos Passos

### Frontend (Implementar quando backend estiver pronto):

1. **Remover workarounds:**
   - Remover busca adicional de `/api/pessoas` após login
   - Usar dados retornados diretamente do endpoint de login

2. **Implementar funcionalidades específicas:**
   - Dashboard completo do distribuidor com aceitar/rejeitar pedidos
   - Fluxo completo de entregas para o entregador
   - Integração real com API de pedidos por papel

3. **Melhorias de UX:**
   - Notificações de pedidos novos
   - Refresh automático de status
   - Histórico completo de ações

### Backend (Urgente):

1. ✅ Criar endpoint `GET /api/Pedidos/assistencia/{idPessoa}`
2. ✅ Retornar `idPessoa` e `tipo` no login
3. ✅ Adicionar validação de campo `Tipo`
4. ✅ Implementar endpoints para distribuidor e entregador
5. ⚠️ Adicionar autorização por roles nos endpoints

---

## Arquivos Criados/Modificados

### Novos Arquivos:
- `src/hooks/useAuth.js` - Hook de autenticação e roles
- `src/Components/ProtectedRoute/ProtectedRoute.jsx` - Componente de proteção de rotas
- `src/Components/NaoAutorizado/NaoAutorizado.jsx` - Página de acesso negado
- `src/Components/NaoAutorizado/NaoAutorizado.module.css` - Estilos da página
- `src/Components/TelaEntregador/TelaEntregador.module.css` - Estilos do dashboard entregador

### Arquivos Modificados:
- `src/App.jsx` - Adicionadas rotas protegidas
- `src/Components/InicialTela/Inicial.jsx` - Atualizado para usar useAuth
- `src/Components/TelaEntregador/TelaEntregador.jsx` - Dashboard completo criado

---

## Suporte

Para dúvidas ou problemas:
1. Consulte este documento primeiro
2. Verifique o console do navegador para mensagens de debug
3. Verifique o localStorage para dados armazenados
4. Consulte a análise completa da API no relatório gerado pelo agente

---

**Data de criação:** 2025-10-11
**Versão:** 1.0 (Workaround - Aguardando melhorias no backend)
