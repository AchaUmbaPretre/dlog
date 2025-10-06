import React, { useEffect, useState } from 'react';
import { Table, Space, Typography, Button, DatePicker, notification, Tag, Spin } from 'antd';
import moment from 'moment';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { getDevices } from '../../../../../services/eventService';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const RapportDevice = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [summary, setSummary] = useState({ connected: 0, disconnected: 0 });

  const columns = [
    { title: 'Device ID', dataIndex: 'device_id', key: 'device_id' },
    { title: 'Nom', dataIndex: 'name', key: 'name' },
    { 
      title: 'Dernière connexion', 
      dataIndex: 'last_seen', 
      key: 'last_seen',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    { 
      title: 'Statut', 
      dataIndex: 'online_status', 
      key: 'online_status',
      render: (status) => (
        <Tag color={status === 'connected' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    { title: 'Latitude', dataIndex: 'latitude', key: 'latitude' },
    { title: 'Longitude', dataIndex: 'longitude', key: 'longitude' },
    {
      title: 'Position',
      key: 'position',
      render: (_, record) => {
        const { latitude, longitude } = record;
        if (!latitude || !longitude) return 'N/A';
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        return (
          <Button type="link" onClick={() => window.open(mapsUrl, '_blank')}>
            Voir sur Maps
          </Button>
        );
      }
    }
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        startDate: dateRange?.[0]?.format('YYYY-MM-DD'),
        endDate: dateRange?.[1]?.format('YYYY-MM-DD'),
        status: statusFilter || undefined,
      };
      const { data } = await getDevices(params);
      setData(data);

      // Calcul du résumé
      const connectedCount = data.filter(d => d.online_status === 'connected').length;
      const disconnectedCount = data.filter(d => d.online_status === 'disconnected').length;
      setSummary({ connected: connectedCount, disconnected: disconnectedCount });

    } catch (error) {
      console.error(error);
      notification.error({ message: 'Erreur', description: 'Impossible de récupérer les devices' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [dateRange, statusFilter]);

  // Colonnes pour export (exclure Device ID, Latitude, Longitude, Position)
  const exportColumns = columns.filter(c => !['device_id','latitude','longitude','position'].includes(c.key));

  const exportExcel = () => {
    const exportData = data.map(d => {
      const obj = {};
      exportColumns.forEach(c => {
        if(c.dataIndex === 'last_seen') obj[c.title] = moment(d[c.dataIndex]).format('YYYY-MM-DD HH:mm:ss');
        else if(c.dataIndex === 'online_status') obj[c.title] = d[c.dataIndex].toUpperCase();
        else obj[c.title] = d[c.dataIndex];
      });
      return obj;
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Devices');
    XLSX.writeFile(wb, 'rapport_devices.xlsx');
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Rapport Devices', 14, 16);
    doc.autoTable({
      startY: 20,
      head: [exportColumns.map(c => c.title)],
      body: data.map(d => exportColumns.map(c => {
        if(c.dataIndex === 'last_seen') return moment(d[c.dataIndex]).format('YYYY-MM-DD HH:mm:ss');
        if(c.dataIndex === 'online_status') return d[c.dataIndex].toUpperCase();
        return d[c.dataIndex];
      }))
    });
    doc.save('rapport_devices.pdf');
  };

  const exportCSV = () => {
    const exportData = data.map(d => {
      const obj = {};
      exportColumns.forEach(c => {
        if(c.dataIndex === 'last_seen') obj[c.title] = moment(d[c.dataIndex]).format('YYYY-MM-DD HH:mm:ss');
        else if(c.dataIndex === 'online_status') obj[c.title] = d[c.dataIndex].toUpperCase();
        else obj[c.title] = d[c.dataIndex];
      });
      return obj;
    });
    return exportData;
  };

  return (
    <div className="rapport_device">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Title level={3}>Rapport des Devices</Title>

        {/* Résumé des statuts */}
        <Space>
          <Text strong>Connectés: </Text>
          <Tag color="green">{summary.connected}</Tag>
          <Text strong>Déconnectés: </Text>
          <Tag color="red">{summary.disconnected}</Tag>
        </Space>

        <Space style={{ marginTop: 10 }}>
          <RangePicker
            value={dateRange}
            onChange={dates => setDateRange(dates)}
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
          />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">Tous les statuts</option>
            <option value="connected">Connecté</option>
            <option value="disconnected">Déconnecté</option>
          </select>
          <Button type="primary" onClick={fetchData}>Filtrer</Button>
          <Button onClick={exportExcel}>Export Excel</Button>
          <Button onClick={exportPDF}>Export PDF</Button>
          <CSVLink data={exportCSV()} filename="rapport_devices.csv">
            <Button>Export CSV</Button>
          </CSVLink>
        </Space>

        {loading ? (
          <Spin tip="Chargement..." size="large" style={{ marginTop: 50 }} />
        ) : (
          <Table
            style={{ marginTop: 20 }}
            columns={columns}
            dataSource={data}
            rowKey="device_id"
            pagination={{ pageSize: 10 }}
          />
        )}
      </Space>
    </div>
  );
};

export default RapportDevice;