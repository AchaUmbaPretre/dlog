import React, { useEffect, useState } from 'react';
import { notification, Card, Row, Col, Spin, Typography, Badge, Modal, Divider, Skeleton } from 'antd';
import { InfoCircleOutlined, ReconciliationOutlined, FileTextOutlined, ClockCircleOutlined } from '@ant-design/icons';
import ProjetDetailGeneral from './projetDetailGen/ProjetDetailGeneral';
import { getProjetOne } from '../../../services/projetService';
import ListeTacheProjet from '../listeTacheProjet/ListeTacheProjet';

const { Title, Text } = Typography;

const DetailProjetsGlobal = ({ idProjet }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getProjetOne(idProjet);
      setData(response.data[0]);
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données. Veuillez réessayer plus tard.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [idProjet]);

  const closeAllModals = () => {
    setModalType(null);
  };
  
  const openModal = (type) => {
    closeAllModals();
    setModalType(type);
  };

  const handleInfo = () => {
    openModal('info');
  };

  const handleTracking = () => {
    openModal('tracking');
  };

  const handleDoc = () => {
    openModal('document');
  };

  const handleTiming = () => {
    openModal('timing');
  };

  const renderDataCards = () => (
    <Row gutter={[16, 16]} justify="center" className="data-cards">
      <Col xs={24} sm={12} md={6} onClick={handleInfo}>
        <Card className="data-card" hoverable style={{ textAlign: 'center' }} bodyStyle={{ padding: '20px' }}>
          <InfoCircleOutlined style={{ fontSize: '40px', color: '#1890ff', marginBottom: '10px' }} />
          <h3>Infos Générales</h3>
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6} onClick={handleTracking}>
        <Card className="data-card" hoverable style={{ textAlign: 'center' }} bodyStyle={{ padding: '20px' }}>
          <FileTextOutlined style={{ fontSize: '40px', color: '#52c41a', marginBottom: '10px' }} />
          <h3>Tache</h3>
        </Card>
      </Col>

{/*       <Col xs={24} sm={12} md={6} onClick={handleDoc}>
        <Card className="data-card" hoverable style={{ textAlign: 'center' }} bodyStyle={{ padding: '20px' }}>
          <ReconciliationOutlined style={{ fontSize: '40px', color: '#faad14', marginBottom: '10px' }} />
          <h3>Documents</h3>
        </Card>
      </Col> */}

      <Col xs={24} sm={12} md={6} onClick={handleTiming}>
        <Card className="data-card" hoverable style={{ textAlign: 'center' }} bodyStyle={{ padding: '20px' }}>
          <ClockCircleOutlined style={{ fontSize: '40px', color: '#f5222d', marginBottom: '10px' }} />
          <h3>Timing</h3>
        </Card>
      </Col>
    </Row>
  );

  return (
    <div className="dataTableau">
      <div className="title_row">
        <h1 className="title_h1">
          <FileTextOutlined style={{ marginRight: '8px' }} />
          <strong>Titre : </strong> {data.nom_projet}
        </h1>
      </div>
      <div className="title_row">
        <h1 className="title_h1">
          <FileTextOutlined style={{ marginRight: '8px' }} />
          <strong>Description : </strong> {data.description}
        </h1>
      </div>
      {loading ? (
        <Skeleton active />
      ) : (
        renderDataCards()
      )}

      <Modal
        title=""
        visible={modalType === 'info'}
        onCancel={closeAllModals}
        footer={null}
        width={800}
        centered
      >
        <ProjetDetailGeneral idProjet={idProjet} />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'tracking'}
        onCancel={closeAllModals}
        footer={null}
        width={1000}
        centered
      >
         <ListeTacheProjet idProjet={idProjet} />
      </Modal>
      <Modal
        title=""
        visible={modalType === 'document'}
        onCancel={closeAllModals}
        footer={null}
        width={800}
        centered
      >
{/*         <ListeDocTache idTache={idTache} /> */}
      </Modal>
      <Modal
        title=""
        visible={modalType === 'timing'}
        onCancel={closeAllModals}
        footer={null}
        width={500}
        centered
        className="timing-modal"
      >
        <Card className="timing-card" bordered={false}>
          <div className="timing-header">
            <ClockCircleOutlined className="timing-icon" />
            <Title level={3} className="timing-title">Durée du projet</Title>
          </div>
          <Divider />
          <div className="timing-content">
            <Text type="secondary" className="timing-label">Nombre de jours :</Text>
            <Title level={2} className="timing-value">
              {data.nbre_jour}
            </Title>
          </div>
          <Divider />
          <Text type="secondary" className="timing-note">
            Ce nombre représente le total des jours entre le début et la fin de la tâche.
          </Text>
        </Card>
      </Modal>
    </div>
  );
};

export default DetailProjetsGlobal;
