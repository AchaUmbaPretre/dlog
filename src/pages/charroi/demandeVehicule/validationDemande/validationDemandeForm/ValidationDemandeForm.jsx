import { useEffect, useState } from 'react';
import { getBandeSortieOne, posValidationDemande } from '../../../../../services/charroiService';
import { notification, Button, message, Spin, Card } from 'antd';
import moment from 'moment';
import './validationDemandeForm.scss';
import { useSelector } from 'react-redux';

const ValidationDemandeForm = ({ closeModal, fetchData, id_bon }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingData, setLoadingData] = useState(false);
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);

    useEffect(() => {
        const fetchDataAsync = async () => {
            try {
                const response = await getBandeSortieOne(id_bon);
                setData(response.data[0]);
            } catch (error) {
                notification.error({
                    message: 'Erreur de chargement',
                    description: 'Une erreur est survenue lors du chargement des données.',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchDataAsync();
    }, [id_bon]);

    if (loading) {
        return (
            <div className="validationDemandeForm loading">
                <Spin size="large" />
            </div>
        );
    }

const onFinish = async () => {
  setLoadingData(true);
  const notificationKey = 'bon_de_sortie_validation';

  try {
    message.loading({ content: 'Validation en cours...', key: notificationKey });
    const v = {
        id_bande_sortie : id_bon,
        validateur_id : userId
    }
    await posValidationDemande(v);

    message.success({
      content: 'Le bon de sortie a été validé avec succès.',
      key: notificationKey,
      duration: 3,
    });

    fetchData();
    closeModal();

  } catch (error) {
    console.error('Erreur lors de la validation du bon de sortie:', error);

    const errorMsg = error?.response?.data?.message || 'Une erreur inattendue est survenue.';

    message.error({
      content: errorMsg,
      key: notificationKey,
      duration: 4,
    });

  } finally {
    setLoadingData(false);
  }
};


    return (
        <div className="validationDemandeForm">
            <div className="validationDemandeForm_wrapper">
                <div className="validation_title_row">
                    <h1 className="validation_h1">📝 Autorisation de sortie</h1>
                </div>
                <Card bordered={false} className="validation_card">
                <div className="validationDemande_top">
                    <Info label="👤 Agent" value={data?.personne_bord} />
                    <Info label="🏢 Service" value={data?.nom_service} />
                    <Info
                    label="🗓 Date & Heure"
                    value={`${moment(data?.date_prevue).isValid() ? moment(data.date_prevue).format('D-MM-YYYY [à] HH:mm') : 'Date prévue invalide'}
                    → 
                    ${moment(data?.date_retour).isValid() ? moment(data.date_retour).format('D-MM-YYYY [à] HH:mm') : 'Date retour invalide'}`}
                    />
                    <Info label="🎯 Raison" value={data?.nom_motif_demande} />
                    <Info label="🚗 Marque" value={data?.nom_marque} />
                    <Info label="📘 Modèle" value={data?.Yaris ?? 'Aucun'} />
                    <Info label="🔢 Plaque" value={data?.immatriculation} />
                    <Info label="🧑‍✈️ Chauffeur" value={data?.nom_chauffeur} />
                </div>
                </Card>


                <div className="validationDemande_bottom">
                    <Button className="validation_btn" type="primary" onClick={onFinish} disabled={loadingData} loading={loadingData}>
                        ✅ Valider la demande
                    </Button>
                </div>
            </div>
        </div>
    );
};

const Info = ({ label, value }) => (
    <div className="info-item">
        <span className="label">{label} :</span>
        <span className="value">{value}</span>
    </div>
);

export default ValidationDemandeForm;
