import { useEffect, useState } from 'react';
import { notification, message, Button, Tooltip, Modal, Card, Typography, Spin, Empty } from 'antd';
import { getSortieVehicule, postSortieVehicule } from '../../../../services/charroiService';
import { useSelector } from 'react-redux';
import { PlusCircleOutlined } from '@ant-design/icons';
import './securiteSortie.scss';
import moment from 'moment';
import SortieExceptionnelle from '../sortieExceptionnelle/SortieExceptionnelle';

const { Title, Text } = Typography;

const SecuriteSortie = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
  const [modalType, setModalType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleAdd = () => openModal('Exceptionnelle');

  const closeAllModals = () => {
    setModalType(null);
  };

  const openModal = (type) => {
      closeAllModals();
      setModalType(type);
  }

  const fetchData = async () => {
    try {
      const [ sortieData] = await Promise.all([
        getSortieVehicule()
      ])
      setData(sortieData.data);

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

  const groupByBandeSortie = (rawData) => {
  const grouped = {};

  rawData.forEach(item => {
    const id = item.id_bande_sortie;

    if (!grouped[id]) {
      grouped[id] = {
        ...item,
        signataires: []
      };
    }

    grouped[id].signataires.push({
      nom: item.personne_signe,
      role: item.role
    });
  });

  return Object.values(grouped);
    };

  const groupedData = groupByBandeSortie(data);

  const onFinish = async (d) => {
    const value = {
      id_bande_sortie: d.id_bande_sortie,
      id_vehicule: d.id_vehicule,
      id_chauffeur: d.id_chauffeur,
      id_destination: d.id_destination,
      id_motif: d.id_motif_demande,
      id_demandeur: d.id_demandeur,
      id_client: d.id_client,
      personne_bord: d.personne_bord,
      id_societe: d.id_societe,
      id_agent: userId,
    };
    const loadingKey = 'loadingSortie';
      message.loading({ content: 'Traitement en cours, veuillez patienter...', key: loadingKey, duration: 0 });
      setIsLoading(true);

    try {
      await postSortieVehicule(value);
      message.success({ content: `Le véhicule avec le bon de sortie N° ${d.id_bande_sortie} a été validé pour sortir.`, key: loadingKey });
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
    <div className='securiteSortie'>
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
      <div className="securiteSortie_wrapper">
        <Title level={4} className="securite_title">🚗 SORTIE DU VEHICULE</Title>
        {loading ? (
          <div className="securite_loader">
            <Spin tip="Chargement des véhicules..." size="large" />
          </div>
        ) : data.length === 0 ? (
          <Empty description="Aucune demande de sortie disponible." />
        ) : (
          <div className="securite_rows">
            {groupedData.map((d) => (
            <Card
                key={d.id_bande_sortie}
                className="securite_card"
                bordered
                hoverable
            >
                <div className="securite_card_content">
                  <div className="securite_info">
                    <Text strong>Marque :</Text>
                    <strong>{d.nom_marque}</strong>
                  </div>
                  <div className="securite_info">
                      <Text strong>Plaque :</Text>
                      <strong>{d.immatriculation}</strong>
                  </div>
                  <div className="securite_info">
                      <Text strong>Chauffeur :</Text>
                      <Text>{d.nom}</Text>
                  </div>
                <div className="securite_info">
                    <Text strong>Heure prévue :</Text>
                    <Text>{moment(d.date_prevue).format('HH:mm')}</Text>
                </div>
                <div className="securite_info">
                    <Text strong>Signataires :</Text>
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                    {d.signataires.map((s, i) => (
                        <li key={i}>{s.nom} <em>({s.role})</em></li>
                    ))}
                    </ul>
                </div>
                </div>

                <Button
                type="primary"
                size="small"
                loading={isLoading}
                disabled={isLoading}
                onClick={() => {
                  Modal.confirm({
                    title: 'Confirmation de sortie',
                    content: (
                      <div>
                        <p>Voulez-vous vraiment valider la sortie maintenant à <strong>{moment().format('HH:mm')}</strong> ?</p>
                        <p><strong>Véhicule :</strong> {d.nom_marque} - {d.immatriculation}</p>
                        <p><strong>Chauffeur :</strong> {d.nom}</p>
                      </div>
                    ),
                    okText: 'Oui, valider',
                    cancelText: 'Annuler',
                    onOk: () => onFinish(d),
                  });
                }}
              >
                Valider la sortie
              </Button>

            </Card>
            ))}
          </div>
        )}
      </div>

        <Modal
          title=""
          visible={modalType === 'Exceptionnelle'}
          onCancel={closeAllModals}
          footer={null}
          width={1000}
          centered
        >
          <SortieExceptionnelle closeModal={() => setModalType(null)} fetchData={fetchData} />
        </Modal>
    </div>
  );
};

export default SecuriteSortie;
