import React, { useEffect, useState } from 'react';
import { notification, Card, Row, Col, Typography, Modal, Divider, Skeleton, Badge } from 'antd';
import { InfoCircleOutlined, FileOutlined, FileTextOutlined, ClockCircleOutlined } from '@ant-design/icons';
import ProjetDetailGeneral from './projetDetailGen/ProjetDetailGeneral';
import { getProjetOne } from '../../../services/projetService';
import ListeTacheProjet from '../listeTacheProjet/ListeTacheProjet';
import DetailProjetBesoin from './detailProjetBesoin/DetailProjetBesoin';
import ProjetDoc from '../projetDoc/ProjetDoc';
import ListeTacheProjet1 from '../listeTacheProjet/ListeTacheProjet1';

const { Title, Text } = Typography;

const DetailProjetsGlobal = ({ idProjet }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [docs, setDocs] = useState('');
  const [dataTache, setDataTache] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getProjetOne(idProjet);
      setData(response.data.projet[0]);
      setDocs(response.data.total_doc);
      setDataTache(response.data.total_taches)
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

  const handleBesoin = () => {
    openModal('besoin');
  };

  const handleDoc = () => {
    openModal('detail-doc')
  }

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
          <Badge count={ dataTache || 0} showZero>
            <FileOutlined style={{ fontSize: '40px', color: '#52c41a', marginBottom: '10px' }} />
          </Badge>
          <h3>Tache</h3>
        </Card>
      </Col>
{/* 
      <Col xs={24} sm={12} md={6} onClick={handleBesoin}>
        <Card className="data-card" hoverable style={{ textAlign: 'center' }} bodyStyle={{ padding: '20px' }}>
          <ReconciliationOutlined style={{ fontSize: '40px', color: '#faad14', marginBottom: '10px' }} />
          <h3>Besoins</h3>
        </Card>
      </Col> */}

      <Col xs={24} sm={12} md={6} onClick={handleDoc}>
        <Card className="data-card" hoverable style={{ textAlign: 'center' }} bodyStyle={{ padding: '20px' }}>
        <Badge count={docs || 0} showZero>
          <FileTextOutlined style={{ fontSize: '40px', color: '#faad14', marginBottom: '10px' }} />
        </Badge>
          <h3>Document</h3>
        </Card>
      </Col>

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
      <div className="title_row" style={{display:'flex', justifyContent:'space-between'}}>
        <h1 className="title_h1">
          <FileTextOutlined style={{ marginRight: '8px' }} />
          <strong>Titre : </strong> {data.nom_projet}
        </h1>
      </div>
      <div className="title_row">
        <h1 className="title_h1">
          <FileTextOutlined style={{ marginRight: '8px' }} />
          <strong>Description : </strong> {data?.description ? (
              <div dangerouslySetInnerHTML={{ __html: data.description }} />
            ) : (
              <Skeleton.Input active />
            )}
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
        visible={modalType === 'detail-doc'}
        onCancel={closeAllModals}
        footer={null}
        width={800}
        centered
      >
        <ProjetDoc idProjet={idProjet} />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'tracking'}
        onCancel={closeAllModals}
        footer={null}
        width={1000}
        centered
      >
        <ListeTacheProjet1 idProjet={idProjet} fetchData={fetchData} closeModal={()=>setModalType(null)}/>
      </Modal>
      <Modal
        title=""
        visible={modalType === 'besoin'}
        onCancel={closeAllModals}
        footer={null}
        width={800}
        centered
      >
        <DetailProjetBesoin idProjet={idProjet} />
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
