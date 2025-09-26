import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './TelaEntrega.module.css';
import { ArrowLeft } from 'lucide-react';

import ResumoPedido from './ResumoPedido/ResumoPedido';
import OpcaoEntregaCard from './OperacaoEntregaCard/OpcaoEntregaCard';

// CORREÇÃO: 'icone' agora é um texto simples (string), e não um componente JSX.
const mockOpcoesEntrega = [
  { id: 1, tipo: 'normal', titulo: 'Entrega Normal', descricao: 'Entrega padrão via correios', prazo: '5-7 dias úteis', origem: 'TechParts SP', preco: 25.90, icone: 'truck' },
  { id: 2, tipo: 'urgente', titulo: 'Entrega Urgente', descricao: 'Entrega expressa com motoboy', prazo: '1-2 dias úteis', origem: 'TechParts SP', preco: 51.80, icone: 'zap', tag: 'Urgente' },
];

function TelaEntrega() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const cartItems = useMemo(() => location.state?.cartItems || [], [location.state]);

  const valorProdutos = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  const [opcoesEntrega, setOpcoesEntrega] = useState([]);
  const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);

  useEffect(() => {
    setOpcoesEntrega(mockOpcoesEntrega);
  }, []);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/assistencia/loja'); 
    }
  }, [cartItems, navigate]);

  const handleGoToPayment = () => {
    if (opcaoSelecionada) {
      // Agora o objeto 'opcaoSelecionada' só contém dados simples e pode ser clonado
      navigate('/assistencia/pagamento', { 
        state: { 
          cartItems, 
          opcaoSelecionada 
        } 
      });
    }
  };

  const generateHeaderText = () => {
    if (cartItems.length === 0) return '';
    const namesToShow = cartItems.slice(0, 3).map(item => item.nome);
    const namesString = namesToShow.join(', ');
    const remainingCount = cartItems.length - 3;
    let text = `Para: ${namesString}`;
    if (remainingCount > 0) {
      const plural = remainingCount > 1 ? 'itens' : 'item';
      text += ` e mais ${remainingCount} ${plural}`;
    }
    text += ` (${totalItems}x)`;
    return text;
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <ArrowLeft />
        </button>
        <div className={styles.headerTitle}>
          <h2>Opções de Entrega</h2>
          {cartItems.length > 0 && <p>{generateHeaderText()}</p>}
        </div>
      </header>

      <main className={styles.mainContent}>
        <ResumoPedido 
          valorProdutos={valorProdutos}
          opcaoSelecionada={opcaoSelecionada}
        />
        <div className={styles.optionsList}>
          {opcoesEntrega.map((opcao) => (
            <OpcaoEntregaCard 
              key={opcao.id}
              opcao={opcao}
              isSelected={opcaoSelecionada?.id === opcao.id}
              onSelect={setOpcaoSelecionada}
            />
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <button className={`${styles.actionButton} ${styles.secondary}`} onClick={() => navigate(-1)}>Voltar</button>
        <button 
          className={`${styles.actionButton} ${styles.primary}`} 
          disabled={!opcaoSelecionada}
          onClick={handleGoToPayment}
        >
          Finalizar Pedido
        </button>
      </footer>
    </div>
  );
}

export default TelaEntrega;