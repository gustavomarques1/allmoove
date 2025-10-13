-- ========================================
-- Script SQL para Adicionar Imagens aos Produtos
-- Banco de dados: allmoove
-- ========================================

-- Garantir que estamos no banco correto
USE allmoove;
GO

-- Verificar quantos produtos existem
SELECT
    COUNT(*) as TotalProdutos
FROM Produtos;

-- Verificar quantos produtos não têm imagem
SELECT
    COUNT(*) as TotalSemImagem
FROM Produtos
WHERE imagem IS NULL OR imagem = '';

-- ========================================
-- ADICIONAR IMAGENS BASEADO NO NOME
-- ========================================

-- 1. Produtos com "TELA" no nome → imagens de telas (rotação 1-12)
WITH TelasComNumero AS (
    SELECT
        id,
        ROW_NUMBER() OVER (ORDER BY id) as RowNum
    FROM Produtos
    WHERE (nome LIKE '%TELA%' OR nome LIKE '%LCD%' OR nome LIKE '%OLED%' OR
           nome LIKE '%AMOLED%' OR nome LIKE '%FOG%' OR nome LIKE '%DISPLAY%' OR
           nome LIKE '%TOUCH%')
        AND (imagem IS NULL OR imagem = '')
)
UPDATE Produtos
SET imagem = '/images/telas/tela' + CAST(((t.RowNum - 1) % 12) + 1 AS VARCHAR) + '.png'
FROM Produtos p
INNER JOIN TelasComNumero t ON p.id = t.id;

-- 2. Produtos com "IPHONE" ou "SAMSUNG" + "GB" → celulares completos
WITH CelularesComNumero AS (
    SELECT
        id,
        ROW_NUMBER() OVER (ORDER BY id) as RowNum
    FROM Produtos
    WHERE (nome LIKE '%IPHONE%' OR nome LIKE '%SAMSUNG%' OR nome LIKE '%GALAXY%')
        AND nome LIKE '%GB%'
        AND (imagem IS NULL OR imagem = '')
)
UPDATE Produtos
SET imagem = '/images/celulares/celular' + CAST(((c.RowNum - 1) % 12) + 1 AS VARCHAR) + '.png'
FROM Produtos p
INNER JOIN CelularesComNumero c ON p.id = c.id;

-- 3. Outros produtos (baterias, câmeras, conectores) → acessórios
WITH OutrosComNumero AS (
    SELECT
        id,
        ROW_NUMBER() OVER (ORDER BY id) as RowNum
    FROM Produtos
    WHERE (imagem IS NULL OR imagem = '')
)
UPDATE Produtos
SET imagem = '/images/acessorios/acessorio' + CAST(((o.RowNum - 1) % 12) + 1 AS VARCHAR) + '.png'
FROM Produtos p
INNER JOIN OutrosComNumero o ON p.id = o.id;

-- ========================================
-- VERIFICAR RESULTADO
-- ========================================

-- Ver total com imagens
SELECT
    COUNT(*) as TotalComImagem
FROM Produtos
WHERE imagem IS NOT NULL AND imagem <> '';

-- Ver distribuição por tipo de imagem
SELECT
    CASE
        WHEN imagem LIKE '%telas%' THEN 'Telas'
        WHEN imagem LIKE '%celulares%' THEN 'Celulares'
        WHEN imagem LIKE '%acessorios%' THEN 'Acessórios'
        ELSE 'Outros'
    END as TipoImagem,
    COUNT(*) as Quantidade
FROM Produtos
WHERE imagem IS NOT NULL AND imagem <> ''
GROUP BY CASE
    WHEN imagem LIKE '%telas%' THEN 'Telas'
    WHEN imagem LIKE '%celulares%' THEN 'Celulares'
    WHEN imagem LIKE '%acessorios%' THEN 'Acessórios'
    ELSE 'Outros'
END;

-- Ver exemplos de produtos com imagens
SELECT TOP 20
    id,
    LEFT(nome, 50) as Nome,
    imagem,
    precoVenda,
    idSegmento
FROM Produtos
WHERE imagem IS NOT NULL
ORDER BY id;

-- ========================================
-- OPCIONAL: Adicionar coluna se não existir
-- ========================================
-- Execute APENAS se a coluna 'imagem' não existir

/*
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'Produtos'
    AND COLUMN_NAME = 'imagem'
    AND TABLE_CATALOG = 'allmoove'
)
BEGIN
    ALTER TABLE Produtos
    ADD imagem VARCHAR(255) NULL;

    PRINT 'Coluna imagem adicionada com sucesso!';
END
ELSE
BEGIN
    PRINT 'Coluna imagem já existe!';
END
*/
