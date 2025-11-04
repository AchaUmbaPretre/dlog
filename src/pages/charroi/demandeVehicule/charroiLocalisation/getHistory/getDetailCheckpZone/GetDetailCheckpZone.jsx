import React, { useState, useRef } from 'react';
import { DatePicker, Table, Typography, Tooltip, Tag, Space, Button } from 'antd';
import { CarOutlined, ClockCircleOutlined, ArrowRightOutlined, ArrowLeftOutlined, EnvironmentOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs'; // Assure-toi de l'avoir installé

const { Text } = Typography;

const GetDetailCheckpZone = ({ events = [] }) => {
  // 🔹 States pour recherche et pagination si besoin
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const searchInput = useRef(null);

  // 🔹 Exemple de getColumnSearchProps (tu peux le personnaliser)
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: () => null, // remplacer par ton filtre réel
    filterIcon: () => null,
  });

  const columns = [
    {
      title: '#',
      dataIndex: '#',
      width: 50,
      align: 'center',
      render: (_, __, index) => <strong>{index + 1}</strong>,
    },
    {
      title: 'Véhicule',
      dataIndex: 'vehicule',
      key: 'vehicule',
      ...getColumnSearchProps('vehicule'),
      render: (text) => (
        <Space>
          <CarOutlined style={{ color: '#1890ff', fontSize: 18 }} />
          <span style={{ fontWeight: 600, color: '#0a3d62' }}>{text || 'N/A'}</span>
        </Space>
      ),
    },
    {
      title: 'Zone',
      dataIndex: 'zone',
      key: 'zone',
      ...getColumnSearchProps('zone'),
      render: (text) => <Text>{text || 'N/A'}</Text>,
    },
    {
      title: 'Entrée / Sortie',
      key: 'entry_exit',
      render: (_, record) => (
        <div>
          <div>
            <ArrowRightOutlined style={{ color: '#52c41a', marginRight: 4 }} />
            <span>{record.entree ? dayjs(record.entree).format('DD/MM/YYYY HH:mm') : 'N/A'}</span>
          </div>
          <div>
            {record.sortie ? (
              <>
                <ArrowLeftOutlined style={{ color: '#f5222d', marginRight: 4 }} />
                <span>{dayjs(record.sortie).format('DD/MM/YYYY HH:mm')}</span>
              </>
            ) : (
              <Tag color="#fa8c16">⏳ En cours</Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Depuis zone préc.',
      dataIndex: 'duree_depuis_zone_precedente',
      key: 'duree_depuis_zone_precedente',
      render: (text) => {
        if (!text) return <span>—</span>;

        let color = '#52c41a';
        const match = text.match(/(\d+)h/) || text.match(/(\d+)min/) || text.match(/(\d+)sec/);
        if (match) {
          const value = parseInt(match[1], 10);
          if (text.includes('h') || value > 30) color = '#f5222d';
          else if (value > 15) color = '#fa8c16';
          else if (value > 5) color = '#a0d911';
        }

        return (
          <Tooltip title={text}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <ClockCircleOutlined style={{ color, fontWeight: 'bold' }} />
              <span>{text}</span>
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: 'Durée dans zone',
      dataIndex: 'duree_text',
      key: 'duree_text',
      render: (_, record) => {
        if (record.duree_text === 'En cours') return <Tag color="#fa8c16">En cours</Tag>;
        const totalSeconds = (record.duree_minutes || 0) * 60 + (record.duree_secondes || 0);
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        let color = '#52c41a';
        if (totalSeconds > 1800) color = '#f5222d';
        else if (totalSeconds > 900) color = '#fa8c16';
        else if (totalSeconds > 300) color = '#a0d911';
        const isCheckP = record.zone?.startsWith('CheckP');
        return <Tag color={isCheckP ? color : 'default'}>{`${h > 0 ? h + 'h ' : ''}${m}min ${s}sec`}</Tag>;
      },
    },
    {
      title: 'Distance (km)',
      dataIndex: 'distance_km',
      key: 'distance_km',
      align: 'center',
      render: (value) => {
        if (!value) return <Tag color="gray">N/A</Tag>;
        let color = '#52c41a';
        if (value > 50) color = '#f5222d';
        else if (value > 20) color = '#fa8c16';
        else if (value > 5) color = '#a0d911';
        return <Tag color={color}>{value.toFixed(1)} km</Tag>;
      },
    }
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={events}
        rowKey={(record) => record.id || record.external_id}
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '80', '100'],
          showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} résultats`,
          onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
          onShowSizeChange: (current, size) => setPagination({ current: 1, pageSize: size }),
        }}
        bordered
        size="middle"
      />
    </div>
  );
};

export default GetDetailCheckpZone;
