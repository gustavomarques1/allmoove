# ✅ SOLUÇÃO: Pedidos Não Aparecem no Dashboard

## 🎯 Problema Identificado

**Frontend envia:** `assistenciaTecnicaId`
**Backend espera:** `idPessoa`

### Evidência do Backend:

**Model** (`Pedido.cs:49`):
```csharp
[Column("ID_PESSOA")]
public long? IdPessoa { get; set; }
```

**Service** (`PedidosService.cs:72-80`):
```csharp
public async Task<IEnumerable<Pedido>> GetPedidoByIdPessoa(long idPessoa)
{
    var pedidos = await _context.Pedidos
        .Where(n => n.IdPessoa == idPessoa)  // ← Filtra por IdPessoa
        .OrderByDescending(p => p.DataHoraCriacaoRegistro)
        .ToListAsync();
    return pedidos;
}
```

**Controller** (`PedidosController.cs:123-128`):
```csharp
[HttpGet("assistencia/{idPessoa:long}")]
public async Task<ActionResult<IEnumerable<Pedido>>> GetPedidoByAssistencia(long idPessoa)
{
    var pedidos = await _pedidoService.GetPedidoByIdPessoa(idPessoa);
    return Ok(pedidos);
}
```

### Evidência do Banco de Dados:

```sql
-- Pedidos criados HOJE (não aparecem):
ID: 25, 26, 27, 28, 29
ID_PESSOA: NULL, NULL, NULL, NULL, NULL  ❌

-- Pedidos antigos (aparecem):
ID: 5, 6, 8-15
ID_PESSOA: 3, 3, 3, 3, 5, 5, 5, 5, 7, 7  ✅
```

---

## 🛠️ Solução 1: Corrigir Frontend (RECOMENDADO)

### Arquivo: `src/api/pedidosServices.js`

Mudar de `assistenciaTecnicaId` para `idPessoa`:

```javascript
export const createPedido = async (dadosPedido) => {
  const token = localStorage.getItem('token');

  // ✅ CORREÇÃO: Backend espera "idPessoa", não "assistenciaTecnicaId"
  const payload = {
    idPessoa: dadosPedido.assistenciaTecnicaId || dadosPedido.idPessoa,  // ← MUDANÇA
    empresa: dadosPedido.empresa,
    estabelecimento: dadosPedido.estabelecimento,
    // ... outros campos
  };

  const response = await api.post('/api/Pedidos', payload, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return response.data;
};
```

### Arquivo: `src/Components/TelaCheckout/TelaPagamento.jsx`

Trocar `assistenciaTecnicaId` por `idPessoa`:

```javascript
const dadosPedido = {
  idPessoa: parseInt(idPessoa),  // ← MUDANÇA (era assistenciaTecnicaId)
  empresa: 1,
  estabelecimento: 1,
  // ... resto do código
};
```

### Arquivo: `src/Components/TestePedido/TestePedido.jsx`

```javascript
const pedidoTeste = {
  idPessoa: idPessoa,  // ← MUDANÇA (era assistenciaTecnicaId)
  empresa: 1,
  estabelecimento: 1,
  // ... resto do código
};
```

---

## 🛠️ Solução 2: Corrigir Backend (NÃO RECOMENDADO)

Se preferir manter o frontend como está, seria necessário:

1. Adicionar propriedade `AssistenciaTecnicaId` no Model
2. Modificar o Service para aceitar ambos os nomes
3. Criar migration para adicionar coluna no banco

**Mas isso é DESNECESSÁRIO** porque:
- O backend já está correto e funcional
- `IdPessoa` é o nome adequado (identifica a pessoa/assistência técnica)
- Pedidos antigos já usam `IdPessoa`

---

## 🧪 Teste Após Correção

Execute no Console (F12):

```javascript
const token = localStorage.getItem('token');
const idPessoa = localStorage.getItem('idPessoa');

// Criar pedido de teste
fetch('https://localhost:44370/api/Pedidos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    idPessoa: parseInt(idPessoa),  // ← Agora envia idPessoa!
    empresa: 1,
    estabelecimento: 1,
    valorFrete: 15.00
  })
})
.then(r => r.json())
.then(pedido => {
  console.log('✅ Pedido criado:', pedido.id);

  // Buscar pedidos
  return fetch(`https://localhost:44370/api/Pedidos/assistencia/${idPessoa}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
})
.then(r => r.json())
.then(pedidos => {
  console.log('📋 Total de pedidos:', pedidos.length);
  console.log('🔢 IDs:', pedidos.map(p => p.id).join(', '));
});
```

**Resultado esperado:**
```
✅ Pedido criado: 30
📋 Total de pedidos: 1  (ou mais se já existirem outros)
🔢 IDs: 30 (ou mais)
```

---

## 📊 Resumo das Mudanças

| Arquivo | Mudança |
|---------|---------|
| `src/api/pedidosServices.js` | `assistenciaTecnicaId` → `idPessoa` |
| `src/Components/TelaCheckout/TelaPagamento.jsx` | `assistenciaTecnicaId` → `idPessoa` |
| `src/Components/TestePedido/TestePedido.jsx` | `assistenciaTecnicaId` → `idPessoa` |

---

## 🚀 Próximos Passos

1. ✅ Aplicar correções no frontend
2. ✅ Testar criação de pedido
3. ✅ Confirmar que pedido aparece no dashboard
4. ✅ Atualizar validação em `validarDadosPedido()` se necessário
5. ✅ Commit: `fix(pedidos): corrige mapeamento idPessoa no payload da API`
