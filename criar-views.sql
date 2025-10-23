-- Script para criar VIEWs com os nomes que a API espera
-- Execute este script no SQL Server Management Studio

USE allmoove;
GO

-- Criar view Pedidos (plural) apontando para PEDIDO (singular)
CREATE VIEW Pedidos AS
SELECT * FROM PEDIDO;
GO

-- Criar view Produtos
CREATE VIEW Produtos AS
SELECT * FROM PRODUTO;
GO

-- Criar view PedidoItems
CREATE VIEW PedidoItems AS
SELECT * FROM PEDIDO_ITEM;
GO

-- Criar view PedidoGrupos
CREATE VIEW PedidoGrupos AS
SELECT * FROM PEDIDO_GRUPO;
GO

-- Criar views para outras tabelas que a API pode usar
CREATE VIEW Pessoas AS
SELECT * FROM PESSOA;
GO

CREATE VIEW ProdutoSegmentos AS
SELECT * FROM PRODUTO_SEGMENTO;
GO

-- Verificar se funcionou
SELECT 'Views criadas com sucesso!' as Mensagem;
SELECT COUNT(*) as TotalPedidos FROM Pedidos;
SELECT COUNT(*) as TotalProdutos FROM Produtos;