-- ========================================
-- CRIAR USUÁRIO DISTRIBUIDOR DE TESTE
-- ========================================

-- IMPORTANTE: Execute este script no seu banco de dados AllMoove
-- Este script cria:
-- 1. Uma PESSOA do tipo DISTRIBUIDOR
-- 2. Um registro na tabela DISTRIBUIDORES vinculado à pessoa

-- ========================================
-- PASSO 1: Criar a PESSOA
-- ========================================

DECLARE @ID_PESSOA_CRIADO BIGINT;

-- Verifica se já existe um distribuidor de teste
IF NOT EXISTS (SELECT 1 FROM PESSOA WHERE LOGIN = 'distribuidor')
BEGIN
    INSERT INTO PESSOA (
        EMPRESA,
        ESTABELECIMENTO,
        CODIGO,
        DATA_HORA_CRICAO_REGISTRO,
        USUARIO_CRIACAO,
        SITUACAO_REGISTRO,
        TIPO,
        NOME,
        CPFCNPJ,
        LOGIN,
        SENHA,
        SITUACAO
    )
    VALUES (
        1,                              -- EMPRESA
        1,                              -- ESTABELECIMENTO
        'DIST001',                      -- CODIGO
        GETDATE(),                      -- DATA_HORA_CRICAO_REGISTRO
        'ADMIN',                        -- USUARIO_CRIACAO
        'ATIVO',                        -- SITUACAO_REGISTRO
        'DISTRIBUIDOR',                 -- TIPO (IMPORTANTE!)
        'Distribuidor Teste AllMoove',  -- NOME
        '12345678901234',               -- CPFCNPJ (14 dígitos para CNPJ)
        'distribuidor',                 -- LOGIN (para fazer login)
        '123456',                       -- SENHA (para fazer login)
        'ATIVO'                         -- SITUACAO
    );

    -- Captura o ID da pessoa criada
    SET @ID_PESSOA_CRIADO = SCOPE_IDENTITY();

    PRINT '✅ Pessoa DISTRIBUIDOR criada com ID: ' + CAST(@ID_PESSOA_CRIADO AS VARCHAR);
    PRINT '📧 Login: distribuidor';
    PRINT '🔑 Senha: 123456';

    -- ========================================
    -- PASSO 2: Criar registro na tabela DISTRIBUIDORES
    -- ========================================

    -- Verifica se a tabela DISTRIBUIDORES existe
    IF OBJECT_ID('DISTRIBUIDORES', 'U') IS NOT NULL
    BEGIN
        INSERT INTO DISTRIBUIDORES (
            EMPRESA,
            ESTABELECIMENTO,
            DATA_HORA_CRICAO_REGISTRO,
            USUARIO_CRIACAO,
            SITUACAO_REGISTRO,
            ID_PESSOA,
            RAZAO_SOCIAL,
            NOME_FANTASIA,
            CNPJ,
            SITUACAO
        )
        VALUES (
            1,                              -- EMPRESA
            1,                              -- ESTABELECIMENTO
            GETDATE(),                      -- DATA_HORA_CRICAO_REGISTRO
            'ADMIN',                        -- USUARIO_CRIACAO
            'ATIVO',                        -- SITUACAO_REGISTRO
            @ID_PESSOA_CRIADO,              -- ID_PESSOA (vincula com a pessoa criada)
            'Distribuidor Teste AllMoove LTDA', -- RAZAO_SOCIAL
            'Distribuidor Teste',           -- NOME_FANTASIA
            '12345678901234',               -- CNPJ (mesmo da pessoa)
            'ATIVO'                         -- SITUACAO
        );

        PRINT '✅ Distribuidor vinculado com ID: ' + CAST(SCOPE_IDENTITY() AS VARCHAR);
    END
    ELSE
    BEGIN
        PRINT '⚠️ Tabela DISTRIBUIDORES não existe. Ajuste o script conforme sua estrutura.';
    END

    PRINT '';
    PRINT '========================================';
    PRINT 'DISTRIBUIDOR CRIADO COM SUCESSO!';
    PRINT '========================================';
    PRINT 'Para fazer login no sistema:';
    PRINT 'Login: distribuidor';
    PRINT 'Senha: 123456';
    PRINT '';
    PRINT 'Este usuário é do tipo DISTRIBUIDOR';
    PRINT 'e será redirecionado para /distribuidor/dashboard';
    PRINT '========================================';
END
ELSE
BEGIN
    PRINT '⚠️ Já existe um usuário com login "distribuidor"';
    PRINT 'Você pode usar este usuário ou alterar o script para criar outro.';

    -- Mostra os dados do usuário existente
    SELECT
        P.ID as ID_PESSOA,
        P.NOME,
        P.LOGIN,
        P.SENHA,
        P.TIPO,
        P.SITUACAO
    FROM PESSOA P
    WHERE P.LOGIN = 'distribuidor';
END

-- ========================================
-- VERIFICAÇÃO FINAL
-- ========================================

-- Lista todos os distribuidores ativos
SELECT
    P.ID as ID_PESSOA,
    P.NOME,
    P.LOGIN,
    P.SENHA,
    P.CPFCNPJ,
    P.TIPO,
    D.ID as ID_DISTRIBUIDOR
FROM PESSOA P
LEFT JOIN DISTRIBUIDORES D ON D.ID_PESSOA = P.ID
WHERE P.TIPO = 'DISTRIBUIDOR'
  AND P.SITUACAO_REGISTRO = 'ATIVO';
