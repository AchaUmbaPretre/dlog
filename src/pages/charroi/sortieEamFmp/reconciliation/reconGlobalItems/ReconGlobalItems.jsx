import React, { useEffect, useMemo, useState } from 'react';
import { Table, Tag, Spin, Empty, Typography, Input, Button, Space } from 'antd';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { getReconGlobalItem } from '../../../../../services/sortieEamFmp';

const { Text } = Typography;
const { Search } = Input;

const ReconGlobalItems = () => {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getReconGlobalItem();
        setRows(res.data?.data || []);
        setTotal(res.data?.total || 0);
      } catch (err) {
        console.error('Erreur reconciliation globale:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * 🔍 Filtrage par item_code (case-insensitive)
   */
  const filteredRows = useMemo(() => {
    if (!searchValue) return rows;

    const value = searchValue.toLowerCase().trim();

    return rows.filter((row) =>
      (row.item_code || '').toLowerCase().includes(value)
    );
  }, [rows, searchValue]);

  /**
   * 📤 Export Excel professionnel
   */
  const handleExportExcel = () => {
    const exportData = filteredRows.map((item) => ({
      'Item Code': item.item_code || 'N/A',
      'Quantité EAM': item.total_qte_eam || 0,
      'Quantité FMP': item.total_qte_fmp || 0,
      'Écart': item.ecart || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Réconciliation');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(blob, `reconciliation_items_${Date.now()}.xlsx`);
  };

  const columns = [
    {
      title: 'Item Code',
      dataIndex: 'item_code',
      key: 'item_code',
      width: 260,
      ellipsis: true,
      render: (value) =>
        value && value.trim() !== '' ? (
          <Text strong>{value.trim()}</Text>
        ) : (
          <Text type="secondary">N/A</Text>
        ),
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
      render: (value) => {
        if (value === 0) return <Tag color="blue">0</Tag>;
        if (value > 0) return <Tag color="green">+{value}</Tag>;
        return <Tag color="red">{value}</Tag>;
      },
    },
  ];

  return (
    <div style={{ marginTop: 16 }}>
      <Space
        style={{
          width: '100%',
          marginBottom: 16,
          justifyContent: 'space-between',
        }}
      >
        <Text strong>Total items réconciliés : {filteredRows.length}</Text>

        <Space>
          <Search
            allowClear
            placeholder="Rechercher par Item Code"
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ width: 260 }}
          />

          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExportExcel}
            disabled={filteredRows.length === 0}
          >
            Export Excel
          </Button>
        </Space>
      </Space>

      {loading ? (
        <Spin style={{ display: 'block', marginTop: 24 }} />
      ) : filteredRows.length === 0 ? (
        <Empty description="Aucune donnée de réconciliation" />
      ) : (
        <Table
          columns={columns}
          dataSource={filteredRows}
          rowKey={(record, index) => `${record.item_code || 'NA'}-${index}`}
          bordered
          size="middle"
          pagination={{
            pageSize: 25,
            showSizeChanger: true,
            pageSizeOptions: ['25', '50', '100'],
          }}
          summary={(pageData) => {
            let sumEam = 0;
            let sumFmp = 0;
            let sumEcart = 0;

            pageData.forEach((item) => {
              sumEam += item.total_qte_eam || 0;
              sumFmp += item.total_qte_fmp || 0;
              sumEcart += item.ecart || 0;
            });

            return (
              <Table.Summary.Row>
                <Table.Summary.Cell>
                  <Text strong>Total page</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right">
                  <Text strong>{sumEam}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right">
                  <Text strong>{sumFmp}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right">
                  <Tag
                    color={
                      sumEcart === 0 ? 'blue' : sumEcart > 0 ? 'green' : 'red'
                    }
                  >
                    {sumEcart}
                  </Tag>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            );
          }}
        />
      )}
    </div>
  );
};

export default ReconGlobalItems;
