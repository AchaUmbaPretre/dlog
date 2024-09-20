import React, { useState, useEffect } from 'react';
import { getPlansOne } from '../../../../services/batimentService';
import { Spin, notification, Card, Col, Row, Modal, Button } from 'antd';
import { EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import './detailUpload.scss';
import config from '../../../../config';

const { Meta } = Card;

const DetailUpload = ({ idBatiment }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPlansOne(idBatiment);
        setData(response.data);
      } catch (error) {
        notification.error({
          message: 'Erreur de chargement',
          description: 'Une erreur est survenue lors du chargement des données.',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [idBatiment]);

  const showImageModal = (image) => {
    setSelectedImage(image);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const downloadImage = (imagePath) => {
    const link = document.createElement('a');
    link.href = `${DOMAIN}/${imagePath}`;
    link.download = 'image.jpg';
    link.click();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin tip="Chargement en cours..." size="large" />
      </div>
    );
  }

  return (
    <div className="gallery-container">
      <Row gutter={[16, 16]}>
        {data.map((item) => (
          <Col key={item.id_batiment_plans} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              className="image-card"
              cover={
                <img
                  alt={item.nom_document}
                  src={`${DOMAIN}/${item.chemin_document}`}
                  className="gallery-image"
                  onClick={() => showImageModal(item)}
                />
              }
              actions={[
                <Button
                  type="primary"
                  icon={<EyeOutlined />}
                  onClick={() => showImageModal(item)}
                  className="view-button"
                >
                  Voir
                </Button>,
                <Button
                  type="default"
                  icon={<DownloadOutlined />}
                  onClick={() => downloadImage(item.chemin_document)}
                  className="download-button"
                >
                  Télécharger
                </Button>,
              ]}
            >
              <Meta title={item.nom_document} description={new Date(item.date_ajout).toLocaleDateString()} />
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        visible={isModalVisible}
        footer={null}
        onCancel={handleCancel}
        className="image-modal"
        width={800}
        centered
        transitionName="fade"
      >
        {selectedImage && (
          <img
            alt={selectedImage.nom_document}
            src={`${DOMAIN}/${selectedImage.chemin_document}`}
            className="modal-image"
          />
        )}
      </Modal>
    </div>
  );
};

export default DetailUpload;
