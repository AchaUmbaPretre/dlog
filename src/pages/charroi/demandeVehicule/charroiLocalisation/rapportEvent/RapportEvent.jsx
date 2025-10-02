import React, { useEffect, useState, useRef } from 'react';
import { getEventRow } from '../../../../../services/eventService';
import { Table, Space, Typography, Spin, Button, DatePicker, notification } from 'antd';
import moment from 'moment';
import html2pdf from 'html2pdf.js';
import HtmlDocx from 'html-docx-js/dist/html-docx';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import './rapportEvent.scss';

const { RangePicker } = DatePicker;
const { Title } = Typography;

const RapportEvent = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const reportRef = useRef();
  const [dateRange, setDateRange] = useState([moment().startOf('month'), moment().endOf('month')]);

  const fetchData = async (range) => {
    setLoading(true);
    try {
      const params = {
        startDate: range[0].format('YYYY-MM-DD HH:mm:ss'),
        endDate: range[1].format('YYYY-MM-DD HH:mm:ss'),
      };
      const { data } = await getEventRow(params);
      setReportData(data);
    } catch (error) {
      console.error(error);
      notification.error({ message: 'Erreur', description: 'Impossible de récupérer les rapports' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(dateRange);
  }, [dateRange]);

  const handleRangeChange = (dates) => {
    if (dates) setDateRange(dates);
  };

  const columns = [
    { title: 'Véhicule', dataIndex: 'vehicle', key: 'vehicle' },
    { title: 'Allumages', dataIndex: 'ignitionCount', key: 'ignitionCount' },
    { title: 'Dépassements vitesse', dataIndex: 'overspeedCount', key: 'overspeedCount' },
    { title: 'Déconnexions (min)', dataIndex: 'disconnects', key: 'disconnects', render: (d) => d.reduce((sum, dd) => sum + dd.durationMinutes, 0) }
  ];

  const exportPDF = () => {
    if (reportRef.current) html2pdf().from(reportRef.current).set({ margin: 10, filename: 'rapport.pdf' }).save();
  };

  const exportWord = () => {
    if (!reportRef.current) return;
    const content = HtmlDocx.asBlob(reportRef.current.innerHTML);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = 'rapport.docx';
    link.click();
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      reportData.map(r => ({
        Véhicule: r.vehicle,
        Allumages: r.ignitionCount,
        'Dépassements vitesse': r.overspeedCount,
        'Déconnexions (min)': r.disconnects.reduce((sum, d) => sum + d.durationMinutes, 0)
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rapport');
    XLSX.writeFile(workbook, 'rapport.xlsx');
  };

  return (
    <div className="rapport-event-container" ref={reportRef}>
      <Title level={3}>Rapport des événements véhicules</Title>

      <Space style={{ marginBottom: 20 }}>
        <RangePicker
          value={dateRange}
          onChange={handleRangeChange}
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
        />
        <Button type="primary" onClick={() => fetchData(dateRange)}>Rafraîchir</Button>
      </Space>

      <Space style={{ marginBottom: 20 }}>
        <Button type="primary" onClick={exportPDF}>Exporter PDF</Button>
        <Button type="default" onClick={exportWord}>Exporter Word</Button>
        <Button type="dashed" onClick={exportExcel}>Exporter Excel</Button>
        <CSVLink
          data={reportData.map(r => ({
            Véhicule: r.vehicle,
            Allumages: r.ignitionCount,
            'Dépassements vitesse': r.overspeedCount,
            'Déconnexions (min)': r.disconnects.reduce((sum, d) => sum + d.durationMinutes, 0)
          }))}
          filename="rapport.csv"
        >
          <Button>Exporter CSV</Button>
        </CSVLink>
      </Space>

      {loading ? (
        <Spin tip="Chargement des rapports..." size="large" style={{ marginTop: 100 }} />
      ) : (
        <Table
          columns={columns}
          dataSource={reportData}
          rowKey="vehicle"
          pagination={{ pageSize: 5 }}
          bordered
        />
      )}
    </div>
  );
};

export default RapportEvent;
