import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, AlertTriangle, DollarSign, Plus, Edit2, Trash2, Search, Flame } from 'lucide-react';
import logger from '../../../utils/logger';
import Button from '../../Shared/Button/Button';
import Logo from '../../Shared/Logo/Logo';
import Loader from '../../Shared/Loader/Loader';
import ModalCadastrarProduto from './ModalCadastrarProduto';
import ModalEditarProduto from './ModalEditarProduto';
import styles from './TelaEstoque.module.css';
import { useEstoque } from '../../../hooks/useEstoque';
import { useProdutosMaisVendidos } from '../../../hooks/useProdutosMaisVendidos';
import {
  deleteProdutoEstoque,
  updateProdutoEstoque,
  createProdutoEstoque
} from '../../../api/estoqueServices';

function TelaEstoque() {
  const navigate = useNavigate();
  const { estoque, isLoading, error, recarregar } = useEstoque();
  const { produtosMaisVendidos } = useProdutosMaisVendidos(10); // Top 10 produtos
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [processando, setProcessando] = useState(false);
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  // Log para debug dos produtos no estoque
  useEffect(() => {
    if (estoque && estoque.length > 0) {
      logger.info('🛍️ Produtos no estoque:', estoque);
      logger.info('📊 Primeiro produto detalhado:', {
        produto: estoque[0],
        valorUnitario: estoque[0]?.valorUnitario,
        debug_precos: estoque[0]?._debug_precos
      });
    }
  }, [estoque]);

  // Calcula métricas
  const totalItens = estoque.reduce((acc, item) => acc + item.quantidade, 0);
  const itensComAlerta = estoque.filter(item =>
    item.status === 'estoque-baixo' || item.status === 'sem-estoque'
  ).length;
  const valorTotal = estoque.reduce((acc, item) =>
    acc + (item.quantidade * item.valorUnitario), 0
  );

  // Filtra itens
  const itensFiltrados = estoque.filter(item => {
    const matchesSearch =
      item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.marca.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'todos' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleVoltar = () => {
    navigate('/distribuidor/dashboard');
  };

  const handleCadastrar = () => {
    setModalCadastroAberto(true);
  };

  const handleSubmitCadastro = async (produtoData) => {
    try {
      await createProdutoEstoque(produtoData);
      alert('Produto cadastrado com sucesso!');
      recarregar(); // Recarrega a lista de produtos
    } catch (err) {
      logger.error('Erro ao cadastrar produto:', err);
      alert('Erro ao cadastrar produto: ' + (err.message || 'Erro desconhecido'));
      throw err; // Re-throw para o modal tratar
    }
  };

  const handleEditar = (id) => {
    const produto = estoque.find(item => item.id === id);
    if (produto) {
      setProdutoSelecionado(produto);
      setModalEdicaoAberto(true);
    }
  };

  const handleSubmitEdicao = async (id, produtoData) => {
    try {
      setProcessando(true);
      await updateProdutoEstoque(id, produtoData);
      alert('Produto atualizado com sucesso!');
      recarregar(); // Recarrega a lista de produtos
    } catch (err) {
      logger.error('Erro ao atualizar produto:', err);
      alert('Erro ao atualizar produto: ' + (err.message || 'Erro desconhecido'));
      throw err; // Re-throw para o modal tratar
    } finally {
      setProcessando(false);
    }
  };

  const handleExcluir = async (id) => {
    const produto = estoque.find(item => item.id === id);
    if (!produto) {
      alert('Produto não encontrado.');
      return;
    }

    const confirmacao = window.confirm(
      `Tem certeza que deseja excluir o produto:\n\n${produto.nome}\n\nEsta ação não pode ser desfeita.`
    );

    if (!confirmacao) {
      return;
    }

    try {
      setProcessando(true);
      await deleteProdutoEstoque(id);
      alert('Produto excluído com sucesso!');
      recarregar(); // Recarrega a lista
    } catch (err) {
      logger.error('Erro ao excluir produto:', err);
      alert('Erro ao excluir produto: ' + (err.message || 'Erro desconhecido'));
    } finally {
      setProcessando(false);
    }
  };

  const limparFiltros = () => {
    setSearchTerm('');
    setStatusFilter('todos');
  };

  const getStatusLabel = (status) => {
    const labels = {
      'disponivel': 'Disponível',
      'estoque-baixo': 'Estoque Baixo',
      'sem-estoque': 'Sem Estoque'
    };
    return labels[status] || status;
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.logoSection}>
            <Logo size={28} />
          </div>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft size={16} />}
            onClick={handleVoltar}
          >
            Voltar
          </Button>
        </div>

        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.title}>Gerenciar Estoque</h1>
            <p className={styles.subtitle}>Monitore e Gerencie seus produtos</p>
          </div>
        </div>
      </header>

      {/* Loading State */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <Loader size="xl" variant="primary" text="Carregando estoque..." />
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#e74c3c' }}>
          <AlertTriangle size={48} style={{ marginBottom: '1rem' }} />
          <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>❌ Erro ao carregar estoque</p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>{error}</p>
          <Button
            variant="primary"
            size="md"
            onClick={recarregar}
            style={{ marginTop: '1rem' }}
          >
            Tentar Novamente
          </Button>
        </div>
      )}

      {/* Métricas Cards */}
      {!isLoading && !error && (
        <>
        <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Total de Itens</span>
            <Package className={styles.metricIcon} size={20} />
          </div>
          <div className={styles.metricValue}>{totalItens}</div>
          <div className={styles.metricSubtext}>{estoque.length} tipos diferentes</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Alertas de Estoque</span>
            <AlertTriangle className={styles.metricIcon} size={20} />
          </div>
          <div className={styles.metricValue}>{itensComAlerta}</div>
          <div className={styles.metricSubtext}>Itens com estoque baixo/zerado</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Valor do Estoque</span>
            <DollarSign className={styles.metricIcon} size={20} />
          </div>
          <div className={styles.metricValue}>
            R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={styles.metricSubtext}>Valor total: inventário</div>
        </div>

        <div className={styles.metricCardAction}>
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Plus size={18} />}
            onClick={handleCadastrar}
            className={styles.cadastrarButton}
          >
            Cadastrar Produto
          </Button>
        </div>
      </div>

      {/* Alerta de Estoque Baixo */}
      {itensComAlerta > 0 && (
        <div className={styles.alertBox}>
          <div className={styles.alertHeader}>
            <AlertTriangle size={24} className={styles.alertIcon} />
            <div>
              <h3 className={styles.alertTitle}>Atenção: Estoque Baixo!</h3>
              <p className={styles.alertMessage}>
                <strong>{itensComAlerta} produto(s)</strong> com estoque baixo ou zerado precisam de reposição urgente.
              </p>
            </div>
          </div>
          <div className={styles.alertProducts}>
            {estoque
              .filter(item => item.status === 'estoque-baixo' || item.status === 'sem-estoque')
              .slice(0, 5)
              .map(item => (
                <div key={item.id} className={styles.alertProductItem}>
                  <div className={styles.alertProductInfo}>
                    <span className={styles.alertProductName}>{item.nome}</span>
                    <span className={styles.alertProductMarca}>({item.marca})</span>
                  </div>
                  <div className={styles.alertProductStatus}>
                    <span className={`${styles.statusBadgeSmall} ${styles[item.status]}`}>
                      {item.quantidade === 0 ? 'SEM ESTOQUE' : `${item.quantidade} un.`}
                    </span>
                  </div>
                </div>
              ))}
            {itensComAlerta > 5 && (
              <div className={styles.alertMoreItems}>
                + {itensComAlerta - 5} produto(s) a mais precisam de atenção
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filtros e Busca */}
      <div className={styles.filterSection}>
        <h2 className={styles.filterTitle}>
          <Search size={18} />
          Filtros e Busca
        </h2>

        <div className={styles.filterControls}>
          <div className={styles.filterGroup}>
            <label htmlFor="search" className={styles.filterLabel}>Buscar</label>
            <input
              id="search"
              type="text"
              placeholder="Nome, descrição ou marca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="status" className={styles.filterLabel}>Status</label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.selectInput}
            >
              <option value="todos">Todos os status</option>
              <option value="disponivel">Disponível</option>
              <option value="estoque-baixo">Estoque Baixo</option>
              <option value="sem-estoque">Sem Estoque</option>
            </select>
          </div>

          <Button
            variant="ghost"
            size="md"
            onClick={limparFiltros}
            className={styles.clearButton}
          >
            Limpar Filtros
          </Button>
        </div>
      </div>

      {/* Lista de Itens */}
      <div className={styles.stockSection}>
        <div className={styles.stockHeader}>
          <h2 className={styles.stockTitle}>
            Itens em Estoque ({itensFiltrados.length})
          </h2>
          <p className={styles.stockSubtitle}>Monitore e Gerencie seus produtos</p>
        </div>

        <div className={styles.stockList}>
          {itensFiltrados.map((item) => (
            <div key={item.id} className={styles.stockItem}>
              <div className={styles.itemIcon}>
                <Package size={24} />
              </div>

              <div className={styles.itemContent}>
                <div className={styles.itemHeader}>
                  <div className={styles.itemTitleRow}>
                    <h3 className={styles.itemName}>{item.nome}</h3>
                    {produtosMaisVendidos.has(item.id) && (
                      <span className={styles.badgeMaisVendido}>
                        <Flame size={14} />
                        Mais Vendido
                      </span>
                    )}
                  </div>
                  <div className={styles.itemActions}>
                    <button
                      className={styles.actionButton}
                      onClick={() => handleEditar(item.id)}
                      title="Editar"
                      disabled={processando}
                    >
                      <Edit2 size={16} />
                      Editar
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={() => handleExcluir(item.id)}
                      title="Excluir"
                      disabled={processando}
                    >
                      <Trash2 size={16} />
                      {processando ? 'Excluindo...' : 'Excluir'}
                    </button>
                  </div>
                </div>

                <p className={styles.itemDescription}>{item.descricao}</p>

                <div className={styles.itemDetails}>
                  <div className={styles.detailGroup}>
                    <span className={styles.detailLabel}>Marca:</span>
                    <span className={styles.detailValue}>{item.marca}</span>
                  </div>

                  <div className={styles.detailGroup}>
                    <span className={styles.detailLabel}>Quantidade:</span>
                    <span className={styles.detailValue}>{item.quantidade} unidades</span>
                  </div>

                  <div className={styles.detailGroup}>
                    <span className={styles.detailLabel}>Valor Unit:</span>
                    <span className={styles.detailValue}>
                      R$ {item.valorUnitario.toFixed(2)}
                    </span>
                  </div>

                  <div className={styles.detailGroup}>
                    <span className={styles.detailLabel}>Local Físico:</span>
                    <span className={styles.detailValue}>{item.localFisico}</span>
                  </div>
                </div>

                <div className={styles.itemFooter}>
                  <div className={styles.footerLeft}>
                    <span className={styles.valorTotal}>
                      Valor Total: <strong>R$ {(item.quantidade * item.valorUnitario).toFixed(2)}</strong>
                    </span>
                  </div>

                  <div className={styles.footerRight}>
                    <span className={`${styles.statusBadge} ${styles[item.status]}`}>
                      {getStatusLabel(item.status)}
                    </span>
                    <span className={styles.lote}>{item.lote}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {itensFiltrados.length === 0 && (
            <div className={styles.emptyState}>
              <Package size={48} className={styles.emptyIcon} />
              <p className={styles.emptyText}>Nenhum item encontrado</p>
              <p className={styles.emptySubtext}>
                Tente ajustar os filtros ou cadastre um novo produto
              </p>
            </div>
          )}
        </div>
      </div>
      </>
      )}

      {/* Modal de Cadastro */}
      <ModalCadastrarProduto
        isOpen={modalCadastroAberto}
        onClose={() => setModalCadastroAberto(false)}
        onSubmit={handleSubmitCadastro}
      />

      {/* Modal de Edição */}
      <ModalEditarProduto
        isOpen={modalEdicaoAberto}
        onClose={() => {
          setModalEdicaoAberto(false);
          setProdutoSelecionado(null);
        }}
        onSubmit={handleSubmitEdicao}
        produto={produtoSelecionado}
      />
    </div>
  );
}

export default TelaEstoque;
