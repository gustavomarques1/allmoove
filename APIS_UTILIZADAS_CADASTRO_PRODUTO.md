# 📡 APIs Utilizadas no Cadastro de Produtos

## 🎯 Resumo Executivo

O formulário de cadastro de produtos utiliza **5 APIs** para popular os dropdowns de classificação e **1 API** para salvar o produto.

---

## 📥 APIs de LEITURA (GET) - Populam Dropdowns

### **1. API de Segmentos**

**Endpoint:** `GET https://localhost:44370/api/ProdutoSegmentos`
**Autenticação:** ❌ Não requer
**Usado em:** Dropdown "Segmento" (obrigatório)

**Retorna:**
```json
[
  {
    "id": 1,
    "nome": "Celulares",
    "codigo": "CEL",
    "situacao": "ATIVO",
    "empresa": 1,
    "estabelecimento": 1,
    "dataHoraCriacaoRegistro": "2024-01-15T10:30:00",
    "situacaoRegistro": "ATIVO"
  },
  {
    "id": 2,
    "nome": "Notebooks",
    "codigo": "NOTE",
    "situacao": "ATIVO",
    "empresa": 1,
    "estabelecimento": 1,
    "dataHoraCriacaoRegistro": "2024-01-15T10:30:00",
    "situacaoRegistro": "ATIVO"
  }
]
```

**Campos Utilizados:**
- `id` → Enviado no cadastro como `idSegmento`
- `nome` → Exibido no dropdown

---

### **2. API de Marcas**

**Endpoint:** `GET https://localhost:44370/api/ProdutoMarcas`
**Autenticação:** ❌ Não requer
**Usado em:** Dropdown "Marca" (obrigatório)

**Retorna:**
```json
[
  {
    "id": 1,
    "nome": "Apple",
    "codigo": "APPL",
    "idSegmento": 1,
    "situacao": "ATIVO",
    "empresa": 1,
    "estabelecimento": 1,
    "dataHoraCriacaoRegistro": "2024-01-15T10:30:00",
    "situacaoRegistro": "ATIVO"
  },
  {
    "id": 2,
    "nome": "Samsung",
    "codigo": "SAMS",
    "idSegmento": 1,
    "situacao": "ATIVO",
    "empresa": 1,
    "estabelecimento": 1,
    "dataHoraCriacaoRegistro": "2024-01-15T10:30:00",
    "situacaoRegistro": "ATIVO"
  }
]
```

**Campos Utilizados:**
- `id` → Enviado no cadastro como `idMarca`
- `nome` → Exibido no dropdown
- `idSegmento` → Relacionamento com Segmento

**⚠️ Nota:** Marca está vinculada a Segmento via `idSegmento`

---

### **3. API de Modelos**

**Endpoint:** `GET https://localhost:44370/api/ProdutoModelos`
**Autenticação:** ❌ Não requer
**Usado em:** Dropdown "Modelo" (opcional)

**Retorna:**
```json
[
  {
    "id": 1,
    "nome": "iPhone 14 Pro",
    "codigo": "IP14PRO",
    "idMarca": 1,
    "situacao": "ATIVO",
    "empresa": 1,
    "estabelecimento": 1,
    "dataHoraCriacaoRegistro": "2024-01-15T10:30:00",
    "situacaoRegistro": "ATIVO"
  },
  {
    "id": 2,
    "nome": "iPhone 13",
    "codigo": "IP13",
    "idMarca": 1,
    "situacao": "ATIVO",
    "empresa": 1,
    "estabelecimento": 1,
    "dataHoraCriacaoRegistro": "2024-01-15T10:30:00",
    "situacaoRegistro": "ATIVO"
  }
]
```

**Campos Utilizados:**
- `id` → Enviado no cadastro como `idModelo`
- `nome` → Exibido no dropdown
- `idMarca` → Relacionamento com Marca

**⚠️ Nota:** Modelo está vinculado a Marca via `idMarca`

---

### **4. API de Grupos**

**Endpoint:** `GET https://localhost:44370/api/ProdutoGrupos`
**Autenticação:** ❌ Não requer
**Usado em:** Dropdown "Grupo" (opcional)

**Retorna:**
```json
[
  {
    "id": 1,
    "nome": "Telas",
    "codigo": "TELA",
    "situacao": "ATIVO",
    "empresa": 1,
    "estabelecimento": 1,
    "dataHoraCriacaoRegistro": "2024-01-15T10:30:00",
    "situacaoRegistro": "ATIVO"
  },
  {
    "id": 2,
    "nome": "Baterias",
    "codigo": "BAT",
    "situacao": "ATIVO",
    "empresa": 1,
    "estabelecimento": 1,
    "dataHoraCriacaoRegistro": "2024-01-15T10:30:00",
    "situacaoRegistro": "ATIVO"
  }
]
```

**Campos Utilizados:**
- `id` → Enviado no cadastro como `idGrupo`
- `nome` → Exibido no dropdown

**⚠️ Nota:** Grupo é independente (não tem relacionamento com outros)

---

### **5. API de Tags**

**Endpoint:** `GET https://localhost:44370/api/ProdutoTags`
**Autenticação:** ❌ Não requer
**Usado em:** Dropdown "Tag" (opcional)

**Retorna:**
```json
[
  {
    "id": 1,
    "nome": "Original",
    "codigo": "ORIG",
    "situacao": "ATIVO",
    "empresa": 1,
    "estabelecimento": 1,
    "dataHoraCriacaoRegistro": "2024-01-15T10:30:00",
    "situacaoRegistro": "ATIVO"
  },
  {
    "id": 2,
    "nome": "Compatível",
    "codigo": "COMP",
    "situacao": "ATIVO",
    "empresa": 1,
    "estabelecimento": 1,
    "dataHoraCriacaoRegistro": "2024-01-15T10:30:00",
    "situacaoRegistro": "ATIVO"
  }
]
```

**Campos Utilizados:**
- `id` → Enviado no cadastro como `idTag`
- `nome` → Exibido no dropdown

**⚠️ Nota:** Tag é independente (não tem relacionamento com outros)

---

## 📤 API de ESCRITA (POST) - Salva Produto

### **6. API de Produtos**

**Endpoint:** `POST https://localhost:44370/api/Produtos`
**Autenticação:** ✅ Requer Bearer Token
**Usado em:** Salvar produto cadastrado

**Envia (Request Body):**
```json
{
  "nome": "Tela iPhone 14 Pro OLED Original",
  "descricao": "Tela OLED original para iPhone 14 Pro, com touch 3D",
  "sku": "TIP14PRO001",
  "ean": "7891234567890",
  "quantidade": 25,
  "precoCusto": 899.00,
  "precoVenda": 1299.00,
  "posicao": "A1-B2-C3",
  "imagem": "https://exemplo.com/tela-iphone14pro.jpg",
  "idSegmento": 1,
  "idMarca": 1,
  "idModelo": 1,
  "idGrupo": 1,
  "idTag": 1,
  "idDistribuidor": 2,
  "empresa": 1,
  "estabelecimento": 1,
  "situacaoRegistro": "ATIVO"
}
```

**Retorna (Response - 201 Created):**
```json
{
  "id": 123,
  "nome": "Tela iPhone 14 Pro OLED Original",
  "descricao": "Tela OLED original para iPhone 14 Pro, com touch 3D",
  "sku": "TIP14PRO001",
  "ean": "7891234567890",
  "quantidade": 25,
  "precoCusto": 899.00,
  "precoVenda": 1299.00,
  "posicao": "A1-B2-C3",
  "imagem": "https://exemplo.com/tela-iphone14pro.jpg",
  "idSegmento": 1,
  "idMarca": 1,
  "idModelo": 1,
  "idGrupo": 1,
  "idTag": 1,
  "idDistribuidor": 2,
  "empresa": 1,
  "estabelecimento": 1,
  "situacao": "ATIVO",
  "situacaoRegistro": "ATIVO",
  "dataHoraCriacaoRegistro": "2024-10-28T15:30:00",
  "usuarioCriacao": "distribuidor@example.com"
}
```

**Campos Obrigatórios:**
- ✅ `nome` (string, max 100)
- ✅ `sku` (string, max 50)
- ✅ `idSegmento` (int)
- ✅ `idMarca` (int)
- ✅ `precoVenda` (decimal)
- ✅ `idDistribuidor` (bigint) - Preenchido automaticamente

**Campos Opcionais:**
- `descricao`, `ean`, `quantidade`, `precoCusto`, `posicao`, `imagem`
- `idModelo`, `idGrupo`, `idTag`

---

## 🔄 Fluxo Completo de Uso das APIs

### **Ao Abrir o Modal de Cadastro:**

```javascript
// 1. Modal abre
// 2. useEffect dispara carregamento

carregarDadosDropdowns() {
  // Chama as 5 APIs em paralelo:
  Promise.all([
    GET /api/ProdutoSegmentos,    // → setSegmentos([...])
    GET /api/ProdutoMarcas,        // → setMarcas([...])
    GET /api/ProdutoModelos,       // → setModelos([...])
    GET /api/ProdutoGrupos,        // → setGrupos([...])
    GET /api/ProdutoTags           // → setTags([...])
  ]);
}

// 3. Dropdowns são populados com os dados
```

### **Ao Submeter o Formulário:**

```javascript
// 1. Validação dos campos obrigatórios
validate() {
  ✅ nome não vazio
  ✅ sku não vazio
  ✅ idSegmento selecionado
  ✅ idMarca selecionada
  ✅ precoVenda > 0
}

// 2. Prepara dados para envio
const payload = {
  nome: formData.nome,
  sku: formData.sku,
  idSegmento: parseInt(formData.idSegmento),
  idMarca: parseInt(formData.idMarca),
  precoVenda: parseFloat(formData.precoVenda),
  idDistribuidor: parseInt(localStorage.getItem('idDistribuidor')),
  // ... outros campos
};

// 3. Envia para API
POST /api/Produtos (payload) → Response 201 Created

// 4. Recarrega lista de produtos
recarregar();
```

---

## 📊 Resumo Visual

```
┌─────────────────────────────────────┐
│  Modal Abre                         │
│  ↓                                  │
│  Carrega 5 APIs em Paralelo:       │
│  ├─ GET /api/ProdutoSegmentos      │
│  ├─ GET /api/ProdutoMarcas         │
│  ├─ GET /api/ProdutoModelos        │
│  ├─ GET /api/ProdutoGrupos         │
│  └─ GET /api/ProdutoTags           │
│  ↓                                  │
│  Popula Dropdowns                   │
│  ↓                                  │
│  Usuário Preenche Formulário       │
│  ↓                                  │
│  Validação de Campos                │
│  ↓                                  │
│  POST /api/Produtos                 │
│  ↓                                  │
│  Produto Criado! ✅                 │
└─────────────────────────────────────┘
```

---

## 🧪 Como Testar Cada API

### **Teste Rápido com cURL:**

```bash
# Segmentos
curl https://localhost:44370/api/ProdutoSegmentos

# Marcas
curl https://localhost:44370/api/ProdutoMarcas

# Modelos
curl https://localhost:44370/api/ProdutoModelos

# Grupos
curl https://localhost:44370/api/ProdutoGrupos

# Tags
curl https://localhost:44370/api/ProdutoTags
```

### **Teste no Console do Navegador:**

```javascript
// Abra F12 e execute:

// Teste todas as APIs de uma vez
Promise.all([
  fetch('https://localhost:44370/api/ProdutoSegmentos').then(r => r.json()),
  fetch('https://localhost:44370/api/ProdutoMarcas').then(r => r.json()),
  fetch('https://localhost:44370/api/ProdutoModelos').then(r => r.json()),
  fetch('https://localhost:44370/api/ProdutoGrupos').then(r => r.json()),
  fetch('https://localhost:44370/api/ProdutoTags').then(r => r.json())
]).then(([seg, mar, mod, grp, tag]) => {
  console.log('Segmentos:', seg.length);
  console.log('Marcas:', mar.length);
  console.log('Modelos:', mod.length);
  console.log('Grupos:', grp.length);
  console.log('Tags:', tag.length);
});
```

### **Teste POST de Produto:**

```javascript
// ATENÇÃO: Substituir TOKEN_AQUI pelo token real

const token = localStorage.getItem('token');
const idDistribuidor = localStorage.getItem('idDistribuidor');

fetch('https://localhost:44370/api/Produtos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    nome: "Teste API",
    sku: "TEST001",
    idSegmento: 1,
    idMarca: 1,
    precoVenda: 100.00,
    quantidade: 10,
    idDistribuidor: parseInt(idDistribuidor)
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

---

## 📝 Campos Retornados por Todas as APIs

### **Estrutura Comum:**

Todas as 5 APIs de classificação (GET) retornam arrays com esta estrutura:

```typescript
interface ProdutoClassificacao {
  id: number;                          // ✅ USADO - ID único
  nome: string;                        // ✅ USADO - Nome exibido
  codigo: string;                      // ℹ️ INFO - Código interno
  situacao: string;                    // ℹ️ INFO - Status (ATIVO/INATIVO)
  empresa: number | null;              // ℹ️ INFO - ID empresa
  estabelecimento: number | null;      // ℹ️ INFO - ID estabelecimento
  dataHoraCriacaoRegistro: string;     // ℹ️ INFO - Data de criação
  dataHoraAlteracaoRegistro?: string;  // ℹ️ INFO - Data de alteração
  usuarioCriacao?: string;             // ℹ️ INFO - Quem criou
  usuarioAlteracao?: string;           // ℹ️ INFO - Quem alterou
  situacaoRegistro: string;            // ℹ️ INFO - Status do registro

  // Campos específicos (relacionamentos):
  idSegmento?: number;                 // Apenas em ProdutoMarca
  idMarca?: number;                    // Apenas em ProdutoModelo
}
```

**Legenda:**
- ✅ **USADO** - Campo utilizado pelo frontend
- ℹ️ **INFO** - Campo retornado mas não utilizado atualmente

---

## 🎯 Resumo Rápido

| API | Método | Autenticação | Obrigatória | Qtd Esperada | Usado Para |
|-----|--------|--------------|-------------|--------------|------------|
| ProdutoSegmentos | GET | ❌ Não | ✅ Sim | 3-10 | Dropdown Segmento |
| ProdutoMarcas | GET | ❌ Não | ✅ Sim | 10-50 | Dropdown Marca |
| ProdutoModelos | GET | ❌ Não | ❌ Não | 50-200 | Dropdown Modelo |
| ProdutoGrupos | GET | ❌ Não | ❌ Não | 5-20 | Dropdown Grupo |
| ProdutoTags | GET | ❌ Não | ❌ Não | 5-15 | Dropdown Tag |
| Produtos | POST | ✅ Sim | ✅ Sim | - | Salvar Produto |

---

**Data do Documento:** 28/10/2025
**Versão:** 1.0
**Status:** ✅ Documentado
