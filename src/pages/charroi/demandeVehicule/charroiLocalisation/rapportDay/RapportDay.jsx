import React, { useEffect, useState, useRef } from 'react';
import { Table, Space, Typography, Spin, Button, Tag, notification } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import html2pdf from 'html2pdf.js';
import { getEventRapportDay } from '../../../../../services/eventService';
import moment from 'moment';
import './rapportDay.scss';

const { Title, Text } = Typography;

const RapportDay = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const reportRef = useRef();

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getEventRapportDay();
      setReportData(data || []);
    } catch (error) {
      console.error(error);
      notification.error({
        message: 'Erreur',
        description: 'Impossible de récupérer les rapports du jour'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Comptage connecté / déconnecté
  const connectedCount = reportData.filter(r => r.status === 'connected').length;
  const disconnectedCount = reportData.filter(r => r.status !== 'connected').length;

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      reportData.map(r => ({
        'Nom Véhicule': r.device_name,
        'Dernière Connexion': moment(r.last_connection).format('YYYY-MM-DD HH:mm:ss'),
        Status: r.status.toUpperCase()
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'RapportDay');
    XLSX.writeFile(workbook, 'rapport_day.xlsx');
  };

  const exportPDF = () => {
    if (!reportRef.current) return;
    html2pdf()
      .from(reportRef.current)
      .set({ margin: 10, filename: 'rapport_day.pdf', html2canvas: { scale: 2 } })
      .save();
  };

  const columns = [
    {
      title: 'Nom Véhicule',
      dataIndex: 'device_name',
      key: 'device_name',
      render: text => <span className="vehicle-name">{text}</span>
    },
    {
      title: 'Dernière Connexion',
      dataIndex: 'last_connection',
      key: 'last_connection',
      render: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag
          className={`status-tag ${status}`}
          icon={status === 'connected' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
        >
          {status.toUpperCase()}
        </Tag>
      )
    }
  ];

  return (
    <div className="rapport-day-container" ref={reportRef}>
      <Title level={3} className="main-title">📋 Rapport du jour</Title>

      <Space size="large" className="status-summary">
        <Text strong style={{ color: '#52c41a' }}>Connectés: {connectedCount}</Text>
        <Text strong style={{ color: '#f5222d' }}>Non connectés: {disconnectedCount}</Text>
      </Space>

      <Space style={{ margin: '20px 0' }}>
        <Button type="primary" onClick={fetchData}>Rafraîchir</Button>
        <Button type="dashed" onClick={exportExcel}>Exporter Excel</Button>
        <Button type="default" onClick={exportPDF}>Exporter PDF</Button>
        <CSVLink
          data={reportData.map(r => ({
            'Nom Véhicule': r.device_name,
            'Dernière Connexion': moment(r.last_connection).format('YYYY-MM-DD HH:mm:ss'),
            Status: r.status.toUpperCase()
          }))}
          filename="rapport_day.csv"
        >
          <Button>Exporter CSV</Button>
        </CSVLink>
      </Space>

      {loading ? (
        <Spin tip="Chargement..." size="large" className="loading-spinner" />
      ) : (
        <Table
          columns={columns}
          dataSource={reportData}
          rowKey="device_id"
          bordered
          pagination={{ pageSize: 8 }}
          className="main-table"
        />
      )}
    </div>
  );
};

export default RapportDay;
