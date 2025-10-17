import { useEffect, useState, useMemo } from 'react';
import { Typography, Input, Tabs, Space, DatePicker, Table, Tag, notification, Spin, Progress } from 'antd';
import moment from 'moment';
import { getConnectivity } from '../../../../../services/eventService';
import './rapportEvent.scss';
import { CarOutlined, DashboardOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { formatDurations } from '../../../../../utils/renderTooltip';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const RapportEvent = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState([moment().startOf('day'), moment().endOf('day')]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });
  const [activeKey, setActiveKey] = useState('1');

  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  const getTabStyle = (key) => ({
        display: 'flex',
        alignItems: 'center',
        color: activeKey === key ? '#1890ff' : 'rgba(0,0,0,0.65)',
        fontWeight: activeKey === key ? '600' : '400',
        transition: 'color 0.3s',
    });

  const iconStyle = (key) => ({
        marginRight: 8,
        fontSize: 18,
        color: activeKey === key ? '#1890ff' : 'rgba(0,0,0,0.45)',
        transform: activeKey === key ? 'scale(1.2)' : 'scale(1)',
        transition: 'transform 0.3s, color 0.3s',
    });

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

  useEffect(() => { fetchData(); }, [dateRange]);

  const filteredData = useMemo(() => {
    if (!searchText) return reportData;
    return reportData.filter(item =>
      item.device_name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, reportData]);

  const columns = [
    { 
      title: '#', 
      dataIndex: 'id', 
      key: 'id', 
      render: (text, record, index) => {
        const pageSize = pagination.pageSize || 10;
        const pageIndex = pagination.current || 1;
        return (pageIndex - 1) * pageSize + index + 1;
      }, 
      width: 50,
    },
    {
      title: 'Véhicule',
      dataIndex: 'device_name',
      key: 'device_name',
      sorter: (a, b) => a.device_name.localeCompare(b.device_name),
      render: text => (
        <strong>
          <CarOutlined style={{ color: '#1890ff', marginRight: 6 }} />
          {text}
        </strong>
      ),
    },
    {
      title: 'M à j (Taux de connectivité)',
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
      title: 'Durée dernière déconnexion',
      dataIndex: 'duree_derniere_deconnexion_minutes',
      key: 'duree_derniere_deconnexion_minutes',
      sorter: (a, b) => a.duree_derniere_deconnexion_minutes - b.duree_derniere_deconnexion_minutes,
      render: value => (
        <span>
          <ClockCircleOutlined style={{ marginRight: 6, color: '#faad14' }} />
          {formatDurations(value)}
        </span>
      ),
    },
    {
      title: 'Statut actuel',
      dataIndex: 'statut_actuel',
      key: 'statut_actuel',
      filters: [
        { text: 'Actif', value: 'connected' },
        { text: 'Inactif', value: 'disconnected' },
      ],
      onFilter: (value, record) => record.statut_actuel === value,
      render: status => {
        const isActive = status === 'connected';
        return (
          <Tag 
            icon={isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />} 
            color={isActive ? 'green' : 'volcano'}
          >
            {isActive ? 'Actif' : 'Inactif'}
          </Tag>
        );
      },
    },
  ];

  return (
    <>
        <Tabs
          activeKey={activeKey}
          onChange={handleTabChange}
          type="card"
          tabPosition="top"
        >
           <Tabs.TabPane
                tab={
                    <span style={getTabStyle('2')}>
                        <DashboardOutlined style={iconStyle('2')} />
                        Monitoring
                    </span>
                }
                key="1"
            >
              <div className="rapport-event-container">
                <Title level={3} style={{ marginBottom: 24 }}>
                  📊 Rapport des connexions du jour
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
                    pagination={{ pageSize: pagination.pageSize, current: pagination.current, showSizeChanger: true }}
                    onChange={pagination => setPagination(pagination)}
                    bordered
                    size="middle"
                    scroll={{ x: 900 }}
                  />
                </Spin>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={
                    <span style={getTabStyle('2')}>
                        <DashboardOutlined style={iconStyle('2')} />
                        Rapport Month
                    </span>
              }
              key="2"
            >
                
            </Tabs.TabPane>
        </Tabs>
    </>
  );
};

export default RapportEvent;
