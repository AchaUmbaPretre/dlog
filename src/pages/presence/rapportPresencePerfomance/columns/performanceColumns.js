import React from 'react';
import { 
  Space, 
  Text, 
  Tag, 
  Avatar, 
  Tooltip, 
  Badge, 
  Progress 
} from 'antd';
import { 
  BuildOutlined, 
  ExclamationCircleOutlined, 
  TeamOutlined, 
  UserOutlined, 
  FieldTimeOutlined 
} from '@ant-design/icons';

const { Text } = Typography;

// Colonnes pour le tableau des sites
export const columnsSites = [
  {
    title: 'Site',
    dataIndex: 'site_nom',
    key: 'site',
    render: (text, record) => (
      <Space>
        <BuildOutlined style={{ color: '#1890ff' }} />
        <Text strong>{text || 'N/A'}</Text>
        {record?.performance < 50 && (
          <Tooltip title="Site en difficulté">
            <ExclamationCircleOutlined style={{ color: '#f5222d' }} />
          </Tooltip>
        )}
      </Space>
    )
  },
  {
    title: 'Présence',
    dataIndex: 'taux_presence',
    key: 'presence',
    render: (value) => {
      const val = value || 0;
      const color = val >= 75 ? '#52c41a' : val >= 50 ? '#faad14' : '#f5222d';
      return (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong style={{ color }}>{val}%</Text>
          <Progress 
            percent={val} 
            size="small" 
            showInfo={false}
            strokeColor={color}
            trailColor="#f0f0f0"
          />
        </Space>
      );
    }
  },
  {
    title: 'Retards',
    dataIndex: 'total_retards',
    key: 'retards',
    render: (value, record) => {
      const retards = value || 0;
      return (
        <Space>
          <Badge 
            count={retards} 
            style={{ backgroundColor: retards > 10 ? '#f5222d' : '#faad14' }}
            overflowCount={999}
          />
          <Tooltip title="Retard moyen">
            <Text type="secondary" style={{ fontSize: 12 }}>
              ({(record?.retard_moyen || 0).toFixed(0)} min)
            </Text>
          </Tooltip>
        </Space>
      );
    }
  },
  {
    title: 'Performance',
    dataIndex: 'performance',
    key: 'performance',
    render: (value) => {
      const val = value || 0;
      let color = 'success';
      if (val < 50) color = 'error';
      else if (val < 75) color = 'warning';
      
      return (
        <Tag color={color}>
          {val}%
        </Tag>
      );
    }
  },
  {
    title: 'Effectifs',
    key: 'effectifs',
    render: (record) => (
      <Space>
        <TeamOutlined style={{ color: '#1890ff' }} />
        <Text type="secondary">
          {record?.employes_presents || 0}/{record?.employes_total || 0}
        </Text>
      </Space>
    )
  }
];

// Colonnes pour le tableau des top performeurs
export const columnsTop = [
  {
    title: 'Employé',
    dataIndex: 'nom',
    key: 'nom',
    render: (text, record) => (
      <Space>
        <Avatar 
          icon={<UserOutlined />} 
          style={{ backgroundColor: '#87d068' }}
        />
        <div>
          <Text strong>{record?.prenom || ''} {record?.nom || ''}</Text>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>{record?.site || 'N/A'}</Text>
          </div>
        </div>
      </Space>
    )
  },
  {
    title: 'Présence',
    dataIndex: 'taux_presence',
    key: 'tauxPresence',
    render: (value) => (
      <Tag color="success">{value || 0}%</Tag>
    )
  },
  {
    title: 'Retard',
    dataIndex: 'retard_moyen',
    key: 'retardMoyen',
    render: (value) => (
      <Text type="secondary">
        <FieldTimeOutlined /> {value || 0} min
      </Text>
    )
  },
  {
    title: 'Heures sup',
    dataIndex: 'heures_sup',
    key: 'heuresSup',
    render: (value) => (
      <Text type="secondary">{value || 0}h</Text>
    )
  }
];

// Colonnes pour le tableau des agents à problème
export const columnsProbleme = [
  {
    title: 'Employé',
    dataIndex: 'nom',
    key: 'nom',
    render: (text, record) => (
      <Space>
        <Avatar 
          icon={<UserOutlined />} 
          style={{ backgroundColor: '#f5222d' }}
        />
        <div>
          <Text strong>{record?.prenom || ''} {record?.nom || ''}</Text>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>{record?.site || 'N/A'}</Text>
          </div>
        </div>
      </Space>
    )
  },
  {
    title: 'Présence',
    dataIndex: 'taux_presence',
    key: 'tauxPresence',
    render: (value) => (
      <Tag color="error">{value || 0}%</Tag>
    )
  },
  {
    title: 'Retards',
    dataIndex: 'jours_retard',
    key: 'joursRetard',
    render: (value, record) => (
      <Tooltip title={`Total: ${record?.total_minutes_retard || 0} min`}>
        <Badge 
          count={value || 0} 
          style={{ backgroundColor: '#f5222d' }} 
          overflowCount={999}
        />
      </Tooltip>
    )
  },
  {
    title: 'Retard moyen',
    dataIndex: 'retard_moyen',
    key: 'retardMoyen',
    render: (value) => {
      const minutes = value || 0;
      return (
        <Text type="danger">
          {Math.floor(minutes / 60)}h{minutes % 60}
        </Text>
      );
    }
  },
  {
    title: 'Absences',
    dataIndex: 'jours_absence',
    key: 'joursAbsence',
    render: (value) => (
      <Tag color="error">{value || 0}j</Tag>
    )
  }
];