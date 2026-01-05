import React, { useEffect, useState } from 'react';
import { Table, Tag, Spin, Empty, Typography, Input, Button, Space } from 'antd';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { getReconGlobalItem } from '../../../../../services/sortieEamFmp';

const { Text, Title } = Typography;
const { Search } = Input;

const ReconGlobalItems = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [sortedInfo, setSortedInfo] = useState({});
  const [pagination, setPagination] = useState({ current: 1, pageSize: 25 });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getReconGlobalItem();
        setRows(res.data?.data || []);
      } catch (err) {
        console.error('Erreur reconciliation globale:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExportExcel = () => {
    const filteredRows = rows.filter((row) =>
      (row.item_code || '').toLowerCase().includes(searchValue.toLowerCase())
    );

    const exportData = filteredRows.map((item) => ({
      'Item Code': item.item_code || 'N/A',
      'Quantité EAM': item.total_qte_eam || 0,
      'Quantité FMP': item.total_qte_fmp || 0,
      'Écart': item.ecart || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Réconciliation');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, `reconciliation_items_${Date.now()}.xlsx`);
  };

  const handleChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    setSortedInfo(sorter);
  };

  const filteredRows = rows.filter((row) =>
    (row.item_code || '').toLowerCase().includes(searchValue.toLowerCase())
  );

  const totalEam = filteredRows.reduce((sum, row) => sum + (row.total_qte_eam || 0), 0);
  const totalFmp = filteredRows.reduce((sum, row) => sum + (row.total_qte_fmp || 0), 0);

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 60,
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: 'Item Code',
      dataIndex: 'item_code',
      key: 'item_code',
      width: 260,
      ellipsis: true,
      render: (value) => (value ? <Text strong>{value}</Text> : <Text type="secondary">N/A</Text>),
    },
    {
      title: 'Qté EAM',
      dataIndex: 'total_qte_eam',
      key: 'total_qte_eam',
      align: 'right',
      sorter: (a, b) => Math.abs(a.total_qte_eam || 0) - Math.abs(b.total_qte_eam || 0),
      sortOrder: sortedInfo.columnKey === 'total_qte_eam' && sortedInfo.order,
      render: (value) => <Text strong>{value}</Text>,
    },
    {
      title: 'Qté FMP',
      dataIndex: 'total_qte_fmp',
      key: 'total_qte_fmp',
      align: 'right',
      sorter: (a, b) => Math.abs(a.total_qte_fmp || 0) - Math.abs(b.total_qte_fmp || 0),
      sortOrder: sortedInfo.columnKey === 'total_qte_fmp' && sortedInfo.order,
      render: (value) => <Text strong>{value}</Text>,
    },
    {
      title: 'Écart',
      dataIndex: 'ecart',
      key: 'ecart',
      align: 'right',
      sorter: (a, b) => Math.abs(a.ecart || 0) - Math.abs(b.ecart || 0),
      sortOrder: sortedInfo.columnKey === 'ecart' && sortedInfo.order,
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
        style={{ width: '100%', marginBottom: 16, justifyContent: 'space-between' }}
      >
        <div>
          <Title level={4} style={{ marginBottom: 0 }}>
            Total items réconciliés : {filteredRows.length}
          </Title>
          <Text type="secondary">
            Analyse des écarts entre les documents EAM et FMP
          </Text>
          <div style={{ marginTop: 4 }}>
            <Text strong style={{ marginRight: 16 }}>
              Total EAM: {totalEam}
            </Text>
            <Text strong>Total FMP: {totalFmp}</Text>
          </div>
        </div>

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
          onChange={handleChange}
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ['25', '50', '100'],
            showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} items`,
            current: pagination.current,
            pageSize: pagination.pageSize,
          }}
          summary={(pageData) => {
            let sumEamPage = 0;
            let sumFmpPage = 0;
            let sumEcartPage = 0;

            pageData.forEach((item) => {
              sumEamPage += item.total_qte_eam || 0;
              sumFmpPage += item.total_qte_fmp || 0;
              sumEcartPage += item.ecart || 0;
            });

            return (
              <Table.Summary.Row>
                <Table.Summary.Cell>
                  <Text strong></Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text strong>Total page</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right">
                  <Text strong>{sumEamPage}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right">
                  <Text strong>{sumFmpPage}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right">
                  <Tag
                    color={sumEcartPage === 0 ? 'blue' : sumEcartPage > 0 ? 'green' : 'red'}
                  >
                    {sumEcartPage}
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
