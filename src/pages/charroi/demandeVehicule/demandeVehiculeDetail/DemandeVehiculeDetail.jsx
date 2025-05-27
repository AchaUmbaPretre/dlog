import { useEffect, useState } from 'react';
import { getDemandeVehiculeOne } from '../../../../services/charroiService';
import { notification, Spin, Descriptions } from 'antd';

const DemandeVehiculeDetail = ({ id_demande_vehicule }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getDemandeVehiculeOne(id_demande_vehicule);
      if (response.data.length > 0) {
        setData(response.data[0]);
      } else {
        setData(null);
      }
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id_demande_vehicule) {
      fetchData();
    }
  }, [id_demande_vehicule]);

  if (loading) {
    return <Spin tip="Chargement des détails..." />;
  }

  if (!data) {
    return <p>Aucune donnée disponible.</p>;
  }

  return (
    <Descriptions
      title="Détails de la Demande de Véhicule"
      bordered
      column={1}
      size="middle"
    >
      <Descriptions.Item label="Client">{data.nom}</Descriptions.Item>
      <Descriptions.Item label="Nom du service">{data.nom_service}</Descriptions.Item>
      <Descriptions.Item label="Type de véhicule">{data.nom_type_vehicule}</Descriptions.Item>
      <Descriptions.Item label="Immatriculation">{data.immatriculation}</Descriptions.Item>
      <Descriptions.Item label="Nom du chauffeur">{data.nom_chauffeur}</Descriptions.Item>
      <Descriptions.Item label="Statut de la demande">{data.nom_type_statut}</Descriptions.Item>
      <Descriptions.Item label="Motif de la demande">{data.nom_motif_demande}</Descriptions.Item>
      <Descriptions.Item label="Localisation">{data.localisation}</Descriptions.Item>
      <Descriptions.Item label="Date de chargement">
        {new Date(data.date_chargement).toLocaleString()}
      </Descriptions.Item>
      <Descriptions.Item label="Date prévue">
        {new Date(data.date_prevue).toLocaleString()}
      </Descriptions.Item>
      <Descriptions.Item label="Date de retour">
        {new Date(data.date_retour).toLocaleString()}
      </Descriptions.Item>
      <Descriptions.Item label="Nom de l'utilisateur">{data.nom_user}</Descriptions.Item>
    </Descriptions>
  );
};

export default DemandeVehiculeDetail;