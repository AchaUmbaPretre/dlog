import React from 'react';
import { Card, Alert, Button, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

export const PerformanceLoader = () => (
  <div style={{ textAlign: 'center', padding: '50px' }}>
    <Card loading={true} />
  </div>
);

export const PerformanceError = ({ error, onReload }) => (
  <div style={{ padding: '24px' }}>
    <Alert
      message="Erreur de chargement"
      description={error}
      type="error"
      showIcon
      action={
        <Button 
          icon={<ReloadOutlined />} 
          onClick={onReload}
          size="small"
        >
          Réessayer
        </Button>
      }
    />
  </div>
);