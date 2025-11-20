import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Typography, DatePicker, Table, notification, Spin, Tag, Input, Button, Tooltip, Space } from 'antd';
import moment from 'moment';
import 'moment/locale/fr';
import { CarOutlined, ArrowUpOutlined, ArrowRightOutlined, ArrowDownOutlined, SearchOutlined, FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import html2pdf from 'html2pdf.js';

const { Title } = Typography;

const RapportCatPeriode = () => {
    const [month, setMonth] = useState(moment().format('YYYY-MM'));
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const tableRef = useRef();

    const columns = [
        {
            title: '#',
            render: (text, record, index) => index + 1,
            width: 10,
            fixed: 'left'
        },
        {
            title: 'Catégorie',
            dataIndex: 'device_name',
            fixed: 'left',
            width: 180,
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
                  {text}
                </strong>
            ),
        },
    ]
  return (
    <>
      <Title level={3} style={{ marginBottom: 24 }}>
        📅 Rapport de categorie
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
                pagination={false}
                bordered
                size="middle"
            />
        </div>
    </>
  )
}

export default RapportCatPeriode