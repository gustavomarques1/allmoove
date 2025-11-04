import React, { useState, useEffect, useRef } from "react";
import styles from './BuscaSegmentada.module.css';
import { useNavigate } from "react-router-dom";
import logger from '../../../utils/logger';
import {
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Car,
  Bike,
  Zap,
  FileText,
  Cpu,
  Package,
  Box,
  Clock,
  Star,
  Search,
  ShoppingCart
} from "lucide-react";
import {
  getFornecedores,
  getSegmentos,
  getDistribuidoresPorSegmento,
  getDistribuidoresFavoritos
} from '../../../api/produtosServices';
import { useAuth } from '../../../hooks/useAuth';

// Mapeamento de ícones por nome de segmento
const getIconeSegmento = (nome) => {
  const nomeNormalizado = nome.toLowerCase().trim();

  // Mapeamento baseado nas categorias reais da API
  const iconMap = {
    // Celulares e relacionados
    'celulares': Smartphone,
    'celular': Smartphone,
    'smartphones': Smartphone,
    'telefone': Smartphone,
    'telefones': Smartphone,

    // Auto
    'auto': Car,
    'automotivo': Car,
    'automóvel': Car,
    'carro': Car,
    'carros': Car,
    'veículo': Car,
    'veículos': Car,

    // Moto
    'moto': Bike,
    'motos': Bike,
    'motocicleta': Bike,
    'motocicletas': Bike,
    'bike': Bike,
    'bicicleta': Bike,

    // Eletro (eletrônicos/eletrodomésticos)
    'eletro': Zap,
    'eletrônicos': Zap,
    'eletronicos': Zap,
    'eletrodomésticos': Zap,
    'eletrodomesticos': Zap,
    'elétrica': Zap,
    'eletrica': Zap,

    // Papelaria
    'papelaria': FileText,
    'papelarias': FileText,
    'papel': FileText,
    'escritório': FileText,
    'escritorio': FileText,

    // Componentes eletrônicos
    'componentes': Cpu,
    'componente': Cpu,
    'peças': Cpu,
    'pecas': Cpu,

    // Acessórios (fallback para categorias não específicas)
    'acessorios': Package,
    'acessórios': Package,
    'acessório': Package,
  };

  return iconMap[nomeNormalizado] || Box; // Box como ícone padrão
};

// Categorias fallback (caso a API não esteja disponível)
const segmentosFallback = [
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

function BuscaSegmentada() {
  const [segmentos, setSegmentos] = useState(segmentosFallback);
  const [selectedSegmento, setSelectedSegmento] = useState('');
  const [selectedDistribuidor, setSelectedDistribuidor] = useState('');
  const [searchDistribuidor, setSearchDistribuidor] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [ultimosPedidos, setUltimosPedidos] = useState([]);
  const [distribuidoresFavoritos, setDistribuidoresFavoritos] = useState([]);
  const [distribuidoresDisponiveis, setDistribuidoresDisponiveis] = useState(distribuidores);
  const [isLoadingPedidos, setIsLoadingPedidos] = useState(false);
  const [isLoadingFavoritos, setIsLoadingFavoritos] = useState(false);

  const carouselRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  // Obter ID do usuário autenticado (assistência técnica)
  const { userId } = useAuth();

  // Carrega segmentos/categorias da API
  useEffect(() => {
    const loadSegmentos = async () => {
      try {
        const segmentosAPI = await getSegmentos();

        if (segmentosAPI && segmentosAPI.length > 0) {
          // Converte o formato da API para o formato esperado pelo componente
          const segmentosFormatados = segmentosAPI.map(seg => ({
            id: seg.id,
            nome: seg.nome || seg.descricao || 'Sem nome'
          }));

          setSegmentos(segmentosFormatados);
          // Define o primeiro segmento como selecionado
          if (segmentosFormatados.length > 0) {
            setSelectedSegmento(segmentosFormatados[0].id);
          }
          logger.info('✅ Segmentos carregados da API:', segmentosFormatados.length);
        }
      } catch (error) {
        logger.info('⚠️ API de segmentos não disponível, usando categorias fallback', error);
        setSegmentos(segmentosFallback);
        setSelectedSegmento(segmentosFallback[0].id);
      }
    };

    loadSegmentos();
  }, []);

  // Carrega distribuidores por segmento da API
  useEffect(() => {
    // Só carrega se tiver segmento selecionado
    if (!selectedSegmento) {
      return;
    }

    const loadDistribuidores = async () => {
      try {
        // Tenta usar a API específica de distribuidores por segmento
        const distribuidoresAPI = await getDistribuidoresPorSegmento(selectedSegmento);

        if (distribuidoresAPI && distribuidoresAPI.length > 0) {
          logger.info('📦 Distribuidor da API (RAW):', distribuidoresAPI[0]);

          const distribuidoresFormatados = distribuidoresAPI.map(d => ({
            id: d.idDistribuidor || d.id || d.idPessoa,
            nome: d.nome || d.razaoSocial || d.nomeFantasia || 'Sem nome'
          }));
          setDistribuidoresDisponiveis(distribuidoresFormatados);
          logger.info(`✅ Distribuidores do segmento ${selectedSegmento}:`, distribuidoresAPI.length);
          logger.info('📋 Lista de distribuidores formatados:', distribuidoresFormatados);
        } else {
          // Fallback: tenta API de fornecedores genérica
          logger.info('⚠️ Nenhum distribuidor encontrado no segmento, tentando API genérica');
          const fornecedoresAPI = await getFornecedores();
          if (fornecedoresAPI && fornecedoresAPI.length > 0) {
            setDistribuidoresDisponiveis(
              fornecedoresAPI.map(f => ({ id: f, nome: f }))
            );
            logger.info('✅ Fornecedores carregados da API genérica:', fornecedoresAPI.length);
          }
        }
      } catch (error) {
        logger.info('⚠️ Erro ao buscar distribuidores, usando dados estáticos', error);
        // Mantém dados estáticos em caso de erro
      }
    };

    loadDistribuidores();
  }, [selectedSegmento]);

  // Carrega últimos pedidos com produtos (FORNECEDOR - PRODUTO) filtrados por segmento
  useEffect(() => {
    if (!userId || !selectedSegmento) {
      return;
    }

    const loadUltimosPedidos = async () => {
      setIsLoadingPedidos(true);
      logger.info(`\n🔍 Buscando últimos pedidos do segmento ${selectedSegmento} para assistência ${userId}`);

      try {
        // API com filtro por segmento: /api/Pedidos/ultimos-produtos/{idAssistencia}/segmento/{idSegmento}
        const API_BASE_URL = import.meta.env.VITE_API_URL || "https://localhost:44370/";
        const response = await fetch(`${API_BASE_URL}api/Pedidos/ultimos-produtos/${userId}/segmento/${selectedSegmento}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error(`API retornou status ${response.status}`);
        }

        const produtosAPI = await response.json();

        if (produtosAPI && produtosAPI.length > 0) {
          logger.info(`✅ ${produtosAPI.length} produtos encontrados no segmento ${selectedSegmento}`);

          // Transforma para formato de exibição
          const produtosFormatados = produtosAPI.slice(0, 5).map(item => ({
            id: item.idPedidoItem,
            fornecedor: item.fornecedorProduto,
            produto: '',
            descricao: item.fornecedorProduto,
            data: item.dataPedido,
            quantidade: item.quantidade
          }));

          setUltimosPedidos(produtosFormatados);
        } else {
          logger.info('⚠️ Nenhum produto encontrado neste segmento');
          setUltimosPedidos([]);
        }
      } catch (error) {
        logger.error('❌ Erro ao carregar últimos pedidos:', error);
        setUltimosPedidos([]);
      } finally {
        setIsLoadingPedidos(false);
      }
    };

    loadUltimosPedidos();
  }, [userId, selectedSegmento]);

  // Carrega distribuidores favoritos por segmento
  useEffect(() => {
    if (!selectedSegmento || !userId) {
      return;
    }

    const loadFavoritos = async () => {
      setIsLoadingFavoritos(true);
      logger.info(`\n🔍 Buscando favoritos para segmento ${selectedSegmento} e assistência ${userId}`);

      try {
        const favoritosAPI = await getDistribuidoresFavoritos(selectedSegmento, userId);

        if (favoritosAPI && favoritosAPI.length > 0) {
          logger.info(`✅ Distribuidores favoritos:`, favoritosAPI);

          // Transforma para formato de exibição
          const favoritosFormatados = favoritosAPI.slice(0, 5).map(dist => ({
            id: dist.idDistribuidor,
            nome: dist.nome,
            cpfCnpj: dist.cpfCnpj,
            idSegmento: dist.idSegmento
          }));

          setDistribuidoresFavoritos(favoritosFormatados);
        } else {
          logger.info('⚠️ Nenhum distribuidor favorito neste segmento');
          setDistribuidoresFavoritos([]);
        }
      } catch (error) {
        logger.error('❌ Erro ao carregar favoritos:', error);
        setDistribuidoresFavoritos([]);
      } finally {
        setIsLoadingFavoritos(false);
      }
    };

    loadFavoritos();
  }, [selectedSegmento, userId]);

  const handleScroll = (scrollOffset) => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft += scrollOffset;
    }
  };

  const handleNavigateToCategoria = () => {
    let url = '/assistencia/loja';
    const params = new URLSearchParams();

    if (selectedSegmento) {
      params.append('idSegmento', selectedSegmento);
    }

    if (selectedDistribuidor) {
      // Passa o ID do distribuidor (não o nome)
      params.append('idDistribuidor', selectedDistribuidor);
    }

    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    logger.info('🔍 Navegando para loja com filtros:', url);
    navigate(url);
  };

  // Filtra fornecedores baseado na busca
  const filteredDistribuidores = distribuidoresDisponiveis.filter(dist =>
    dist.nome.toLowerCase().includes(searchDistribuidor.toLowerCase())
  );

  // Debug temporário
  if (searchDistribuidor) {
    logger.info('🔍 Buscando:', searchDistribuidor);
    logger.info('📦 Distribuidores disponíveis:', distribuidoresDisponiveis);
    logger.info('✅ Filtrados:', filteredDistribuidores);
  }

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

  // Navega para loja ao clicar em um último pedido
  const handleClickUltimoPedido = () => {
    let url = '/assistencia/loja';
    const params = new URLSearchParams();

    if (selectedSegmento) {
      params.append('idSegmento', selectedSegmento);
    }

    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    logger.info('🔍 Navegando para loja a partir de último pedido:', url);
    navigate(url);
  };

  // Navega para loja ao clicar em um favorito
  const handleClickFavorito = (distribuidor) => {
    let url = '/assistencia/loja';
    const params = new URLSearchParams();

    // Usa o idSegmento do próprio distribuidor (vem da API)
    if (distribuidor.idSegmento) {
      params.append('idSegmento', distribuidor.idSegmento);
    }

    // Adiciona o filtro por distribuidor
    if (distribuidor.id) {
      params.append('idDistribuidor', distribuidor.id);
    }

    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    logger.info('🔍 Navegando para loja a partir de favorito:', url);
    navigate(url);
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
      {/* Título da Seção */}
      <div className={styles.sectionHeader}>
        <Package size={24} />
        <h2>Buscar Produtos</h2>
      </div>

      {/* Campo de Busca Único e Inteligente + Botão Ver Todos */}
      <div className={styles.searchContainer}>
        <div className={styles.searchRow}>
          <div className={styles.searchWrapper} ref={searchInputRef}>
            <Search className={styles.searchIcon} size={20} />
            <input
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
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleNavigateToCategoria();
                }
              }}
              placeholder="Buscar por categoria, distribuidor ou produto..."
              className={styles.searchInput}
            />
            {selectedDistribuidor && (
              <button
                type="button"
                onClick={handleClearDistribuidor}
                className={styles.clearButton}
                title="Limpar busca"
              >
                ✕
              </button>
            )}
            {!selectedDistribuidor && (
              <button
                type="button"
                onClick={handleNavigateToCategoria}
                className={styles.searchButton}
                title="Buscar"
              >
                <Search size={18} />
              </button>
            )}

            {/* Dropdown de sugestões */}
            {showDropdown && searchDistribuidor && filteredDistribuidores.length > 0 && (
              <ul className={styles.dropdownList}>
                {filteredDistribuidores.map((dist) => (
                  <li
                    key={dist.id}
                    onClick={() => handleSelectDistribuidor(dist)}
                    className={styles.dropdownItem}
                  >
                    <Package size={16} />
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

          <button
            type="button"
            onClick={() => navigate('/assistencia/loja')}
            className={styles.viewAllButton}
            title="Ver todos os produtos"
          >
            <ShoppingCart size={18} />
            Ver Todos
          </button>
        </div>
      </div>

      {/* Categorias como Pills/Badges Clicáveis */}
      <div className={styles.categoriasSection}>
        <span className={styles.categoriasLabel}>Categorias:</span>
        <div className={styles.carouselWrapper}>
          <button className={styles.navButton} onClick={() => handleScroll(-250)}>
            <ChevronLeft size={18} />
          </button>
          <div ref={carouselRef} className={styles.categoriasPills}>
            {segmentos.map((segmento) => {
              const IconeSegmento = getIconeSegmento(segmento.nome);
              return (
                <button
                  key={segmento.id}
                  className={`${styles.categoriaPill} ${selectedSegmento === segmento.id ? styles.pillActive : ''}`}
                  onClick={() => {
                    setSelectedSegmento(segmento.id);
                  }}
                >
                  <IconeSegmento size={16} />
                  <span>{segmento.nome}</span>
                </button>
              );
            })}
          </div>
          <button className={styles.navButton} onClick={() => handleScroll(250)}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Separador Visual */}
      <div className={styles.divider}></div>

      {/* Seção de Últimos Pedidos e Favoritos - CARROSSEL HORIZONTAL ESTILO IFOOD */}
      <div className={styles.distribuidoresSection}>
        {/* Últimos Pedidos - CARROSSEL */}
        <div className={styles.distribuidorCard}>
          <h3 className={styles.colunaTitulo}>
            <Clock size={20} />
            Últimos Pedidos
          </h3>
          {isLoadingPedidos ? (
            <div className={styles.carrosselWrapper}>
              <p className={styles.listaVazia}>Carregando...</p>
            </div>
          ) : ultimosPedidos.length > 0 ? (
            <div className={styles.carrosselWrapper}>
              <div className={styles.carrosselScroll}>
                {ultimosPedidos.map((item) => (
                  <div
                    key={item.id}
                    className={styles.distribuidorItem}
                    onClick={handleClickUltimoPedido}
                    style={{ cursor: 'pointer' }}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleClickUltimoPedido();
                      }
                    }}
                    title={`Ir para ${segmentos.find(s => s.id === selectedSegmento)?.nome || 'produtos'}`}
                  >
                    {/* Logo circular */}
                    <div className={styles.distribuidorLogo}>
                      <Package size={28} />
                    </div>
                    {/* Info do distribuidor */}
                    <div className={styles.distribuidorInfo}>
                      <span className={styles.distribuidorNome}>{item.fornecedor}</span>
                      <span className={styles.distribuidorCategoria}>
                        {selectedSegmento ? segmentos.find(s => s.id === selectedSegmento)?.nome : 'Produtos'}
                      </span>
                    </div>
                    {/* Ícone de relógio */}
                    <button className={styles.favoritoBtn} onClick={(e) => e.stopPropagation()}>
                      <Clock size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.carrosselWrapper}>
              <p className={styles.listaVazia}>
                {userId
                  ? 'Você ainda não fez nenhum pedido.'
                  : 'Faça login para ver seus pedidos.'}
              </p>
            </div>
          )}
        </div>

        {/* Distribuidores Favoritos - CARROSSEL */}
        <div className={styles.distribuidorCard}>
          <h3 className={styles.colunaTitulo}>
            <Star size={20} />
            Favoritos do Segmento
          </h3>
          {isLoadingFavoritos ? (
            <div className={styles.carrosselWrapper}>
              <p className={styles.listaVazia}>Carregando...</p>
            </div>
          ) : distribuidoresFavoritos.length > 0 ? (
            <div className={styles.carrosselWrapper}>
              <div className={styles.carrosselScroll}>
                {distribuidoresFavoritos.map((dist) => (
                  <div
                    key={dist.id}
                    className={styles.distribuidorItem}
                    onClick={() => handleClickFavorito(dist)}
                    style={{ cursor: 'pointer' }}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleClickFavorito(dist);
                      }
                    }}
                    title={`Ver produtos de ${dist.nome}`}
                  >
                    {/* Logo circular */}
                    <div className={styles.distribuidorLogo}>
                      <Star size={28} fill="currentColor" />
                    </div>
                    {/* Info do distribuidor */}
                    <div className={styles.distribuidorInfo}>
                      <span className={styles.distribuidorNome}>{dist.nome}</span>
                      <span className={styles.distribuidorCategoria}>
                        {selectedSegmento ? segmentos.find(s => s.id === selectedSegmento)?.nome : 'Produtos'}
                      </span>
                    </div>
                    {/* Ícone de estrela preenchida (favorito) */}
                    <button className={`${styles.favoritoBtn} ${styles.favorited}`} onClick={(e) => e.stopPropagation()}>
                      <Star size={16} fill="currentColor" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.carrosselWrapper}>
              <p className={styles.listaVazia}>
                {userId
                  ? 'Nenhum favorito neste segmento ainda.'
                  : 'Faça login para ver favoritos.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BuscaSegmentada;