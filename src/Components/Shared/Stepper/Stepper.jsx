import React from 'react';
import PropTypes from 'prop-types';
import styles from './Stepper.module.css';
import { Check } from 'lucide-react';

function Stepper({ steps, currentStep }) {
  return (
    <div className={styles.stepper}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;
        const isFuture = stepNumber > currentStep;

        return (
          <div key={step.label} className={styles.stepWrapper}>
            {/* Step Circle */}
            <div
              className={`${styles.stepCircle} ${
                isCompleted ? styles.completed :
                isActive ? styles.active :
                styles.future
              }`}
            >
              {isCompleted ? (
                <Check size={16} strokeWidth={3} />
              ) : (
                <span className={styles.stepNumber}>{stepNumber}</span>
              )}
            </div>

            {/* Step Label */}
            <span
              className={`${styles.stepLabel} ${
                isCompleted || isActive ? styles.labelActive : styles.labelInactive
              }`}
            >
              {step.label}
            </span>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`${styles.connector} ${
                  isCompleted ? styles.connectorCompleted : styles.connectorInactive
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

Stepper.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  currentStep: PropTypes.number.isRequired
};

export default Stepper;
