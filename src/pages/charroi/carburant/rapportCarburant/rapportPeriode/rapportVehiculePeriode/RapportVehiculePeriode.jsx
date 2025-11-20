import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Typography, DatePicker, Table, notification, Spin, Tag, Input, Button, Tooltip, Space } from 'antd';
import moment from 'moment';
import 'moment/locale/fr';
import { CarOutlined, ArrowUpOutlined, ArrowRightOutlined, ArrowDownOutlined, SearchOutlined, FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import html2pdf from 'html2pdf.js';
import { formatNumber } from '../../../../../../utils/formatNumber';
import { getRapportVehiculePeriode } from '../../../../../../services/carburantService';

const { Search } = Input;
const { Text, Title } = Typography;

const RapportVehiculePeriode = () => {
    const [month, setMonth] = useState(moment().format('YYYY-MM'));
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const tableRef = useRef();

    const fetchData = async() => {
        try {
            const { data } = await getRapportVehiculePeriode(month);
            setData(data)           
        } catch (error) {
            notification.error({
                message: "Erreur de chargement",
                description: "Impossible de récupérer les données carburant.",
                placement: "topRight",
            });
        } finally {
            setLoading(false);
        }

    }

      useEffect(() => {
        fetchData();
      }, [month]);
    const columns = [
        {
          title: '#',
          render: (text, record, index) => index + 1,
          width: 10,
          fixed: 'left',
        },
        {
          title: 'Marque',
          dataIndex: 'nom_marque',
          fixed: 'left',
          filterDropdown: () => (
            <Input
              placeholder="Rechercher véhicule"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 180, marginBottom: 8 }}
              prefix={<SearchOutlined />}
            />
          ),
          render: (text) => (
            <strong>
              <CarOutlined style={{ color: '#1890ff', marginRight: 6 }} />
              {text?? 'N/A'}
            </strong>
          ),
        }, 
        {
          title: 'Immatriculation',
          dataIndex: 'immatriculation',
          fixed: 'left',
          filterDropdown: () => (
            <Input
              placeholder="Rechercher véhicule"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 180, marginBottom: 8 }}
              prefix={<SearchOutlined />}
            />
          ),
          render: (text) => (
            <strong>
              {text ?? 'N/A'}
            </strong>
          ),
        },
        {
            title: "#Plein",
            dataIndex: "total_pleins",
            key: "total_pleins",
            align: "right",
            render: (text) => <Text>{formatNumber(text)}</Text>,
        },
        {
            title: "Qté (L)",
            dataIndex: "total_litres",
            key: "total_litres",
            align: "right",
            render: (text) => <Text>{formatNumber(text)}</Text>,
        },
        {
            title: "Dist. (km)",
            dataIndex: "total_distance",
            key: "total_distance",
            align: "right",
            render: (text) => <Text>{formatNumber(text)}</Text>,
        },
        {
            title: "Km actuel",
            dataIndex: "total_kilometrage",
            key: "total_kilometrage",
            align: "right",
            render: (text) => <Text>{formatNumber(text)} km</Text>,
        },
        {
            title: "Cons./100km",
            dataIndex: "total_consom",
            key: "total_consom",
            align: "right",
            render: (text) => <Text>{formatNumber(text, " L")}</Text>,
        },
        {
            title: "Montant CDF",
            dataIndex: "total_total_cdf",
            key: "total_total_cdf",
            align: "right",
            render: (text) => <Text>{formatNumber(text, " L")}</Text>,
        },
        {
            title: "Montant USD",
            dataIndex: "total_total_usd",
            key: "total_total_usd",
            align: "right",
            render: (text) => <Text>{formatNumber(text, " L")}</Text>,
        },
    ]

  return (
    <>
      <Title level={3} style={{ marginBottom: 24 }}>
        📅 Rapport par véhicule
      </Title>

      <Space style={{ marginBottom: 24 }}>
        <DatePicker
          picker="month"
          defaultValue={moment()}
          onChange={(date) => setMonth(date.format('YYYY-MM'))}
        />
      </Space>
        <div ref={tableRef}>
          <Table
            dataSource={data}
            columns={columns}
            scroll={{ x: 'max-content' }}
            rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
            pagination={false}
            bordered
            size="middle"
          />
        </div>
    </>
  )
}

export default RapportVehiculePeriode