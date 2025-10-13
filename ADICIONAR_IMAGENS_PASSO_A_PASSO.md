# 🎨 Adicionar Imagens - Guia Passo a Passo

## 🚀 Método Recomendado: Console do Navegador

Este método é mais seguro e não precisa acessar o banco de dados diretamente.

---

## 📋 Passo a Passo (5 minutos)

### **1. Faça login na aplicação**
```
http://localhost:5173
```
Usuário e senha normais.

---

### **2. Abra o Console do DevTools**

**Windows/Linux:** Pressione `F12` ou `Ctrl + Shift + J`
**Mac:** Pressione `Cmd + Option + J`

Clique na aba **Console**.

---

### **3. Copie e Cole o Script**

Abra o arquivo:
```
adicionar-imagens-produtos.js
```

**Copie TODO o conteúdo** (Ctrl+A, Ctrl+C) e **cole no Console** (Ctrl+V).

Pressione **Enter**.

---

### **4. Aguarde a Execução**

Você verá logs como:

```
🎨 Adicionando Imagens aos Produtos

🔐 Token encontrado: eyJhbGciOiJIUzI1NiI...

📦 Buscando produtos...
✅ 703 produtos encontrados

🎨 Adicionando imagens...

✅ [1/703] "11 FOG PRETO WEFIX EMB. NOVA" → tela1.png
✅ [2/703] "11 PRETO WEFIX" → tela2.png
✅ [3/703] "BATERIA IPHONE 12" → acessorio1.png
...
📊 Progresso: 50/703 (7%)
...
📊 Progresso: 100/703 (14%)
...
```

**Tempo estimado:** ~2 minutos para 703 produtos.

---

### **5. Resultado**

Ao final, você verá:

```
========================================
🏁 IMAGENS ADICIONADAS!
========================================
✅ Sucesso: 703 produtos
❌ Erros: 0 produtos

📊 Distribuição de imagens:
┌────────────┬───────┐
│   Pasta    │  Qtd  │
├────────────┼───────┤
│ celulares  │   10  │
│ telas      │  650  │
│ acessorios │   43  │
└────────────┴───────┘

✨ Imagens adicionadas com sucesso!
💡 Recarregue a página: location.reload()
```

---

### **6. Recarregar a Página**

No mesmo console, digite:

```javascript
location.reload()
```

Ou simplesmente pressione **Ctrl + R** ou **F5**.

---

## ✅ Verificar se Funcionou

### **Ir para a loja:**
```
http://localhost:5173/assistencia/loja?idSegmento=1
```

Você deve ver:
- ✅ **703 produtos**
- ✅ **Todos com imagens**
- ✅ **Preços corretos**

---

## ❓ Troubleshooting

### **"Token não encontrado"**
→ Faça logout e login novamente.

### **"Erro 401"**
→ Token expirou. Faça login novamente e reexecute o script.

### **"Erro 400 ou 500"**
→ Verifique se a coluna `imagem` existe na tabela `Produtos`.

Se a coluna não existir, execute no SQL:
```sql
ALTER TABLE dbo.Produtos ADD imagem VARCHAR(255);
```

---

## 🔍 Verificar no Banco de Dados (Opcional)

Se você quiser confirmar que as imagens foram adicionadas:

```sql
-- Ver banco atual
SELECT DB_NAME() AS BancoDeDadosAtual;

-- Ver total com imagens
SELECT COUNT(*) as TotalComImagem
FROM dbo.Produtos
WHERE imagem IS NOT NULL AND imagem <> '';

-- Ver exemplos
SELECT TOP 10
    id,
    LEFT(nome, 40) as Nome,
    imagem,
    precoVenda
FROM dbo.Produtos
WHERE imagem IS NOT NULL
ORDER BY id;
```

---

## 📁 Arquivos

| Arquivo | Quando Usar |
|---------|-------------|
| `adicionar-imagens-produtos.js` | ⭐ **RECOMENDADO** - Console do navegador |
| `adicionar-imagens-sql-corrigido.sql` | Se preferir executar direto no SQL |
| `ADICIONAR_IMAGENS_PASSO_A_PASSO.md` | Este guia |

---

## ✅ Checklist

- [ ] Fiz login na aplicação
- [ ] Abri o Console (F12)
- [ ] Colei o script `adicionar-imagens-produtos.js`
- [ ] Aguardei a execução (~2 minutos)
- [ ] Recarreguei a página (`location.reload()`)
- [ ] Verifiquei que as imagens aparecem
- [ ] Tudo funcionando! 🎉

---

**Tempo total:** ~5 minutos
**Resultado:** 703 produtos com imagens! 🚀
