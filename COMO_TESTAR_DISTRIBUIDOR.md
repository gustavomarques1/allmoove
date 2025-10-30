# 🧪 Como Descobrir e Testar Usuário Distribuidor

Este guia mostra como testar se o **Dashboard do Distribuidor** está carregando os pedidos corretos para cada usuário/distribuidor que fizer login.

---

## 📋 Índice
- [1. Consultar Distribuidores Existentes](#1-consultar-distribuidores-existentes)
- [2. Criar Distribuidor de Teste](#2-criar-distribuidor-de-teste)
- [3. Testar Login no Frontend](#3-testar-login-no-frontend)
- [4. Validar Pedidos no Dashboard](#4-validar-pedidos-no-dashboard)
- [5. Testar com Múltiplos Distribuidores](#5-testar-com-múltiplos-distribuidores)

---

## 1. Consultar Distribuidores Existentes

### **Passo 1: Conectar ao SQL Server**

Abra o **SQL Server Management Studio (SSMS)** ou seu cliente SQL preferido e conecte ao banco de dados AllMoove.

### **Passo 2: Executar Query de Consulta**

Execute o arquivo `consultar-distribuidores.sql`:

```sql
-- LISTAR DISTRIBUIDORES COM SEUS IDs
SELECT
    D.ID as ID_DISTRIBUIDOR,
    D.ID_PESSOA,
    P.NOME,
    P.LOGIN,
    P.SENHA,
    P.CPFCNPJ,
    P.TIPO
FROM DISTRIBUIDORES D
INNER JOIN PESSOA P ON D.ID_PESSOA = P.ID
WHERE P.SITUACAO_REGISTRO = 'ATIVO';
```

**Resultado esperado:**
```
ID_DISTRIBUIDOR | ID_PESSOA | NOME                  | LOGIN        | SENHA
----------------|-----------|----------------------|--------------|--------
2               | 5         | João Distribuidor    | joao.dist    | 123456
3               | 8         | Maria Distribuidora  | maria.dist   | 123456
```

✅ **Anote o `ID_DISTRIBUIDOR` e `LOGIN/SENHA`** - você usará para testar!

---

## 2. Criar Distribuidor de Teste

Se a consulta acima **não retornou nenhum resultado**, você precisa criar um distribuidor de teste.

Execute o arquivo `criar-distribuidor-teste.sql` no SQL Server.

**Credenciais criadas:**
```
Login: distribuidor
Senha: 123456
```

---

## 3. Testar Login no Frontend

### **Passo 1: Abrir o Sistema**

1. Inicie o backend ASP.NET: certifique-se que está rodando em `https://localhost:44370/`
2. Inicie o frontend: `npm run dev`
3. Acesse: `http://localhost:5173`

### **Passo 2: Fazer Login**

Use as credenciais encontradas:
```
Login: distribuidor (ou outro login encontrado)
Senha: 123456
```

### **Passo 3: Verificar no Console do Navegador**

Após fazer login, abra o **Console (F12)** e digite:

```javascript
console.log({
  token: localStorage.getItem('token'),
  idPessoa: localStorage.getItem('idPessoa'),
  idDistribuidor: localStorage.getItem('idDistribuidor'),
  userRole: localStorage.getItem('userRole')
});
```

**Resultado esperado:**
```javascript
{
  token: "eyJhbGciOiJIUzI1...",
  idPessoa: "5",
  idDistribuidor: "2",              // ✅ Deve ter um número!
  userRole: "DISTRIBUIDOR"
}
```

✅ Se `idDistribuidor` tem um número (não é null), **funcionou**!

---

## 4. Validar Pedidos no Dashboard

Agora você está no **Dashboard do Distribuidor** (`/distribuidor/dashboard`). Vamos validar se os pedidos mostrados são realmente deste distribuidor.

### **Passo 1: Ver o que está aparecendo no Painel**

Observe o "Painel de Controle - Entregas":
- Quantos pedidos estão aparecendo?
- Quais os IDs dos pedidos?
- Qual o status de cada um?

### **Passo 2: Verificar no Console quais pedidos foram buscados**

Abra o Console (F12) e procure por logs que começam com:
```
📡 Buscando pedidos do distribuidor ID: 2
✅ Pedidos do distribuidor recebidos: [...]
```

**Exemplo de log esperado:**
```
🔐 Usando idDistribuidor: 2 ou idPessoa: 5
📡 Buscando pedidos do distribuidor ID: 2
✅ Pedidos do distribuidor recebidos: [
  { id: 101, status: "Aguardando Aceite", totalPago: 1500.00 },
  { id: 102, status: "Aceito", totalPago: 2300.00 }
]
```

### **Passo 3: Validar no Banco de Dados**

Execute esta query no SQL Server para confirmar que os pedidos mostrados pertencem ao distribuidor:

```sql
-- Substitua '2' pelo ID_DISTRIBUIDOR do usuário logado
DECLARE @ID_DISTRIBUIDOR INT = 2;

SELECT
    P.ID as ID_PEDIDO,
    P.ID_DISTRIBUIDOR,
    P.STATUS,
    P.DATA_PEDIDO,
    P.VALOR_FRETE,
    (
        SELECT SUM(PI.PRECO * PI.QUANTIDADE)
        FROM PEDIDO_ITEM PI
        WHERE PI.ID_PEDIDO = P.ID
    ) as VALOR_PRODUTOS
FROM PEDIDO P
WHERE P.ID_DISTRIBUIDOR = @ID_DISTRIBUIDOR
ORDER BY P.DATA_PEDIDO DESC;
```

**O que validar:**
- ✅ Os pedidos mostrados no dashboard devem ter o mesmo `ID_DISTRIBUIDOR` que você logou
- ✅ Os valores devem bater (total pago, status, quantidade de items)
- ✅ Se não houver pedidos no banco para esse distribuidor, o dashboard deve mostrar "Nenhum pedido encontrado"

---

## 5. Testar com Múltiplos Distribuidores

Para garantir que cada distribuidor vê **apenas seus próprios pedidos**, teste com 2 distribuidores diferentes:

### **Cenário de Teste:**

1. **Criar 2 distribuidores de teste** (se ainda não existirem)
2. **Criar pedidos para cada um** no banco de dados:

```sql
-- Inserir pedido para Distribuidor 1 (ID_DISTRIBUIDOR = 2)
INSERT INTO PEDIDO (EMPRESA, ESTABELECIMENTO, ID_GRUPO_PEDIDO, ID_PESSOA, ID_DISTRIBUIDOR, VALOR_FRETE, STATUS, DATA_PEDIDO)
VALUES (1, 1, 27, 1, 2, 15.00, 'Aguardando Aceite', GETDATE());

-- Inserir pedido para Distribuidor 2 (ID_DISTRIBUIDOR = 3)
INSERT INTO PEDIDO (EMPRESA, ESTABELECIMENTO, ID_GRUPO_PEDIDO, ID_PESSOA, ID_DISTRIBUIDOR, VALOR_FRETE, STATUS, DATA_PEDIDO)
VALUES (1, 1, 27, 1, 3, 20.00, 'Aguardando Aceite', GETDATE());
```

3. **Testar Login com Distribuidor 1:**
   - Faça login com credenciais do distribuidor 1
   - Verifique se aparece APENAS o pedido com `ID_DISTRIBUIDOR = 2`
   - Anote quantos pedidos aparecem

4. **Fazer Logout e Login com Distribuidor 2:**
   - Faça logout
   - Faça login com credenciais do distribuidor 2
   - Verifique se aparece APENAS o pedido com `ID_DISTRIBUIDOR = 3`
   - Confirme que os pedidos do distribuidor 1 NÃO aparecem

### **Checklist de Validação:**

- [ ] Cada distribuidor vê apenas seus próprios pedidos
- [ ] Os indicadores (Novos Pedidos, Em Andamento, Concluídos) são calculados corretamente para cada distribuidor
- [ ] O faturamento mostrado corresponde aos pedidos daquele distribuidor específico
- [ ] Ao aceitar um pedido, apenas aquele distribuidor consegue aceitá-lo
- [ ] Trocar de conta mostra pedidos diferentes

---

## 🐛 Troubleshooting

### **Problema: `idDistribuidor` é `null` no localStorage**

**Causa:** O hook `useAuth` não conseguiu encontrar o distribuidor na tabela `DISTRIBUIDORES`.

**Solução:**
1. Execute a query:
```sql
SELECT * FROM DISTRIBUIDORES WHERE ID_PESSOA = 5; -- Substitua 5 pelo idPessoa
```
2. Se não retornar nada, crie o registro:
```sql
INSERT INTO DISTRIBUIDORES (EMPRESA, ESTABELECIMENTO, ID_PESSOA, RAZAO_SOCIAL, SITUACAO_REGISTRO)
VALUES (1, 1, 5, 'Distribuidor Teste LTDA', 'ATIVO');
```

---

### **Problema: Dashboard mostra pedidos de TODOS os distribuidores**

**Causa:** O endpoint da API pode estar retornando todos os pedidos ao invés de filtrar por distribuidor.

**Solução:**
1. Verifique o endpoint no backend: `GET /api/Pedidos/distribuidor/{id}`
2. Confirme que está filtrando por `ID_DISTRIBUIDOR = {id}` e não por `ID_PESSOA`

---

### **Problema: "Nenhum pedido encontrado" mas existem pedidos no banco**

**Causa:** Os pedidos no banco têm `ID_DISTRIBUIDOR` NULL ou diferente do distribuidor logado.

**Solução:**
1. Execute:
```sql
SELECT ID, ID_DISTRIBUIDOR, STATUS FROM PEDIDO WHERE ID_DISTRIBUIDOR IS NULL;
```
2. Atualize os pedidos para ter o distribuidor correto:
```sql
UPDATE PEDIDO SET ID_DISTRIBUIDOR = 2 WHERE ID IN (101, 102); -- IDs dos pedidos
```

---

**Última atualização:** 23/10/2025
