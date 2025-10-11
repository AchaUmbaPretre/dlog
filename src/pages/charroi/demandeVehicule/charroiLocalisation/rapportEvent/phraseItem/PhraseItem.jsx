import React from 'react';
import { List, Typography, Tag } from 'antd';
import { CheckCircleOutlined, LogoutOutlined, CarOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Text } = Typography;

const parsePhrase = (phrase) => {
  const vehicleMatch = phrase.match(/^Véhicule\s(.+?)\s\(/);
  const vehicle = vehicleMatch ? vehicleMatch[1].trim() : 'Véhicule inconnu';

  const dateMatch = phrase.match(/\(([^)]+)\)/);
  const rawDate = dateMatch ? dateMatch[1] : null;
  const date = rawDate
    ? moment(new Date(rawDate)).format('DD MMM YYYY')
    : 'Date inconnue';

  const statusMatch = phrase.split('→')[1]?.trim() || '';
  const isConnected = statusMatch.toLowerCase().includes('connecté');
  const isDisconnected = statusMatch.toLowerCase().includes('déconnexion');

  return { vehicle, date, status: statusMatch, isConnected, isDisconnected };
};

const PhraseItem = ({ phrase, index }) => {
  const { vehicle, date, status, isConnected, isDisconnected } = parsePhrase(phrase);

  return (
    <List.Item className="phrase-item">
      <div className="phrase-line">
        <Text className="phrase-index">{index + 1}.</Text>
        <Text className="phrase-vehicle">
          <CarOutlined style={{ marginRight: 6 }} />
          {vehicle}
        </Text>
        <Text className="phrase-date">📅 {date}</Text>
        <Tag
          icon={
            isConnected ? <CheckCircleOutlined /> :
            isDisconnected ? <LogoutOutlined /> :
            null
          }
          color={isConnected ? 'green' : isDisconnected ? 'orange' : 'default'}
          className="phrase-tag"
        >
          {status}
        </Tag>
      </div>
    </List.Item>
  );
};

export default PhraseItem;
