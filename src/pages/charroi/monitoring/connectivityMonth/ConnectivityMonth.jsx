import React, { useEffect, useState } from 'react';
import { Typography, DatePicker, Table, notification, Spin, Tag, Row, Col, Card } from 'antd';
import moment from 'moment';
import { getConnectivityMonth } from '../../../../services/eventService';
import { CarOutlined } from '@ant-design/icons';
import { ResponsiveHeatMap } from '@nivo/heatmap';

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
      row[j] = match ? match.score_percent : null;
    });
    return row;
  });

  // 🎨 Transformation des données pour le heatmap Nivo
  const heatmapData = devices.map(device => {
    const deviceData = { id: device };
    jours.forEach(day => {
      const match = data.find(item => item.device_name === device && item.jour === day);
      deviceData[day] = match ? match.score_percent : 0;
    });
    return deviceData;
  });

  const heatmapKeys = jours.map(day => day.toString());

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
    },
    {
      title: 'Véhicule',
      dataIndex: 'device_name',
      fixed: 'left',
      width: 180,
      render: (text) => (
        <strong>
          <CarOutlined style={{ color: '#1890ff', marginRight: 6 }} />
          {text}
        </strong>
      )
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
        <>
          {/* Graphique HeatMap */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col span={24}>
              <Card 
                title="📊 Vue d'ensemble de la connectivité" 
                bordered={false}
                style={{ height: 500 }}
              >
                <ResponsiveHeatMap
                  data={heatmapData}
                  keys={heatmapKeys}
                  indexBy="id"
                  margin={{ top: 100, right: 60, bottom: 60, left: 200 }}
                  forceSquare={false}
                  axisTop={{
                    orient: 'top',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -90,
                    legend: '',
                    legendOffset: 36
                  }}
                  axisRight={null}
                  axisBottom={null}
                  axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Véhicules',
                    legendPosition: 'middle',
                    legendOffset: -180
                  }}
                  cellOpacity={1}
                  cellBorderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
                  labelTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                  defs={[
                    {
                      id: 'lines',
                      type: 'patternLines',
                      background: 'inherit',
                      color: 'rgba(0, 0, 0, 0.1)',
                      rotation: -45,
                      lineWidth: 4,
                      spacing: 7
                    }
                  ]}
                  fill={[{ id: 'lines' }]}
                  animate={true}
                  motionStiffness={80}
                  motionDamping={9}
                  hoverTarget="cell"
                  cellHoverOthersOpacity={0.25}
                  colors={[
                    '#f47560', // 0-25% - rouge
                    '#f1e15b', // 25-50% - jaune
                    '#e8a838', // 50-75% - orange
                    '#61cdbb'  // 75-100% - vert
                  ]}
                  minValue={0}
                  maxValue={100}
                  tooltip={({ cell }) => (
                    <div
                      style={{
                        padding: '8px 12px',
                        background: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                      }}
                    >
                      <strong>{cell.serieId}</strong>
                      <br />
                      Jour {cell.data.x}
                      <br />
                      <strong>Score: {cell.data.y}%</strong>
                    </div>
                  )}
                />
              </Card>
            </Col>
          </Row>

          {/* Tableau détaillé */}
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="📋 Détails par jour et véhicule" bordered={false}>
                <Table
                  dataSource={tableData}
                  columns={columns}
                  scroll={{ x: 'max-content' }}
                  pagination={false}
                  bordered
                  size="middle"
                />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default ConnectivityMonth;