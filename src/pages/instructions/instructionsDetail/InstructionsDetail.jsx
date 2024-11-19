import React, { useEffect, useRef, useState } from 'react';
import { Card, Spin, notification, Typography, Row, Col, Button, Space } from 'antd';
import { getInspectionOneV } from '../../../services/batimentService';
import html2pdf from 'html2pdf.js';
import config from '../../../config';

const { Title, Text } = Typography;

const InstructionsDetail = ({ idInspection }) => {
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const exportRef = useRef(); // Référence pour les données à exporter

  // Fonction pour charger les données
  const fetchData = async () => {
    try {
      const { data } = await getInspectionOneV(idInspection);
      setData(data);
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au montage du composant ou si l'idInspection change
  useEffect(() => {
    if (idInspection) {
      fetchData();
    }
  }, [idInspection]);

  // Fonction pour exporter en PDF
  const exportToPDF = () => {
    const element = exportRef.current;
  
    const images = element.querySelectorAll('img');
    const loadPromises = Array.from(images).map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) resolve();
          else img.onload = resolve;
        })
    );
  
    Promise.all(loadPromises).then(() => {
      const options = {
        margin: 1,
        filename: `Instructions_${idInspection}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' },
      };
      html2pdf().set(options).from(element).save();
    });
  };
  
  const exportToWord = () => {
    
  };

  return (
    <div style={{ padding: 16 }}>
      {loading ? (
        <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />
      ) : (
        <div>
          <Space style={{ marginBottom: 16 }}>
            <Button type="primary" onClick={exportToPDF}>
              Exporter en PDF
            </Button>
            <Button type="default" onClick={exportToWord}>
              Exporter en Word
            </Button>
          </Space>
          <div ref={exportRef}>
            <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
              Détails des Instructions
            </Title>
            <Row gutter={[16, 16]}>
              {data.map((instruction) => (
                <Col xs={24} sm={12} lg={8} key={instruction.id_inspection}>
                  <Card
                    hoverable
                    style={{ borderRadius: 8 }}
                    cover={
                      <a
                        href={`${DOMAIN}/${instruction.img}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          alt="Instruction"
                          src={`${DOMAIN}/${instruction.img}`}
                          style={{
                            width: '100%',
                            height: 200,
                            objectFit: 'cover',
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                          }}
                        />
                      </a>
                    }
                  >
                    <Title level={4}>{instruction.nom_batiment}</Title>
                    <Text strong>Type d'Instruction :</Text>{' '}
                    <Text>{instruction.nom_type_instruction}</Text>
                    <br />
                    <Text strong>Commentaire :</Text> <Text>{instruction.commentaire}</Text>
                    <br />
                    <Text strong>Date de Création :</Text>{' '}
                    <Text>{new Date(instruction.date_creation).toLocaleString()}</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructionsDetail;
