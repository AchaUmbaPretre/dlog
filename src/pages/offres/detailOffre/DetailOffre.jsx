import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Divider, Space, notification, Spin } from 'antd';
import { getOffreDetail } from '../../../services/offreService';

const DetailOffre = ({ idOffre }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const scroll = { x: 400 };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getOffreDetail(idOffre);
        setData(response.data);
      } catch (error) {
        notification.error({
          message: 'Erreur de chargement',
          description: 'Une erreur est survenue lors du chargement des données. Veuillez réessayer plus tard.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idOffre]);

  const columns = [
    {
      title: 'Offre',
      dataIndex: 'nom_offre',
      key: 'nom_offre',
    },
    {
      title: 'Article',
      dataIndex: 'nom_article',
      key: 'nom_article',
    },
    {
      title: 'P.U.',
      dataIndex: 'prix_unitaire',
      key: 'prix_unitaire',
      render: (text) => `${text.toFixed(2)} $`,
    },
    {
      title: 'Quantité',
      dataIndex: 'quantite',
      key: 'quantite',
    },
    {
      title: 'Montant',
      dataIndex: 'montant',
      key: 'montant',
      render: (text) => `${text.toFixed(2)} $`,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Détails de l'Offre</h1>
      </div>

      {loading ? (
        <Spin size="large" tip="Chargement des données..." />
      ) : (
        <Card bordered={false} style={{ marginBottom: '24px' }}>
          <Table
            dataSource={data}
            columns={columns}
            rowKey="nom_article"
            pagination={false}
            scroll={scroll} 
          />
        </Card>
      )}

      <Card bordered={false}>
        <Space>
          <Button type="primary" disabled={loading}>Télécharger PDF</Button>
        </Space>
      </Card>
    </div>
  );
};

export default DetailOffre;
