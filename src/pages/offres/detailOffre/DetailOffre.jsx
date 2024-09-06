import React, { useEffect, useState, useRef } from 'react';
import { Card, Table, Button, Space, notification, Spin } from 'antd';
import { getOffreDetail } from '../../../services/offreService';
import html2pdf from 'html2pdf.js';

const DetailOffre = ({ idOffre }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const pdfRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getOffreDetail(idOffre);
        if (response?.data?.length > 0) {
          setData(response.data);
          setName(response.data[0].nom_offre);
        } else {
          throw new Error('Aucune donnée trouvée.');
        }
      } catch (error) {
        notification.error({
          message: 'Erreur de chargement',
          description: error.message || 'Une erreur est survenue lors du chargement des données. Veuillez réessayer plus tard.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idOffre]);

  const calculateTotal = () => {
    return data.reduce((total, item) => total + (item?.prix || 0), 0).toFixed(2);
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => index + 1,
      width: '5%',
    },
    {
      title: 'Article',
      dataIndex: 'nom_article',
      key: 'nom_article',
    },
    {
      title: 'P.U.',
      dataIndex: 'prix',
      key: 'prix',
      render: (prix) => `${prix?.toFixed(2)} $`,
    },
  ];

  const handleExportPDF = () => {
    const element = pdfRef.current;
    const options = {
      margin: 1,
      filename: `Offre_Detail_${idOffre}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };
    html2pdf().from(element).set(options).save();
  };

  return (
    <div style={{ padding: '24px' }}>
      <div ref={pdfRef}>
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Détails de l'Offre : {name}</h1>
        </div>

        {loading ? (
          <Spin size="large" tip="Chargement des données..." />
        ) : (
          <Card bordered={false}>
            <Table
              dataSource={data}
              columns={columns}
              rowKey="nom_article"
              pagination={false}
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={2} align="right">
                    <strong>Total:</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>
                    <strong>{`${calculateTotal()} $`}</strong>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
              scroll={{ x: 400 }}
            />
          </Card>
        )}
      </div>

      <Card bordered={false} style={{ marginTop: '24px' }}>
        <Space>
          <Button type="primary" disabled={loading} onClick={handleExportPDF}>
            Télécharger PDF
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default DetailOffre;
