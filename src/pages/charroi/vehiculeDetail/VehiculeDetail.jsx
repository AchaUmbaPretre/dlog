import React, { useEffect, useState } from 'react';
import { Descriptions, Card, Image, Spin, Row, Col, notification, Empty } from 'antd';
import { getVehiculeOne } from '../../../services/charroiService';
import { CarOutlined } from '@ant-design/icons';

const VehiculeDetail = ({ idVehicule }) => {
    const [loading, setLoading] = useState(true);
    const [vehicule, setVehicule] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data } = await getVehiculeOne(idVehicule);
            setVehicule(data.data[0]);
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
        if (idVehicule) fetchData();
    }, [idVehicule]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!vehicule) {
        return (
            <Empty
                description="Aucune information sur ce véhicule"
                style={{ padding: '50px 0' }}
            />
        );
    }

    return (
        <Card
            title={
                <span><CarOutlined style={{ marginRight: 8 }} />Détail du Véhicule</span>
            }
            bordered={false}
            style={{ maxWidth: 1000, margin: '0 auto' }}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24} md={10}>
                    <Image
                        src={`/${vehicule.img}`}
                        alt="Image véhicule"
                        width="100%"
                        style={{ borderRadius: 8 }}
                        placeholder
                    />
                </Col>
                <Col xs={24} md={14}>
                    <Descriptions
                        column={1}
                        bordered
                        size="middle"
                        labelStyle={{ fontWeight: 'bold', width: 150 }}
                    >
                        <Descriptions.Item label="Marque">{vehicule.nom_marque}</Descriptions.Item>
                        <Descriptions.Item label="Modèle">{vehicule.modele}</Descriptions.Item>
                        <Descriptions.Item label="Catégorie">{vehicule.nom_cat}</Descriptions.Item>
                        <Descriptions.Item label="Immatriculation">{vehicule.immatriculation}</Descriptions.Item>
                        <Descriptions.Item label="Châssis">{vehicule.num_chassis}</Descriptions.Item>
                        <Descriptions.Item label="Couleur">{vehicule.nom_couleur}</Descriptions.Item>
                        <Descriptions.Item label="Date de mise en service">
                            {new Date(vehicule.date_service).toLocaleDateString()}
                        </Descriptions.Item>
                        <Descriptions.Item label="Année fabrication">{vehicule.annee_fabrication}</Descriptions.Item>
                        <Descriptions.Item label="Année circulation">{vehicule.annee_circulation}</Descriptions.Item>
                        <Descriptions.Item label="Nombre de portes">{vehicule.nbre_portes}</Descriptions.Item>
                        <Descriptions.Item label="Nombre de places">{vehicule.nbre_place}</Descriptions.Item>
                        <Descriptions.Item label="Nombre de moteurs">{vehicule.nbre_moteur}</Descriptions.Item>
                        <Descriptions.Item label="Pneus">{vehicule.pneus}</Descriptions.Item>
                        <Descriptions.Item label="Capacité carburant">{vehicule.capacite_carburant} L</Descriptions.Item>
                        <Descriptions.Item label="Capacité carter">{vehicule.capacite_carter} L</Descriptions.Item>
                        <Descriptions.Item label="Capacité radiateur">{vehicule.capacite_radiateur} L</Descriptions.Item>
                        <Descriptions.Item label="Dimensions (L x l x h)">
                            {vehicule.longueur} x {vehicule.largeur} x {vehicule.hauteur} mm
                        </Descriptions.Item>
                        <Descriptions.Item label="Poids">{vehicule.poids} kg</Descriptions.Item>
                    </Descriptions>
                </Col>
            </Row>
        </Card>
    );
};

export default VehiculeDetail;
