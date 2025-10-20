import React, { useEffect, useState } from 'react';
import { Table, notification, Spin, Typography } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, BarChartOutlined } from '@ant-design/icons';
import { getConnectivityDetail } from '../../../../../../services/eventService';
import moment from 'moment';

const { Title } = Typography;

// Fonction pour formater la durée
const formatDurations = (minutes) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} j`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} mois`;
  const years = Math.floor(months / 12);
  return `${years} an${years > 1 ? 's' : ''}`;
};

const RapportEventDetail = ({ idDevice, dateRange }) => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deviceName, setDeviceName] = useState('');

  const fetchData = async () => {
    if (!idDevice) return;
    setLoading(true);
    try {
      const params = {
        startDate: dateRange[0].format('YYYY-MM-DD'),
        endDate: dateRange[1].format('YYYY-MM-DD'),
        deviceId: idDevice
      };

      const { data } = await getConnectivityDetail(params);
      setReportData(data);
      if (data.length > 0) setDeviceName(data[0].device_name);
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
  }, [idDevice, dateRange]);

  const columns = [
    {
      title: 'Check Time',
      dataIndex: 'check_time',
      key: 'check_time',
      render: (value) => moment(value).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value) => value === 'connected' 
        ? <CheckCircleOutlined style={{ color: 'green', marginRight: 6 }} /> 
        : <CloseCircleOutlined style={{ color: 'red', marginRight: 6 }} /> + value,
    },
    {
      title: 'Last Connection',
      dataIndex: 'last_connection',
      key: 'last_connection',
      render: (value) => moment(value).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'Downtime',
      dataIndex: 'downtime_minutes',
      key: 'downtime_minutes',
      render: (value) => (
        <span>
          <ClockCircleOutlined style={{ marginRight: 6, color: '#faad14' }} />
          {formatDurations(value)}
        </span>
      ),
    },
    {
      title: 'Snapshots Connectés',
      dataIndex: 'snapshots_connected',
      key: 'snapshots_connected',
      render: (value, record) => (
        <span>
          <BarChartOutlined style={{ marginRight: 6, color: '#1890ff' }} />
          {value} / {record.total_snapshots || 4}
        </span>
      ),
    },
    {
      title: 'Taux Connectivité (%)',
      dataIndex: 'taux_connectivite_pourcent',
      key: 'taux_connectivite_pourcent',
      render: (value) => `${value}%`,
    },
    {
      title: 'Score Journalier (%)',
      dataIndex: 'score_journalier',
      key: 'score_journalier',
      render: (value) => `${value}%`,
    },
  ];

  return (
    <div>
      {deviceName && <Title level={4}>{deviceName}</Title>}
      {loading ? (
        <Spin tip="Chargement des données..." />
      ) : (
        <Table
          dataSource={reportData}
          columns={columns}
          rowKey="check_time"
          pagination={{ pageSize: 20 }}
        />
      )}
    </div>
  );
};

export default RapportEventDetail;