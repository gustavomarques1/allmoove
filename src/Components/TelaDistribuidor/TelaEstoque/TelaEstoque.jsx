import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, AlertTriangle, DollarSign, Plus, Edit2, Trash2, Search } from 'lucide-react';
import Button from '../../Shared/Button/Button';
import styles from './TelaEstoque.module.css';

// Dados mockados dos itens do estoque
const mockEstoque = [
  {
    id: 1,
    nome: 'Placa Principal',
    descricao: 'Placa principal para smartphone Samsung Galaxy A54',
    marca: 'Samsung',
    quantidade: 25,
    valorUnitario: 89.90,
    localFisico: 'A1-B2',
    lote: 'LOT-001',
    status: 'disponivel'
  },
  {
    id: 2,
    nome: 'Tela LCD',
    descricao: 'Tela LCD original 6.4 polegadas',
    marca: 'Samsung',
    quantidade: 5,
    valorUnitario: 120.50,
    localFisico: 'B2-C1',
    lote: 'LOT-002',
    status: 'estoque-baixo'
  },
  {
    id: 3,
    nome: 'Bateria',
    descricao: 'Bateria 3000mAh compatível',
    marca: 'Universal',
    quantidade: 0,
    valorUnitario: 45.00,
    localFisico: 'C1-D3',
    lote: 'LOT-003',
    status: 'sem-estoque'
  },
  {
    id: 4,
    nome: 'Conector USB-C',
    descricao: 'Conector de carga USB-C universal',
    marca: 'Universal',
    quantidade: 50,
    valorUnitario: 15.90,
    localFisico: 'D1-E2',
    lote: 'LOT-004',
    status: 'disponivel'
  },
  {
    id: 5,
    nome: 'Alto-falante',
    descricao: 'Alto-falante interno padrão',
    marca: 'Samsung',
    quantidade: 12,
    valorUnitario: 25.50,
    localFisico: 'E1-F1',
    lote: 'LOT-005',
    status: 'disponivel'
  }
];

function TelaEstoque() {
  const navigate = useNavigate();
  const [estoque, setEstoque] = useState(mockEstoque);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

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
    console.log('Cadastrar novo produto');
    // TODO: Implementar modal ou rota para cadastro
  };

  const handleEditar = (id) => {
    console.log('Editar produto', id);
    // TODO: Implementar edição
  };

  const handleExcluir = (id) => {
    console.log('Excluir produto', id);
    // TODO: Implementar exclusão
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
            <div className={styles.logoIcon}>
              <Package size={24} />
            </div>
            <span className={styles.logoText}>Allmoove</span>
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
            <p className={styles.subtitle}>Controle de lotes e inventário de peças</p>
          </div>
        </div>
      </header>

      {/* Métricas Cards */}
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

      {/* Alerta */}
      {itensComAlerta > 0 && (
        <div className={styles.alertBox}>
          <AlertTriangle size={20} />
          <span>
            Atenção: <strong>{itensComAlerta} item(ns)</strong> com estoque baixo ou zerado precisam de reposição.
          </span>
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
          <p className={styles.stockSubtitle}>Gerencie seus lotes de peças e monitore quantidades</p>
        </div>

        <div className={styles.stockList}>
          {itensFiltrados.map((item) => (
            <div key={item.id} className={styles.stockItem}>
              <div className={styles.itemIcon}>
                <Package size={24} />
              </div>

              <div className={styles.itemContent}>
                <div className={styles.itemHeader}>
                  <h3 className={styles.itemName}>{item.nome}</h3>
                  <div className={styles.itemActions}>
                    <button
                      className={styles.actionButton}
                      onClick={() => handleEditar(item.id)}
                      title="Editar"
                    >
                      <Edit2 size={16} />
                      Editar
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={() => handleExcluir(item.id)}
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                      Excluir
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
    </div>
  );
}

export default TelaEstoque;
