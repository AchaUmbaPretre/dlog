import React, { useEffect, useState } from 'react';
import {
  Table,
  Tag,
  Spin,
  Empty,
  Typography,
  Button,
  Space,
  Divider,
} from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { getReconciliationItem } from '../../../../../services/sortieEamFmp';

const { Title, Text } = Typography;

const ReconciliationItems = ({ items, dateRange }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!items) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getReconciliationItem(items, dateRange);

        const formattedData = Array.isArray(response.data?.data)
          ? response.data.data
          : response.data?.data
          ? [response.data.data]
          : [];

        setData(formattedData);
      } catch (error) {
        console.error('Erreur reconciliation items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [items, dateRange]);

  /**
   * 📤 Export Excel
   */
  const handleExportExcel = () => {
    const exportData = data.map((item) => ({
      'Item Code': item.item_code,
      'Quantité EAM': item.total_qte_eam || 0,
      'Quantité FMP': item.total_qte_fmp || 0,
      Écart: item.ecart || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Réconciliation Item');

    const buffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    saveAs(
      new Blob([buffer], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }),
      `reconciliation_item_${Date.now()}.xlsx`
    );
  };

  const columns = [
    {
        title: '#',
        key: 'index',
        width: 60,
        render: (text, record, index) => index + 1, // simple si pas de pagination
    },
    {
      title: 'Item Code',
      dataIndex: 'item_code',
      key: 'item_code',
      width: 220,
      render: (value) => <Text strong>{value}</Text>,
    },
    {
      title: 'Qté EAM',
      dataIndex: 'total_qte_eam',
      key: 'total_qte_eam',
      align: 'right',
    },
    {
      title: 'Qté FMP',
      dataIndex: 'total_qte_fmp',
      key: 'total_qte_fmp',
      align: 'right',
    },
    {
      title: 'Écart',
      dataIndex: 'ecart',
      key: 'ecart',
      align: 'right',

      // 🔽 TRI AUTOMATIQUE PAR ABS(écart)
      sorter: (a, b) => Math.abs(a.ecart || 0) - Math.abs(b.ecart || 0),
      defaultSortOrder: 'descend',

      render: (value) => (
        <Tag color={value === 0 ? 'blue' : value > 0 ? 'green' : 'red'}>
          {value}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ marginTop: 24 }}>
      {/* 🔷 Header */}
      <Space
        style={{ width: '100%', justifyContent: 'space-between' }}
        align="center"
      >
        <div>
          <Title level={4} style={{ marginBottom: 0 }}>
            Réconciliation EAM / FMP par code article
          </Title>
          <Text type="secondary">
            Analyse des écarts entre documents EAM et FMP
          </Text>
        </div>

        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleExportExcel}
          disabled={data.length === 0}
        >
          Export Excel
        </Button>
      </Space>

      <Divider />

      {/* 🔷 Contenu */}
      {loading ? (
        <Spin style={{ display: 'block', marginTop: 32 }} />
      ) : data.length === 0 ? (
        <Empty description="Aucune donnée de réconciliation" />
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          rowKey="item_code"
          bordered
          size="middle"
          pagination={false}
        />
      )}
    </div>
  );
};

export default ReconciliationItems;
