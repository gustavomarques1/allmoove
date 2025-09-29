import React, { useState, useEffect, useRef } from "react";
import styles from './BuscaSegmentada.module.css';
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Dados de exemplo com mais categorias
const segmentos = [
  { id: 'celular', nome: 'Celular' },
  { id: 'auto', nome: 'Auto' },
  { id: 'telas', nome: 'Telas' },
  { id: 'notebooks', nome: 'Notebooks' },
  { id: 'display', nome: 'Display' },
  { id: 'audio', nome: 'Áudio' },
  { id: 'energia', nome: 'Energia' },
  { id: 'componentes', nome: 'Componentes' },
  { id: 'acessorios', nome: 'Acessórios' },
];

const mockPedidos = [
  { id: 1, distribuidor: "Distribuidor A", produto: "Tela de Reposição para Celular", segmentoId: 'celular' },
  { id: 2, distribuidor: "Distribuidor B", produto: "Pastilhas de Freio Automotivo", segmentoId: 'auto' },
  { id: 3, distribuidor: "Distribuidor A", produto: "Bateria para Smartphone", segmentoId: 'celular' },
  { id: 4, distribuidor: "Distribuidor D", produto: "Tela para Notebook Dell 15\"", segmentoId: 'telas' },
  { id: 5, distribuidor: "Distribuidor B", produto: "Filtro de Óleo para Carro", segmentoId: 'auto' },
  { id: 6, distribuidor: "Distribuidor E", produto: "Teclado para Macbook Pro", segmentoId: 'notebooks' },
  { id: 7, distribuidor: "Distribuidor F", produto: "Carcaça de Notebook HP", segmentoId: 'notebooks' },
  { id: 8, distribuidor: "Distribuidor D", produto: "Display AMOLED para Monitor", segmentoId: 'display' },
];

function BuscaSegmentada() {
  const [selectedSegmento, setSelectedSegmento] = useState('celular'); 
  const [ultimosPedidos, setUltimosPedidos] = useState([]);
  
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const pedidosFiltrados = mockPedidos.filter(p => p.segmentoId === selectedSegmento);
    setUltimosPedidos(pedidosFiltrados);
  }, [selectedSegmento]);

  const handleScroll = (scrollOffset) => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft += scrollOffset;
    }
  };

  const handleNavigateToCategoria = () => {
    if (selectedSegmento) {
      navigate(`/assistencia/loja?categoria=${selectedSegmento}`);
    } else {
      navigate('/loja'); 
    }
  };

  const handleNavigateToAllProducts = () => {
    navigate('/assistencia/loja');
  };

  return (
    <div className={styles.painelContainer}>
      
      {/* Seção do Carrossel */}
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
          {/* <h3 className={styles.colunaTitulo}>Nenhum distribuidor selecionado [selecionar]</h3> */}
          <h3 className={styles.colunaTitulo}>Últimos Pedidos</h3>
          <div className={styles.listaWrapper}>
            {ultimosPedidos.length > 0 ? (
              <ul className={styles.listaPedidos}>
                {ultimosPedidos.map((pedido) => (
                  <li key={pedido.id}>
                    <span>{pedido.distribuidor}</span>
                    <span>{pedido.produto}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.listaVazia}>Nenhum pedido encontrado.</p>
            )}
          </div>
        </div>

        {/* Coluna da direita agora só contém os botões de ação */}
        <div className={styles.distribuidorContainer}>
          <div className={styles.botoesDistribuidor}>
            {/* Botão Primário (com a classe 'primary' adicionada) */}
            <button className={`${styles.botaoAcao} ${styles.primary}`} onClick={handleNavigateToCategoria}>
              Pesquisar por categoria
            </button>
            {/* Botão Secundário */}
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