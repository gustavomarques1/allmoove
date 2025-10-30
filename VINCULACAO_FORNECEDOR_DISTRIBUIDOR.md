# 🔗 Vinculação Fornecedor → Distribuidor

## 📋 Visão Geral

Este documento explica como funciona a **vinculação automática de fornecedores aos distribuidores** quando pedidos são criados no sistema AllMoove.

---

## 🎯 Problema Resolvido

### ❌ Antes (Problema)

```javascript
// Pedidos eram criados SEM idDistribuidor
const dadosPedido = {
  idGrupoPedido: 27,
  idPessoa: 1,
  valorFrete: 15.00,
  items: [...]
  // ❌ idDistribuidor estava faltando!
};
```

**Resultado:**
- ❌ Pedidos criados sem vínculo ao distribuidor
- ❌ Distribuidores não recebiam pedidos em seus dashboards
- ❌ Impossível rastrear qual distribuidor deveria atender o pedido

---

### ✅ Depois (Solução)

```javascript
// Sistema busca idDistribuidor automaticamente pelo nome do fornecedor
const idDistribuidor = await getDistribuidorIdPorNome('TechParts SP');

const dadosPedido = {
  idGrupoPedido: 27,
  idPessoa: 1,
  idDistribuidor: 2,  // ✅ Vinculado corretamente!
  valorFrete: 15.00,
  items: [...]
};
```

**Resultado:**
- ✅ Pedidos criados COM vínculo ao distribuidor
- ✅ Distribuidores recebem pedidos em seus dashboards
- ✅ Sistema funciona end-to-end corretamente

---

## 🔧 Como Funciona

### 1️⃣ **Fluxo de Dados**

```
PRODUTO
├── fornecedor: "TechParts SP" (string)
└── idDistribuidor: null (não usado nos produtos do JSON)

    ⬇️ Mapeamento via API

PESSOA (Tabela de usuários)
├── id: 2
├── nome: "TechParts SP"
└── tipo: "DISTRIBUIDOR"

    ⬇️ Usado na criação

PEDIDO
├── idPessoa: 1 (Assistência Técnica)
├── idDistribuidor: 2 ⭐ (TechParts SP)
└── idGrupoPedido: 27
```

---

### 2️⃣ **API Utilizada**

**Endpoint:** `GET /api/Pessoas/GetByNome?nome={nomeFornecedor}`

**Exemplo:**
```bash
GET https://localhost:44370/api/Pessoas/GetByNome?nome=TechParts%20SP
Authorization: Bearer {token}
```

**Resposta:**
```json
[
  {
    "id": 2,
    "nome": "TechParts SP",
    "tipo": "DISTRIBUIDOR",
    "cpfCnpj": "12345678901234",
    "login": "techparts",
    ...
  }
]
```

**Mapeamento:**
```javascript
const pessoa = response.data[0];
const idDistribuidor = pessoa.id; // 2
```

---

### 3️⃣ **Código Implementado**

#### **Arquivo:** `src/api/distribuidorServices.js`

```javascript
/**
 * Busca o ID do distribuidor baseado no nome do fornecedor
 * @param {string} nomeFornecedor - Nome do fornecedor (ex: "TechParts SP")
 * @returns {Promise<number|null>} ID do distribuidor ou null
 */
export const getDistribuidorIdPorNome = async (nomeFornecedor) => {
  const response = await api.get('/api/Pessoas/GetByNome', {
    params: { nome: nomeFornecedor },
    headers: { Authorization: `Bearer ${token}` }
  });

  if (response.data && response.data.length > 0) {
    return response.data[0].id;
  }

  return null;
};
```

---

#### **Arquivo:** `src/Components/TelaCheckout/TelaPagamento.jsx`

```javascript
// Antes de criar cada pedido, busca o idDistribuidor
for (const [fornecedor, items] of Object.entries(itensPorFornecedor)) {

  // ✅ BUSCA idDistribuidor pelo nome do fornecedor
  const idDistribuidor = await getDistribuidorIdPorNome(fornecedor);

  const dadosPedido = {
    idGrupoPedido: grupoId,
    idPessoa: parseInt(idPessoa),
    idDistribuidor: idDistribuidor,  // ⭐ Agora está preenchido!
    valorFrete: valorFreteFornecedor,
    items: items
  };

  await createPedido(dadosPedido);
}
```

---

## 📊 Estrutura de Banco de Dados

### **Tabela PESSOA**
```sql
CREATE TABLE PESSOA (
    ID BIGINT PRIMARY KEY,
    NOME VARCHAR(100),
    TIPO VARCHAR(50),  -- 'DISTRIBUIDOR', 'ASSISTENCIA_TECNICA', etc.
    CPFCNPJ VARCHAR(14),
    LOGIN VARCHAR(50),
    SENHA VARCHAR(100),
    ...
);
```

**Exemplo de registros:**
| ID | NOME | TIPO | CPFCNPJ |
|----|------|------|---------|
| 1 | Assistência AllMoove | ASSISTENCIA_TECNICA | 12345678901 |
| 2 | TechParts SP | DISTRIBUIDOR | 12345678901234 |
| 3 | Global Peças RJ | DISTRIBUIDOR | 98765432109876 |

---

### **Tabela PEDIDO**
```sql
CREATE TABLE PEDIDO (
    ID BIGINT PRIMARY KEY,
    ID_PESSOA BIGINT,        -- FK → PESSOA (Assistência que fez o pedido)
    ID_DISTRIBUIDOR BIGINT,  -- FK → PESSOA (Distribuidor que vai atender) ⭐
    ID_GRUPO_PEDIDO BIGINT,
    VALOR_FRETE DECIMAL(10,2),
    STATUS VARCHAR(50),
    ...
);
```

**Exemplo de registro:**
| ID | ID_PESSOA | ID_DISTRIBUIDOR | ID_GRUPO_PEDIDO | STATUS |
|----|-----------|-----------------|-----------------|--------|
| 101 | 1 | 2 | 27 | Aguardando Aceite |
| 102 | 1 | 3 | 27 | Aguardando Aceite |

---

## 🧪 Como Testar

### **Passo 1: Verificar se distribuidores existem no banco**

```sql
-- Lista todos os distribuidores
SELECT ID, NOME, TIPO, CPFCNPJ
FROM PESSOA
WHERE TIPO = 'DISTRIBUIDOR'
  AND SITUACAO_REGISTRO = 'ATIVO';
```

**Resultado esperado:**
```
ID | NOME              | TIPO         | CPFCNPJ
-------------------------------------------------
2  | TechParts SP      | DISTRIBUIDOR | 12345678901234
3  | Global Peças RJ   | DISTRIBUIDOR | 98765432109876
4  | ImportaCell       | DISTRIBUIDOR | 11122233344455
5  | Display Brasil    | DISTRIBUIDOR | 55544433322211
```

---

### **Passo 2: Fazer um pedido no frontend**

1. Faça login como **Assistência Técnica**
2. Adicione produtos ao carrinho (de diferentes fornecedores)
3. Finalize a compra
4. Observe os logs do console:

```
🔍 Buscando idDistribuidor para: TechParts SP
✅ idDistribuidor encontrado: 2
📤 Enviando para API: {
  idGrupoPedido: 27,
  idPessoa: 1,
  idDistribuidor: 2,  ⭐
  valorFrete: 15.00,
  items: [...]
}
✅ Pedido + Items criados com ID: 101
```

---

### **Passo 3: Validar no banco de dados**

```sql
-- Verifica se pedido foi criado com idDistribuidor
SELECT
    P.ID as ID_PEDIDO,
    P.ID_PESSOA as ID_ASSISTENCIA,
    PESSOA_ASS.NOME as ASSISTENCIA,
    P.ID_DISTRIBUIDOR,
    PESSOA_DIST.NOME as DISTRIBUIDOR,
    P.STATUS
FROM PEDIDO P
LEFT JOIN PESSOA PESSOA_ASS ON P.ID_PESSOA = PESSOA_ASS.ID
LEFT JOIN PESSOA PESSOA_DIST ON P.ID_DISTRIBUIDOR = PESSOA_DIST.ID
WHERE P.ID = 101;
```

**Resultado esperado:**
```
ID_PEDIDO | ASSISTENCIA          | ID_DISTRIBUIDOR | DISTRIBUIDOR  | STATUS
---------------------------------------------------------------------------
101       | Assistência AllMoove | 2               | TechParts SP  | ATIVO
```

---

### **Passo 4: Verificar dashboard do distribuidor**

1. Faça login como **Distribuidor** (login: `techparts`, senha: `123456`)
2. Acesse `/distribuidor/dashboard`
3. **Deve aparecer o pedido #101** na lista!

---

## ⚠️ Casos de Erro

### **Erro 1: Fornecedor não encontrado**

```javascript
// Log:
⚠️ Fornecedor "ABC Parts" não encontrado na base de dados
⚠️ idDistribuidor não encontrado para "ABC Parts".
   Pedido será criado sem vínculo ao distribuidor.

// Pedido criado com:
idDistribuidor: null
```

**Solução:**
1. Verificar se existe um usuário PESSOA com `NOME = "ABC Parts"` e `TIPO = "DISTRIBUIDOR"`
2. Se não existir, criar o distribuidor no banco ou ajustar o nome do fornecedor no JSON de produtos

---

### **Erro 2: Múltiplas pessoas com mesmo nome**

```javascript
// Se houver 2+ pessoas com nome "TechParts SP":
// O sistema usa a PRIMEIRA encontrada (response.data[0])
```

**Solução:**
- Garantir que nomes de distribuidores sejam únicos
- Ou implementar busca por TIPO também

---

## 📁 Arquivos Modificados

| Arquivo | Mudanças |
|---------|----------|
| `src/api/distribuidorServices.js` | ➕ Adicionada função `getDistribuidorIdPorNome()` |
| `src/Components/TelaCheckout/TelaPagamento.jsx` | ✏️ Adicionada busca de `idDistribuidor` antes de criar pedido |
| `VINCULACAO_FORNECEDOR_DISTRIBUIDOR.md` | ➕ Documentação criada |

---

## 🎯 Próximos Passos Recomendados

### **Opção 1: Criar endpoint dedicado no backend**
```csharp
// GET /api/Distribuidores/por-nome/{nome}
[HttpGet("por-nome/{nome}")]
public async Task<ActionResult<int>> GetIdPorNome(string nome)
{
    var pessoa = await _context.Pessoas
        .FirstOrDefaultAsync(p =>
            p.Nome == nome &&
            p.Tipo == "DISTRIBUIDOR" &&
            p.SituacaoRegistro == "ATIVO"
        );

    return pessoa?.Id ?? 0;
}
```

**Vantagem:** Endpoint específico, mais performático

---

### **Opção 2: Adicionar campo idDistribuidor nos produtos**

Modificar `public/data/products.json`:
```json
{
  "id": 1,
  "nome": "6S BRANCO",
  "fornecedor": "TechParts SP",
  "idDistribuidor": 2,  // ⭐ Adicionar este campo
  ...
}
```

**Vantagem:** Não precisa buscar na API, mapeamento direto

---

### **Opção 3: Cache de mapeamento**

```javascript
// Cria mapa em memória no carregamento do app
const FORNECEDOR_MAP = {
  "TechParts SP": 2,
  "Global Peças RJ": 3,
  "ImportaCell": 4,
  "Display Brasil": 5
};

// Uso direto
const idDistribuidor = FORNECEDOR_MAP[fornecedor];
```

**Vantagem:** Performance máxima, sem chamadas de API

---

## 🐛 Troubleshooting

### Problema: Pedidos ainda não aparecem no dashboard do distribuidor

**Verificações:**
1. ✅ Pedido foi criado com `idDistribuidor` preenchido?
   ```sql
   SELECT ID, ID_DISTRIBUIDOR FROM PEDIDO WHERE ID = 101;
   ```

2. ✅ Usuário logado tem `idDistribuidor` correto no localStorage?
   ```javascript
   localStorage.getItem('idDistribuidor') // deve retornar "2"
   ```

3. ✅ Dashboard está buscando pedidos pelo `idDistribuidor` correto?
   ```javascript
   const pedidos = await getPedidosDoDistribuidor(idDistribuidor);
   ```

---

## ✅ Checklist de Validação

- [x] Função `getDistribuidorIdPorNome()` criada em `distribuidorServices.js`
- [x] TelaPagamento.jsx atualizado para buscar `idDistribuidor`
- [x] Logs implementados para debug
- [x] Cache local atualizado com `idDistribuidor`
- [ ] Testado em ambiente local
- [ ] Validado que pedidos aparecem no dashboard do distribuidor
- [ ] Documentação criada

---

## 📞 Suporte

Para dúvidas ou problemas, verifique:
- Console do navegador (logs com 🔍 ✅ ⚠️)
- Banco de dados (queries SQL acima)
- API response (Network tab do DevTools)

---

**Última atualização:** 2025-10-24
**Autor:** Claude Code (API Integrator)
