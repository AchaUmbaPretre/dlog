import React, { useEffect, useState } from 'react';
import { Table, Typography, Spin, Button, DatePicker, notification, Tag, Input, Space } from 'antd';
import moment from 'moment';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getEventRow } from '../../../../../services/eventService';
import { CheckCircleOutlined, ThunderboltOutlined, CarOutlined } from '@ant-design/icons';
import './rapportEvent.scss';

const { RangePicker } = DatePicker;
const { Title } = Typography;

const RapportEvent = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [months, setMonths] = useState([]);
  const [dateRange, setDateRange] = useState([moment().startOf('day'), moment().endOf('day')]);
  const [searchText, setSearchText] = useState('');

  const fetchData = async (range) => {
    setLoading(true);
    try {
      const params = {
        startDate: range[0].format('YYYY-MM-DD HH:mm:ss'),
        endDate: range[1].format('YYYY-MM-DD HH:mm:ss'),
      };
      const { data } = await getEventRow(params);

      // Extraire tous les mois uniques pour les colonnes
      const monthSet = new Set();
      data.forEach(d => Object.keys(d.months).forEach(m => monthSet.add(m)));
      setMonths(Array.from(monthSet).sort());

      setReportData(data);
    } catch (error) {
      console.error(error);
      notification.error({ message: 'Erreur', description: 'Impossible de récupérer les rapports' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(dateRange); }, [dateRange]);

  const filteredData = reportData.filter(r => r.device_name.toLowerCase().includes(searchText.toLowerCase()));

  const columns = [
    {
      title: 'N°',
      key: 'index',
      render: (_, __, index) => index + 1,
      fixed: 'left',
      width: 50,
      align: 'center'
    },
    {
      title: 'Véhicule',
      dataIndex: 'device_name',
      key: 'device_name',
      fixed: 'left',
      width: 180,
      sorter: (a, b) => a.device_name.localeCompare(b.device_name),
      render: text => (
        <Space>
          <CarOutlined style={{ color: '#1890ff', fontSize: 18 }} />
          <b>{text}</b>
        </Space>
      )
    },
    ...months.map(month => ({
      title: moment(month).format('MMM YYYY'),
      children: [
        {
          title: 'Connexions',
          dataIndex: ['months', month, 'connexions'],
          key: `connexions_${month}`,
          sorter: (a, b) => (a.months[month]?.connexions || 0) - (b.months[month]?.connexions || 0),
          render: (_, record) => (
            <Tag icon={<CheckCircleOutlined />} color="#87d068">
              {record.months[month]?.connexions || 0}
            </Tag>
          )
        },
        {
          title: 'Dépassements',
          dataIndex: ['months', month, 'depassements'],
          key: `depassements_${month}`,
          sorter: (a, b) => (a.months[month]?.depassements || 0) - (b.months[month]?.depassements || 0),
          render: (_, record) => (
            <Tag icon={<ThunderboltOutlined />} color="#fa8c16">
              {record.months[month]?.depassements || 0}
            </Tag>
          )
        },
      ],
    }))
  ];

  const exportExcel = () => {
    const worksheetData = filteredData.map((r, i) => {
      const row = { 'N°': i + 1, Véhicule: r.device_name };
      months.forEach(m => {
        row[`${m} Connexions`] = r.months[m]?.connexions || 0;
        row[`${m} Dépassements`] = r.months[m]?.depassements || 0;
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rapport');
    XLSX.writeFile(workbook, 'rapport.xlsx');
  };

  const exportPDF = () => {
    const input = document.getElementById('rapport-table');
    html2canvas(input, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('rapport.pdf');
    });
  };

  return (
    <div className="rapport-container">
      <Title level={2}>📊 Rapport Véhicules</Title>

      <Space className="filter-bar">
        <RangePicker
          value={dateRange}
          onChange={dates => dates && setDateRange(dates)}
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
        />
        <Input
          placeholder="Rechercher un véhicule"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 220 }}
        />
        <Button type="primary" onClick={() => fetchData(dateRange)}>Rafraîchir</Button>
        <Button type="dashed" onClick={exportExcel}>Exporter Excel</Button>
        <Button type="default" onClick={exportPDF}>Exporter PDF</Button>
        <CSVLink
          data={filteredData.map((r, i) => {
            const row = { 'N°': i + 1, Véhicule: r.device_name };
            months.forEach(m => {
              row[`${m} Connexions`] = r.months[m]?.connexions || 0;
              row[`${m} Dépassements`] = r.months[m]?.depassements || 0;
            });
            return row;
          })}
          filename="rapport.csv"
        >
          <Button>Exporter CSV</Button>
        </CSVLink>
      </Space>

      {loading ? (
        <Spin tip="Chargement des rapports..." size="large" className="loading-spinner" />
      ) : (
        <div id="rapport-table">
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="device_id"
            pagination={{ pageSize: 10 }}
            bordered
            scroll={{ x: 'max-content' }}
            className="main-table"
            rowClassName={() => 'hover-row'}
          />
        </div>
      )}
    </div>
  );
};

export default RapportEvent;
