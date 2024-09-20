import React, { useState, useEffect } from 'react';
import { Spin, notification, Card, Col, Row, Modal, Button, Typography } from 'antd';
import { EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import { getPlansOne } from '../../../../services/batimentService';
import config from '../../../../config';
import './detailUpload.scss';

const { Meta } = Card;
const { Title } = Typography;

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
          description: 'Impossible de charger les données. Veuillez réessayer plus tard.',
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
    link.download = imagePath.split('/').pop();
    link.click();
  };

  return (
    <div className="detail-upload">
      <Title level={2} className="gallery-title">
        Galerie des plans
      </Title>

      {loading ? (
        <div className="loading-container">
          <Spin tip="Chargement des images..." size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]} className="gallery-row">
          {data.map((item) => (
            <Col key={item.id_batiment_plans} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
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
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => showImageModal(item)}
                    className="view-button"
                  />,
                  <Button
                    type="link"
                    icon={<DownloadOutlined />}
                    onClick={() => downloadImage(item.chemin_document)}
                    className="download-button"
                  />,
                ]}
                className="gallery-card"
              >
                <Meta
                  title={item.nom_document}
                  description={`Ajouté le ${new Date(item.date_ajout).toLocaleDateString()}`}
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        visible={isModalVisible}
        footer={null}
        onCancel={handleCancel}
        className="image-modal"
        width={1000}
        centered
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
