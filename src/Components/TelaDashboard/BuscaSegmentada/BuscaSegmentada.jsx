import React, { useState, useEffect, useRef } from "react";
import styles from './BuscaSegmentada.module.css';
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Car,
  Monitor,
  Laptop,
  Tv,
  Headphones,
  Battery,
  Cpu,
  Package,
  ShoppingBag,
  Box,
  Clock,
  Star,
  Search,
  ShoppingCart
} from "lucide-react";
import {
  getProdutos,
  getFornecedores,
  getSegmentos,
  getDistribuidoresPorSegmento,
  getUltimosPedidos,
  getDistribuidoresFavoritos
} from '../../../api/produtosServices';
import { useAuth } from '../../../hooks/useAuth';

// Mapeamento de ícones por nome de segmento
const getIconeSegmento = (nome) => {
  const nomeNormalizado = nome.toLowerCase().trim();

  const iconMap = {
    'celulares': Smartphone,
    'celular': Smartphone,
    'smartphones': Smartphone,
    'auto': Car,
    'automotivo': Car,
    'automóvel': Car,
    'telas': Monitor,
    'tela': Monitor,
    'monitores': Monitor,
    'notebooks': Laptop,
    'notebook': Laptop,
    'laptops': Laptop,
    'display': Tv,
    'displays': Tv,
    'audio': Headphones,
    'áudio': Headphones,
    'som': Headphones,
    'energia': Battery,
    'bateria': Battery,
    'baterias': Battery,
    'componentes': Cpu,
    'componente': Cpu,
    'peças': Cpu,
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
  const [useAPI, setUseAPI] = useState(false); // Flag para tentar usar API

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
          setUseAPI(true);
          console.log('✅ Segmentos carregados da API:', segmentosFormatados.length);
        }
      } catch (error) {
        console.log('⚠️ API de segmentos não disponível, usando categorias fallback', error);
        setSegmentos(segmentosFallback);
        setSelectedSegmento(segmentosFallback[0].id);
        setUseAPI(false);
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
          console.log('📦 Distribuidor da API (RAW):', distribuidoresAPI[0]);

          const distribuidoresFormatados = distribuidoresAPI.map(d => ({
            id: d.idDistribuidor || d.id || d.idPessoa,
            nome: d.nome || d.razaoSocial || d.nomeFantasia || 'Sem nome'
          }));
          setDistribuidoresDisponiveis(distribuidoresFormatados);
          console.log(`✅ Distribuidores do segmento ${selectedSegmento}:`, distribuidoresAPI.length);
          console.log('📋 Lista de distribuidores formatados:', distribuidoresFormatados);
        } else {
          // Fallback: tenta API de fornecedores genérica
          console.log('⚠️ Nenhum distribuidor encontrado no segmento, tentando API genérica');
          const fornecedoresAPI = await getFornecedores();
          if (fornecedoresAPI && fornecedoresAPI.length > 0) {
            setDistribuidoresDisponiveis(
              fornecedoresAPI.map(f => ({ id: f, nome: f }))
            );
            console.log('✅ Fornecedores carregados da API genérica:', fornecedoresAPI.length);
          }
        }
      } catch (error) {
        console.log('⚠️ Erro ao buscar distribuidores, usando dados estáticos', error);
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
      console.log(`\n🔍 Buscando últimos pedidos do segmento ${selectedSegmento} para assistência ${userId}`);

      try {
        // API com filtro por segmento: /api/Pedidos/ultimos-produtos/{idAssistencia}/segmento/{idSegmento}
        const response = await fetch(`https://localhost:44370/api/Pedidos/ultimos-produtos/${userId}/segmento/${selectedSegmento}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error(`API retornou status ${response.status}`);
        }

        const produtosAPI = await response.json();

        if (produtosAPI && produtosAPI.length > 0) {
          console.log(`✅ ${produtosAPI.length} produtos encontrados no segmento ${selectedSegmento}`);

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
          console.log('⚠️ Nenhum produto encontrado neste segmento');
          setUltimosPedidos([]);
        }
      } catch (error) {
        console.error('❌ Erro ao carregar últimos pedidos:', error);
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
      console.log(`\n🔍 Buscando favoritos para segmento ${selectedSegmento} e assistência ${userId}`);

      try {
        const favoritosAPI = await getDistribuidoresFavoritos(selectedSegmento, userId);

        if (favoritosAPI && favoritosAPI.length > 0) {
          console.log(`✅ Distribuidores favoritos:`, favoritosAPI);

          // Transforma para formato de exibição
          const favoritosFormatados = favoritosAPI.slice(0, 5).map(dist => ({
            id: dist.idDistribuidor,
            nome: dist.nome,
            cpfCnpj: dist.cpfCnpj,
            idSegmento: dist.idSegmento
          }));

          setDistribuidoresFavoritos(favoritosFormatados);
        } else {
          console.log('⚠️ Nenhum distribuidor favorito neste segmento');
          setDistribuidoresFavoritos([]);
        }
      } catch (error) {
        console.error('❌ Erro ao carregar favoritos:', error);
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

    console.log('🔍 Navegando para loja com filtros:', url);
    navigate(url);
  };

  const handleNavigateToAllProducts = () => {
    navigate('/assistencia/loja');
  };

  // Filtra fornecedores baseado na busca
  const filteredDistribuidores = distribuidoresDisponiveis.filter(dist =>
    dist.nome.toLowerCase().includes(searchDistribuidor.toLowerCase())
  );

  // Debug temporário
  if (searchDistribuidor) {
    console.log('🔍 Buscando:', searchDistribuidor);
    console.log('📦 Distribuidores disponíveis:', distribuidoresDisponiveis);
    console.log('✅ Filtrados:', filteredDistribuidores);
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
          {segmentos.map((segmento) => {
            const IconeSegmento = getIconeSegmento(segmento.nome);
            return (
              <button
                key={segmento.id}
                className={`${styles.segmentoBotao} ${selectedSegmento === segmento.id ? styles.selecionado : ''}`}
                onClick={() => setSelectedSegmento(segmento.id)}
              >
                <IconeSegmento size={18} className={styles.segmentoIcon} />
                <span>{segmento.nome}</span>
              </button>
            );
          })}
        </div>
        <button className={styles.navButton} onClick={() => handleScroll(250)}>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Seção de Interação - DUAS COLUNAS */}
      <div className={styles.interacaoContainer}>
        {/* COLUNA ESQUERDA: Últimos Pedidos + Favoritos (empilhados) */}
        <div className={styles.colunaEsquerda}>
          {/* Últimos Pedidos */}
          <div className={styles.pedidosContainer}>
            <h3 className={styles.colunaTitulo}>
              <Clock size={20} />
              Últimos Pedidos
            </h3>
            <div className={styles.listaWrapper}>
              {isLoadingPedidos ? (
                <p className={styles.listaVazia}>Carregando...</p>
              ) : ultimosPedidos.length > 0 ? (
                <ul className={styles.listaPedidos}>
                  {ultimosPedidos.map((item) => (
                    <li key={item.id}>
                      {/* Exibe "FORNECEDOR - PRODUTO" em uma única linha */}
                      <span>{item.fornecedor}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.listaVazia}>
                  {userId
                    ? 'Você ainda não fez nenhum pedido.'
                    : 'Faça login para ver seus pedidos.'}
                </p>
              )}
            </div>
          </div>

          {/* Distribuidores Favoritos */}
          <div className={styles.pedidosContainer}>
            <h3 className={styles.colunaTitulo}>
              <Star size={20} />
              Favoritos do Segmento
            </h3>
            <div className={styles.listaWrapper}>
              {isLoadingFavoritos ? (
                <p className={styles.listaVazia}>Carregando...</p>
              ) : distribuidoresFavoritos.length > 0 ? (
                <ul className={styles.listaPedidos}>
                  {distribuidoresFavoritos.map((dist) => (
                    <li key={dist.id}>
                      <span>{dist.nome}</span>
                      <span>{dist.cpfCnpj}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.listaVazia}>
                  {userId
                    ? 'Nenhum favorito neste segmento ainda.'
                    : 'Faça login para ver favoritos.'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA - Seleção de Distribuidor e Ações */}
        <div className={styles.distribuidorContainer}>
          {/* Busca de Distribuidor com Autocomplete */}
          <div className={styles.distribuidorSelector} ref={searchInputRef}>
            <label htmlFor="distribuidor-search" className={styles.distribuidorLabel}>
              <Search size={18} />
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
              <Search size={18} />
              Pesquisar por categoria
            </button>
            <button className={styles.botaoAcao} onClick={handleNavigateToAllProducts}>
              <ShoppingCart size={18} />
              Todos os Produtos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuscaSegmentada;