# 🚀 Como Importar Produtos - Guia Rápido

## ⚡ Solução Recomendada: Via Console do Navegador

Esta é a forma **mais simples e sem erros** de importar produtos. Funciona 100% sem problemas de CORS ou certificados SSL.

---

## 📝 Método 1: Importar produtos predefinidos no código

Use quando você quiser adicionar produtos manualmente editando um script JavaScript.

### Passo a passo:

1. **Faça login na aplicação:**
   ```
   http://localhost:5174
   ```

2. **Abra o Console do DevTools:**
   - Pressione `F12`
   - Vá na aba **Console**

3. **Abra o arquivo para editar:**
   ```
   script-importar-console.js
   ```

4. **Edite a lista de produtos:**
   - Encontre a seção `PRODUTOS PARA IMPORTAR`
   - Adicione/edite os produtos conforme necessário:
   ```javascript
   {
       nome: "Nome do Produto",
       descricao: "Descrição detalhada",
       sku: "CODIGO-SKU",
       ean: "7891234567890",
       precoCusto: 100.00,
       precoVenda: 150.00,
       quantidade: 10,
       posicao: "A1-P1"
   }
   ```

5. **Copie TODO o conteúdo do arquivo**

6. **Cole no Console e pressione Enter**

7. **Aguarde a importação:**
   - Verá logs em tempo real: ✅ Sucesso ou ❌ Erro
   - Ao final, verá um resumo completo

### Resultado esperado:
```
🚀 Iniciando importação de produtos...

🔐 Token encontrado: eyJhbGciOiJIUzI1NiI...
📦 Total de produtos a importar: 20

✅ [1/20] "iPhone 14 128GB" - ID: 42
✅ [2/20] "iPhone 14 Pro Max 256GB" - ID: 43
...

========================================
🏁 IMPORTAÇÃO CONCLUÍDA!
========================================
✅ Sucesso: 20 produtos
❌ Erros: 0 produtos
```

---

## 📊 Método 2: Importar do arquivo Excel

Use quando você tem um Excel com muitos produtos.

### Passo a passo:

1. **Faça login na aplicação:**
   ```
   http://localhost:5174
   ```

2. **Abra o Console do DevTools:**
   - Pressione `F12`
   - Vá na aba **Console**

3. **Carregue a biblioteca XLSX primeiro:**
   ```javascript
   const script = document.createElement('script');
   script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
   document.head.appendChild(script);
   ```
   Pressione Enter e **aguarde 2 segundos**

4. **Copie o conteúdo completo do arquivo:**
   ```
   script-importar-excel-console.js
   ```

5. **Cole no Console e pressione Enter**

6. **Selecione o arquivo Excel:**
   - Uma janela se abrirá automaticamente
   - Escolha o arquivo `excel/produtos.xlsx`

7. **Aguarde a importação:**
   - Verá um preview dos primeiros 3 produtos
   - A importação inicia automaticamente em 3 segundos
   - Logs em tempo real mostrarão o progresso

### Colunas aceitas no Excel:

O script mapeia automaticamente diversas variações:

| Campo | Variações aceitas |
|-------|-------------------|
| Nome | `nome`, `Nome`, `NOME` |
| Preço | `precoVenda`, `PrecoVenda`, `preco`, `Preco` |
| Descrição | `descricao`, `Descricao`, `DESCRICAO` |
| SKU | `sku`, `SKU`, `codigo`, `Codigo` |
| EAN | `ean`, `EAN`, `codigoBarras` |
| Custo | `precoCusto`, `PrecoCusto`, `preco_custo` |
| Quantidade | `quantidade`, `Quantidade`, `estoque`, `Estoque` |

---

## 🎯 Comparação dos Métodos

| Método | Vantagens | Desvantagens |
|--------|-----------|--------------|
| **HTML (public/importar-produtos.html)** | Interface visual bonita | Problema com CORS/SSL |
| **Console - Predefinido** | Sem erros, rápido, customizável | Precisa editar código |
| **Console - Excel** | Lê arquivo direto, automático | Precisa carregar biblioteca |

---

## ⚠️ Troubleshooting

### "Token não encontrado"
**Causa:** Você não fez login
**Solução:** Acesse `http://localhost:5174` e faça login primeiro

### "Biblioteca XLSX não encontrada"
**Causa:** Não carregou a biblioteca antes
**Solução:** Execute o comando para carregar a biblioteca XLSX (Método 2, passo 3)

### Erro 401 - Unauthorized
**Causa:** Token expirado
**Solução:** Faça logout e login novamente

### Erro 400 - Bad Request
**Causa:** IDs de relação (distribuidor, segmento, marca) não existem
**Solução:** Ajuste os valores no script:
```javascript
const ID_DISTRIBUIDOR = 11;  // Use um ID que existe no banco
const ID_SEGMENTO = 1;       // Use um ID que existe no banco
```

### "Failed to fetch"
**Causa:** Backend não está rodando
**Solução:** Verifique se `https://localhost:44370` está ativo

---

## 📁 Arquivos Criados

```
my-app/
├── public/
│   └── importar-produtos.html              (Interface visual - com CORS issues)
├── script-importar-console.js              (Script com produtos predefinidos)
├── script-importar-excel-console.js        (Script que lê Excel)
├── COMO_IMPORTAR_PRODUTOS.md               (Este arquivo)
└── INSTRUCOES_IMPORTACAO.md                (Instruções detalhadas)
```

---

## 🎉 Exemplo Rápido - Testar Agora

Quer testar rapidamente? Copie e cole isto no console após fazer login:

```javascript
(async function() {
    const token = localStorage.getItem('token');
    if (!token) return console.error('❌ Faça login primeiro!');

    const produto = {
        empresa: 1,
        estabelecimento: 1,
        codigo: 'TEST-001',
        idDistribuidor: 11,
        idSegmento: 1,
        idMarca: 1,
        idModelo: 1,
        idGrupo: 1,
        idTag: 1,
        nome: 'Produto Teste',
        descricao: 'Produto de teste via console',
        sku: 'TEST-001',
        ean: '7891234567890',
        posicao: 'T1-P1',
        situacao: 'ATIVO',
        precoCusto: 50.00,
        precoVenda: 100.00,
        quantidade: 5
    };

    const response = await fetch('https://localhost:44370/api/Produtos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(produto)
    });

    if (response.ok) {
        const result = await response.json();
        console.log('✅ Produto criado com ID:', result.id);
    } else {
        console.error('❌ Erro:', await response.text());
    }
})();
```

Se funcionar, você verá: `✅ Produto criado com ID: 42`

Agora pode usar os scripts completos para importar todos os produtos!
