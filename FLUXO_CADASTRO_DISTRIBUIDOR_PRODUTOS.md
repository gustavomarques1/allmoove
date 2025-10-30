# Fluxo: Cadastro de Distribuidores e Produtos

## Como Funciona ATUALMENTE

### 1️⃣ Estrutura Atual

**Produtos:**
- Frontend lê de: `public/data/products.json` (arquivo estático)
- Banco tem tabela `PRODUTO` com 12 produtos
- Campo no JSON: `fornecedor: "TechParts SP"` (string)
- Campo no banco: `ID_DISTRIBUIDOR` (bigint) - **MAS NÃO ESTÁ MAPEADO NO MODEL**

**Model Produto.cs atual:**
```csharp
[Column("FORNECEDOR")]
[MaxLength(100)]
public string? Fornecedor { get; set; }

// ⚠️ FALTA MAPEAR:
// [Column("ID_DISTRIBUIDOR")]
// public long? IdDistribuidor { get; set; }
```

### 2️⃣ Fluxo Atual (Com Problemas)

```
1. Cliente acessa loja
   ↓
2. Frontend carrega products.json (48 produtos estáticos)
   ↓
3. Cliente adiciona ao carrinho produtos com "fornecedor": "TechParts SP"
   ↓
4. No checkout, sistema faz:
   - Agrupa items por fornecedor (string)
   - Para cada fornecedor, chama: getDistribuidorIdPorNome("TechParts SP")
   - API busca na PESSOA: WHERE NOME = 'TechParts SP'
   - Retorna: ID = 20
   ↓
5. Cria pedido com: idDistribuidor = 20
```

**⚠️ PROBLEMAS:**

1. **Matching por nome é frágil**: Se o distribuidor mudar o nome ou houver diferença de maiúsculas/minúsculas, quebra
2. **Produtos estáticos**: Não há tela para distribuidor cadastrar produtos
3. **Dessincronia**: Produtos no JSON ≠ Produtos no banco
4. **Sem controle de estoque**: Distribuidor não gerencia seu catálogo

---

## Como DEVERIA Funcionar (Ideal)

### 1️⃣ Estrutura Ideal

**Atualizar Model Produto.cs:**
```csharp
[Column("FORNECEDOR")]
[MaxLength(100)]
public string? Fornecedor { get; set; }  // Nome exibição (legado)

[Column("ID_DISTRIBUIDOR")]
public long? IdDistribuidor { get; set; }  // ⭐ ADICIONAR ISSO

// Navigation property (opcional, mas recomendado)
[ForeignKey("IdDistribuidor")]
public Pessoa? Distribuidor { get; set; }
```

### 2️⃣ Fluxo Completo do Dia a Dia

#### **ETAPA 1: Cadastro de Novo Distribuidor**

**Administrador do sistema:**

1. Acessa painel admin (ainda não existe, precisaria criar)
2. Cadastra novo distribuidor na tabela PESSOA:
   ```sql
   INSERT INTO PESSOA (NOME, TIPO, LOGIN, CPFCNPJ, SITUACAO_REGISTRO)
   VALUES ('AutoPeças Premium', 'DISTRIBUIDOR', 'autopecas@email.com', '12345678000199', 'ATIVO');
   -- Retorna ID = 24
   ```

3. Cria usuário no AspNetUsers via API:
   ```bash
   POST /api/account/CreateUser
   {
     "email": "autopecas@email.com",
     "password": "SenhaForte@2024",
     "confirmPassword": "SenhaForte@2024"
   }
   ```

4. Vincula Email na PESSOA:
   ```sql
   UPDATE PESSOA SET Email = 'autopecas@email.com' WHERE ID = 24;
   ```

5. ✅ Distribuidor criado! Já pode fazer login.

---

#### **ETAPA 2: Distribuidor Cadastra Produtos**

**Distribuidor faz login no sistema:**

1. Acessa: `/distribuidor/dashboard`
2. Menu lateral: **"Meus Produtos"** → **"Adicionar Produto"**
3. Preenche formulário:
   ```
   Nome: Tela iPhone 15 Pro Original
   Categoria: telas
   Preço: R$ 1.299,00
   SKU: TIP15PRO
   Estoque: 50 unidades
   Imagem: [upload ou URL]
   Descrição: Tela OLED original Apple...
   ```

4. Frontend chama API:
   ```javascript
   const idDistribuidor = localStorage.getItem('idPessoa'); // 24

   const novoProduto = {
     nome: "Tela iPhone 15 Pro Original",
     categoria: "telas",
     price: 1299.00,
     sku: "TIP15PRO",
     estoque: 50,
     imagem: "url-da-imagem",
     descricao: "Tela OLED original...",
     idDistribuidor: 24,  // ⭐ VINCULA AUTOMATICAMENTE
     fornecedor: "AutoPeças Premium"  // Para exibição
   };

   await api.post('/api/Produtos', novoProduto, {
     headers: { Authorization: `Bearer ${token}` }
   });
   ```

5. ✅ Produto criado e **automaticamente vinculado** ao distribuidor ID 24!

---

#### **ETAPA 3: Cliente Faz Pedido**

**Cliente acessa loja:**

1. Frontend carrega produtos da API (não mais do JSON):
   ```javascript
   // ANTES (ruim):
   const produtos = await fetch('/data/products.json');

   // DEPOIS (ideal):
   const response = await api.get('/api/Produtos');
   const produtos = response.data;
   ```

2. Cliente adiciona ao carrinho:
   - Produto já tem `idDistribuidor: 24` no objeto
   - Não precisa buscar por nome!

3. No checkout, ao criar pedido:
   ```javascript
   // Agrupa por idDistribuidor (não mais por nome)
   const pedidosPorDistribuidor = items.reduce((acc, item) => {
     const idDist = item.idDistribuidor;
     if (!acc[idDist]) acc[idDist] = [];
     acc[idDist].push(item);
     return acc;
   }, {});

   // Cria pedidos
   for (const [idDistribuidor, items] of Object.entries(pedidosPorDistribuidor)) {
     await api.post('/api/Pedidos', {
       idGrupoPedido: grupoId,
       idPessoa: idCliente,
       idDistribuidor: parseInt(idDistribuidor),  // ⭐ JÁ TEM O ID!
       valorFrete: 15.00,
       items: items
     });
   }
   ```

4. ✅ Pedido criado com `idDistribuidor` correto, sem buscar por nome!

---

#### **ETAPA 4: Distribuidor Gerencia Pedidos**

**Distribuidor vê seus pedidos:**

1. Acessa: `/distribuidor/dashboard`
2. API busca pedidos:
   ```javascript
   GET /api/Pedidos/distribuidor/24
   ```

3. Backend filtra:
   ```sql
   SELECT * FROM PEDIDO
   WHERE ID_DISTRIBUIDOR = 24
   ORDER BY DATA_HORA_CRICAO_REGISTRO DESC;
   ```

4. Distribuidor vê lista de pedidos e pode:
   - ✅ Aceitar pedido
   - 📦 Separar produtos
   - 🚚 Confirmar envio
   - ❌ Recusar (se sem estoque)

---

## Comparação: ANTES vs DEPOIS

| Aspecto | Sistema Atual (Frágil) | Sistema Ideal (Robusto) |
|---------|------------------------|-------------------------|
| **Produtos** | Arquivo JSON estático | API dinâmica do banco |
| **Vinculação** | Por nome (string) | Por ID (foreign key) |
| **Cadastro** | Manual no JSON | Distribuidor cadastra pelo painel |
| **Atualização** | Editar JSON manualmente | Distribuidor atualiza estoque/preço |
| **Estoque** | Não controlado | Controlado por distribuidor |
| **Erros** | Nome digitado errado = pedido sem distribuidor | ID sempre garante vinculação |
| **Escalabilidade** | Não escala (JSON gigante) | Escala perfeitamente |

---

## O que PRECISA ser Implementado

### 🔴 CRÍTICO (Sistema Funcione Corretamente)

1. **Atualizar Model Produto.cs:**
   ```csharp
   [Column("ID_DISTRIBUIDOR")]
   public long? IdDistribuidor { get; set; }
   ```

2. **Atualizar Controller para validar distribuidor:**
   ```csharp
   [HttpPost]
   public async Task<ActionResult<Produto>> PostProduto(Produto produto)
   {
       // Validar se IdDistribuidor existe
       var distribuidor = await _context.Pessoas
           .FirstOrDefaultAsync(p => p.Id == produto.IdDistribuidor && p.Tipo == "DISTRIBUIDOR");

       if (distribuidor == null)
           return BadRequest("Distribuidor inválido");

       // Auto-preencher o nome do fornecedor para legado
       produto.Fornecedor = distribuidor.Nome;

       await _produtoService.Createproduto(produto);
       return CreatedAtRoute(nameof(GetProduto), new { id = produto.Id }, produto);
   }
   ```

3. **Frontend: Mudar para consumir API de produtos:**
   ```javascript
   // src/context/Provider.jsx

   useEffect(() => {
     const fetchProducts = async () => {
       try {
         const response = await api.get('/api/Produtos');
         setProducts(response.data);
       } catch (error) {
         console.error('Erro ao carregar produtos:', error);
         // Fallback: usa JSON se API falhar
         const response = await fetch('/data/products.json');
         const data = await response.json();
         setProducts(data);
       } finally {
         setLoading(false);
       }
     };

     fetchProducts();
   }, []);
   ```

4. **Checkout: Usar idDistribuidor direto:**
   ```javascript
   // src/Components/TelaCheckout/TelaPagamento.jsx

   // ❌ ANTES (buscar por nome):
   const idDistribuidor = await getDistribuidorIdPorNome(fornecedor);

   // ✅ DEPOIS (já tem o ID):
   const idDistribuidor = items[0].idDistribuidor; // Todos items do mesmo grupo têm mesmo ID
   ```

### 🟡 IMPORTANTE (Melhorar Experiência)

5. **Tela de Cadastro de Produtos para Distribuidor:**
   - Rota: `/distribuidor/produtos/novo`
   - Form com campos: Nome, Categoria, Preço, SKU, Estoque, Imagem
   - Auto-preenche `idDistribuidor` do usuário logado

6. **Tela de Listagem de Produtos do Distribuidor:**
   - Rota: `/distribuidor/produtos`
   - Lista produtos WHERE `idDistribuidor = [logado]`
   - Permite editar estoque, preço, status

7. **API Endpoint para produtos do distribuidor:**
   ```csharp
   [HttpGet("distribuidor/{idDistribuidor}")]
   public async Task<ActionResult<IEnumerable<Produto>>> GetProdutosPorDistribuidor(long idDistribuidor)
   {
       var produtos = await _produtoService.Getprodutos();
       var produtosDistribuidor = produtos
           .Where(p => p.IdDistribuidor == idDistribuidor)
           .ToList();
       return Ok(produtosDistribuidor);
   }
   ```

### 🟢 OPCIONAL (Funcionalidades Extras)

8. **Painel Admin:**
   - Criar distribuidores
   - Aprovar produtos
   - Ver estatísticas

9. **Importação em Lote:**
   - Distribuidor faz upload de CSV/Excel
   - Sistema importa 100+ produtos de uma vez

10. **Notificações:**
    - Distribuidor recebe email quando novo pedido chega
    - Cliente recebe quando distribuidor aceita/envia pedido

---

## Migração: Como Sair do JSON para o Banco

### Opção 1: Script de Migração Único

Criar script que lê `products.json` e insere no banco vinculando aos distribuidores:

```javascript
// scripts/migrate-products-to-db.js

const fs = require('fs');
const axios = require('axios');

const products = JSON.parse(fs.readFileSync('public/data/products.json'));

// Mapa de fornecedor → idDistribuidor
const fornecedorMap = {
  'TechParts SP': 20,
  'Global Peças RJ': 21,
  'ImportaCell': 22,
  'Display Brasil': 23
};

async function migrate() {
  for (const product of products) {
    const idDistribuidor = fornecedorMap[product.fornecedor];

    await axios.post('https://localhost:44370/api/Produtos', {
      nome: product.nome,
      categoria: product.categoria,
      price: product.price,
      sku: product.id.toString(),
      imagem: product.imagem,
      idDistribuidor: idDistribuidor,
      fornecedor: product.fornecedor,
      estoque: 100, // Estoque padrão
      descricao: `Produto: ${product.nome}`
    }, {
      headers: {
        'Authorization': 'Bearer SEU_TOKEN_AQUI'
      }
    });

    console.log(`✅ ${product.nome} migrado`);
  }
}

migrate();
```

### Opção 2: SQL Direto

```sql
-- Popular produtos dos distribuidores
INSERT INTO PRODUTO (NOME, CATEGORIA, PRICE, SKU, IMAGEM, ID_DISTRIBUIDOR, FORNECEDOR, SITUACAO_REGISTRO, DATA_HORA_CRICAO_REGISTRO)
VALUES
-- TechParts SP (ID: 20)
('Tela iPhone 14 OLED', 'telas', 899.00, 'TIP14OLED', '/images/tela-iphone14.jpg', 20, 'TechParts SP', 'ATIVO', GETDATE()),
('Tela iPhone 13 Incell', 'telas', 599.00, 'TIP13INC', '/images/tela-iphone13.jpg', 20, 'TechParts SP', 'ATIVO', GETDATE()),
-- ... continuar para todos os 48 produtos
```

---

## Resposta à Sua Pergunta

> "Quando um novo usuário distribuidor for criado, ele vai ter que adicionar os produtos deles e esses produtos já serão atribuídos ao id dele?"

**✅ SIM, EXATAMENTE!**

### Passo a Passo:

1. **Admin cria o distribuidor** (ou auto-cadastro se implementar):
   - PESSOA com TIPO='DISTRIBUIDOR' → recebe ID = 25
   - Cria usuário em AspNetUsers
   - Vincula Email

2. **Distribuidor faz login**:
   - Sistema sabe: `idPessoa = 25`
   - Token JWT inclui esse ID

3. **Distribuidor acessa "Adicionar Produto"**:
   - Preenche dados do produto
   - Frontend **automaticamente** inclui: `idDistribuidor: 25`
   - Distribuidor nem vê esse campo (é automático)

4. **Backend salva produto**:
   ```sql
   INSERT INTO PRODUTO (..., ID_DISTRIBUIDOR)
   VALUES (..., 25);  -- ⭐ VINCULADO AUTOMATICAMENTE
   ```

5. **Cliente faz pedido desse produto**:
   - Produto já tem `idDistribuidor: 25` no objeto
   - Pedido automaticamente vai para o distribuidor correto
   - Distribuidor vê o pedido no dashboard

### Vantagens:

- ✅ **Automático**: Distribuidor não precisa "escolher" seu ID
- ✅ **Seguro**: Distribuidor só vê/edita produtos dele
- ✅ **Escalável**: Funciona para 10 ou 1000 distribuidores
- ✅ **Rastreável**: Sempre sabemos de quem é cada produto

---

## Próximos Passos Recomendados

### AGORA (Para Funcionar Corretamente):

1. ✅ Adicionar campo `IdDistribuidor` ao Model
2. ✅ Atualizar Controller para validar e popular
3. ✅ Frontend consumir API de produtos

### CURTO PRAZO (Para Distribuidores Gerenciarem):

4. ✅ Tela de cadastro de produtos
5. ✅ Tela de listagem/edição de produtos
6. ✅ Endpoint para produtos por distribuidor

### MÉDIO PRAZO (Para Escalar):

7. ✅ Painel admin completo
8. ✅ Importação em lote
9. ✅ Sistema de notificações

---

## Conclusão

O sistema **JÁ ESTÁ PREPARADO** no banco de dados (campo `ID_DISTRIBUIDOR` existe), mas precisa de ajustes no backend e frontend para usar esse relacionamento corretamente.

A mudança é simples mas poderosa:
- **ANTES**: "Busca distribuidor pelo nome" (frágil)
- **DEPOIS**: "Produto já sabe qual distribuidor é dono" (robusto)

E sim, quando criar um novo distribuidor, ele pode começar a cadastrar produtos imediatamente, e todos os produtos ficam automaticamente vinculados ao ID dele! 🎯
