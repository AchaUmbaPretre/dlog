import React, { useEffect, useState } from 'react';
import { Typography, DatePicker, Table, notification, Spin, Tag } from 'antd';
import moment from 'moment';
import 'moment/locale/fr'; // Import du locale français
import { getConnectivityMonth } from '../../../../services/eventService';
import { CarOutlined } from '@ant-design/icons';

const { Title } = Typography;

const ConnectivityMonth = () => {
  const [month, setMonth] = useState(moment().format('YYYY-MM'));
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getConnectivityMonth(month);
      setData(data);
    } catch (err) {
      notification.error({
        message: 'Erreur de chargement',
        description: "Impossible de récupérer les données du rapport mensuel",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [month]);

  // 🧩 Transformation des données pour le tableau
  const devices = [...new Set(data.map(item => item.device_name))];
  const jours = [...new Set(data.map(item => item.jour))].sort((a, b) => a - b);

  // 🔹 Fonction pour formater les jours avec le mois abrégé
  const formatDayWithMonth = (day) => {
    const monthYear = moment(month, 'YYYY-MM');
    const fullDate = monthYear.date(parseInt(day));
    return fullDate.format('MMM D'); // Format: "janv. 12", "févr. 13", etc.
  };

  // 🔹 Fonction pour obtenir la date complète pour le tri
  const getFullDate = (day) => {
    const monthYear = moment(month, 'YYYY-MM');
    return monthYear.date(parseInt(day)).valueOf(); // Timestamp pour le tri
  };

  const tableData = devices.map(name => {
    const row = { key: name, device_name: name };
    jours.forEach(j => {
      const match = data.find(item => item.device_name === name && item.jour === j);
      row[j] = match ? match.score_percent : null;
    });
    return row;
  });

  // 🔹 Fonction pour choisir la couleur selon le score
  const getScoreColor = (score) => {
    if (score === 25) return 'red';
    if (score === 50) return 'orange';
    if (score === 75) return 'blue';
    if (score === 100) return 'green';
    return 'default';
  };

  const columns = [
    {
      title: '#',
      render: (text, record, index) => index + 1,
      width: 20,
      fixed: 'left',
      sorter: (a, b) => a.key.localeCompare(b.key),
    },
    {
      title: 'Véhicule',
      dataIndex: 'device_name',
      fixed: 'left',
      width: 180,
      render: (text, record) => (
        <strong>
          <CarOutlined style={{ color: '#1890ff', marginRight: 6 }} />
          {text}
        </strong>
      ),
      sorter: (a, b) => a.device_name.localeCompare(b.device_name),
      defaultSortOrder: 'ascend',
    },
    ...jours.map(j => ({
      title: formatDayWithMonth(j),
      dataIndex: j,
      align: 'center',
      width: 80,
      render: (value) =>
        value !== null ? (
          <Tag color={getScoreColor(value)} style={{ fontWeight: 'bold' }}>
            {value}%
          </Tag>
        ) : (
          '-'
        ),
      sorter: (a, b) => {
        // Tri numérique pour les scores
        const valA = a[j] !== null ? a[j] : -1; // Les valeurs null en dernier
        const valB = b[j] !== null ? b[j] : -1;
        return valA - valB;
      },
      sortDirections: ['ascend', 'descend'],
    })),
  ];

  return (
    <div className="rapport-event-container">
      <Title level={3} style={{ marginBottom: 24 }}>
        📅 Rapport de connectivité du mois : {moment(month, 'YYYY-MM').format('MMMM YYYY')}
      </Title>

      <DatePicker
        picker="month"
        defaultValue={moment()}
        onChange={(date) => setMonth(date.format('YYYY-MM'))}
        style={{ marginBottom: 24 }}
      />

      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          dataSource={tableData}
          columns={columns}
          scroll={{ x: 'max-content' }}
          pagination={false}
          bordered
          size="middle"
          // Option pour permettre le tri multiple avec Shift+click
          sortDirections={['ascend', 'descend']}
        />
      )}
    </div>
  );
};

export default ConnectivityMonth;