# 🔧 Debug: Erro 500 ao Cadastrar Produto

## ⚠️ Problema

Ao tentar cadastrar um produto pelo formulário, ocorre erro 500 (Internal Server Error) no endpoint `POST /api/Produtos`.

## 📋 Dados Atualizados

### ✅ Correções Aplicadas

1. **Campo `marca` e `modelo`**: Corrigido para enviar como `marca` e `modelo` (não `idMarca` e `idModelo`)
2. **Campos opcionais**: Agora envia `null` ao invés de strings vazias `''`
3. **Conversão de tipos**: Todos os campos numéricos são convertidos explicitamente (parseFloat, parseInt)
4. **Validação melhorada**: Validação de `precoVenda` aceita tanto `precoVenda` quanto `valorUnitario`

### 📤 Payload Atual (Após Correções)

```javascript
{
  // Campos obrigatórios
  "nome": "Tela iPhone 16 Pro",
  "sku": "TIP16PRO001",
  "precoVenda": 1299,
  "idDistribuidor": 20,

  // Campos opcionais
  "descricao": null,
  "ean": null,
  "quantidade": 24.97,
  "posicao": null,
  "imagem": null,

  // IDs de relacionamento
  "idSegmento": 1,
  "marca": 1,
  "modelo": 4,

  // Campos do sistema
  "empresa": 1,
  "estabelecimento": 1,
  "situacaoRegistro": "ATIVO",
  "situacao": "ATIVO"
}
```

## 🔍 Possíveis Causas do Erro 500

### 1. **Foreign Key Constraint Violation** (Mais Provável)

Os IDs enviados podem não existir nas tabelas de relacionamento:

```sql
-- Verificar se os IDs existem:

-- Segmento ID = 1
SELECT * FROM PRODUTO_SEGMENTO WHERE ID = 1;

-- Marca ID = 1
SELECT * FROM PRODUTO_MARCA WHERE ID = 1;

-- Modelo ID = 4
SELECT * FROM PRODUTO_MODELO WHERE ID = 4;

-- Distribuidor ID = 20
SELECT * FROM PESSOA WHERE ID = 20 AND SITUACAO_REGISTRO = 'ATIVO';
SELECT * FROM PESSOA_PAPEL WHERE ID_PESSOA = 20 AND ID_PAPEL = 4; -- 4 = DISTRIBUIDOR
```

**Solução**: Use IDs que realmente existem no banco de dados.

---

### 2. **Unique Constraint no SKU**

O SKU pode já existir no banco:

```sql
-- Verificar se SKU já existe
SELECT * FROM PRODUTO WHERE SKU = 'TIP16PRO001';
```

**Solução**: Use um SKU único que ainda não existe no banco.

---

### 3. **Tipo de Dados Incompatível**

O campo `QUANTIDADE` no banco pode ser `int`, mas estamos enviando `decimal` (24.97):

```sql
-- Verificar tipo do campo QUANTIDADE
SELECT
    COLUMN_NAME,
    DATA_TYPE,
    NUMERIC_PRECISION,
    NUMERIC_SCALE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'PRODUTO' AND COLUMN_NAME = 'QUANTIDADE';
```

**Solução**: Se QUANTIDADE for `int`, envie um número inteiro (24 ao invés de 24.97).

---

### 4. **NOT NULL Constraint em Campo Não Enviado**

Pode haver campos NOT NULL que não estamos enviando:

```sql
-- Verificar campos NOT NULL da tabela PRODUTO
SELECT
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'PRODUTO' AND IS_NULLABLE = 'NO'
ORDER BY ORDINAL_POSITION;
```

**Solução**: Envie todos os campos obrigatórios (NOT NULL).

---

### 5. **Trigger ou Stored Procedure Falhando**

Pode haver um trigger na tabela PRODUTO que valida os dados:

```sql
-- Verificar triggers na tabela PRODUTO
SELECT
    t.name AS TriggerName,
    OBJECT_NAME(t.parent_id) AS TableName,
    te.type_desc AS TriggerType
FROM sys.triggers t
INNER JOIN sys.trigger_events te ON t.object_id = te.object_id
WHERE OBJECT_NAME(t.parent_id) = 'PRODUTO';
```

**Solução**: Desabilitar temporariamente o trigger ou corrigir a lógica que está falhando.

---

## 🧪 Como Descobrir o Erro Real

### Opção 1: Verificar Logs do Backend

No terminal onde o backend está rodando, procure por:

```
[ERROR] Erro em PostProduto: [MENSAGEM DO ERRO]
InnerException: [MENSAGEM DETALHADA]
```

Isso mostrará o erro real do banco de dados ou da aplicação.

---

### Opção 2: Modificar o Controller para Retornar Erro Detalhado

Edite `ProdutosConstroller.cs` linha 194-197:

**Antes:**
```csharp
catch (Exception ex)
{
    _logger.LogError(ex, "Erro ao criar produto");
    return StatusCode(500, new { message = "Erro ao criar produto" });
}
```

**Depois (TEMPORÁRIO - apenas para debug):**
```csharp
catch (Exception ex)
{
    _logger.LogError(ex, "Erro ao criar produto");
    return StatusCode(500, new {
        message = "Erro ao criar produto",
        error = ex.Message,
        innerError = ex.InnerException?.Message,
        stackTrace = ex.StackTrace
    });
}
```

**⚠️ IMPORTANTE**: Remover essa mudança após descobrir o erro! Não deve expor detalhes técnicos em produção.

---

### Opção 3: Testar Diretamente no Banco de Dados

Execute um INSERT manual para testar:

```sql
-- Testar INSERT na tabela PRODUTO
INSERT INTO dbo.PRODUTO (
    NOME,
    SKU,
    PRECO_VENDA_PIX,
    QUANTIDADE,
    ID_SEGMENTO,
    MARCA,
    MODELO,
    ID_DISTRIBUIDOR,
    EMPRESA,
    ESTABELECIMENTO,
    SITUACAO_REGISTRO,
    SITUACAO,
    DATA_HORA_CRIACAO_REGISTRO
)
VALUES (
    'Teste Manual',           -- NOME
    'TESTE001',               -- SKU
    1299.00,                  -- PRECO_VENDA_PIX
    24,                       -- QUANTIDADE (inteiro)
    1,                        -- ID_SEGMENTO
    1,                        -- MARCA
    4,                        -- MODELO
    20,                       -- ID_DISTRIBUIDOR
    1,                        -- EMPRESA
    1,                        -- ESTABELECIMENTO
    'ATIVO',                  -- SITUACAO_REGISTRO
    'ATIVO',                  -- SITUACAO
    GETDATE()                 -- DATA_HORA_CRIACAO_REGISTRO
);
```

Se esse INSERT falhar, a mensagem de erro do SQL Server mostrará exatamente qual constraint/regra está sendo violada.

---

### Opção 4: Testar com Payload Mínimo

Teste com apenas os campos absolutamente necessários:

```javascript
// No console do navegador:
const token = localStorage.getItem('token');
const idDistribuidor = localStorage.getItem('idDistribuidor');

fetch('https://localhost:44370/api/Produtos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    nome: "Teste Mínimo",
    sku: "TESTMIN001",
    precoVenda: 100.00,
    idDistribuidor: parseInt(idDistribuidor)
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

Se isso funcionar, vá adicionando campos um por um até encontrar qual está causando o erro.

---

## 📊 Checklist de Validação

Execute essa checklist no SQL Server:

```sql
-- ✅ 1. Distribuidor existe e é ATIVO?
SELECT * FROM PESSOA WHERE ID = 20 AND SITUACAO_REGISTRO = 'ATIVO';
SELECT * FROM PESSOA_PAPEL WHERE ID_PESSOA = 20 AND ID_PAPEL = 4;

-- ✅ 2. Segmento existe?
SELECT * FROM PRODUTO_SEGMENTO WHERE ID = 1;

-- ✅ 3. Marca existe?
SELECT * FROM PRODUTO_MARCA WHERE ID = 1;

-- ✅ 4. Modelo existe?
SELECT * FROM PRODUTO_MODELO WHERE ID = 4;

-- ✅ 5. SKU já existe?
SELECT * FROM PRODUTO WHERE SKU = 'TIP16PRO001';

-- ✅ 6. Campos NOT NULL da tabela PRODUTO
SELECT COLUMN_NAME
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'PRODUTO' AND IS_NULLABLE = 'NO';

-- ✅ 7. Tipo de dados do campo QUANTIDADE
SELECT DATA_TYPE, NUMERIC_PRECISION, NUMERIC_SCALE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'PRODUTO' AND COLUMN_NAME = 'QUANTIDADE';
```

---

## 🎯 Próximos Passos

1. **Execute o checklist SQL acima** para identificar qual validação está falhando
2. **Verifique os logs do backend** para ver o erro exato
3. **Teste o INSERT manual** no banco de dados
4. **Use o payload mínimo** no console do navegador

Após identificar o erro real, podemos ajustar o código frontend conforme necessário.

---

**Data:** 28/10/2025
**Status:** 🔍 Aguardando logs do backend ou resultados do checklist SQL
