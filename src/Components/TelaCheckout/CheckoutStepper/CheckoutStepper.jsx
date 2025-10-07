import React from 'react';
import PropTypes from 'prop-types';
import { ShoppingCart, Truck, CreditCard, CheckCircle } from 'lucide-react';
import styles from './CheckoutStepper.module.css';

const steps = [
  { id: 1, label: 'Carrinho', icon: ShoppingCart },
  { id: 2, label: 'Entrega', icon: Truck },
  { id: 3, label: 'Pagamento', icon: CreditCard },
  { id: 4, label: 'Confirmação', icon: CheckCircle }
];

function CheckoutStepper({ currentStep }) {
  return (
    <div className={styles.stepper}>
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={step.id}>
            <div className={`${styles.step} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}>
              <div className={styles.stepIcon}>
                {isCompleted ? (
                  <CheckCircle size={20} />
                ) : (
                  <Icon size={20} />
                )}
              </div>
              <span className={styles.stepLabel}>{step.label}</span>
            </div>
            {!isLast && (
              <div className={`${styles.stepLine} ${isCompleted ? styles.completed : ''}`}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

CheckoutStepper.propTypes = {
  currentStep: PropTypes.number.isRequired
};

export default CheckoutStepper;
