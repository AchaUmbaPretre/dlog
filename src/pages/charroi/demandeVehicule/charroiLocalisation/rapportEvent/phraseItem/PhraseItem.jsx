import { Typography, Tag } from 'antd';
import { CarOutlined, InfoCircleOutlined } from '@ant-design/icons';
import './PhraseItem.scss';

const { Text } = Typography;

const PhraseItem = ({ phrase, index, onDetailClick }) => {
  const [rawIndex, ...rest] = phrase.split('. ');
  const content = rest.join('. ');

  return (
    <div className="phrase-item" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 12px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Tag color="blue">{rawIndex || index + 1}</Tag>
        <CarOutlined style={{ color: '#1890ff' }} />
        <Text>{content}</Text>
      </div>
      
      {/* Icône à droite */}
      <InfoCircleOutlined
        style={{ color: '#1890ff', cursor: 'pointer' }}
        onClick={onDetailClick}
        title="Voir les détails"
      />
    </div>
  );
};

export default PhraseItem;
