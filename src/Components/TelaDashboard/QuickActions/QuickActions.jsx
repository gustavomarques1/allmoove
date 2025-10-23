import React from 'react';
import styles from './QuickActions.module.css';
import {
  ShoppingCart,
  Package,
  Truck,
  HeadphonesIcon,
  TrendingUp,
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'novo-pedido',
      icon: ShoppingCart,
      title: 'Novo Pedido',
      description: 'Faça um pedido de peças',
      color: '#ff6b00',
      bgColor: '#fff5f0',
      onClick: () => navigate('/assistencia/loja')
    },
    {
      id: 'rastrear',
      icon: Truck,
      title: 'Rastrear Entrega',
      description: 'Acompanhe seus pedidos',
      color: '#3b82f6',
      bgColor: '#eff6ff',
      onClick: () => {
        const pedidosSection = document.querySelector('[class*="orders-section"]');
        pedidosSection?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    },
    {
      id: 'historico',
      icon: Package,
      title: 'Histórico',
      description: 'Ver pedidos anteriores',
      color: '#10b981',
      bgColor: '#ecfdf5',
      onClick: () => {
        const pedidosSection = document.querySelector('[class*="orders-section"]');
        pedidosSection?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    },
    {
      id: 'suporte',
      icon: HeadphonesIcon,
      title: 'Suporte',
      description: 'Fale com nosso time',
      color: '#8b5cf6',
      bgColor: '#f3f0ff',
      onClick: () => alert('Em breve: Chat de suporte!')
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Ações Rápidas</h3>
        <p className={styles.subtitle}>O que você deseja fazer hoje?</p>
      </div>

      <div className={styles.grid}>
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              className={styles.actionCard}
              onClick={action.onClick}
              style={{ '--action-color': action.color, '--action-bg': action.bgColor }}
              aria-label={`${action.title}: ${action.description}`}
              role="button"
              tabIndex={0}
            >
              <div className={styles.iconWrapper}>
                <Icon size={24} aria-hidden="true" />
              </div>
              <div className={styles.content}>
                <h4 className={styles.actionTitle}>{action.title}</h4>
                <p className={styles.actionDescription}>{action.description}</p>
              </div>
              <div className={styles.arrow} aria-hidden="true">→</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuickActions;