import React, { useEffect, useState } from 'react';
import './detailTacheGlobalOne.scss';
import { Card, Row, Col, Badge, Typography, Modal, Divider, Skeleton, Button, Tooltip } from 'antd';
import { InfoCircleOutlined,EditOutlined, CalendarOutlined, LeftCircleOutlined, RightCircleOutlined, HistoryOutlined, FileTextOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { getTacheOne } from '../../../services/tacheService';
import DetailTache from '../detailTache/DetailTache';
import ListeTracking from '../listeTracking/ListeTracking';
import ListeDocTache from '../listeDocTache/ListeDocTache';
import { getSuiviTacheOneV, getTrackingAllOne } from '../../../services/suiviService';
import moment from 'moment';
import EditerDesc from '../editerDesc/EditerDesc';

const { Title, Text } = Typography;

const DetailTacheGlobalOne = ({ initialIdTache }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState(null);
  const [idTache, setIdTache] = useState(initialIdTache); 
  const [dates, setDates] = useState(null);
  const [docs, setDocs] = useState('');
  const [track, setTrack] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [response, dateData, allData] = await Promise.all([
        getTacheOne(idTache),
        getSuiviTacheOneV(idTache),
        getTrackingAllOne(idTache)
      ]);

      setData(response.data[0]);
      setDates(dateData.data[0]?.date_dernier_suivi);
      setTrack(allData.data?.nbre_tracking);
      setDocs(allData.data?.nbre_doc);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [idTache]); 

  useEffect(() => {
    setIdTache(initialIdTache);
  }, [initialIdTache]);

  const closeAllModals = () => {
    setModalType(null);
  };
  
  const openModal = (type) => {
    closeAllModals();
    setModalType(type);
  };

  const handleInfo = () => openModal('info');
  const handleTracking = () => openModal('tracking');
  const handleDoc = () => openModal('document');
  const handleTiming = () => openModal('timing');
  const handleEditer = () => openModal('edite');

  const goToNextTache = () => {
    setIdTache((prevId) => prevId + 1);
  };

  const goToPreviousTache = () => {
    setIdTache((prevId) => (prevId > 1 ? prevId - 1 : prevId));
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
            <Badge count={track || 0} showZero>
              <HistoryOutlined style={{ fontSize: '40px', color: '#52c41a', marginBottom: '10px' }} />
            </Badge>
            <h3>Tracking</h3>
          </Card>
      </Col>

      <Col xs={24} sm={12} md={6} onClick={handleDoc}>
          <Card className="data-card" hoverable style={{ textAlign: 'center' }} bodyStyle={{ padding: '20px' }}>
            <Badge count={docs || 0} showZero>
              <FileTextOutlined style={{ fontSize: '40px', color: '#faad14', marginBottom: '10px' }} />
            </Badge>
            <h3>Documents</h3>
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
      <div className="title_row">
        <div style={{display: 'flex', justifyContent:'space-between'}}>
          <h1 className="title_h1">
            <FileTextOutlined style={{ marginRight: '8px' }} />
            <strong>Titre : </strong> {data?.nom_tache || <Skeleton.Input active />}
          </h1>
          <h1 className="title_h1">
            <CalendarOutlined style={{ marginRight: '8px' }} />
            <strong>Date du dernier tracking : </strong> {dates ? moment(dates).format('LL') : <Skeleton.Input active />}
          </h1>
        </div>
      </div>
      <div className="title_row">
        <h1 className="title_h1" style={{display:'flex', justifyContent:'space-between'}}>
          <div style={{flex:'6'}}>
            <FileTextOutlined style={{ marginRight: '8px' }} />
            <strong>Description : </strong>
            {data?.description ? (
              <div dangerouslySetInnerHTML={{ __html: data.description }} />
            ) : (
              <Skeleton.Input active />
            )}
          </div>
          <div onClick={handleEditer} style={{background:'green', height:'30px', width:'30px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', cursor:'pointer', flex:'0.2'}}>
            <EditOutlined/>
          </div>
        </h1>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Tooltip title="Précédent">
          <Button onClick={goToPreviousTache} disabled={idTache === 1}>
            <LeftCircleOutlined />
          </Button>
        </Tooltip>
        <Tooltip title="Suivant">
          <Button onClick={goToNextTache}>
            <RightCircleOutlined />
          </Button> 
        </Tooltip>
      </div>
      {loading ? (
        <Skeleton active />
      ) : !data || Object.keys(data).length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Text type="secondary">Aucune donnée disponible</Text>
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
        visible={modalType === 'edite'}
        onCancel={closeAllModals}
        footer={null}
        width={850}
        centered
      >
        <EditerDesc idTache={idTache} closeModal={()=>closeAllModals(null)} fetchData={fetchData}/>
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
      
      <Modal
        title=""
        visible={modalType === 'document'}
        onCancel={closeAllModals}
        footer={null}
        width={800}
        centered
      >
        <ListeDocTache idTache={idTache} />
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
            <Title level={3} className="timing-title">Durée de la Tâche</Title>
          </div>
          <Divider />
          <div className="timing-content">
            <Text type="secondary" className="timing-label">Nombre de jours :</Text>
            <Title level={2} className="timing-value">
              {data?.nbre_jour !== undefined ? data.nbre_jour : 'Non disponible'}
            </Title>
          </div>
          <Divider />
          <Text type="secondary" className="timing-label">Durée Estimée :</Text>
          <Title level={2} className="timing-value">
            {data?.duree_estimee !== undefined ? data.duree_estimee : 'Non disponible'}
          </Title>
        </Card>
      </Modal>
    </div>
  );
};

export default DetailTacheGlobalOne;
