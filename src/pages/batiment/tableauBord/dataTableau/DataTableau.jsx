import React, { useEffect, useState } from 'react';
import './dataTableau.scss';
import { getDenominationCount, getNiveauCount, getTableauOne } from '../../../../services/batimentService';
import { notification,Tooltip, Card, Row, Col, Spin, Badge, Modal } from 'antd';
import { ToolOutlined, UnorderedListOutlined, PlusCircleOutlined, ApartmentOutlined, CheckCircleOutlined,BankOutlined, SettingOutlined, WarningOutlined } from '@ant-design/icons';
import DenominationForm from '../../denomination/denominationForm/DenominationForm';
import NiveauForm from '../../niveau/niveauForm/NiveauForm';
import { getBatimentOne } from '../../../../services/typeService';
import NiveauOne from '../../niveau/NiveauOne';
import DenominationOne from '../../denomination/DenominationOne';

const DataTableau = ({ idBatiment }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [nameBatiment, setNameBatiment] = useState('');
  const [modalType, setModalType] = useState(null);
  const [niveau, setNiveau] = useState([]);
  const [denomination, setDenomination] = useState([])

  const closeAllModals = () => {
    setModalType(null);
  };

  const openModal = (type, idBatiment = '') => {
    closeAllModals();
    setModalType(type);
  };

  const handleAddNiveau = ( idBatiment) =>{
    openModal('addNiveau', idBatiment)
  }

  const handleListeNiveau = (idBatiment) => openModal('listeNiveau', idBatiment)

  const handleAddDenom = ( idBatiment) =>{
    openModal('addDenomination', idBatiment)
  }

  const handleListeDenom = (idBatiment) => openModal('listeDenom', idBatiment)

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getTableauOne(idBatiment);
      setData(data[0]);
      setLoading(false);
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données.',
      });
      setLoading(false);
    }
  };

  const fetchDatas = async () => {
    setLoading(true);
    try {
      const [ niveauData, denominationData, batimentData] = await Promise.all([
        getNiveauCount(idBatiment),
        getDenominationCount(idBatiment),
        getBatimentOne(idBatiment)
      ])
      setNiveau(niveauData.data[0])
      setDenomination(denominationData.data[0])
      setNameBatiment(batimentData.data[0].nom_batiment)
      setLoading(false);
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données.',
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDatas()
  }, [idBatiment]);

  const renderDataCards = () => (
    <Row gutter={[16, 16]} justify="center" className="data-cards">
      <Col xs={24} sm={12} md={6}>
        <Card
          className="data-card"
          hoverable
          style={{ textAlign: 'center' }}
          bodyStyle={{ padding: '20px' }}
        >
          <Badge count={data.nbre_equipement || 0} showZero>
            <ToolOutlined style={{ fontSize: '40px', color: '#1890ff', marginBottom: '10px' }} />
          </Badge>
          <h3>Total Équipements</h3>
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card
          className="data-card"
          hoverable
          style={{ textAlign: 'center' }}
          bodyStyle={{ padding: '20px' }}
        >
          <Badge count={data.nbre_operationnel || 0} showZero>
            <CheckCircleOutlined style={{ fontSize: '40px', color: '#52c41a', marginBottom: '10px' }} />
          </Badge>
          <h3>Opérationnels</h3>
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card
          className="data-card"
          hoverable
          style={{ textAlign: 'center' }}
          bodyStyle={{ padding: '20px' }}
        >
          <Badge count={data.nbre_entretien || 0} showZero>
            <SettingOutlined style={{ fontSize: '40px', color: '#faad14', marginBottom: '10px' }} />
          </Badge>
          <h3>En Entretien</h3>
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card
          className="data-card"
          hoverable
          style={{ textAlign: 'center' }}
          bodyStyle={{ padding: '20px' }}
        >
          <Badge count={data.nbre_enpanne || 0} showZero>
            <WarningOutlined style={{ fontSize: '40px', color: '#f5222d', marginBottom: '10px' }} />
          </Badge>
          <h3>En Panne</h3>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card
          className="data-card"
          hoverable
          style={{ textAlign: 'center' }}
          bodyStyle={{ padding: '20px' }}
        >
          <Badge count={niveau.nbre_niveau || 0} showZero>
            <ApartmentOutlined style={{ fontSize: '40px', color: 'blue', marginBottom: '10px' }} />
          </Badge>
          <h3>Niveau</h3>
          <div className="row-flex">
            <Tooltip title="voir la liste">
              <UnorderedListOutlined className='row-icon' onClick={handleListeNiveau}/>
            </Tooltip>
            <Tooltip title="Ajoutez un niveau">
              <PlusCircleOutlined className='row-icon' onClick={handleAddNiveau}/>
            </Tooltip>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card
          className="data-card"
          hoverable
          style={{ textAlign: 'center' }}
          bodyStyle={{ padding: '20px' }}
        >
          <Badge count={denomination.nbre_denomination || 0} showZero>
            <BankOutlined style={{ fontSize: '40px', color: 'black', marginBottom: '10px' }} />
          </Badge>
          <h3>Dénomination</h3>
          <div className="row-flex">
            <Tooltip title="voir la liste">
              <UnorderedListOutlined className='row-icon' onClick={handleListeDenom}/>
            </Tooltip>
            <Tooltip title="Ajoutez une denomination">
              <PlusCircleOutlined className='row-icon' onClick={handleAddDenom}/>
            </Tooltip>
          </div>
        </Card>
      </Col>
    </Row>
  );

  return (
    <div className="dataTableau">
        <div className="title_row">
            <h1 className="title_h1">{ nameBatiment ? `Rapport de ${nameBatiment}` : ''}</h1>
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
          visible={modalType === 'addNiveau'}
          onCancel={closeAllModals}
          footer={null}
          width={600}
          centered
        >
          <NiveauForm idBatiment={idBatiment} closeModal={()=>setModalType(null)} fetchData={fetchData} />
        </Modal>
        <Modal
          title=""
          visible={modalType === 'listeNiveau'}
          onCancel={closeAllModals}
          footer={null}
          width={900}
          centered
        >
          <NiveauOne idBatiment={idBatiment} closeModal={()=>setModalType(null)} fetchData={fetchData} />
        </Modal>

        <Modal
          title=""
          visible={modalType === 'addDenomination'}
          onCancel={closeAllModals}
          footer={null}
          width={600}
          centered
        >
          <DenominationForm idBatiment={idBatiment} />
        </Modal>

        <Modal
          title=""
          visible={modalType === 'listeDenom'}
          onCancel={closeAllModals}
          footer={null}
          width={900}
          centered
        >
          <DenominationOne idBatiment={idBatiment} />
        </Modal>

    </div>
  );
};

export default DataTableau;
