import React, { useEffect, useState } from 'react';
import { Typography, DatePicker, Table, notification, Spin } from 'antd';
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

  useEffect(() => { fetchData(); }, [month]);

  // 🧩 Transformer les données en format tableau dynamique
  const devices = [...new Set(data.map(item => item.device_name))];
  const jours = [...new Set(data.map(item => item.jour))].sort((a, b) => a - b);

  const tableData = devices.map(name => {
    const row = { key: name, device_name: name };
    jours.forEach(j => {
      const match = data.find(item => item.device_name === name && item.jour === j);
      row[j] = match ? `${match.score_percent}%` : '-';
    });
    return row;
  });

  const columns = [
    {
        title: '#',
        render :(text, record, index) => index + 1,
        width: 60,
    },
    { title: 'Véhicule', dataIndex: 'device_name', fixed: 'left', width: 180 },
    ...jours.map(j => ({
      title: j,
      dataIndex: j,
      align: 'center',
      width: 80,
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
        <Spin />
      ) : (
        <Table
          dataSource={tableData}
          columns={columns}
          scroll={{ x: true }}
          pagination={false}
          bordered
        />
      )}
    </div>
  );
};

export default ConnectivityMonth;
