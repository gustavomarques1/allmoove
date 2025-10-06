import React, { useState, useEffect, useRef } from "react";
import styles from './BuscaSegmentada.module.css';
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getProdutosPorCategoria, getProdutosPorCategoriaEFornecedor, getFornecedores } from '../../../api/produtosServices';

// Categorias disponíveis (incluindo as do products.json + exemplos)
const segmentos = [
  { id: 'celulares', nome: 'Celulares' },
  { id: 'auto', nome: 'Auto' },
  { id: 'telas', nome: 'Telas' },
  { id: 'notebooks', nome: 'Notebooks' },
  { id: 'display', nome: 'Display' },
  { id: 'audio', nome: 'Áudio' },
  { id: 'energia', nome: 'Energia' },
  { id: 'componentes', nome: 'Componentes' },
  { id: 'acessorios', nome: 'Acessórios' },
];

// Distribuidores/Fornecedores disponíveis
const distribuidores = [
  { id: 'TechParts SP', nome: 'TechParts SP' },
  { id: 'Global Peças RJ', nome: 'Global Peças RJ' },
  { id: 'ImportaCell', nome: 'ImportaCell' },
  { id: 'Display Brasil', nome: 'Display Brasil' },
];

// Mock de pedidos por categoria e distribuidor
const mockPedidos = [
  { id: 1, distribuidor: "TechParts SP", produto: "6S BRANCO", segmentoId: 'celulares' },
  { id: 2, distribuidor: "TechParts SP", produto: "E20 PRETO C/ARO WE KEEP", segmentoId: 'celulares' },
  { id: 3, distribuidor: "Global Peças RJ", produto: "A51 PRETO C/ ARO OLED", segmentoId: 'celulares' },
  { id: 4, distribuidor: "Distribuidor B", produto: "Pastilhas de Freio Automotivo", segmentoId: 'auto' },
  { id: 5, distribuidor: "Distribuidor B", produto: "Filtro de Óleo para Carro", segmentoId: 'auto' },
  { id: 6, distribuidor: "TechParts SP", produto: "Macbook Pro 16 M4", segmentoId: 'notebooks' },
  { id: 7, distribuidor: "Global Peças RJ", produto: "Dell XPS 15", segmentoId: 'notebooks' },
  { id: 8, distribuidor: "Display Brasil", produto: "Monitor Dell UltraSharp 27\"", segmentoId: 'telas' },
  { id: 9, distribuidor: "TechParts SP", produto: "Monitor Gamer LG UltraGear", segmentoId: 'telas' },
  { id: 10, distribuidor: "Distribuidor D", produto: "Display AMOLED para Monitor", segmentoId: 'display' },
  { id: 11, distribuidor: "Display Brasil", produto: "Hub USB-C Multiportas", segmentoId: 'acessorios' },
  { id: 12, distribuidor: "ImportaCell", produto: "Carregador de Parede Rápido", segmentoId: 'acessorios' },
  { id: 13, distribuidor: "ImportaCell", produto: "iPhone 15 Pro Max", segmentoId: 'celulares' },
];

function BuscaSegmentada() {
  const [selectedSegmento, setSelectedSegmento] = useState('celulares');
  const [selectedDistribuidor, setSelectedDistribuidor] = useState('');
  const [searchDistribuidor, setSearchDistribuidor] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [ultimosPedidos, setUltimosPedidos] = useState([]);
  const [distribuidoresDisponiveis, setDistribuidoresDisponiveis] = useState(distribuidores);
  const [isLoading, setIsLoading] = useState(false);
  const [useAPI, setUseAPI] = useState(false); // Flag para tentar usar API

  const carouselRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  // Carrega fornecedores da API (se disponível)
  useEffect(() => {
    const loadFornecedores = async () => {
      try {
        const fornecedoresAPI = await getFornecedores();
        if (fornecedoresAPI && fornecedoresAPI.length > 0) {
          setDistribuidoresDisponiveis(
            fornecedoresAPI.map(f => ({ id: f, nome: f }))
          );
          setUseAPI(true); // API disponível
        }
      } catch (error) {
        console.log('API de fornecedores não disponível, usando dados estáticos', error);
        setUseAPI(false);
      }
    };

    loadFornecedores();
  }, []);

  // Filtra pedidos por categoria e distribuidor
  useEffect(() => {
    const loadPedidos = async () => {
      setIsLoading(true);

      try {
        if (useAPI) {
          // Tenta buscar da API
          let produtos = [];

          if (selectedDistribuidor) {
            produtos = await getProdutosPorCategoriaEFornecedor(selectedSegmento, selectedDistribuidor);
          } else {
            produtos = await getProdutosPorCategoria(selectedSegmento);
          }

          // Converte produtos em formato de "últimos pedidos"
          const pedidosFromAPI = produtos.slice(0, 5).map((produto, index) => ({
            id: produto.id || index,
            distribuidor: produto.fornecedor,
            produto: produto.nome,
            segmentoId: produto.categoria,
          }));

          setUltimosPedidos(pedidosFromAPI);
        } else {
          // Usa mock data
          let pedidosFiltrados = mockPedidos.filter(p => p.segmentoId === selectedSegmento);

          if (selectedDistribuidor) {
            pedidosFiltrados = pedidosFiltrados.filter(p => p.distribuidor === selectedDistribuidor);
          }

          setUltimosPedidos(pedidosFiltrados);
        }
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        // Fallback para mock em caso de erro
        let pedidosFiltrados = mockPedidos.filter(p => p.segmentoId === selectedSegmento);
        if (selectedDistribuidor) {
          pedidosFiltrados = pedidosFiltrados.filter(p => p.distribuidor === selectedDistribuidor);
        }
        setUltimosPedidos(pedidosFiltrados);
      } finally {
        setIsLoading(false);
      }
    };

    loadPedidos();
  }, [selectedSegmento, selectedDistribuidor, useAPI]);

  const handleScroll = (scrollOffset) => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft += scrollOffset;
    }
  };

  const handleNavigateToCategoria = () => {
    let url = '/assistencia/loja';
    const params = new URLSearchParams();

    if (selectedSegmento) {
      params.append('categoria', selectedSegmento);
    }

    if (selectedDistribuidor) {
      params.append('fornecedor', selectedDistribuidor);
    }

    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    navigate(url);
  };

  const handleNavigateToAllProducts = () => {
    navigate('/assistencia/loja');
  };

  // Filtra fornecedores baseado na busca
  const filteredDistribuidores = distribuidoresDisponiveis.filter(dist =>
    dist.nome.toLowerCase().includes(searchDistribuidor.toLowerCase())
  );

  // Seleciona fornecedor do dropdown
  const handleSelectDistribuidor = (distribuidor) => {
    setSelectedDistribuidor(distribuidor.id);
    setSearchDistribuidor(distribuidor.nome);
    setShowDropdown(false);
  };

  // Limpa seleção de fornecedor
  const handleClearDistribuidor = () => {
    setSelectedDistribuidor('');
    setSearchDistribuidor('');
    setShowDropdown(false);
  };

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.painelContainer}>

      {/* Seção do Carrossel de Categorias */}
      <div className={styles.carouselWrapper}>
        <button className={styles.navButton} onClick={() => handleScroll(-250)}>
          <ChevronLeft size={20} />
        </button>
        <div ref={carouselRef} className={styles.segmentosGrid}>
          {segmentos.map((segmento) => (
            <button
              key={segmento.id}
              className={`${styles.segmentoBotao} ${selectedSegmento === segmento.id ? styles.selecionado : ''}`}
              onClick={() => setSelectedSegmento(segmento.id)}
            >
              {segmento.nome}
            </button>
          ))}
        </div>
        <button className={styles.navButton} onClick={() => handleScroll(250)}>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Seção de Interação */}
      <div className={styles.interacaoContainer}>
        <div className={styles.pedidosContainer}>
          <h3 className={styles.colunaTitulo}>
            {useAPI ? 'Produtos Disponíveis' : 'Últimos Pedidos'}
          </h3>
          <div className={styles.listaWrapper}>
            {isLoading ? (
              <p className={styles.listaVazia}>Carregando...</p>
            ) : ultimosPedidos.length > 0 ? (
              <ul className={styles.listaPedidos}>
                {ultimosPedidos.map((pedido) => (
                  <li key={pedido.id}>
                    <span>{pedido.distribuidor}</span>
                    <span>{pedido.produto}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.listaVazia}>Nenhum produto encontrado para esta seleção.</p>
            )}
          </div>
        </div>

        {/* Coluna da direita - Seleção de Distribuidor e Ações */}
        <div className={styles.distribuidorContainer}>
          {/* Busca de Distribuidor com Autocomplete */}
          <div className={styles.distribuidorSelector} ref={searchInputRef}>
            <label htmlFor="distribuidor-search" className={styles.distribuidorLabel}>
              Buscar Distribuidor:
            </label>
            <div className={styles.searchInputWrapper}>
              <input
                id="distribuidor-search"
                type="text"
                value={searchDistribuidor}
                onChange={(e) => {
                  setSearchDistribuidor(e.target.value);
                  setShowDropdown(true);
                  if (!e.target.value) {
                    setSelectedDistribuidor('');
                  }
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Digite para buscar ou deixe vazio para todos"
                className={styles.distribuidorSearchInput}
              />
              {selectedDistribuidor && (
                <button
                  type="button"
                  onClick={handleClearDistribuidor}
                  className={styles.clearButton}
                  title="Limpar seleção"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Dropdown de sugestões */}
            {showDropdown && searchDistribuidor && filteredDistribuidores.length > 0 && (
              <ul className={styles.dropdownList}>
                {filteredDistribuidores.map((dist) => (
                  <li
                    key={dist.id}
                    onClick={() => handleSelectDistribuidor(dist)}
                    className={styles.dropdownItem}
                  >
                    {dist.nome}
                  </li>
                ))}
              </ul>
            )}

            {showDropdown && searchDistribuidor && filteredDistribuidores.length === 0 && (
              <div className={styles.dropdownEmpty}>
                Nenhum distribuidor encontrado
              </div>
            )}
          </div>

          {/* Botões de Ação */}
          <div className={styles.botoesDistribuidor}>
            <button className={`${styles.botaoAcao} ${styles.primary}`} onClick={handleNavigateToCategoria}>
              Pesquisar por categoria
            </button>
            <button className={styles.botaoAcao} onClick={handleNavigateToAllProducts}>
              Todos os Produtos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuscaSegmentada;