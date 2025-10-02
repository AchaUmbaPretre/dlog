import React, { useEffect, useState, useRef } from 'react';
import { getEventRow } from '../../../../../services/eventService';
import { Table, Badge, Collapse, Space, Typography, Spin, Button, notification } from 'antd';
import moment from 'moment';
import html2pdf from 'html2pdf.js';
import HtmlDocx from 'html-docx-js/dist/html-docx';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import './rapportEvent.scss';

const { Panel } = Collapse;
const { Text } = Typography;

const RapportEvent = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const reportRef = useRef();

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getEventRow();
      setReportData(data);
    } catch (error) {
      console.error(error);
      notification.error({ message: 'Erreur', description: 'Impossible de récupérer les rapports' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Table columns
  const columns = [
    {
      title: 'Véhicule',
      dataIndex: 'vehicle',
      key: 'vehicle',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Allumages',
      dataIndex: 'ignitionCount',
      key: 'ignitionCount',
      render: (count) => <Badge count={count} style={{ backgroundColor: '#52c41a' }} />,
    },
    {
      title: 'Dépassements vitesse',
      dataIndex: 'overspeedCount',
      key: 'overspeedCount',
      render: (count) => <Badge count={count} style={{ backgroundColor: '#faad14' }} />,
    },
    {
      title: 'Déconnexions',
      dataIndex: 'disconnects',
      key: 'disconnects',
      render: (disconnects) => (
        <Space direction="vertical">
          {disconnects.map((d, idx) => (
            <Badge
              key={idx}
              color="red"
              text={`${moment(d.from).format('HH:mm')} → ${moment(d.to).format('HH:mm')} (${d.durationMinutes} min)`}
            />
          ))}
        </Space>
      ),
    },
    {
      title: 'Détails',
      key: 'details',
      render: (_, record) => (
        <Collapse>
          <Panel header="Voir détails" key="1">
            {record.details.map((e, i) => (
              <p key={i}>
                {moment(e.time).format('DD-MM-YYYY HH:mm:ss')} | {e.type} | lat:{e.latitude} lon:{e.longitude}
              </p>
            ))}
          </Panel>
        </Collapse>
      ),
    },
  ];

  // Export PDF
  const exportPDF = () => {
    if (!reportRef.current) return;
    html2pdf().from(reportRef.current).set({ margin: 10, filename: 'rapport.pdf' }).save();
  };

  // Export Word
  const exportWord = () => {
    if (!reportRef.current) return;
    const content = HtmlDocx.asBlob(reportRef.current.innerHTML);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = 'rapport.docx';
    link.click();
  };

  // Export Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      reportData.map((r) => ({
        Véhicule: r.vehicle,
        Allumages: r.ignitionCount,
        'Dépassements vitesse': r.overspeedCount,
        Déconnexions: r.disconnects.map((d) => `${d.durationMinutes} min`).join(', '),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rapport');
    XLSX.writeFile(workbook, 'rapport.xlsx');
  };

  return (
    <div className="rapport-event-container" ref={reportRef}>
      <Space style={{ marginBottom: 20 }}>
        <Button type="primary" onClick={exportPDF}>Exporter PDF</Button>
        <Button type="default" onClick={exportWord}>Exporter Word</Button>
        <Button type="dashed" onClick={exportExcel}>Exporter Excel</Button>
        <CSVLink
          data={reportData.map((r) => ({
            Véhicule: r.vehicle,
            Allumages: r.ignitionCount,
            'Dépassements vitesse': r.overspeedCount,
            Déconnexions: r.disconnects.map((d) => `${d.durationMinutes} min`).join(', '),
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
          expandable={{
            expandedRowRender: (record) => (
              <pre style={{ whiteSpace: 'pre-wrap' }}>{record.summary}</pre>
            ),
            rowExpandable: (record) => !!record.details.length,
          }}
        />
      )}
    </div>
  );
};

export default RapportEvent;
