import { useEffect, useState } from 'react';
import './detailTacheGlobalOne.scss';
import { Card, Row, Col, Tag, Badge, Typography, Modal, Divider, Skeleton, Button, Tooltip } from 'antd';
import { InfoCircleOutlined, 
  LockFilled, 
  LinkOutlined,
  FormOutlined,
  FileAddOutlined,
  ProjectOutlined, 
  EditOutlined, 
  DollarOutlined, 
  CalendarOutlined, 
  LeftCircleOutlined, 
  RightCircleOutlined, 
  HistoryOutlined, 
  FileTextOutlined, 
  LeftCircleFilled,
  PushpinFilled,
  RightCircleFilled,
  UserOutlined,
  ClockCircleOutlined } from '@ant-design/icons';
import { getTacheOne } from '../../../services/tacheService';
import DetailTache from '../detailTache/DetailTache';
import ListeTracking from '../listeTracking/ListeTracking';
import ListeDocTache from '../listeDocTache/ListeDocTache';
import { getSuiviTacheOneV, getTrackingAllOne } from '../../../services/suiviService';
import moment from 'moment';
import EditerDesc from '../editerDesc/EditerDesc';
import TacheDoc from '../tacheDoc/TacheDoc';
import TacheProjet from '../tacheProjet/TacheProjet';
import ProjetAssocieForm from '../projetAssocie/ProjetAssocieForm';
import SuiviTache from '../suiviTache/SuiviTache';
import InstructionForm from '../../instructions/instructionForm/InstructionForm';
import PermissionTache from '../../permission/permissionTache/PermissionTache';

const { Title, Text } = Typography;

const DetailTacheGlobalOne = ({ initialIdTache, allIds }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState(null);
  const [idTache, setIdTache] = useState(initialIdTache); 
  const [dates, setDates] = useState(null);
  const [docs, setDocs] = useState('');
  const [track, setTrack] = useState('');
  const [cout, setCount] = useState('');
  const [cat, setCat] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [response, dateData, allData ] = await Promise.all([
        getTacheOne(idTache),
        getSuiviTacheOneV(idTache),
        getTrackingAllOne(idTache)
      ]);

      setData(response.data.tache[0]);
      setCount(response.data.cout_total);
      setCat(response.data.categories)
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
    if (idTache) {
      fetchData();
    }
  }, [idTache]);

  const closeAllModals = () => {
    setModalType(null);
  };
  
  const openModal = (type ) => {
    closeAllModals();
    setModalType(type);
  };

  const handleAddProjet = () => openModal('AddProjet');
  const handleAjouterDoc = () => openModal('DocumentTacheForm');
  const handleInfo = () => openModal('info');
  const handleTracking = () => openModal('tracking');
  const handleAddTracking = () => openModal('trackingForm')
  const handleDoc = () => openModal('document');
  const handleTiming = () => openModal('timing');
  const handleEditer = () => openModal('edite');
  const handleAssocierProjet = () => openModal('associe_projet');
  const handleInspection = () => openModal('add_inspection');
  const handlePermission = () => openModal('permission');

  const goToNextTache = () => {
    setIdTache((prevId) => prevId + 1);
  };

  const goToPreviousTache = () => {
    setIdTache((prevId) => (prevId > 1 ? prevId - 1 : prevId));
  };

  const goToNext = () => {
    setIdTache(prevId => {
      const index = allIds.indexOf(prevId);
      return index !== -1 && index < allIds.length - 1 ? allIds[index + 1] : prevId;
    });
  };

  const goToPrevious = () => {
    setIdTache(prevId => {
      const index = allIds.indexOf(prevId);
      return index > 0 ? allIds[index - 1] : prevId;
    });
  };

  const currentIndex = allIds.indexOf(idTache);
  const isFirst = currentIndex <= 0;
  const isLast = currentIndex >= allIds.length - 1;

  useEffect(() => {
    setIdTache(initialIdTache);
  }, [initialIdTache]);

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
      <div className="detail_tache_arrow">
        <Tooltip title="Précédent">
          <Button className="row-arrow" onClick={goToPrevious}  disabled={isFirst}>
            <LeftCircleFilled className="icon-arrow" />
          </Button>
        </Tooltip>
        <h2 className="tache_title_h2">
          DÉTAILS DE LA TACHE N° {`${new Date().getFullYear().toString().slice(2)}${idTache?.toString().padStart(4, '0')}`}
        </h2>
        <Tooltip title="Suivant">
          <Button className="row-arrow" onClick={goToNext} disabled={isLast}>
            <RightCircleFilled className="icon-arrow" />
          </Button>
        </Tooltip>
      </div>
      <div className="title_row">
        <div style={{display: 'flex', justifyContent:'space-between'}}>
          <h1 className="title_h1">
            <FileTextOutlined style={{ marginRight: '8px' }} />
            <strong>Titre : </strong> {data?.nom_tache || <Skeleton.Input active />}
          </h1>
          <h1 className="title_h1">
            <strong>Owner : {<Tag icon={<UserOutlined />} >{data.owner}</Tag>}</strong>
          </h1>
          <h1 className="title_h1">
            <strong>Statut : {<Tag icon={<PushpinFilled />} >{data.statut}</Tag>}</strong>
          </h1>
          <h1 className="title_h1">
            <CalendarOutlined style={{ marginRight: '8px' }} />
            <strong>{dates && `Date du dernier tracking : ${moment(dates).format('LL')}` }</strong>
          </h1>
        </div>
      </div>
      <div className="title_row">
        <h1 className="title_h1" style={{display:'flex', justifyContent:'space-between'}}>
          <div style={{flex:'6'}}>
            <FileTextOutlined style={{ marginRight: '8px' }} />
            <strong >Description : </strong>
            {data?.description ? (
              <div dangerouslySetInnerHTML={{ __html: data.description }} style={{marginTop:'10px'}} />
            ) : (
              <Skeleton.Input active />
            )}
          </div>
          <div className='rows-menu'>
            <Tooltip title="Modifier la description">
              <div 
                onClick={handleEditer} 
                style={{
                  background:'#4CAF50', // vert doux pour l'action de modifier
                  height:'30px',
                  width:'30px',
                  borderRadius:'50%',
                  display:'flex',
                  marginLeft:'10px',
                  alignItems:'center',
                  justifyContent:'center',
                  color:'#fff',
                  cursor:'pointer',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <EditOutlined />
              </div>
            </Tooltip>

            <Tooltip title="Créer un document">
              <div 
                onClick={handleAjouterDoc} 
                style={{
                  background:'#FF9800', // orange pour une action de création
                  height:'30px',
                  width:'30px',
                  borderRadius:'50%',
                  display:'flex',
                  alignItems:'center',
                  marginLeft:'10px',
                  justifyContent:'center',
                  color:'#fff',
                  cursor:'pointer',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <FileAddOutlined />
              </div>
            </Tooltip>

            <Tooltip title="Créer un projet">
              <div 
                onClick={handleAddProjet} 
                style={{
                  background:'#2196F3',
                  height:'30px',
                  width:'30px',
                  borderRadius:'50%',
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  color:'#fff',
                  marginLeft:'10px',
                  cursor:'pointer',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <ProjectOutlined />
              </div>
            </Tooltip>

            <Tooltip title="Tracking">
              <div 
                onClick={handleAddTracking} 
                style={{
                  background:'#03A9F4',
                  height:'30px',
                  width:'30px',
                  borderRadius:'50%',
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  color:'#fff',
                  marginLeft:'10px',
                  cursor:'pointer',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <HistoryOutlined />
              </div>
            </Tooltip>

            <Tooltip title="Associer un projet existant">
              <div 
                onClick={handleAssocierProjet}
                style={{
                  background:'#FFC107',
                  height:'30px',
                  width:'30px',
                  borderRadius:'50%',
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  color:'#fff',
                  marginLeft:'10px',
                  cursor:'pointer',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <LinkOutlined /> {/* Icône pour associer un projet */}
              </div>
            </Tooltip>

            <Tooltip title="Créer une inspection">
              <div 
                onClick={handleInspection} 
                style={{
                  background:'#f50',
                  height:'30px',
                  width:'30px',
                  borderRadius:'50%',
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  color:'#fff',
                  marginLeft:'10px',
                  cursor:'pointer',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <FormOutlined />
              </div>
            </Tooltip>

            <Tooltip title="Permission">
              <div 
                onClick={handlePermission} 
                style={{
                  background: '#1890ff',
                  height: '30px',
                  width: '30px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  marginLeft: '10px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <LockFilled />
              </div>
            </Tooltip>
          </div>
        </h1>
      </div>
      { cout ? 
        <div className="title_row">
          <h1 className="title_h1">
            <DollarOutlined style={{ marginRight: '8px' }} />
            <strong>COÛT : </strong> {cout || <Skeleton.Input active />} $
          </h1>
        </div> : ''
      }
      
      {cat.length > 0 ? (
    <div className="title_row" style={{ padding: '16px' }}>
      <h1 className="title_h1" style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <DollarOutlined style={{ marginRight: '6px' }} />
        <strong style={{ marginRight: '8px'}}>Categories</strong>
      </h1>
    {cat.map((dd, index) => (
      <Card
        key={index}
        hoverable
        style={{
          marginBottom: '12px',
          borderRadius: '6px',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          overflow: 'hidden',
          padding: '12px',
        }}
        bodyStyle={{ padding: '8px 12px' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.01)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.06)';
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ 
            fontWeight: '600', 
            fontSize: '12px', 
            color: '#1890ff', 
            backgroundColor: '#e6f7ff', 
            borderRadius: '50%', 
            width: '28px', 
            height: '28px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginRight: '8px'
          }}>
            {index + 1}
          </div>

          {/* Category Name */}
          <div style={{ fontWeight: '500', fontSize: '14px', color: '#3f8600', flex: 1 }}>
            {dd.nom_cat_tache}
          </div>

          {/* Category Cost */}
          <div style={{ fontWeight: '500', fontSize: '12px', color: '#52c41a' }}>
            <Badge count={`${dd.cout} $`} style={{ backgroundColor: '#52c41a', color: '#fff', fontSize: '12px', padding: '5px', display:'flex', alignItems:'center', justifyContent:'center'}} />
          </div>
        </div>
      </Card>
    ))}
  </div>
) : (
  ''
)}
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
        <ListeTracking idTache={idTache} fetchData={fetchData} />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'trackingForm'}
        onCancel={closeAllModals}
        footer={null}
        width={900}
        centered
      >
        <SuiviTache idTache={idTache} closeModal={()=>closeAllModals(null)} fetchData={fetchData} />
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

      <Modal
        title=""
        visible={modalType === 'DocumentTacheForm'}
        onCancel={closeAllModals}
        footer={null}
        centered
      >
        <TacheDoc idTache={idTache} fetchData={fetchData} closeModal={()=>setModalType(null)} />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'AddProjet'}
        onCancel={closeAllModals}
        footer={null}
        width={850}
        centered
      >
        <TacheProjet idTache={idTache} fetchData={fetchData} closeModal={()=>setModalType(null)} />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'associe_projet'}
        onCancel={closeAllModals}
        footer={null}
        width={500}
        centered
      >
        <ProjetAssocieForm idTache={idTache} fetchData={fetchData} closeModal={()=>setModalType(null)} />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'add_inspection'}
        onCancel={closeAllModals}
        footer={null}
        width={700}
        centered
      >
        <InstructionForm idBatiment={''} closeModal={closeAllModals} fetchData={fetchData} idInspection={''} idTache={idTache}/>
      </Modal>

      <Modal
        title=""
        visible={modalType === 'permission'}
        onCancel={closeAllModals}
        footer={null}
        width={1070}
        centered
      >
        <PermissionTache idTache={idTache}/>
      </Modal>

    </div>
  );
};

export default DetailTacheGlobalOne;
