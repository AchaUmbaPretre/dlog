import React from 'react';
import { List, Typography, Space, Tag } from 'antd';
import { CheckCircleOutlined, LogoutOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Text } = Typography;

/**
 * Parse la phrase pour extraire :
 * - véhicule (ex: GTM_ HILUX_8876)
 * - date formatée (ex: 11 Oct 2025, 00:00)
 * - statut (ex: "1 connecté" ou "1 déconnexion de 0 min")
 * - indicateurs de statut pour affichage icône/couleur
 */
const parsePhrase = (phrase) => {
  const vehicleMatch = phrase.match(/^Véhicule\s(.+?)\s\(/);
  const vehicle = vehicleMatch ? vehicleMatch[1].trim() : 'Véhicule inconnu';

  const dateMatch = phrase.match(/\(([^)]+)\)/);
  const rawDate = dateMatch ? dateMatch[1] : null;
  const date = rawDate
    ? moment(rawDate).format('DD MMM YYYY, HH:mm')
    : 'Date inconnue';

  const statusMatch = phrase.split('→')[1]?.trim() || '';

  const isConnected = statusMatch.toLowerCase().includes('connecté');
  const isDisconnected = statusMatch.toLowerCase().includes('déconnexion');

  return { vehicle, date, status: statusMatch, isConnected, isDisconnected };
};

const PhraseItem = ({ phrase }) => {
  const { vehicle, date, status, isConnected, isDisconnected } = parsePhrase(phrase);

  return (
    <List.Item className="phrase-item">
      <Space direction="vertical" size={6} style={{ width: '100%' }}>
        <Text strong className="phrase-vehicle">{vehicle}</Text>
        <Text type="secondary" className="phrase-date">{date}</Text>
        <Tag
          icon={
            isConnected ? <CheckCircleOutlined /> :
            isDisconnected ? <LogoutOutlined /> :
            null
          }
          color={isConnected ? 'success' : isDisconnected ? 'warning' : 'default'}
          className="phrase-tag"
        >
          {status}
        </Tag>
      </Space>
    </List.Item>
  );
};

export default PhraseItem;
