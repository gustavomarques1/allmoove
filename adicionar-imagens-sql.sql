-- ========================================
-- Script SQL para Adicionar Imagens aos Produtos
-- ========================================
-- Execute este script no SQL Server Management Studio
-- ou em qualquer ferramenta de banco de dados
-- ========================================

-- Verificar quantos produtos não têm imagem
SELECT
    COUNT(*) as TotalSemImagem
FROM Produtos
WHERE imagem IS NULL OR imagem = '';

-- ========================================
-- OPÇÃO 1: Adicionar imagens baseado no nome do produto
-- ========================================

-- Produtos com "TELA" no nome → imagens de telas (rotação 1-12)
UPDATE Produtos
SET imagem = '/images/telas/tela' +
    CAST(((ROW_NUMBER() OVER (ORDER BY id) - 1) % 12) + 1 AS VARCHAR) + '.png'
WHERE (nome LIKE '%TELA%' OR nome LIKE '%LCD%' OR nome LIKE '%OLED%' OR
       nome LIKE '%AMOLED%' OR nome LIKE '%FOG%' OR nome LIKE '%DISPLAY%' OR
       nome LIKE '%TOUCH%')
    AND (imagem IS NULL OR imagem = '');

-- Produtos com "IPHONE" ou "SAMSUNG" + "GB" → celulares completos
UPDATE Produtos
SET imagem = '/images/celulares/celular' +
    CAST(((ROW_NUMBER() OVER (ORDER BY id) - 1) % 12) + 1 AS VARCHAR) + '.png'
WHERE (nome LIKE '%IPHONE%' OR nome LIKE '%SAMSUNG%' OR nome LIKE '%GALAXY%')
    AND nome LIKE '%GB%'
    AND (imagem IS NULL OR imagem = '');

-- Outros produtos (baterias, câmeras, conectores) → acessórios
UPDATE Produtos
SET imagem = '/images/acessorios/acessorio' +
    CAST(((ROW_NUMBER() OVER (ORDER BY id) - 1) % 12) + 1 AS VARCHAR) + '.png'
WHERE (imagem IS NULL OR imagem = '');

-- ========================================
-- Verificar resultado
-- ========================================
SELECT
    COUNT(*) as TotalComImagem
FROM Produtos
WHERE imagem IS NOT NULL AND imagem <> '';

-- Ver exemplos de produtos com imagens
SELECT TOP 10
    id,
    LEFT(nome, 40) as Nome,
    imagem
FROM Produtos
WHERE imagem IS NOT NULL
ORDER BY id;

-- ========================================
-- OPÇÃO 2: Adicionar imagem padrão para TODOS
-- ========================================
-- Se preferir dar uma imagem padrão para todos:

-- UPDATE Produtos
-- SET imagem = '/images/acessorios/acessorio1.png'
-- WHERE (imagem IS NULL OR imagem = '');
