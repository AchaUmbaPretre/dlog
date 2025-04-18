import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Spin, notification, Typography, Tag } from 'antd';
import { getReparationOne } from '../../../../services/charroiService';
import moment from 'moment';

const { Title } = Typography;

const ReparationDetail = ({ idReparation }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchDatas = async () => {
        setLoading(true);
        try {
            const response = await getReparationOne(idReparation);
            setData(response.data.data?.[0]); // On récupère directement le 1er objet de "data"
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
        if (idReparation) {
            fetchDatas();
        }
    }, [idReparation]);

    return (
        <div style={{ padding: 16 }}>
            {loading ? (
                <Spin size="large" />
            ) : data ? (
                <Card>
                    <Title level={4}>Détails de la réparation</Title>
                    <Descriptions bordered column={1} size="middle">
                        <Descriptions.Item label="Immatriculation">
                            {data.immatriculation}
                        </Descriptions.Item>
                        <Descriptions.Item label="Marque">
                            {data.nom_marque}
                        </Descriptions.Item>
                        <Descriptions.Item label="Fournisseur">
                            {data.nom_fournisseur}
                        </Descriptions.Item>
                        <Descriptions.Item label="Type de réparation">
                            {data.type_rep}
                        </Descriptions.Item>
                        <Descriptions.Item label="Statut">
                            <Tag color="orange">{data.nom_type_statut}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Date d’entrée">
                            {data.date_entree ? moment(data.date_entree).format('DD/MM/YYYY') : 'N/A'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Date prévue de sortie">
                            {data.date_prevu ? moment(data.date_prevu).format('DD/MM/YYYY') : 'N/A'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Date réelle de sortie">
                            {data.date_sortie ? moment(data.date_sortie).format('DD/MM/YYYY') : 'Non sortie'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Coût">
                            {data.cout} $
                        </Descriptions.Item>
                        {data.code_rep && (
                            <Descriptions.Item label="Code réparation">
                                {data.code_rep}
                            </Descriptions.Item>
                        )}
                        {data.commentaire && (
                            <Descriptions.Item label="Commentaire">
                                {data.commentaire}
                            </Descriptions.Item>
                        )}
                    </Descriptions>
                </Card>
            ) : (
                <p>Aucune donnée trouvée pour cette réparation.</p>
            )}
        </div>
    );
};

export default ReparationDetail;
