import React from 'react';
import styles from './StatsCards.module.css';
import { Package, CheckCircle, Clock } from 'lucide-react';

function StatsCards({ indicadores, isLoading }) {
  const cards = [
    {
      id: 'total',
      title: 'Total de Pedidos',
      value: indicadores.totalPedidos,
      icon: Package,
      color: '#ff6b00',
      bgColor: '#fff5f0'
    },
    {
      id: 'encerrados',
      title: 'Entregues',
      value: indicadores.pedidosEncerrados,
      icon: CheckCircle,
      color: '#16a34a',
      bgColor: '#ecfdf5'
    },
    {
      id: 'andamento',
      title: 'Em Andamento',
      value: indicadores.pedidosEmAndamento,
      icon: Clock,
      color: '#f59e0b',
      bgColor: '#fef3c7'
    }
  ];

  if (isLoading) {
    return (
      <div className={styles.grid}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.skeleton} />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.id}
              className={styles.card}
              style={{
                '--card-color': card.color,
                '--card-bg': card.bgColor
              }}
            >
              <div className={styles.content}>
                <div className={styles.header}>
                  <div className={styles.iconWrapper}>
                    <Icon size={22} />
                  </div>
                </div>

                <div className={styles.value}>
                  <span className={styles.number}>{card.value}</span>
                  <span className={styles.label}>{card.title}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StatsCards;