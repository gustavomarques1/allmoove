-- ========================================
-- MIGRAÇÃO: Produtos do JSON para Banco V2
-- ========================================
-- Script corrigido usando apenas campos que existem na tabela

USE allmoove;
GO

PRINT '📦 MIGRANDO PRODUTOS DO JSON PARA O BANCO';
PRINT '========================================';
PRINT '';

-- ========================================
-- INSERIR PRODUTOS
-- ========================================
-- Usando apenas campos que existem:
-- NOME, PRECO_VENDA_PIX, SKU, IMAGEM, ID_DISTRIBUIDOR,
-- SITUACAO_REGISTRO, FRETE_GRATIS, QUANTIDADE, DATA_HORA_CRICAO_REGISTRO

PRINT '1️⃣ Inserindo produtos da TechParts SP (ID: 20)';

INSERT INTO dbo.PRODUTO (NOME, PRECO_VENDA_PIX, SKU, IMAGEM, ID_DISTRIBUIDOR, SITUACAO_REGISTRO, FRETE_GRATIS, QUANTIDADE, DATA_HORA_CRICAO_REGISTRO, DESCRICAO)
VALUES
-- CELULARES
('6S BRANCO', 9999.90, 'PROD-001', '/images/celulares/celular1.png', 20, 'ATIVO', 1, 100, GETDATE(), 'Categoria: Celulares'),
('E20 PRETO C/ARO WE KEEP', 9499.90, 'PROD-002', '/images/celulares/celular2.png', 20, 'ATIVO', 1, 100, GETDATE(), 'Categoria: Celulares'),
('REDMI9 PRETO C/ARO NN', 3999.00, 'PROD-006', '/images/celulares/celular6.png', 20, 'ATIVO', 0, 75, GETDATE(), 'Categoria: Celulares'),
('Samsung Galaxy A56', 2499.50, 'PROD-009', '/images/celulares/celular9.png', 20, 'ATIVO', 0, 50, GETDATE(), 'Categoria: Celulares'),
-- NOTEBOOKS
('Macbook Pro 16 M4', 24999.90, 'PROD-013', '/images/notebooks/notebook1.png', 20, 'ATIVO', 1, 30, GETDATE(), 'Categoria: Notebooks'),
('Lenovo ThinkPad X1 Carbon', 12999.00, 'PROD-015', '/images/notebooks/notebook3.png', 20, 'ATIVO', 1, 40, GETDATE(), 'Categoria: Notebooks'),
('Razer Blade 16', 19999.00, 'PROD-018', '/images/notebooks/notebook6.png', 20, 'ATIVO', 1, 25, GETDATE(), 'Categoria: Notebooks'),
('Macbook Air 15 M3', 11999.00, 'PROD-020', '/images/notebooks/notebook8.png', 20, 'ATIVO', 1, 45, GETDATE(), 'Categoria: Notebooks'),
('LG Gram SuperSlim', 8999.00, 'PROD-023', '/images/notebooks/notebook11.png', 20, 'ATIVO', 1, 60, GETDATE(), 'Categoria: Notebooks'),
-- ACESSÓRIOS
('Cabo USB-C Aviador Coiled', 189.50, 'PROD-027', '/images/acessorios/acessorio3.png', 20, 'ATIVO', 0, 200, GETDATE(), 'Categoria: Acessórios'),
('Cabo USB-C Reforçado (Nylon)', 89.90, 'PROD-031', '/images/acessorios/acessorio7.png', 20, 'ATIVO', 1, 250, GETDATE(), 'Categoria: Acessórios'),
('Adaptador de Vídeo DVI para HDMI', 65.00, 'PROD-035', '/images/acessorios/acessorio11.png', 20, 'ATIVO', 1, 150, GETDATE(), 'Categoria: Acessórios'),
-- TELAS
('Monitor Gamer LG UltraGear 27" 144Hz', 1899.90, 'PROD-038', '/images/telas/tela2.png', 20, 'ATIVO', 1, 35, GETDATE(), 'Categoria: Telas'),
('Monitor BenQ para Designers 27"', 2899.00, 'PROD-042', '/images/telas/tela6.png', 20, 'ATIVO', 1, 25, GETDATE(), 'Categoria: Telas'),
('Monitor Philips 24" Full HD', 899.00, 'PROD-046', '/images/telas/tela10.png', 20, 'ATIVO', 1, 80, GETDATE(), 'Categoria: Telas');

PRINT '✅ 15 produtos TechParts SP inseridos';
PRINT '';

PRINT '2️⃣ Inserindo produtos da Global Peças RJ (ID: 21)';

INSERT INTO dbo.PRODUTO (NOME, PRECO_VENDA_PIX, SKU, IMAGEM, ID_DISTRIBUIDOR, SITUACAO_REGISTRO, FRETE_GRATIS, QUANTIDADE, DATA_HORA_CRICAO_REGISTRO, DESCRICAO)
VALUES
-- CELULARES
('A51 PRETO C/ ARO OLED WE KEEP 1.1', 7899.00, 'PROD-003', '/images/celulares/celular3.png', 21, 'ATIVO', 1, 90, GETDATE(), 'Categoria: Celulares'),
('IPHONE X PRETO OLED (HOX1) WE KEEP', 5499.99, 'PROD-004', '/images/celulares/celular4.png', 21, 'ATIVO', 1, 60, GETDATE(), 'Categoria: Celulares'),
('REDMINOTE8 AZUL C/ARO NN', 7499.90, 'PROD-008', '/images/celulares/celular8.png', 21, 'ATIVO', 1, 70, GETDATE(), 'Categoria: Celulares'),
('OnePlus 13', 4999.00, 'PROD-011', '/images/celulares/celular11.png', 21, 'ATIVO', 1, 55, GETDATE(), 'Categoria: Celulares'),
-- NOTEBOOKS
('Dell XPS 15', 14599.00, 'PROD-014', '/images/notebooks/notebook2.png', 21, 'ATIVO', 1, 35, GETDATE(), 'Categoria: Notebooks'),
('Asus ROG Strix Scar 17', 17899.00, 'PROD-017', '/images/notebooks/notebook5.png', 21, 'ATIVO', 1, 20, GETDATE(), 'Categoria: Notebooks'),
('Samsung Galaxy Book4 Ultra', 13500.00, 'PROD-021', '/images/notebooks/notebook9.png', 21, 'ATIVO', 1, 30, GETDATE(), 'Categoria: Notebooks'),
('Lenovo Yoga Slim 7', 7899.00, 'PROD-024', '/images/notebooks/notebook12.png', 21, 'ATIVO', 1, 50, GETDATE(), 'Categoria: Notebooks'),
-- ACESSÓRIOS
('Cabo USB 3.0 para HD Externo', 79.90, 'PROD-029', '/images/acessorios/acessorio5.png', 21, 'ATIVO', 0, 180, GETDATE(), 'Categoria: Acessórios'),
('Fonte / Carregador para Notebook', 299.00, 'PROD-033', '/images/acessorios/acessorio9.png', 21, 'ATIVO', 1, 100, GETDATE(), 'Categoria: Acessórios'),
-- TELAS
('Monitor Curvo Samsung Odyssey G7 32"', 4200.00, 'PROD-039', '/images/telas/tela3.png', 21, 'ATIVO', 1, 20, GETDATE(), 'Categoria: Telas'),
('Monitor Gamer AOC Hero 24" 144Hz', 1299.00, 'PROD-043', '/images/telas/tela7.png', 21, 'ATIVO', 1, 45, GETDATE(), 'Categoria: Telas'),
('Monitor Profissional LG 34" Ultrawide', 2999.00, 'PROD-047', '/images/telas/tela11.png', 21, 'ATIVO', 1, 30, GETDATE(), 'Categoria: Telas');

PRINT '✅ 13 produtos Global Peças RJ inseridos';
PRINT '';

PRINT '3️⃣ Inserindo produtos da ImportaCell (ID: 22)';

INSERT INTO dbo.PRODUTO (NOME, PRECO_VENDA_PIX, SKU, IMAGEM, ID_DISTRIBUIDOR, SITUACAO_REGISTRO, FRETE_GRATIS, QUANTIDADE, DATA_HORA_CRICAO_REGISTRO, DESCRICAO)
VALUES
-- CELULARES
('REDMINOTE13 4G  PRETO S/ ARO INCELL NN', 12999.90, 'PROD-005', '/images/celulares/celular5.png', 22, 'ATIVO', 1, 65, GETDATE(), 'Categoria: Celulares'),
('REDMINOTE8 PRETO C/ARO NN', 6999.00, 'PROD-007', '/images/celulares/celular7.png', 22, 'ATIVO', 1, 80, GETDATE(), 'Categoria: Celulares'),
('iPhone 15 Pro Max', 8999.90, 'PROD-010', '/images/celulares/celular10.png', 22, 'ATIVO', 1, 40, GETDATE(), 'Categoria: Celulares'),
('Huawei P70 Pro', 6500.00, 'PROD-012', '/images/celulares/celular12.png', 22, 'ATIVO', 1, 50, GETDATE(), 'Categoria: Celulares'),
-- NOTEBOOKS
('HP Spectre x360', 9999.90, 'PROD-016', '/images/notebooks/notebook4.png', 22, 'ATIVO', 1, 35, GETDATE(), 'Categoria: Notebooks'),
('Microsoft Surface Laptop Studio', 15699.00, 'PROD-019', '/images/notebooks/notebook7.png', 22, 'ATIVO', 1, 25, GETDATE(), 'Categoria: Notebooks'),
('Acer Predator Helios', 11500.00, 'PROD-022', '/images/notebooks/notebook10.png', 22, 'ATIVO', 1, 30, GETDATE(), 'Categoria: Notebooks'),
-- ACESSÓRIOS
('Carregador de Parede Rápido com Cabo USB-C', 149.90, 'PROD-028', '/images/acessorios/acessorio4.png', 22, 'ATIVO', 0, 150, GETDATE(), 'Categoria: Acessórios'),
('Carregador de Parede + Cabo USB-C', 129.90, 'PROD-032', '/images/acessorios/acessorio8.png', 22, 'ATIVO', 1, 180, GETDATE(), 'Categoria: Acessórios'),
('Cabo de Impressora USB 2.0', 49.90, 'PROD-036', '/images/acessorios/acessorio12.png', 22, 'ATIVO', 1, 200, GETDATE(), 'Categoria: Acessórios'),
-- TELAS
('Monitor Portátil USB-C 15.6"', 999.00, 'PROD-041', '/images/telas/tela5.png', 22, 'ATIVO', 1, 60, GETDATE(), 'Categoria: Telas'),
('Monitor Gamer Asus TUF 27" 165Hz', 1999.90, 'PROD-045', '/images/telas/tela9.png', 22, 'ATIVO', 1, 40, GETDATE(), 'Categoria: Telas');

PRINT '✅ 12 produtos ImportaCell inseridos';
PRINT '';

PRINT '4️⃣ Inserindo produtos da Display Brasil (ID: 23)';

INSERT INTO dbo.PRODUTO (NOME, PRECO_VENDA_PIX, SKU, IMAGEM, ID_DISTRIBUIDOR, SITUACAO_REGISTRO, FRETE_GRATIS, QUANTIDADE, DATA_HORA_CRICAO_REGISTRO, DESCRICAO)
VALUES
-- ACESSÓRIOS
('Hub USB-C Multiportas', 249.90, 'PROD-025', '/images/acessorios/acessorio1.png', 23, 'ATIVO', 1, 120, GETDATE(), 'Categoria: Acessórios'),
('Kit Carregador USB-C + Cabo Lightning', 199.90, 'PROD-026', '/images/acessorios/acessorio2.png', 23, 'ATIVO', 1, 140, GETDATE(), 'Categoria: Acessórios'),
('Cabo de Dados USB-A para USB-C', 59.90, 'PROD-030', '/images/acessorios/acessorio6.png', 23, 'ATIVO', 0, 220, GETDATE(), 'Categoria: Acessórios'),
('Carregador Universal para Notebook', 349.90, 'PROD-034', '/images/acessorios/acessorio10.png', 23, 'ATIVO', 1, 90, GETDATE(), 'Categoria: Acessórios'),
-- TELAS
('Monitor Dell UltraSharp 27" 4K', 3899.00, 'PROD-037', '/images/telas/tela1.png', 23, 'ATIVO', 1, 25, GETDATE(), 'Categoria: Telas'),
('Monitor LG Ultrawide 29"', 1499.90, 'PROD-040', '/images/telas/tela4.png', 23, 'ATIVO', 1, 50, GETDATE(), 'Categoria: Telas'),
('Monitor Samsung Smart M7 32"', 2400.00, 'PROD-044', '/images/telas/tela8.png', 23, 'ATIVO', 1, 35, GETDATE(), 'Categoria: Telas'),
('Monitor Gamer Alienware 25" 360Hz', 5499.00, 'PROD-048', '/images/telas/tela12.png', 23, 'ATIVO', 1, 15, GETDATE(), 'Categoria: Telas');

PRINT '✅ 8 produtos Display Brasil inseridos';
PRINT '';

-- ========================================
-- ESTATÍSTICAS
-- ========================================
PRINT '========================================';
PRINT '📊 ESTATÍSTICAS DA MIGRAÇÃO';
PRINT '========================================';
PRINT '';

SELECT
    D.ID as [ID Distribuidor],
    D.NOME as [Distribuidor],
    COUNT(P.ID) as [Total Produtos]
FROM dbo.PESSOA D
LEFT JOIN dbo.PRODUTO P ON P.ID_DISTRIBUIDOR = D.ID AND P.SITUACAO_REGISTRO = 'ATIVO'
WHERE D.TIPO = 'DISTRIBUIDOR' AND D.ID IN (20, 21, 22, 23)
GROUP BY D.ID, D.NOME
ORDER BY D.ID;

PRINT '';

DECLARE @total INT;
SELECT @total = COUNT(*) FROM dbo.PRODUTO WHERE ID_DISTRIBUIDOR IS NOT NULL;
PRINT 'Total de produtos com distribuidor: ' + CAST(@total AS VARCHAR);

PRINT '';
PRINT '✅ MIGRAÇÃO CONCLUÍDA COM SUCESSO!';
PRINT '';
