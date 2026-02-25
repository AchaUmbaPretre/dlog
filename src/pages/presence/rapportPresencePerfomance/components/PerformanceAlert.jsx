import React from 'react';
import { Alert } from 'antd';

const PerformanceAlert = ({ tauxPresence, employesAbsents }) => {
  if (tauxPresence >= 60) return null;

  return (
    <Alert
      message="Performance critique détectée"
      description={`Le taux de présence global est de ${tauxPresence}%, bien en dessous de l'objectif de 75%. ${employesAbsents} employés sont actuellement absents.`}
      type="error"
      showIcon
      style={{ marginBottom: '16px' }}
    />
  );
};

export default PerformanceAlert;