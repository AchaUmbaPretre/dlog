import React, { useEffect, useState } from 'react';
import { Table, Tag, Spin, Empty } from 'antd';
import { getReconciliationItem } from '../../../../../services/sortieEamFmp';

const ReconciliationItems = ({ items }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!items) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getReconciliationItem(items);

        // Normalisation des données (senior best practice)
        const formattedData = Array.isArray(response.data.data)
          ? response.data.data
          : [response.data.data];

        setData(formattedData);
      } catch (error) {
        console.error('Erreur reconciliation items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [items]);

  const columns = [
    {
      title: 'Item Code',
      dataIndex: 'item_code',
      key: 'item_code',
      align: 'center',
      render: (value) => <strong>{value}</strong>,
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
      render: (value) => (
        <Tag color={value === 0 ? 'blue' : value > 0 ? 'green' : 'red'}>
          {value}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ marginTop: 16 }}>
      {loading ? (
        <Spin />
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
