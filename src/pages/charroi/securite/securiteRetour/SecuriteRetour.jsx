import { useEffect, useState } from 'react';
import {
  notification,
  Button,
  Card,
  Typography,
  Empty,
  message,
  Tooltip,
  Modal
} from 'antd';
import moment from 'moment';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import {
  getRetourVehicule,
  getRetourVehiculeExceptionnel,
  postRetourVehicule,
  postRetourVehiculeExceptionnel
} from '../../../../services/charroiService';
import './securiteRetour.scss';
import RetourExceptionnelle from '../retourExceptionnelle/RetourExceptionnelle';

const { Title, Text } = Typography;

const SecuriteRetour = () => {
  const [data, setData] = useState([]);
  const [exceptionnel, setException] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isloading, setIsLoading] = useState(false);
  const [modalType, setModalType] = useState(null);
  const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);

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

  const handleAdd = () => openModal('retourExceptionnelle');

  const closeAllModals = () => {
    setModalType(null);
  };

  const openModal = (type) => {
      closeAllModals();
      setModalType(type);
  }

  const fetchData = async () => {
    setLoading(true);
    try {
      const [retourData, excepData] = await Promise.all([
        getRetourVehicule(),
        getRetourVehiculeExceptionnel()
      ]);
      setData(retourData.data || []);
      setException(excepData.data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

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

    const loadingKey = 'loadingSecurite';
    message.loading({ content: 'Traitement en cours, veuillez patienter...', key: loadingKey, duration: 0 });
    setIsLoading(true);

    try {
      await postRetourVehicule(value);
      message.success({ content:  `Le véhicule avec le bon de sortie ${d.id_bande_sortie} a été validé pour l’entrée.`, key: loadingKey });

      fetchData();
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: 'Impossible de valider le retour.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onFinishExcep = async (
    id_sortie_retour,
    id_vehicule,
    id_chauffeur,
    id_destination,
    id_motif,
    id_demandeur,
    personne_bord,
    autorise_par
  ) => {
    const value = {
      id_sortieRetourParent: id_sortie_retour,
      id_vehicule,
      id_chauffeur,
      id_destination,
      id_motif,
      id_demandeur,
      personne_bord,
      autorise_par,
      id_agent: userId
    };

    const loadingKey = 'loadingSecurite';
    message.loading({ content: 'Traitement en cours, veuillez patienter...', key: loadingKey, duration: 0 });
    setIsLoading(true);

    try {
      await postRetourVehiculeExceptionnel(value);
        message.success({ content:  `Le véhicule sans bon de sortie a été validé pour l’entrée.`, key: loadingKey });
      fetchData();
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: 'Impossible de valider le retour exceptionnel.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="securiteRetour">
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
        <Title level={4} className="securite_title">
          🔁 Retours des véhicules
        </Title>

          <>
            {/* Retours normaux */}
            {data.length === 0 ? (
              <Empty description="Aucun retour de véhicule avec bon de sortie." />
            ) : (
              <div className="securite_rows">
                {data.map((d) => (
                  <Card
                    key={d.id_bande_sortie}
                    className="securite_card"
                    bordered
                    hoverable
                  >
                    <div className="securite_card_content">
                      <div className="securite_info">
                        <Text strong>Véhicule : </Text>
                        <Text>{d?.immatriculation}</Text>
                      </div>
                      <div className="securite_info">
                        <Text strong>Chauffeur : </Text>
                        <Text>{d?.nom}</Text>
                      </div>
                    </div>

                    <Button
                      type="primary"
                      size="small"
                      htmlType="button"
                      loading={isloading}
                      onClick={() => onFinish(d)}
                    >
                      Valider le retour
                    </Button>
                  </Card>
                ))}
              </div>
            )}

            {/* Retours exceptionnels */}
            {exceptionnel.length > 0 && (
            <>
              <Title level={5} style={{ marginTop: 24 }}>
                🚨 Retours exceptionnels (sans bon de sortie)
              </Title>

              <div className="securite_rows">
                {exceptionnel.map((d) => (
                  <Card
                    key={d.id_sortie_retour}
                    className="securite_card"
                    bordered
                    hoverable
                  >
                    <div className="securite_card_content">
                      <div className="securite_info">
                        <Text strong>Véhicule : </Text>
                        <Text>{d?.immatriculation}</Text>
                      </div>
                      <div className="securite_info">
                        <Text strong>Chauffeur : </Text>
                        <Text>{d?.nom_chauffeur}</Text>
                      </div>
                      <div className="securite_info">
                        <Text strong>Heure de sortie : </Text>
                        <Text>{moment(d?.created_at).format("HH:mm")}</Text>
                      </div>
                    </div>

                    <Button
                      type="primary"
                      htmlType="button"
                      size="small"
                      loading={isloading}
                      disabled={isloading}
                      onClick={() =>
                        onFinishExcep(
                          d.id_sortie_retour,
                          d.id_vehicule,
                          d.id_chauffeur,
                          d.id_destination,
                          d.id_motif,
                          d.id_demandeur,
                          d.personne_bord,
                          d.autorise_par
                        )
                      }
                    >
                      Valider le retour
                    </Button>
                  </Card>
                ))}
              </div>
            </>
)}

          </>
      </div>
        <Modal
          title=""
          visible={modalType === 'retourExceptionnelle'}
          onCancel={closeAllModals}
          footer={null}
          width={1000}
          centered
        >
          <RetourExceptionnelle closeModal={() => setModalType(null)} fetchData={fetchData} />
        </Modal>
    </div>
  );
};

export default SecuriteRetour;
