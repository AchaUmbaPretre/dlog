import { useEffect, useState, useMemo } from 'react';
import { Typography, Input, Space, DatePicker, Table, Tag, notification, Spin, Progress } from 'antd';
import moment from 'moment';
import { getConnectivity } from '../../../../../services/eventService';
import './rapportEvent.scss';
import { CarOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const RapportEvent = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState([moment().startOf('day'), moment().endOf('day')]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        startDate: dateRange[0].format('YYYY-MM-DD HH:mm:ss'),
        endDate: dateRange[1].format('YYYY-MM-DD HH:mm:ss'),
      };
      const { data } = await getConnectivity(params);
      setReportData(data);
    } catch (err) {
      notification.error({
        message: 'Erreur de chargement',
        description: "Impossible de récupérer les données du rapport",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const filteredData = useMemo(() => {
    if (!searchText) return reportData;
    return reportData.filter(item =>
      item.device_name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, reportData]);

  const columns = [
    {
      title: 'Véhicule',
      dataIndex: 'device_name',
      key: 'device_name',
      sorter: (a, b) => a.device_name.localeCompare(b.device_name),
      render: text => 
      <strong>
        <CarOutlined style={{ color: '#1890ff', marginRight: 6 }} />
        {text}
      </strong>,
    },
    {
      title: 'Taux de connectivité',
      dataIndex: 'taux_connectivite_pourcent',
      key: 'taux_connectivite_pourcent',
      sorter: (a, b) => a.taux_connectivite_pourcent - b.taux_connectivite_pourcent,
      render: value => (
        <Progress
          percent={Number(value.toFixed(2))}
          size="small"
          strokeColor={value >= 75 ? '#52c41a' : value >= 50 ? '#faad14' : '#f5222d'}
          format={percent => `${percent.toFixed(2)}%`}
        />
      ),
    },
    {
      title: 'Durée dernière déconnexion (min)',
      dataIndex: 'duree_derniere_deconnexion_minutes',
      key: 'duree_derniere_deconnexion_minutes',
      sorter: (a, b) => a.duree_derniere_deconnexion_minutes - b.duree_derniere_deconnexion_minutes,
      render: value => value + ' min',
    },
    {
      title: 'Statut actuel',
      dataIndex: 'statut_actuel',
      key: 'statut_actuel',
      filters: [
        { text: 'Connected', value: 'connected' },
        { text: 'Disconnected', value: 'disconnected' },
      ],
      onFilter: (value, record) => record.statut_actuel === value,
      render: status => (
        <Tag color={status === 'connected' ? 'green' : 'volcano'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  return (
    <div className="rapport-event-container">
      <Title level={3} style={{ marginBottom: 24 }}>
        📊 Rapport des connexions
      </Title>

      <Space
        className="toolbar"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <RangePicker
          value={dateRange}
          onChange={dates => dates && setDateRange(dates)}
          showTime
          format="YYYY-MM-DD HH:mm"
          style={{ marginBottom: 8 }}
        />

        <Input.Search
          placeholder="Rechercher un véhicule"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          allowClear
          style={{ width: 300, marginBottom: 8 }}
        />
      </Space>

      <Spin spinning={loading} tip="Chargement des données...">
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="device_id"
          pagination={{ pageSize: 10 }}
          bordered
          size="middle"
          scroll={{ x: 800 }}
        />
      </Spin>
    </div>
  );
};

export default RapportEvent;
