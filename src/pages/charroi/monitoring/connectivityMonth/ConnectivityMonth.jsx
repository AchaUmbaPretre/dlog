import React, { useEffect, useState } from 'react';
import { Typography, DatePicker, Table, notification, Spin, Tag } from 'antd';
import moment from 'moment';
import { getConnectivityMonth } from '../../../../services/eventService';

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

  const tableData = devices.map(name => {
    const row = { key: name, device_name: name };
    jours.forEach(j => {
      const match = data.find(item => item.device_name === name && item.jour === j);
      row[j] = match ? match.score_percent : null; // on garde la valeur numérique
    });
    return row;
  });

  // 🔹 Fonction pour choisir la couleur selon le score
  const getScoreColor = (score) => {
    if (score === 25) return 'red';
    if (score === 50) return 'orange';
    if (score === 75) return 'blue';
    if (score === 100) return 'green';
    return 'grey';
  };

  const columns = [
    {
      title: '#',
      render: (text, record, index) => index + 1,
      width: 20,
      fixed: 'left',
    },
    {
      title: 'Véhicule',
      dataIndex: 'device_name',
      fixed: 'left',
      width: 180,
    },
    ...jours.map(j => ({
      title: j,
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
    })),
  ];

  return (
    <div className="rapport-event-container">
      <Title level={3} style={{ marginBottom: 24 }}>
        📅 Rapport de connectivité du mois : {month}
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
        />
      )}
    </div>
  );
};

export default ConnectivityMonth;
