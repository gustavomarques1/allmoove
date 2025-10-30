# 🔧 Como Resolver Erro "Nome de objeto 'PESSOA' inválido"

## ❌ O Problema

Ao executar queries SQL, você recebe este erro:

```
Mensagem 208, Nível 16, Estado 1, Linha 1
Nome de objeto 'PESSOA' inválido.
```

---

## ✅ Solução Rápida

### **1. Execute o script de diagnóstico**

Abra o SQL Server Management Studio e execute:

```sql
-- diagnostico-banco.sql
```

Este script irá:
- ✅ Verificar qual database está selecionado
- ✅ Listar todas as tabelas disponíveis
- ✅ Identificar o schema correto (dbo)
- ✅ Testar diferentes formas de acessar a tabela
- ✅ Mostrar a sintaxe correta para usar

---

### **2. Use SEMPRE o prefixo `dbo.` antes das tabelas**

❌ **ERRADO:**
```sql
SELECT * FROM PESSOA;
SELECT * FROM PEDIDO;
SELECT * FROM PRODUTO;
```

✅ **CORRETO:**
```sql
SELECT * FROM dbo.PESSOA;
SELECT * FROM dbo.PEDIDO;
SELECT * FROM dbo.PRODUTO;
```

---

### **3. Certifique-se de estar no database correto**

Adicione no início de TODOS os seus scripts SQL:

```sql
USE allmoove;
GO
```

---

## 📋 Verificações Iniciais

### **Verificação 1: Database está selecionado?**

```sql
SELECT DB_NAME() AS DatabaseAtual;
```

**Resultado esperado:** `allmoove`

Se aparecer outro nome, execute:
```sql
USE allmoove;
GO
```

---

### **Verificação 2: Tabela PESSOA existe?**

```sql
IF OBJECT_ID('dbo.PESSOA', 'U') IS NOT NULL
    PRINT '✅ Tabela existe!'
ELSE
    PRINT '❌ Tabela NÃO existe!';
```

---

### **Verificação 3: Listar todas as tabelas**

```sql
SELECT
    SCHEMA_NAME(schema_id) AS [Schema],
    name AS Tabela
FROM sys.tables
ORDER BY name;
```

Procure por:
- `PESSOA`
- `PEDIDO`
- `PRODUTO`
- `PEDIDO_ITEM`

---

## 🎯 Scripts Atualizados

Todos os scripts SQL foram atualizados para usar a sintaxe correta:

### **1. diagnostico-banco.sql** ⭐ COMECE POR AQUI
Execute primeiro este script para identificar problemas

### **2. validar-vinculacao-distribuidor.sql**
Valida se a vinculação fornecedor→distribuidor está funcionando

### **3. validar-pedidos-distribuidor.sql**
Verifica pedidos de um distribuidor específico

### **4. criar-distribuidor-teste.sql**
Cria um distribuidor de teste para validação

---

## 🔍 Entendendo o Erro

### **O que significa "Nome de objeto inválido"?**

Este erro acontece quando:

1. **Database errado está selecionado**
   - Você está no database `master` ao invés de `allmoove`
   - Solução: `USE allmoove;`

2. **Schema não foi especificado**
   - SQL Server não encontra a tabela sem o schema
   - Solução: Use `dbo.PESSOA` ao invés de `PESSOA`

3. **Tabela realmente não existe**
   - Migrations do Entity Framework não foram executadas
   - Solução: Rodar migrations no backend

---

## 🚀 Passo a Passo Completo

### **1. Abra SQL Server Management Studio**

### **2. Conecte ao servidor**
- Server: `localhost` ou `.\SQLEXPRESS`
- Authentication: Windows Authentication

### **3. Execute o diagnóstico**

```sql
-- Abre e executa: diagnostico-banco.sql
```

### **4. Verifique o resultado**

Se aparecer:
```
✅ Tabela dbo.PESSOA existe!
✅ Tabela dbo.PEDIDO existe!
✅ Tabela dbo.PRODUTO existe!
✅ ESTRUTURA DO BANCO ESTÁ OK!
```

**👉 Tudo certo! Pode continuar com os outros scripts.**

---

### **5. Se alguma tabela não existir:**

Execute as migrations do Entity Framework:

```bash
cd C:\devtemp\allmoove1_2025.10.11_10.57\allmoove1\allmoove1\AllmooveApi
dotnet ef database update
```

---

## 📝 Exemplos de Queries Corretas

### **Listar distribuidores:**
```sql
USE allmoove;
GO

SELECT
    ID,
    NOME,
    TIPO,
    LOGIN
FROM dbo.PESSOA
WHERE TIPO = 'DISTRIBUIDOR'
  AND SITUACAO_REGISTRO = 'ATIVO';
```

### **Listar pedidos:**
```sql
USE allmoove;
GO

SELECT TOP 10
    P.ID,
    P.ID_PESSOA,
    P.ID_DISTRIBUIDOR,
    P.STATUS,
    P.DATA_HORA_CRICAO_REGISTRO
FROM dbo.PEDIDO P
ORDER BY P.ID DESC;
```

### **Listar produtos:**
```sql
USE allmoove;
GO

SELECT TOP 10
    P.ID,
    P.NOME,
    P.ID_DISTRIBUIDOR,
    P.PRECO_VENDA_PIX
FROM dbo.PRODUTO P
ORDER BY P.ID DESC;
```

---

## ⚠️ Problemas Comuns

### **Problema 1: "Database allmoove não existe"**

**Solução:**
1. Verificar connection string no `appsettings.json`
2. Executar migrations:
   ```bash
   dotnet ef database update
   ```

---

### **Problema 2: "Login failed for user"**

**Solução:**
1. Verificar se o SQL Server está rodando
2. Usar Windows Authentication
3. Verificar permissões do usuário

---

### **Problema 3: "Tabelas não aparecem"**

**Solução:**
1. Executar migrations do Entity Framework
2. Verificar se está no database correto (`USE allmoove;`)
3. Atualizar Object Explorer (F5)

---

## 📚 Recursos Adicionais

### **Arquivos de Ajuda:**
- `diagnostico-banco.sql` - Diagnóstico completo do banco
- `VINCULACAO_FORNECEDOR_DISTRIBUIDOR.md` - Documentação da integração
- `COMO_TESTAR_DISTRIBUIDOR.md` - Como testar o sistema

### **Comandos Úteis:**

```sql
-- Mostrar database atual
SELECT DB_NAME();

-- Trocar database
USE allmoove;

-- Listar tabelas
SELECT name FROM sys.tables ORDER BY name;

-- Verificar se tabela existe
IF OBJECT_ID('dbo.PESSOA', 'U') IS NOT NULL
    PRINT 'Existe';
```

---

## ✅ Checklist Final

Antes de executar qualquer script SQL, garanta que:

- [ ] SQL Server Management Studio está aberto
- [ ] Conectado ao servidor correto
- [ ] Database `allmoove` está selecionado (`USE allmoove;`)
- [ ] Usando prefixo `dbo.` antes das tabelas
- [ ] Executou o script de diagnóstico primeiro

---

## 🆘 Ainda com Problemas?

Se após seguir todos os passos o erro persistir:

1. **Execute o script de diagnóstico:**
   ```sql
   -- diagnostico-banco.sql
   ```

2. **Copie a saída completa do script**

3. **Verifique:**
   - Database atual (`DB_NAME()`)
   - Lista de tabelas encontradas
   - Mensagens de erro específicas

4. **Possíveis causas:**
   - Migrations não executadas
   - Connection string incorreta
   - Permissões insuficientes
   - SQL Server não iniciado

---

**✅ Após resolver o erro, continue com a validação da vinculação fornecedor→distribuidor!**

Execute: `validar-vinculacao-distribuidor.sql`
