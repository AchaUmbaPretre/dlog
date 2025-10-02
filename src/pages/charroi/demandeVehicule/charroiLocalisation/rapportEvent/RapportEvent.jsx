import React, { useEffect, useState } from 'react';
import { getEventRow } from '../../../../../services/eventService';
import { Table, Space, Typography, Spin, Button, DatePicker, notification, Tag, Collapse } from 'antd';
import moment from 'moment';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import { CheckCircleOutlined, CloseCircleOutlined, ThunderboltOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { Panel } = Collapse;

const RapportEvent = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [dateRange, setDateRange] = useState([moment().startOf('month'), moment().endOf('month')]);

  const fetchData = async (range) => {
    setLoading(true);
    try {
      const params = {
        startDate: range[0].format('YYYY-MM-DD HH:mm:ss'),
        endDate: range[1].format('YYYY-MM-DD HH:mm:ss'),
      };
      const { data } = await getEventRow(params);
      setReportData(data.report || []);
    } catch (error) {
      notification.error({ message: 'Erreur', description: 'Impossible de récupérer les rapports' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(dateRange);
  }, [dateRange]);

  const columns = [
    {
      title: 'Véhicule',
      dataIndex: 'vehicle',
      key: 'vehicle',
      render: (v, record) => (
        <Space>
          <Text strong>{v}</Text>
          <Tag color={record.status === 'connected' ? 'green' : 'red'} icon={record.status === 'connected' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
            {record.status}
          </Tag>
        </Space>
      )
    },
    {
      title: 'Allumages',
      key: 'ignition_on',
      render: (_, record) => <Tag color="green" icon={<CheckCircleOutlined />}>{record.summary.totalIgnitionsOn} démarrages</Tag>
    },
    {
      title: 'Arrêts',
      key: 'ignition_off',
      render: (_, record) => <Tag color="volcano" icon={<CloseCircleOutlined />}>{record.summary.totalIgnitionsOff} arrêts</Tag>
    },
    {
      title: 'Dépassements',
      key: 'overspeed',
      render: (_, record) => <Tag color="orange" icon={<ThunderboltOutlined />}>{record.summary.totalOverspeed}</Tag>
    },
    {
      title: 'Déconnexions (min)',
      key: 'disconnect',
      render: (_, record) => <Tag color="red">{record.summary.totalDisconnectMinutes} min</Tag>
    }
  ];

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      reportData.map(r => ({
        Véhicule: r.vehicle,
        Allumages: r.summary.totalIgnitionsOn,
        Arrêts: r.summary.totalIgnitionsOff,
        Dépassements: r.summary.totalOverspeed,
        'Déconnexions (min)': r.summary.totalDisconnectMinutes,
        Status: r.status
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rapport');
    XLSX.writeFile(workbook, 'rapport.xlsx');
  };

  return (
    <div style={{ padding: 20 }}>
      <Title level={3}>Rapport des événements véhicules</Title>

      <Space style={{ marginBottom: 20 }}>
        <RangePicker
          value={dateRange}
          onChange={dates => dates && setDateRange(dates)}
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
        />
        <Button type="primary" onClick={() => fetchData(dateRange)}>Rafraîchir</Button>
      </Space>

      <Space style={{ marginBottom: 20 }}>
        <Button type="dashed" onClick={exportExcel}>Exporter Excel</Button>
        <CSVLink
          data={reportData.map(r => ({
            Véhicule: r.vehicle,
            Allumages: r.summary.totalIgnitionsOn,
            Arrêts: r.summary.totalIgnitionsOff,
            Dépassements: r.summary.totalOverspeed,
            'Déconnexions (min)': r.summary.totalDisconnectMinutes,
            Status: r.status
          }))}
          filename="rapport.csv"
        >
          <Button>Exporter CSV</Button>
        </CSVLink>
      </Space>

      {loading ? (
        <Spin tip="Chargement des rapports..." size="large" style={{ marginTop: 50 }} />
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={reportData}
            rowKey="vehicle"
            pagination={{ pageSize: 5 }}
            bordered
          />

          <Collapse accordion style={{ marginTop: 20 }}>
            {reportData.map(r => (
              <Panel header={`Détails → ${r.vehicle}`} key={r.vehicle}>
                {r.events.length > 0 ? (
                  <Table
                    columns={[
                      { title: 'Heure', dataIndex: 'time', key: 'time', render: t => moment(t).format('YYYY-MM-DD HH:mm:ss') },
                      { title: 'Type', dataIndex: 'type', key: 'type' },
                      { title: 'Latitude', dataIndex: 'latitude', key: 'latitude' },
                      { title: 'Longitude', dataIndex: 'longitude', key: 'longitude' }
                    ]}
                    dataSource={r.events}
                    rowKey={record => record.time + record.type}
                    pagination={{ pageSize: 5 }}
                    size="small"
                    scroll={{ x: true }}
                  />
                ) : (
                  <Text>Aucun événement enregistré pour cette période.</Text>
                )}

                {r.disconnects.length > 0 && (
                  <div style={{ marginTop: 10 }}>
                    <Text strong>Périodes de déconnexion :</Text>
                    <ul>
                      {r.disconnects.map((d, i) => (
                        <li key={i}>Déconnexion {i + 1} → {d.durationMinutes} minutes</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Panel>
            ))}
          </Collapse>
        </>
      )}
    </div>
  );
};

export default RapportEvent;
