import { useEffect, useState } from 'react';
import { getBandeSortieOne } from '../../../../../services/charroiService';
import { notification, Button, Spin } from 'antd';
import './validationDemandeForm.scss';

const ValidationDemandeForm = ({ closeModal, fetchData, id_bon }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="validationDemandeForm">
            <div className="validationDemandeForm_wrapper">
                <div className="validation_title_row">
                    <h1 className="validation_h1">📝 Autorisation de sortie</h1>
                </div>

                <div className="validationDemande_top">
                    <Info label="Nom de l'agent" value={data?.personne_bord} />
                    <Info label="Service" value={data?.nom_service} />
                    <Info
                        label="Date & heure"
                        value={`${moment(data?.date_prevue).format('dddd D MMMM YYYY à HH:mm')} → ${moment(data?.date_retour).format('dddd D MMMM YYYY à HH:mm')}`}
                    />
                    <Info label="Raison" value={data?.nom_motif_demande} />
                    <Info label="Marque" value={data?.nom_marque} />
                    <Info label="Modèle" value={data?.Yaris ?? 'Aucun'} />
                    <Info label="Plaque" value={data?.immatriculation} />
                    <Info label="Chauffeur" value={data?.nom_chauffeur} />
                </div>

                <div className="validationDemande_bottom">
                    <Button className="validation_btn" type="primary" onClick={() => {}}>
                        ✅ Valider la demande
                    </Button>
                </div>
            </div>
        </div>
    );
};

// Petite sous-composant pour éviter la répétition
const Info = ({ label, value }) => (
    <div className="info-item">
        <span className="label">{label} :</span>
        <span className="value">{value}</span>
    </div>
);

export default ValidationDemandeForm;
