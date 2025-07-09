import { useEffect, useState } from 'react';
import {
  notification,
  Button,
  Card,
  Typography,
  Empty,
  Spin
} from 'antd';
import moment from 'moment';
import { useSelector } from 'react-redux';
import {
  getRetourVehicule,
  getRetourVehiculeExceptionnel,
  postRetourVehicule,
  postRetourVehiculeExceptionnel
} from '../../../../services/charroiService';
import './securiteRetour.scss';

const { Title, Text } = Typography;

const SecuriteRetour = () => {
  const [data, setData] = useState([]);
  const [exceptionnel, setException] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);

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

  const onFinish = async (idBandeSortie) => {
    const value = {
      id_bande_sortie: idBandeSortie,
      id_agent: userId
    };

    try {
      await postRetourVehicule(value);
      notification.success({
        message: 'Retour validé',
        description: `Le véhicule avec le bon de sortie ${idBandeSortie} a été validé pour l’entrée.`,
      });
      fetchData();
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: 'Impossible de valider le retour.',
      });
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

    try {
      await postRetourVehiculeExceptionnel(value);
      notification.success({
        message: 'Retour sans bon de sortie validé',
        description: 'Le véhicule sans bon de sortie a été validé pour l’entrée.',
      });
      fetchData();
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: 'Impossible de valider le retour exceptionnel.',
      });
    }
  };

  return (
    <div className="securiteRetour">
      <div className="securiteRetour_wrapper">
        <Title level={4} className="securite_title">
          🔁 Retours des véhicules
        </Title>

        {loading ? (
          <div className="securite_loader">
            <Spin tip="Chargement des véhicules..." size="large" />
          </div>
        ) : (
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
                      onClick={() => onFinish(d.id_bande_sortie)}
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
        )}
      </div>
    </div>
  );
};

export default SecuriteRetour;
