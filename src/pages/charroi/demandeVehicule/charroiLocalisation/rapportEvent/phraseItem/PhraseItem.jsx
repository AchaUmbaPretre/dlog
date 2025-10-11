// src/pages/charroi/demandeVehicule/charroiLocalisation/rapportEvent/phraseItem/PhraseItem.jsx
import React from 'react';
import { Typography, Tag, Space } from 'antd';
import { CarOutlined } from '@ant-design/icons';
import './PhraseItem.scss';

const { Text } = Typography;

const PhraseItem = ({ phrase, index }) => {
  // Extrait le n° et reformate le reste de la phrase si nécessaire
  const [rawIndex, ...rest] = phrase.split('. ');
  const content = rest.join('. ');

  return (
    <div className="phrase-item">
      <Space align="start" size="middle">
        <Tag color="blue">{rawIndex || index + 1}</Tag>
        <CarOutlined style={{ color: '#1890ff' }} />
        <Text>{content}</Text>
      </Space>
    </div>
  );
};

export default PhraseItem;
