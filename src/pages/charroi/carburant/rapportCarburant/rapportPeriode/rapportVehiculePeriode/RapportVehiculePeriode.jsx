import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Typography, DatePicker, Table, notification, Spin, Tag, Input, Button, Tooltip, Space } from 'antd';
import moment from 'moment';
import 'moment/locale/fr';
import { CarOutlined, ArrowUpOutlined, ArrowRightOutlined, ArrowDownOutlined, SearchOutlined, FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import html2pdf from 'html2pdf.js';

const { Title } = Typography;

const RapportVehiculePeriode = () => {
    const [month, setMonth] = useState(moment().format('YYYY-MM'));
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const tableRef = useRef();

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
            
        </div>
    </>
  )
}

export default RapportVehiculePeriode