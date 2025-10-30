# 🧪 Teste de Cadastro - Quantidade e Preço

## Objetivo
Verificar se quantidade e preço estão sendo salvos corretamente no banco de dados.

## Preparação

1. **Abra o Console do Navegador:**
   - F12 → Aba "Console"
   - Deixe aberto durante todo o teste

2. **Limpe o console:**
   - Clique no ícone de "limpar" ou Ctrl+L

## Passo a Passo do Teste

### 1. Acesse a Tela de Estoque
```
URL: /distribuidor/estoque
Botão: "Cadastrar Produto"
```

### 2. Preencha o Formulário

**Campos OBRIGATÓRIOS:**
```
Nome: Teste Quantidade 001
SKU: TESTE-QTD-001
Segmento: [Selecione qualquer um]
Marca: [Selecione qualquer uma]
Preço de Venda: 150.00
Quantidade: 25
```

**Campos OPCIONAIS (preencha para teste completo):**
```
Descrição: Este é um produto de teste para validar se quantidade está sendo salva corretamente no banco de dados
Preço de Custo: 80.00
Posição: A1-B2-C3
```

### 3. Clique em "Cadastrar Produto"

### 4. Analise os Logs no Console

#### **Logs Esperados (em ordem):**

```javascript
// 1. Dados recebidos do formulário
📊 Dados recebidos do formulário (produto param): {
  nome: "Teste Quantidade 001",
  sku: "TESTE-QTD-001",
  precoVenda: "150", // ou 150 (número)
  quantidade: "25",  // ou 25 (número)
  // ...
}

// 2. Verificação pré-payload
🔍 VERIFICAÇÃO PRÉ-PAYLOAD:
  quantidade original: "25" (ou 25)
  quantidade !== undefined: true
  quantidade !== "": true
  parseFloat(quantidade): 25
  Resultado final: 25

// 3. Payload enviado
📤 Payload COMPLETO enviado para API: {
  "nome": "Teste Quantidade 001",
  "sku": "TESTE-QTD-001",
  "precoVendaPix": 150,
  "quantidade": 25,  // ⚠️ VERIFICAR SE É 25, NÃO 0!
  "idDistribuidor": [número],
  // ...
}

// 4. Valores convertidos
💵 Valores convertidos no payload: {
  precoVendaPix: 150,
  quantidade: 25,  // ⚠️ VERIFICAR!
  tipo_quantidade_payload: "number"
}

// 5. Response da API
✅ Produto criado com sucesso. Response COMPLETO: {
  "id": 64,
  "quantidade": ???,  // ⚠️ VERIFICAR O QUE RETORNA
  "precoVendaPix": ???,  // ⚠️ VERIFICAR O QUE RETORNA
  // ...
}

// 6. Campos importantes
🔍 CAMPOS IMPORTANTES retornados pela API:
  Quantidade: ??? (tipo: number)
  PrecoVendaPix: ??? (tipo: number)
```

### 5. Verifique a Lista de Produtos

Após o cadastro, o produto deve aparecer na lista com:
- ✅ Quantidade: **25 unidades**
- ✅ Valor Unit: **R$ 150.00**
- ✅ Valor Total: **R$ 3.750,00** (25 × 150)

---

## ❌ Cenários de Erro

### **Problema 1: Quantidade = 0 no payload**
```javascript
📤 Payload COMPLETO enviado para API: {
  "quantidade": 0  // ❌ ERRO!
}
```

**Causa provável:**
- Campo não está sendo preenchido no formulário
- Conversão `parseFloat()` retornando NaN
- Valor sendo resetado em algum lugar

### **Problema 2: Quantidade = 25 no payload, mas 0 na response**
```javascript
// Enviado:
"quantidade": 25  // ✅ OK

// Recebido:
"quantidade": 0  // ❌ ERRO!
```

**Causa provável:**
- Backend não está salvando o campo
- Campo tem nome diferente no banco (QUANTIDADE vs quantidade)
- Validação do backend rejeitando o valor

### **Problema 3: PrecoVendaPix = 0**
```javascript
"precoVendaPix": 0  // ❌ ERRO!
```

**Causa provável:**
- Campo `precoVenda` não está sendo convertido corretamente
- Backend esperando outro nome de campo

---

## 🔍 Comandos SQL para Verificar no Banco

```sql
-- Ver o último produto cadastrado
USE allmoove;
GO

SELECT TOP 1
    ID,
    NOME,
    SKU,
    QUANTIDADE,
    PRECO_VENDA_PIX,
    PRECO_CUSTO,
    ID_MARCA,
    ID_SEGMENTO,
    ID_DISTRIBUIDOR,
    DESCRICAO
FROM PRODUTO
WHERE SKU = 'TESTE-QTD-001'
ORDER BY ID DESC;
GO
```

**Resultado Esperado:**
```
QUANTIDADE: 25.00 (ou 25)
PRECO_VENDA_PIX: 150.00 (ou 150)
PRECO_CUSTO: 80.00
```

---

## 📋 Checklist de Validação

### Frontend:
- [ ] Campo quantidade aceita input numérico
- [ ] Valor não é resetado ao submeter
- [ ] `parseFloat()` converte corretamente
- [ ] Payload contém `quantidade: 25` (não 0)
- [ ] Payload contém `precoVendaPix: 150` (não 0)

### Backend:
- [ ] API recebe o payload corretamente
- [ ] Campo QUANTIDADE é salvo no banco
- [ ] Campo PRECO_VENDA_PIX é salvo no banco
- [ ] Response retorna os valores corretos

### Exibição:
- [ ] Produto aparece na lista
- [ ] Quantidade exibida: "25 unidades"
- [ ] Valor Unit: "R$ 150.00"
- [ ] Valor Total: "R$ 3.750,00"
- [ ] Marca exibida (não "Sem marca")

---

## 🐛 Se o Problema Persistir

**Copie e cole no chat:**

1. **Todos os logs do console** (desde "📦 Criando novo produto" até "📦 Produto formatado")
2. **O resultado da query SQL** acima
3. **Screenshot** da tela de cadastro preenchida

Isso vai me ajudar a identificar exatamente onde o problema está acontecendo.

---

**Data do Teste:** [Anotar]
**Resultado:** [ ] Passou ✅ | [ ] Falhou ❌
