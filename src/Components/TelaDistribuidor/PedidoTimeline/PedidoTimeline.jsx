import React, { useState, useEffect } from 'react';
import { X, Clock, CheckCircle, Package, Truck, MapPin, AlertCircle, PackageSearch, PackageCheck } from 'lucide-react';
import api from '../../../api/api';
import logger from '../../../utils/logger';
import Loader from '../../Shared/Loader/Loader';
import styles from './PedidoTimeline.module.css';

const PedidoTimeline = ({ pedidoId, onClose }) => {
  const [timeline, setTimeline] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const carregarTimeline = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        const response = await api.get(`/api/PedidoTimelines/pedido/${pedidoId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Ordena por data (mais recente primeiro)
        const timelineOrdenada = (response.data || []).sort((a, b) => {
          return new Date(b.dataHoraCriacaoRegistro) - new Date(a.dataHoraCriacaoRegistro);
        });

        setTimeline(timelineOrdenada);
      } catch (err) {
        logger.error('Erro ao carregar timeline:', err);
        setError('Erro ao carregar histórico do pedido');
      } finally {
        setIsLoading(false);
      }
    };

    carregarTimeline();
  }, [pedidoId]);

  const getIconeStatus = (status) => {
    const statusLower = status.toLowerCase();

    if (statusLower.includes('aguardando aceite')) return <AlertCircle size={20} />;
    if (statusLower.includes('aceito') && !statusLower.includes('aguardando')) return <CheckCircle size={20} />;
    if (statusLower.includes('separação')) return <PackageSearch size={20} />;
    if (statusLower.includes('aguardando retirada')) return <PackageCheck size={20} />;
    if (statusLower.includes('trânsito') || statusLower.includes('transito')) return <Truck size={20} />;
    if (statusLower.includes('entregue') || statusLower.includes('concluído') || statusLower.includes('concluido')) return <CheckCircle size={20} />;
    return <Clock size={20} />;
  };

  const getCorStatus = (status) => {
    const statusLower = status.toLowerCase();

    if (statusLower.includes('aguardando aceite')) return '#FF3600'; // Laranja AllMoove
    if (statusLower.includes('aceito') && !statusLower.includes('aguardando')) return '#3B82F6'; // Azul
    if (statusLower.includes('separação')) return '#8B5CF6'; // Roxo
    if (statusLower.includes('aguardando retirada')) return '#F59E0B'; // Âmbar
    if (statusLower.includes('trânsito') || statusLower.includes('transito')) return '#06B6D4'; // Ciano
    if (statusLower.includes('entregue') || statusLower.includes('concluído') || statusLower.includes('concluido')) return '#10B981'; // Verde
    return '#6b7280';
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Histórico do Pedido #{pedidoId}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.modalBody}>
          {isLoading && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <Loader size="lg" text="Carregando histórico..." />
            </div>
          )}

          {error && (
            <div className={styles.error}>
              <p>{error}</p>
            </div>
          )}

          {!isLoading && !error && timeline.length === 0 && (
            <div className={styles.empty}>
              <p>Nenhum histórico encontrado para este pedido.</p>
            </div>
          )}

          {!isLoading && !error && timeline.length > 0 && (
            <div className={styles.timeline}>
              {timeline.map((item, index) => (
                <div key={item.id || index} className={styles.timelineItem}>
                  <div
                    className={styles.timelineIcon}
                    style={{ backgroundColor: getCorStatus(item.situacao) }}
                  >
                    {getIconeStatus(item.situacao)}
                  </div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineHeader}>
                      <h3 className={styles.timelineStatus}>{item.situacao}</h3>
                      <span className={styles.timelineDate}>
                        {new Date(item.dataHoraCriacaoRegistro).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {item.etapa && (
                      <p className={styles.timelineEtapa}>Etapa: {item.etapa}</p>
                    )}
                    {item.usuarioCriacao && (
                      <p className={styles.timelineUser}>
                        Por: {item.usuarioCriacao}
                      </p>
                    )}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className={styles.timelineLine}></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PedidoTimeline;
