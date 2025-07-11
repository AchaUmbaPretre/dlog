import { useEffect, useState } from 'react';
import { notification, Modal, Tooltip, message, Button, Card, Typography, Empty, Spin } from 'antd';
import { getSortieVisiteur, putSortieVisiteur } from '../../../../../services/charroiService';
import { PlusCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import VisiteurRetourExcelForm from '../visiteurRetourExceForm/VisiteurRetourExceForm';
const { Title, Text } = Typography;

const VisiteurSortie = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [modalType, setModalType] = useState(null);

  const buttonStyle = {
      border: 'none',
      borderRadius: '50%',
      background: '#1a73e8',
      height: '40px',
      width: '40px',
      color: '#fff',
      fontSize: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'background 0.3s',
  };

  const containerStyle = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: '10px',
  };
  
  const handleAdd = () => openModal('SortieExceptionnelle');
  const closeAllModals = () => {
    setModalType(null);
  };

  const openModal = (type) => {
      closeAllModals();
      setModalType(type);
  };

  const fetchData = async () => {
    try {
      const { data } = await getSortieVisiteur();
      setData(data);

    } catch (error) {
        console.log(error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const onFinish = async (idVisiteur) => {
      const loadingKey = 'loadingVisiteur';
      message.loading({ content: 'Traitement en cours, veuillez patienter...', key: loadingKey, duration: 0 });
      setIsLoading(true);
    try {
      await putSortieVisiteur(idVisiteur);
      message.success({ content: "Le visiteur est sorti", key: loadingKey });
      fetchData();
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: 'Impossible de valider la sortie.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='securiteRetour'>
      <div style={containerStyle}>
        <Tooltip title="Nouvelle sortie sans bon" placement="top">
          <Button
            onClick={handleAdd}
            style={buttonStyle}
            aria-label="Ajouter une sortie"
                    title="Nouvelle sortie sans bon"
          >
            <PlusCircleOutlined />
          </Button>
        </Tooltip>
      </div>
      <div className="securiteRetour_wrapper">
        <Title level={5} className="securite_title">🔁 Sortie des visiteurs</Title>

        {loading ? (
          <div className="securite_loader">
            <Spin tip="Chargement des ..." size="large" />
          </div>
        ) : data.length === 0 ? (
          <Empty description="Aucun piéton disponible." />
        ) : (
          <div className="securite_rows">
            {data.map((d) => (
              <Card
                key={d.id_visiteur}
                className="securite_card"
                bordered
                hoverable
              >
                <div className="securite_card_content">

                  <div className="securite_info">
                    <Text strong>Chauffeur : </Text>
                    <Text>{d?.nom_chauffeur}</Text>
                  </div>

                  <div className="securite_info">
                    <Text strong>Plaque : </Text>
                    <Text>{d?.immatriculation}</Text>
                  </div>

                  <div className="securite_info">
                    <Text strong>Heure d'entrée : </Text>
                    <Text>{moment(d?.date_entree).format("HH:mm")}</Text>
                  </div>
                </div>

                <Button
                  type="primary"
                  size="small"
                  loading={isLoading}
                  onClick={() => onFinish(d.id_registre_visiteur)}
                >
                  Valider le retour
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Modal
        title=""
        visible={modalType === 'sortieExceptionnelle'}
        onCancel={closeAllModals}
        footer={null}
        width={1000}
        centered
      >
        <VisiteurRetourExcelForm closeModal={() => setModalType(null)} fetchData={fetchData} />
      </Modal>
    </div>
  );
};

export default VisiteurSortie;
