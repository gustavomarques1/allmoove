# 🧪 Como Testar Login de Distribuidor

## Passo 1: Verificar dados no banco

Execute no **SQL Server Management Studio**:

```sql
USE allmoove;
GO

-- Ver todas as pessoas e seus tipos
SELECT Id, Nome, Login, Email, Tipo
FROM PESSOA
ORDER BY Id;
GO
```

**Anote:**
- Um `Id` de uma pessoa que você quer transformar em distribuidor
- O `Login` ou `Email` dessa pessoa (será usado para fazer login)

---

## Passo 2: Transformar pessoa em DISTRIBUIDOR

```sql
-- Substitua o número 2 pelo ID que você anotou
UPDATE PESSOA
SET Tipo = 'DISTRIBUIDOR'
WHERE Id = 2;
GO

-- Verificar se funcionou
SELECT Id, Nome, Login, Email, Tipo
FROM PESSOA
WHERE Id = 2;
GO
```

**Resultado esperado:**
```
Id  Nome                Login                    Email                    Tipo
2   Maria Silva         maria@distribuidor.com   maria@distribuidor.com   DISTRIBUIDOR
```

---

## Passo 3: Criar senha para o usuário (se necessário)

**⚠️ IMPORTANTE:** O usuário precisa ter uma senha cadastrada em `/api/account/LoginUser`

Se o login falhar, pode ser que o usuário não tenha senha. Neste caso:

1. **Opção A:** Use um usuário que você já sabe o login/senha
2. **Opção B:** Crie um novo usuário distribuidor completo (próximo passo)

---

## Passo 4: (ALTERNATIVA) Criar novo distribuidor do zero

Se preferir criar um usuário novo em vez de modificar um existente:

```sql
-- 1. Criar a pessoa
INSERT INTO PESSOA (Nome, Login, Email, Tipo, Ativo, DataCriacao)
VALUES (
    'Distribuidora Teste LTDA',
    'distribuidor@teste.com',
    'distribuidor@teste.com',
    'DISTRIBUIDOR',
    1,
    GETDATE()
);
GO

-- 2. Ver o ID criado
SELECT Id, Nome, Login, Email, Tipo
FROM PESSOA
WHERE Email = 'distribuidor@teste.com';
GO
```

**Depois você precisará:**
- Criar a senha no sistema de autenticação (backend)
- OU usar um usuário existente que já tem senha

---

## Passo 5: Fazer login no frontend

1. **Limpe o cache do navegador:**
   - Abra DevTools (F12)
   - Vá em **Application** > **Local Storage**
   - Delete todas as chaves
   - OU use modo anônimo

2. **Acesse:** `http://localhost:5176/`

3. **Faça login com:**
   - Email: `maria@distribuidor.com` (ou o login que você configurou)
   - Senha: `[senha do usuário]`

4. **Abra o Console (F12)** e procure por estas linhas:
   ```
   🔍 Buscando pessoa no array de pessoas...
   📧 Email de busca: maria@distribuidor.com
   📊 Total de pessoas retornadas: XX
   👤 Pessoa encontrada na API: { tipo: "DISTRIBUIDOR", ... }
   ✅ Login concluído com sucesso! Role: DISTRIBUIDOR
   🔀 Redirecionando para: /distribuidor/dashboard
   ```

5. **Verifique o localStorage:**
   - DevTools > Application > Local Storage
   - Procure a chave `userRole`
   - Deve estar: `"DISTRIBUIDOR"`

---

## Passo 6: Diagnosticar problemas

### Problema 1: Sempre vai para /assistencia/dashboard

**Causa:** Campo `Tipo` está NULL ou vazio

**Solução:**
```sql
-- Ver o tipo da pessoa
SELECT Id, Nome, Tipo FROM PESSOA WHERE Login = 'maria@distribuidor.com';

-- Se estiver NULL, atualizar
UPDATE PESSOA SET Tipo = 'DISTRIBUIDOR' WHERE Login = 'maria@distribuidor.com';
```

### Problema 2: Console mostra "Pessoa não encontrada"

**Causa:** A busca não encontrou o usuário no array de pessoas

**Logs esperados:**
```
🔍 Buscando pessoa no array de pessoas...
📧 Email de busca: maria@distribuidor.com
📊 Total de pessoas retornadas: 150
⚠️ Pessoa não encontrada na API. Usando dados mock.
```

**Solução:** Verificar se o `Login` ou `Email` no banco corresponde exatamente ao que você digitou:

```sql
-- Ver login e email exatos
SELECT Id, Nome, Login, Email, Tipo
FROM PESSOA
WHERE Login LIKE '%maria%' OR Email LIKE '%maria%';
```

**Possíveis problemas:**
- Login é `maria` mas você digitou `maria@distribuidor.com`
- Email tem espaços extras: `maria@teste.com ` (com espaço no final)
- Login é case-sensitive (Maria vs maria)

### Problema 3: API /api/pessoas retorna erro

**Logs esperados:**
```
❌ Erro ao buscar dados da pessoa: [erro]
⚠️ Usando dados mock. Role: ASSISTENCIA_TECNICA
```

**Solução:** Verificar se a API está funcionando:

1. Abra a aba **Network** no DevTools
2. Faça login
3. Procure pela requisição `GET /api/pessoas`
4. Veja o status code:
   - **200 OK:** API funcionou, problema é na busca
   - **401 Unauthorized:** Token inválido
   - **404 Not Found:** Endpoint não existe
   - **500 Internal Server Error:** Erro no backend

---

## Passo 7: Testar cada jornada

### Teste 1: Distribuidor

**Dados de teste:**
```sql
UPDATE PESSOA SET Tipo = 'DISTRIBUIDOR' WHERE Id = 2;
```

**Login:** `maria@distribuidor.com`

**Resultado esperado:**
- Redireciona para `/distribuidor/dashboard`
- localStorage.userRole = `"DISTRIBUIDOR"`
- Navbar mostra opções de distribuidor (Dashboard, Estoque)

### Teste 2: Assistência Técnica

**Dados de teste:**
```sql
UPDATE PESSOA SET Tipo = 'ASSISTENCIA_TECNICA' WHERE Id = 3;
```

**Login:** `joao@assistencia.com`

**Resultado esperado:**
- Redireciona para `/assistencia/dashboard`
- localStorage.userRole = `"ASSISTENCIA_TECNICA"`
- Navbar mostra opções de assistência (Dashboard, Loja)

### Teste 3: Entregador

**Dados de teste:**
```sql
UPDATE PESSOA SET Tipo = 'ENTREGADOR' WHERE Id = 4;
```

**Login:** `carlos@entregador.com`

**Resultado esperado:**
- Redireciona para `/entregador/dashboard`
- localStorage.userRole = `"ENTREGADOR"`
- Navbar mostra opções de entregador

---

## 📋 Checklist Rápido

- [ ] Verificou que pessoa existe no banco
- [ ] Campo `Tipo` está preenchido com `DISTRIBUIDOR`
- [ ] Campo `Login` ou `Email` corresponde ao que você vai digitar
- [ ] Usuário tem senha cadastrada (consegue fazer login)
- [ ] Limpou localStorage antes de testar
- [ ] Console mostra logs detalhados do login
- [ ] userRole no localStorage está correto
- [ ] Foi redirecionado para dashboard correto

---

## 🐛 Script de Diagnóstico Completo

Execute este script para ver todos os dados relevantes:

```sql
USE allmoove;
GO

-- 1. Ver todos os tipos e quantidades
SELECT Tipo, COUNT(*) as Total
FROM PESSOA
GROUP BY Tipo
ORDER BY Total DESC;
GO

-- 2. Ver exemplos de cada tipo
SELECT TOP 3 Id, Nome, Login, Email, Tipo
FROM PESSOA
WHERE Tipo = 'DISTRIBUIDOR';
GO

SELECT TOP 3 Id, Nome, Login, Email, Tipo
FROM PESSOA
WHERE Tipo = 'ASSISTENCIA_TECNICA';
GO

SELECT TOP 3 Id, Nome, Login, Email, Tipo
FROM PESSOA
WHERE Tipo = 'ENTREGADOR';
GO

-- 3. Ver pessoas sem tipo
SELECT Id, Nome, Login, Email, Tipo
FROM PESSOA
WHERE Tipo IS NULL OR Tipo = ''
ORDER BY Id;
GO
```

---

**Boa sorte com os testes! 🚀**

Se continuar dando problema, me mande os logs do console e eu te ajudo a diagnosticar.
