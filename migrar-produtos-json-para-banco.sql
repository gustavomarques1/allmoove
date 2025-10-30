-- ========================================
-- MIGRAÇÃO: Produtos do JSON para Banco
-- ========================================
-- Este script insere os 48 produtos do products.json
-- no banco de dados, vinculando-os aos distribuidores

USE allmoove;
GO

PRINT '📦 MIGRANDO PRODUTOS DO JSON PARA O BANCO';
PRINT '========================================';
PRINT '';

-- ========================================
-- 1. LIMPAR PRODUTOS ANTIGOS (OPCIONAL)
-- ========================================
-- ⚠️ DESCOMENTE SE QUISER LIMPAR OS 12 PRODUTOS EXISTENTES
-- DELETE FROM dbo.PRODUTO WHERE ID <= 12;
-- PRINT '🗑️ Produtos antigos removidos';
-- PRINT '';

-- ========================================
-- 2. MAPEAR FORNECEDORES → IDs
-- ========================================
-- TechParts SP       → ID 20
-- Global Peças RJ    → ID 21
-- ImportaCell        → ID 22
-- Display Brasil     → ID 23

PRINT '1️⃣ Inserindo produtos da TechParts SP (ID: 20)';
PRINT '';

-- ========================================
-- CELULARES - TECHPARTS SP
-- ========================================
INSERT INTO dbo.PRODUTO (NOME, CATEGORIA, PRECO_VENDA_PIX, SKU, IMAGEM, FORNECEDOR, ID_DISTRIBUIDOR, SITUACAO_REGISTRO, FRETE_GRATIS, QUANTIDADE, DATA_HORA_CRICAO_REGISTRO)
VALUES
('6S BRANCO', 'celulares', 9999.90, 'PROD-001', '/images/celulares/celular1.png', 'TechParts SP', 20, 'ATIVO', 1, 100, GETDATE()),
('E20 PRETO C/ARO WE KEEP', 'celulares', 9499.90, 'PROD-002', '/images/celulares/celular2.png', 'TechParts SP', 20, 'ATIVO', 1, 100, GETDATE()),
('REDMI9 PRETO C/ARO NN', 'celulares', 3999.00, 'PROD-006', '/images/celulares/celular6.png', 'TechParts SP', 20, 'ATIVO', 0, 75, GETDATE()),
('Samsung Galaxy A56', 'celulares', 2499.50, 'PROD-009', '/images/celulares/celular9.png', 'TechParts SP', 20, 'ATIVO', 0, 50, GETDATE());

PRINT '✅ 4 celulares TechParts SP inseridos';

-- ========================================
-- NOTEBOOKS - TECHPARTS SP
-- ========================================
INSERT INTO dbo.PRODUTO (NOME, CATEGORIA, PRECO_VENDA_PIX, SKU, IMAGEM, FORNECEDOR, ID_DISTRIBUIDOR, SITUACAO_REGISTRO, FRETE_GRATIS, QUANTIDADE, DATA_HORA_CRICAO_REGISTRO)
VALUES
('Macbook Pro 16 M4', 'notebooks', 24999.90, 'PROD-013', '/images/notebooks/notebook1.png', 'TechParts SP', 20, 'ATIVO', 1, 30, GETDATE()),
('Lenovo ThinkPad X1 Carbon', 'notebooks', 12999.00, 'PROD-015', '/images/notebooks/notebook3.png', 'TechParts SP', 20, 'ATIVO', 1, 40, GETDATE()),
('Razer Blade 16', 'notebooks', 19999.00, 'PROD-018', '/images/notebooks/notebook6.png', 'TechParts SP', 20, 'ATIVO', 1, 25, GETDATE()),
('Macbook Air 15 M3', 'notebooks', 11999.00, 'PROD-020', '/images/notebooks/notebook8.png', 'TechParts SP', 20, 'ATIVO', 1, 45, GETDATE()),
('LG Gram SuperSlim', 'notebooks', 8999.00, 'PROD-023', '/images/notebooks/notebook11.png', 'TechParts SP', 20, 'ATIVO', 1, 60, GETDATE());

PRINT '✅ 5 notebooks TechParts SP inseridos';

-- ========================================
-- ACESSÓRIOS - TECHPARTS SP
-- ========================================
INSERT INTO dbo.PRODUTO (NOME, CATEGORIA, PRECO_VENDA_PIX, SKU, IMAGEM, FORNECEDOR, ID_DISTRIBUIDOR, SITUACAO_REGISTRO, FRETE_GRATIS, QUANTIDADE, DATA_HORA_CRICAO_REGISTRO)
VALUES
('Cabo USB-C Aviador Coiled', 'acessorios', 189.50, 'PROD-027', '/images/acessorios/acessorio3.png', 'TechParts SP', 20, 'ATIVO', 0, 200, GETDATE()),
('Cabo USB-C Reforçado (Nylon)', 'acessorios', 89.90, 'PROD-031', '/images/acessorios/acessorio7.png', 'TechParts SP', 20, 'ATIVO', 1, 250, GETDATE()),
('Adaptador de Vídeo DVI para HDMI', 'acessorios', 65.00, 'PROD-035', '/images/acessorios/acessorio11.png', 'TechParts SP', 20, 'ATIVO', 1, 150, GETDATE());

PRINT '✅ 3 acessórios TechParts SP inseridos';

-- ========================================
-- TELAS - TECHPARTS SP
-- ========================================
INSERT INTO dbo.PRODUTO (NOME, CATEGORIA, PRECO_VENDA_PIX, SKU, IMAGEM, FORNECEDOR, ID_DISTRIBUIDOR, SITUACAO_REGISTRO, FRETE_GRATIS, QUANTIDADE, DATA_HORA_CRICAO_REGISTRO)
VALUES
('Monitor Gamer LG UltraGear 27" 144Hz', 'telas', 1899.90, 'PROD-038', '/images/telas/tela2.png', 'TechParts SP', 20, 'ATIVO', 1, 35, GETDATE()),
('Monitor BenQ para Designers 27"', 'telas', 2899.00, 'PROD-042', '/images/telas/tela6.png', 'TechParts SP', 20, 'ATIVO', 1, 25, GETDATE()),
('Monitor Philips 24" Full HD', 'telas', 899.00, 'PROD-046', '/images/telas/tela10.png', 'TechParts SP', 20, 'ATIVO', 1, 80, GETDATE());

PRINT '✅ 3 telas TechParts SP inseridas';
PRINT '';

-- ========================================
PRINT '2️⃣ Inserindo produtos da Global Peças RJ (ID: 21)';
PRINT '';

-- ========================================
-- CELULARES - GLOBAL PEÇAS RJ
-- ========================================
INSERT INTO dbo.PRODUTO (NOME, CATEGORIA, PRECO_VENDA_PIX, SKU, IMAGEM, FORNECEDOR, ID_DISTRIBUIDOR, SITUACAO_REGISTRO, FRETE_GRATIS, QUANTIDADE, DATA_HORA_CRICAO_REGISTRO)
VALUES
('A51 PRETO C/ ARO OLED WE KEEP 1.1', 'celulares', 7899.00, 'PROD-003', '/images/celulares/celular3.png', 'Global Peças RJ', 21, 'ATIVO', 1, 90, GETDATE()),
('IPHONE X PRETO OLED (HOX1) WE KEEP', 'celulares', 5499.99, 'PROD-004', '/images/celulares/celular4.png', 'Global Peças RJ', 21, 'ATIVO', 1, 60, GETDATE()),
('REDMINOTE8 AZUL C/ARO NN', 'celulares', 7499.90, 'PROD-008', '/images/celulares/celular8.png', 'Global Peças RJ', 21, 'ATIVO', 1, 70, GETDATE()),
('OnePlus 13', 'celulares', 4999.00, 'PROD-011', '/images/celulares/celular11.png', 'Global Peças RJ', 21, 'ATIVO', 1, 55, GETDATE());

PRINT '✅ 4 celulares Global Peças RJ inseridos';

-- ========================================
-- NOTEBOOKS - GLOBAL PEÇAS RJ
-- ========================================
INSERT INTO dbo.PRODUTO (NOME, CATEGORIA, PRECO_VENDA_PIX, SKU, IMAGEM, FORNECEDOR, ID_DISTRIBUIDOR, SITUACAO_REGISTRO, FRETE_GRATIS, QUANTIDADE, DATA_HORA_CRICAO_REGISTRO)
VALUES
('Dell XPS 15', 'notebooks', 14599.00, 'PROD-014', '/images/notebooks/notebook2.png', 'Global Peças RJ', 21, 'ATIVO', 1, 35, GETDATE()),
('Asus ROG Strix Scar 17', 'notebooks', 17899.00, 'PROD-017', '/images/notebooks/notebook5.png', 'Global Peças RJ', 21, 'ATIVO', 1, 20, GETDATE()),
('Samsung Galaxy Book4 Ultra', 'notebooks', 13500.00, 'PROD-021', '/images/notebooks/notebook9.png', 'Global Peças RJ', 21, 'ATIVO', 1, 30, GETDATE()),
('Lenovo Yoga Slim 7', 'notebooks', 7899.00, 'PROD-024', '/images/notebooks/notebook12.png', 'Global Peças RJ', 21, 'ATIVO', 1, 50, GETDATE());

PRINT '✅ 4 notebooks Global Peças RJ inseridos';

-- ========================================
-- ACESSÓRIOS - GLOBAL PEÇAS RJ
-- ========================================
INSERT INTO dbo.PRODUTO (NOME, CATEGORIA, PRECO_VENDA_PIX, SKU, IMAGEM, FORNECEDOR, ID_DISTRIBUIDOR, SITUACAO_REGISTRO, FRETE_GRATIS, QUANTIDADE, DATA_HORA_CRICAO_REGISTRO)
VALUES
('Cabo USB 3.0 para HD Externo', 'acessorios', 79.90, 'PROD-029', '/images/acessorios/acessorio5.png', 'Global Peças RJ', 21, 'ATIVO', 0, 180, GETDATE()),
('Fonte / Carregador para Notebook', 'acessorios', 299.00, 'PROD-033', '/images/acessorios/acessorio9.png', 'Global Peças RJ', 21, 'ATIVO', 1, 100, GETDATE());

PRINT '✅ 2 acessórios Global Peças RJ inseridos';

-- ========================================
-- TELAS - GLOBAL PEÇAS RJ
-- ========================================
INSERT INTO dbo.PRODUTO (NOME, CATEGORIA, PRECO_VENDA_PIX, SKU, IMAGEM, FORNECEDOR, ID_DISTRIBUIDOR, SITUACAO_REGISTRO, FRETE_GRATIS, QUANTIDADE, DATA_HORA_CRICAO_REGISTRO)
VALUES
('Monitor Curvo Samsung Odyssey G7 32"', 'telas', 4200.00, 'PROD-039', '/images/telas/tela3.png', 'Global Peças RJ', 21, 'ATIVO', 1, 20, GETDATE()),
('Monitor Gamer AOC Hero 24" 144Hz', 'telas', 1299.00, 'PROD-043', '/images/telas/tela7.png', 'Global Peças RJ', 21, 'ATIVO', 1, 45, GETDATE()),
('Monitor Profissional LG 34" Ultrawide', 'telas', 2999.00, 'PROD-047', '/images/telas/tela11.png', 'Global Peças RJ', 21, 'ATIVO', 1, 30, GETDATE());

PRINT '✅ 3 telas Global Peças RJ inseridas';
PRINT '';

-- ========================================
PRINT '3️⃣ Inserindo produtos da ImportaCell (ID: 22)';
PRINT '';

-- ========================================
-- CELULARES - IMPORTACELL
-- ========================================
INSERT INTO dbo.PRODUTO (NOME, CATEGORIA, PRECO_VENDA_PIX, SKU, IMAGEM, FORNECEDOR, ID_DISTRIBUIDOR, SITUACAO_REGISTRO, FRETE_GRATIS, QUANTIDADE, DATA_HORA_CRICAO_REGISTRO)
VALUES
('REDMINOTE13 4G  PRETO S/ ARO INCELL NN', 'celulares', 12999.90, 'PROD-005', '/images/celulares/celular5.png', 'ImportaCell', 22, 'ATIVO', 1, 65, GETDATE()),
('REDMINOTE8 PRETO C/ARO NN', 'celulares', 6999.00, 'PROD-007', '/images/celulares/celular7.png', 'ImportaCell', 22, 'ATIVO', 1, 80, GETDATE()),
('iPhone 15 Pro Max', 'celulares', 8999.90, 'PROD-010', '/images/celulares/celular10.png', 'ImportaCell', 22, 'ATIVO', 1, 40, GETDATE()),
('Huawei P70 Pro', 'celulares', 6500.00, 'PROD-012', '/images/celulares/celular12.png', 'ImportaCell', 22, 'ATIVO', 1, 50, GETDATE());

PRINT '✅ 4 celulares ImportaCell inseridos';

-- ========================================
-- NOTEBOOKS - IMPORTACELL
-- ========================================
INSERT INTO dbo.PRODUTO (NOME, CATEGORIA, PRECO_VENDA_PIX, SKU, IMAGEM, FORNECEDOR, ID_DISTRIBUIDOR, SITUACAO_REGISTRO, FRETE_GRATIS, QUANTIDADE, DATA_HORA_CRICAO_REGISTRO)
VALUES
('HP Spectre x360', 'notebooks', 9999.90, 'PROD-016', '/images/notebooks/notebook4.png', 'ImportaCell', 22, 'ATIVO', 1, 35, GETDATE()),
('Microsoft Surface Laptop Studio', 'notebooks', 15699.00, 'PROD-019', '/images/notebooks/notebook7.png', 'ImportaCell', 22, 'ATIVO', 1, 25, GETDATE()),
('Acer Predator Helios', 'notebooks', 11500.00, 'PROD-022', '/images/notebooks/notebook10.png', 'ImportaCell', 22, 'ATIVO', 1, 30, GETDATE());

PRINT '✅ 3 notebooks ImportaCell inseridos';

-- ========================================
-- ACESSÓRIOS - IMPORTACELL
-- ========================================
INSERT INTO dbo.PRODUTO (NOME, CATEGORIA, PRECO_VENDA_PIX, SKU, IMAGEM, FORNECEDOR, ID_DISTRIBUIDOR, SITUACAO_REGISTRO, FRETE_GRATIS, QUANTIDADE, DATA_HORA_CRICAO_REGISTRO)
VALUES
('Carregador de Parede Rápido com Cabo USB-C', 'acessorios', 149.90, 'PROD-028', '/images/acessorios/acessorio4.png', 'ImportaCell', 22, 'ATIVO', 0, 150, GETDATE()),
('Carregador de Parede + Cabo USB-C', 'acessorios', 129.90, 'PROD-032', '/images/acessorios/acessorio8.png', 'ImportaCell', 22, 'ATIVO', 1, 180, GETDATE()),
('Cabo de Impressora USB 2.0', 'acessorios', 49.90, 'PROD-036', '/images/acessorios/acessorio12.png', 'ImportaCell', 22, 'ATIVO', 1, 200, GETDATE());

PRINT '✅ 3 acessórios ImportaCell inseridos';

-- ========================================
-- TELAS - IMPORTACELL
-- ========================================
INSERT INTO dbo.PRODUTO (NOME, CATEGORIA, PRECO_VENDA_PIX, SKU, IMAGEM, FORNECEDOR, ID_DISTRIBUIDOR, SITUACAO_REGISTRO, FRETE_GRATIS, QUANTIDADE, DATA_HORA_CRICAO_REGISTRO)
VALUES
('Monitor Portátil USB-C 15.6"', 'telas', 999.00, 'PROD-041', '/images/telas/tela5.png', 'ImportaCell', 22, 'ATIVO', 1, 60, GETDATE()),
('Monitor Gamer Asus TUF 27" 165Hz', 'telas', 1999.90, 'PROD-045', '/images/telas/tela9.png', 'ImportaCell', 22, 'ATIVO', 1, 40, GETDATE());

PRINT '✅ 2 telas ImportaCell inseridas';
PRINT '';

-- ========================================
PRINT '4️⃣ Inserindo produtos da Display Brasil (ID: 23)';
PRINT '';

-- ========================================
-- ACESSÓRIOS - DISPLAY BRASIL
-- ========================================
INSERT INTO dbo.PRODUTO (NOME, CATEGORIA, PRECO_VENDA_PIX, SKU, IMAGEM, FORNECEDOR, ID_DISTRIBUIDOR, SITUACAO_REGISTRO, FRETE_GRATIS, QUANTIDADE, DATA_HORA_CRICAO_REGISTRO)
VALUES
('Hub USB-C Multiportas', 'acessorios', 249.90, 'PROD-025', '/images/acessorios/acessorio1.png', 'Display Brasil', 23, 'ATIVO', 1, 120, GETDATE()),
('Kit Carregador USB-C + Cabo Lightning', 'acessorios', 199.90, 'PROD-026', '/images/acessorios/acessorio2.png', 'Display Brasil', 23, 'ATIVO', 1, 140, GETDATE()),
('Cabo de Dados USB-A para USB-C', 'acessorios', 59.90, 'PROD-030', '/images/acessorios/acessorio6.png', 'Display Brasil', 23, 'ATIVO', 0, 220, GETDATE()),
('Carregador Universal para Notebook', 'acessorios', 349.90, 'PROD-034', '/images/acessorios/acessorio10.png', 'Display Brasil', 23, 'ATIVO', 1, 90, GETDATE());

PRINT '✅ 4 acessórios Display Brasil inseridos';

-- ========================================
-- TELAS - DISPLAY BRASIL
-- ========================================
INSERT INTO dbo.PRODUTO (NOME, CATEGORIA, PRECO_VENDA_PIX, SKU, IMAGEM, FORNECEDOR, ID_DISTRIBUIDOR, SITUACAO_REGISTRO, FRETE_GRATIS, QUANTIDADE, DATA_HORA_CRICAO_REGISTRO)
VALUES
('Monitor Dell UltraSharp 27" 4K', 'telas', 3899.00, 'PROD-037', '/images/telas/tela1.png', 'Display Brasil', 23, 'ATIVO', 1, 25, GETDATE()),
('Monitor LG Ultrawide 29"', 'telas', 1499.90, 'PROD-040', '/images/telas/tela4.png', 'Display Brasil', 23, 'ATIVO', 1, 50, GETDATE()),
('Monitor Samsung Smart M7 32"', 'telas', 2400.00, 'PROD-044', '/images/telas/tela8.png', 'Display Brasil', 23, 'ATIVO', 1, 35, GETDATE()),
('Monitor Gamer Alienware 25" 360Hz', 'telas', 5499.00, 'PROD-048', '/images/telas/tela12.png', 'Display Brasil', 23, 'ATIVO', 1, 15, GETDATE());

PRINT '✅ 4 telas Display Brasil inseridas';
PRINT '';

-- ========================================
-- 3. ESTATÍSTICAS DA MIGRAÇÃO
-- ========================================
PRINT '========================================';
PRINT '📊 ESTATÍSTICAS DA MIGRAÇÃO';
PRINT '========================================';
PRINT '';

DECLARE @totalProdutos INT;
DECLARE @porDistribuidor TABLE (
    Distribuidor VARCHAR(100),
    IdDistribuidor BIGINT,
    Quantidade INT
);

-- Contar total
SELECT @totalProdutos = COUNT(*) FROM dbo.PRODUTO WHERE ID_DISTRIBUIDOR IS NOT NULL;

-- Contar por distribuidor
INSERT INTO @porDistribuidor (Distribuidor, IdDistribuidor, Quantidade)
SELECT
    P.FORNECEDOR,
    P.ID_DISTRIBUIDOR,
    COUNT(*) as Quantidade
FROM dbo.PRODUTO P
WHERE P.ID_DISTRIBUIDOR IS NOT NULL
GROUP BY P.FORNECEDOR, P.ID_DISTRIBUIDOR;

PRINT 'Total de produtos migrados: ' + CAST(@totalProdutos AS VARCHAR);
PRINT '';

PRINT 'Distribuição por distribuidor:';
SELECT
    Distribuidor as [Distribuidor],
    IdDistribuidor as [ID],
    Quantidade as [Produtos]
FROM @porDistribuidor
ORDER BY IdDistribuidor;

PRINT '';

-- Distribuição por categoria
PRINT 'Distribuição por categoria:';
SELECT
    CATEGORIA as [Categoria],
    COUNT(*) as [Total]
FROM dbo.PRODUTO
WHERE ID_DISTRIBUIDOR IS NOT NULL
GROUP BY CATEGORIA
ORDER BY COUNT(*) DESC;

PRINT '';
PRINT '========================================';
PRINT '✅ MIGRAÇÃO CONCLUÍDA COM SUCESSO!';
PRINT '========================================';
PRINT '';
PRINT '🎯 PRÓXIMOS PASSOS:';
PRINT '';
PRINT '1. Atualizar Model Produto.cs:';
PRINT '   - Adicionar: [Column("ID_DISTRIBUIDOR")] public long? IdDistribuidor { get; set; }';
PRINT '';
PRINT '2. Atualizar frontend para consumir API:';
PRINT '   - Mudar de: fetch("/data/products.json")';
PRINT '   - Para: api.get("/api/Produtos")';
PRINT '';
PRINT '3. Testar a loja com produtos do banco';
PRINT '';
PRINT '✅ Script concluído!';
