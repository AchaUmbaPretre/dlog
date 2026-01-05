import React, { useEffect, useState } from 'react';
import { Table, Tag, Spin, Empty, Typography } from 'antd';
import { getReconGlobalItem } from '../../../../../services/sortieEamFmp';

const { Text } = Typography;

const ReconGlobalItems = () => {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

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
      <Text strong>
        Total items réconciliés : {total}
      </Text>

      {loading ? (
        <Spin style={{ display: 'block', marginTop: 24 }} />
      ) : rows.length === 0 ? (
        <Empty description="Aucune donnée de réconciliation" />
      ) : (
        <Table
          columns={columns}
          dataSource={rows}
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
                  <Tag color={sumEcart === 0 ? 'blue' : sumEcart > 0 ? 'green' : 'red'}>
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
