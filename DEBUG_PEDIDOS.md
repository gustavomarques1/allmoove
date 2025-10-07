# 🐛 Debug: Por que pedidos não aparecem?

## Situação Atual

### Pedidos criados que NÃO aparecem:
- #20, #23, #24: `empresa: null`, `estabelecimento: null` ❌
- #27: `empresa: 1`, `estabelecimento: 1` ✓ mas **assistenciaTecnicaId: undefined** ❌

### Pedidos que APARECEM na lista (sempre os mesmos 10):
- IDs: 5, 6, 8, 9, 10, 11, 12, 13, 14, 15

## 🔍 Próximo Passo: Inspecionar Pedido Existente

No Console (F12), execute:

```javascript
const token = localStorage.getItem('token');

// Buscar pedido #6 (um que APARECE na lista)
fetch('https://localhost:44370/api/Pedidos/6', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(p => {
  console.log('📦 PEDIDO #6 (que aparece):');
  console.log('   empresa:', p.empresa);
  console.log('   estabelecimento:', p.estabelecimento);
  console.log('   assistenciaTecnicaId:', p.assistenciaTecnicaId);
  console.log('   status:', p.status);
  console.log('   codigo:', p.codigo);
  console.log('\n📦 OBJETO COMPLETO:', p);
});

// Comparar com pedido #27 (que NÃO aparece)
fetch('https://localhost:44370/api/Pedidos/27', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(p => {
  console.log('\n📦 PEDIDO #27 (que NÃO aparece):');
  console.log('   empresa:', p.empresa);
  console.log('   estabelecimento:', p.estabelecimento);
  console.log('   assistenciaTecnicaId:', p.assistenciaTecnicaId);
  console.log('   status:', p.status);
  console.log('   codigo:', p.codigo);
  console.log('\n📦 OBJETO COMPLETO:', p);

  console.log('\n❓ DIFERENÇAS ENTRE #6 e #27:');
  console.log('   Ambos têm empresa=1, estabelecimento=1?');
  console.log('   assistenciaTecnicaId é diferente?');
  console.log('   Status é diferente?');
});
```

## 🎯 Possíveis Causas

### 1. Backend Salva Mas Não Retorna `assistenciaTecnicaId`
- **Sintoma**: Pedido #27 tem `assistenciaTecnicaId: undefined` ao buscar por ID
- **Causa provável**: Backend não está salvando ou retornando esse campo
- **Solução**: Backend precisa salvar e retornar `assistenciaTecnicaId` na resposta

### 2. Endpoint de Listagem Ignora Pedidos Sem `assistenciaTecnicaId`
- **Sintoma**: GET `/api/Pedidos/assistencia/4` não retorna pedidos novos
- **Causa provável**: Backend filtra por `assistenciaTecnicaId IS NOT NULL`
- **Solução**: Backend precisa retornar todos os pedidos com empresa=1, estabelecimento=1

### 3. Filtro por Status
- **Sintoma**: Pedidos novos têm `status: undefined`
- **Causa provável**: Backend só retorna pedidos com status específico
- **Solução**: Verificar quais status os pedidos antigos têm

## 📋 Checklist para Resolver

- [ ] Comparar pedido #6 (funciona) com #27 (não funciona)
- [ ] Verificar se `assistenciaTecnicaId` está sendo salvo no banco
- [ ] Verificar SQL do endpoint `/api/Pedidos/assistencia/{id}`
- [ ] Confirmar se há filtro por status
- [ ] Confirmar se há filtro por código
- [ ] Verificar se há JOINs que excluem pedidos novos

## 🛠️ Solução Temporária

**Para testar se o problema é `assistenciaTecnicaId`**, o backend poderia:

```csharp
// Em PedidosController.cs
[HttpGet("assistencia/{id}")]
public async Task<IActionResult> GetPedidosDaAssistencia(int id)
{
    var pedidos = await _context.Pedidos
        .Where(p => p.Empresa == 1 && p.Estabelecimento == 1) // Filtros básicos
        // .Where(p => p.AssistenciaTecnicaId == id) // Comentar temporariamente
        .Include(p => p.Items)
        .ToListAsync();

    return Ok(pedidos);
}
```

Se isso funcionar, confirma que o problema é o `assistenciaTecnicaId` não sendo salvo/retornado corretamente.
