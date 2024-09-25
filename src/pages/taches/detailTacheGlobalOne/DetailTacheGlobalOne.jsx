import React, { useEffect, useState } from 'react';
import './detailTacheGlobalOne.scss';
import { notification, Card, Row, Col, Spin, Badge, Modal } from 'antd';
import { InfoCircleOutlined, HistoryOutlined, FileTextOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { getTacheOne } from '../../../services/tacheService';
import DetailTache from '../detailTache/DetailTache';
import ListeTracking from '../listeTracking/ListeTracking';

const DetailTacheGlobalOne = ({ idTache }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getTacheOne(idTache);
      setData(response.data[0]);
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données. Veuillez réessayer plus tard.',
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [idTache]);

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
          <Badge count={data.nbre_info || 0} showZero>
            <InfoCircleOutlined style={{ fontSize: '40px', color: '#1890ff', marginBottom: '10px' }} />
          </Badge>
          <h3>Infos Générales</h3>
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6} onClick={handleTracking}>
        <Card className="data-card" hoverable style={{ textAlign: 'center' }} bodyStyle={{ padding: '20px' }}>
          <Badge count={data.nbre_tracking || 0} showZero>
            <HistoryOutlined style={{ fontSize: '40px', color: '#52c41a', marginBottom: '10px' }} />
          </Badge>
          <h3>Tracking</h3>
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6} onClick={handleDoc}>
        <Card className="data-card" hoverable style={{ textAlign: 'center' }} bodyStyle={{ padding: '20px' }}>
          <Badge count={data.nbre_documents || 0} showZero>
            <FileTextOutlined style={{ fontSize: '40px', color: '#faad14', marginBottom: '10px' }} />
          </Badge>
          <h3>Documents</h3>
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6} onClick={handleTiming}>
        <Card className="data-card" hoverable style={{ textAlign: 'center' }} bodyStyle={{ padding: '20px' }}>
          <Badge count={data.nbre_timing || 0} showZero>
            <ClockCircleOutlined style={{ fontSize: '40px', color: '#f5222d', marginBottom: '10px' }} />
          </Badge>
          <h3>Timing</h3>
        </Card>
      </Col>
    </Row>
  );

  return (
    <div className="dataTableau">
      <div className="title_row">
        <h1 className="title_h1">
          <FileTextOutlined style={{ marginRight: '8px' }}/>
          <strong>Titre : </strong> {data.nom_tache}
        </h1>
      </div>
      <div className="title_row">
        <h1 className="title_h1">
          <FileTextOutlined style={{ marginRight: '8px' }}/>
          <strong>Description : </strong> {data.description}
        </h1>
      </div>
      {loading ? (
        <div className="spinner-container">
          <Spin size="large" />
        </div>
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
        <DetailTache idTache={idTache} />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'tracking'}
        onCancel={closeAllModals}
        footer={null}
        width={1000}
        centered
      >
        <ListeTracking idTache={idTache} />
      </Modal>
    </div>
  );
};

export default DetailTacheGlobalOne;
