import React, { useEffect, useState, useRef } from 'react';
import { Card, Table, Button, Space, notification, Spin } from 'antd';
import { getOffreDetail } from '../../../services/offreService';
import html2pdf from 'html2pdf.js';

const DetailOffre = ({ idOffre }) => {
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const pdfRef = useRef();
  const scroll = { x: 400 };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getOffreDetail(idOffre);
        setData(response.data);
        setName(response.data[0]?.nom_offre)
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

  const handleExportPDF = () => {
    const element = pdfRef.current;
    const options = {
      margin: 1,
      filename: `Offre_Detail_${idOffre}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(element).set(options).save();
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Détails de {name}</h1>
      </div>

      {loading ? (
        <Spin size="large" tip="Chargement des données..." />
      ) : (
        <Card bordered={false} style={{ marginBottom: '24px' }}>
          <div ref={pdfRef}>
            <Table
              dataSource={data}
              columns={columns}
              rowKey="nom_article"
              pagination={false}
              scroll={scroll}
            />
          </div>
        </Card>
      )}

      <Card bordered={false}>
        <Space>
          <Button type="primary" disabled={loading} onClick={handleExportPDF}>Télécharger PDF</Button>
        </Space>
      </Card>
    </div>
  );
};

export default DetailOffre;
