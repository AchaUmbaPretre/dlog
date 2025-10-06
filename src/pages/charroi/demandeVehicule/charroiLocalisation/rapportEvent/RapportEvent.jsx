import React, { useEffect, useState } from 'react';
import { getEventRow } from '../../../../../services/eventService';
import { Table, Space, Typography, Tabs, Spin, Button, DatePicker, notification, Tag, Collapse } from 'antd';
import moment from 'moment';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import { CheckCircleOutlined, CloseCircleOutlined, ThunderboltOutlined, CarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import './rapportEvent.scss';
import RapportDay from '../rapportDay/RapportDay';
import RapportDevice from '../rapportDevice/RapportDevice';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { Panel } = Collapse;
const { TabPane } = Tabs;

const RapportEvent = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [dateRange, setDateRange] = useState([moment().startOf('month'), moment().endOf('month')]);
  const [activeKey, setActiveKey] = useState('1');

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
          <Text className="vehicle-name">{v}</Text>
          <Tag className={`status-tag ${record.status}`} icon={record.status === 'connected' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
            {record.status.toUpperCase()}
          </Tag>
        </Space>
      )
    },
    { title: 'Allumages', key: 'ignition_on', render: (_, record) => <Tag className="green-tag" icon={<CheckCircleOutlined />}>{record.summary.totalIgnitionsOn} démarrages</Tag> },
    { title: 'Arrêts', key: 'ignition_off', render: (_, record) => <Tag className="volcano-tag" icon={<CloseCircleOutlined />}>{record.summary.totalIgnitionsOff} arrêts</Tag> },
    { title: 'Dépassements', key: 'overspeed', render: (_, record) => <Tag className="orange-tag" icon={<ThunderboltOutlined />}>{record.summary.totalOverspeed}</Tag> },
/*     { title: 'Déconnexions (min)', key: 'disconnect', render: (_, record) => <Tag className="red-tag">{record.summary.totalDisconnectMinutes} min</Tag> }
 */  ];

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
    <>
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        type="card"
        tabPosition="top"
        tabBarGutter={24}
        className="rapport_tabs"
      >
        <TabPane
          tab={
            <span>
              <CarOutlined style={{ color: '#1890ff', marginRight: 8 }} /> Rapport véhicules
            </span>
          }
          key="1"
        >
          <div className="rapport-container">
            <Title level={2} className="main-title">📊 Rapport des événements véhicules</Title>

            <Space className="filter-bar">
              <RangePicker
                value={dateRange}
                onChange={dates => dates && setDateRange(dates)}
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
              />
              <Button type="primary" onClick={() => fetchData(dateRange)}>Rafraîchir</Button>
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
              <Spin tip="Chargement des rapports..." size="large" className="loading-spinner" />
            ) : (
              <>
                <Table
                  columns={columns}
                  dataSource={reportData}
                  rowKey="vehicle"
                  pagination={{ pageSize: 5 }}
                  bordered
                  className="main-table"
                />

                <Collapse accordion className="details-collapse">
                  {reportData.map(r => (
                    <Panel
                      header={<><ClockCircleOutlined style={{ color: '#faad14', marginRight: 5 }} /> Détails → {r.vehicle}</>}
                      key={r.vehicle}
                    >
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
                      ) : <Text>Aucun événement enregistré pour cette période.</Text>}

                      {r.disconnects.length > 0 && (
                        <div className="disconnect-section">
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
        </TabPane>

{/*         <TabPane
          tab={
            <span>
              <ClockCircleOutlined style={{ color: '#faad14', marginRight: 8 }} /> Rapport par jour
            </span>
          }
          key="2"
        >
          <RapportDay/>
        </TabPane> */}

        <TabPane
          tab={
            <span>
              <ClockCircleOutlined style={{ color: '#faad14', marginRight: 8 }} /> Rapport Device
            </span>
          }
          key="3"
        >
          <RapportDevice/>
        </TabPane>
      </Tabs>
    </>
  );
};

export default RapportEvent;
