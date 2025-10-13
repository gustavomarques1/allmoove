-- ========================================
-- Script SQL para Adicionar Imagens aos Produtos
-- ========================================
-- IMPORTANTE: Execute este script no banco de dados correto!
-- ========================================

-- PASSO 1: Verificar se estamos no banco correto
SELECT DB_NAME() AS BancoDeDadosAtual;

-- PASSO 2: Listar tabelas disponíveis para encontrar "Produtos"
SELECT
    TABLE_SCHEMA,
    TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_NAME LIKE '%Produto%'
ORDER BY TABLE_SCHEMA, TABLE_NAME;

-- ========================================
-- VERIFICAÇÃO: Ver estrutura da tabela Produtos
-- ========================================
-- Descomente a linha abaixo após confirmar o nome da tabela
-- sp_help 'dbo.Produtos'

-- ========================================
-- OPÇÃO 1: Usando schema padrão (dbo)
-- ========================================

-- Verificar quantos produtos não têm imagem
SELECT
    COUNT(*) as TotalSemImagem
FROM dbo.Produtos
WHERE imagem IS NULL OR imagem = '';

-- Produtos com "TELA" no nome → imagens de telas (rotação 1-12)
UPDATE dbo.Produtos
SET imagem = '/images/telas/tela' +
    CAST(((ROW_NUMBER() OVER (ORDER BY id) - 1) % 12) + 1 AS VARCHAR) + '.png'
WHERE (nome LIKE '%TELA%' OR nome LIKE '%LCD%' OR nome LIKE '%OLED%' OR
       nome LIKE '%AMOLED%' OR nome LIKE '%FOG%' OR nome LIKE '%DISPLAY%' OR
       nome LIKE '%TOUCH%')
    AND (imagem IS NULL OR imagem = '');

-- Produtos com "IPHONE" ou "SAMSUNG" + "GB" → celulares completos
UPDATE dbo.Produtos
SET imagem = '/images/celulares/celular' +
    CAST(((ROW_NUMBER() OVER (ORDER BY id) - 1) % 12) + 1 AS VARCHAR) + '.png'
WHERE (nome LIKE '%IPHONE%' OR nome LIKE '%SAMSUNG%' OR nome LIKE '%GALAXY%')
    AND nome LIKE '%GB%'
    AND (imagem IS NULL OR imagem = '');

-- Outros produtos (baterias, câmeras, conectores) → acessórios
UPDATE dbo.Produtos
SET imagem = '/images/acessorios/acessorio' +
    CAST(((ROW_NUMBER() OVER (ORDER BY id) - 1) % 12) + 1 AS VARCHAR) + '.png'
WHERE (imagem IS NULL OR imagem = '');

-- Verificar resultado
SELECT
    COUNT(*) as TotalComImagem
FROM dbo.Produtos
WHERE imagem IS NOT NULL AND imagem <> '';

-- Ver exemplos de produtos com imagens
SELECT TOP 10
    id,
    LEFT(nome, 40) as Nome,
    imagem
FROM dbo.Produtos
WHERE imagem IS NOT NULL
ORDER BY id;

-- ========================================
-- OPÇÃO 2: Adicionar coluna 'imagem' se não existir
-- ========================================
-- Execute APENAS se a coluna 'imagem' não existir na tabela

/*
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'Produtos' AND COLUMN_NAME = 'imagem'
)
BEGIN
    ALTER TABLE dbo.Produtos
    ADD imagem VARCHAR(255) NULL;

    PRINT 'Coluna imagem adicionada com sucesso!';
END
ELSE
BEGIN
    PRINT 'Coluna imagem já existe!';
END
*/
