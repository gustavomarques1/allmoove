# 📋 MAPEAMENTO DAS VIEWS - Informe os Nomes Corretos

## 🎯 Objetivo:

O backend espera 3 views, mas elas já existem no seu banco com nomes diferentes.

Precisamos mapear os nomes corretos para atualizar o backend.

---

## 📊 PASSO 1: Execute o Script

Execute o script **`verificar-views-existentes.sql`** no SQL Server para ver todas as views disponíveis.

---

## 📝 PASSO 2: Preencha o Mapeamento Abaixo:

### View 1: Distribuidores por Segmento

**O backend espera:** `VIEW_DISTRIBUIDOR_CONSULTA`

**Seu banco tem:** `_____________________________` ← **PREENCHA AQUI**

**Colunas esperadas:**
- `ID_DISTRIBUIDOR` (long)
- `ID_SEGMENTO` (long)
- `NOME` (string)
- `CPFCNPJ` (string)

**Finalidade:** Retorna lista de distribuidores disponíveis filtrados por segmento.

---

### View 2: Últimos Pedidos

**O backend espera:** `VIEW_DISTRIBUIDOR_ULTIMOS_PEDIDOS`

**Seu banco tem:** `_____________________________` ← **PREENCHA AQUI**

**Colunas esperadas:**
- `ID_DISTRIBUIDOR` (long)
- `ID_ASSISTENCIA` (long)
- `NOME` (string)
- `CPFCNPJ` (string)

**Finalidade:** Retorna os últimos pedidos de uma assistência técnica.

---

### View 3: Distribuidores Favoritos

**O backend espera:** `VIEW_DISTRIBUIDOR_FAVORITO`

**Seu banco tem:** `PESSOA_SEGMENTO_FAVORITO` ← **VOCÊ MENCIONOU ESTA**

**Colunas esperadas:**
- `ID_DISTRIBUIDOR` (long)
- `ID_ASSISTENCIA` (long)
- `ID_SEGMENTO` (long)
- `NOME` (string)
- `CPFCNPJ` (string)

**Finalidade:** Retorna distribuidores favoritos de uma assistência por segmento.

---

## 📋 PASSO 3: Verifique as Colunas

Para cada view que você identificou, execute no SQL Server:

```sql
-- Exemplo para PESSOA_SEGMENTO_FAVORITO:
SELECT TOP 5 * FROM dbo.PESSOA_SEGMENTO_FAVORITO;

-- Ver estrutura:
EXEC sp_columns 'PESSOA_SEGMENTO_FAVORITO';
```

**Anote os nomes EXATOS das colunas:**

### View 1 - Distribuidores por Segmento:
- Coluna ID_DISTRIBUIDOR: `_____________________________`
- Coluna ID_SEGMENTO: `_____________________________`
- Coluna NOME: `_____________________________`
- Coluna CPFCNPJ: `_____________________________`

### View 2 - Últimos Pedidos:
- Coluna ID_DISTRIBUIDOR: `_____________________________`
- Coluna ID_ASSISTENCIA: `_____________________________`
- Coluna NOME: `_____________________________`
- Coluna CPFCNPJ: `_____________________________`

### View 3 - Distribuidores Favoritos (PESSOA_SEGMENTO_FAVORITO):
- Coluna ID_DISTRIBUIDOR: `_____________________________`
- Coluna ID_ASSISTENCIA: `_____________________________`
- Coluna ID_SEGMENTO: `_____________________________`
- Coluna NOME: `_____________________________`
- Coluna CPFCNPJ: `_____________________________`

---

## 🚀 PASSO 4: Depois de Preencher

Cole aqui os resultados e eu vou:

1. ✅ Atualizar os Models do backend com os nomes corretos das tabelas
2. ✅ Atualizar o DbContext
3. ✅ Criar script SQL para criar aliases (se necessário)

---

## 💡 Exemplo de Resposta:

```
View 1: VW_DISTRIBUIDORES_SEGMENTO
  - ID_DISTRIBUIDOR → ID_DIST
  - ID_SEGMENTO → SEGMENTO_ID
  - NOME → NOME_DISTRIBUIDOR
  - CPFCNPJ → CPF_CNPJ

View 2: VW_PEDIDOS_RECENTES
  - ID_DISTRIBUIDOR → DISTRIBUIDOR_ID
  - ID_ASSISTENCIA → ASSISTENCIA_ID
  - NOME → NOME_DIST
  - CPFCNPJ → DOCUMENTO

View 3: PESSOA_SEGMENTO_FAVORITO
  - ID_DISTRIBUIDOR → ID_PESSOA_DISTRIBUIDOR
  - ID_ASSISTENCIA → ID_PESSOA_ASSISTENCIA
  - ID_SEGMENTO → ID_SEGMENTO
  - NOME → NOME_FANTASIA
  - CPFCNPJ → CNPJ
```

---

**📞 Aguardo suas informações para ajustar o backend!**
