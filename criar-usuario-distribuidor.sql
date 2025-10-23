-- Script para criar/atualizar usuário distribuidor de teste
-- Execute este script no SQL Server Management Studio

USE allmoove;
GO

-- 1. Verificar tipos atuais das pessoas
SELECT TOP 10 Id, Nome, Login, Email, Tipo
FROM PESSOA
ORDER BY Id;
GO

-- 2. Atualizar uma pessoa existente para ser DISTRIBUIDOR
-- (Substitua o ID 2 pelo ID de uma pessoa real do seu banco)
UPDATE PESSOA
SET Tipo = 'DISTRIBUIDOR'
WHERE Id = 2;  -- ⚠️ AJUSTE ESTE ID CONFORME NECESSÁRIO
GO

-- 3. Verificar se funcionou
SELECT Id, Nome, Login, Email, Tipo
FROM PESSOA
WHERE Tipo = 'DISTRIBUIDOR';
GO

-- 4. Se quiser criar um novo usuário distribuidor
-- (Descomente e ajuste os valores abaixo)
/*
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

-- Pegar o ID do usuário criado
SELECT Id, Nome, Login, Email, Tipo
FROM PESSOA
WHERE Email = 'distribuidor@teste.com';
GO
*/

-- 5. Verificar todos os tipos existentes
SELECT
    Tipo,
    COUNT(*) as Quantidade
FROM PESSOA
GROUP BY Tipo
ORDER BY Quantidade DESC;
GO

-- 6. Mostrar exemplos de cada tipo
SELECT
    Tipo,
    STRING_AGG(CONCAT('ID:', Id, ' - ', Nome, ' (', ISNULL(Login, Email), ')'), '; ') as Exemplos
FROM (
    SELECT TOP 3 *
    FROM PESSOA
    WHERE Tipo IS NOT NULL
    ORDER BY Tipo, Id
) AS Exemplos
GROUP BY Tipo;
GO
