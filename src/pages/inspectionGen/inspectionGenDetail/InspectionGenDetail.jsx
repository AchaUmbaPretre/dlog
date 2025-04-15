import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Spin, notification, Image, Typography, Tag } from 'antd';
import { getSubInspection } from '../../../services/charroiService';
import moment from 'moment';
import config from '../../../config';

const { Title, Text, Paragraph } = Typography;

const InspectionGenDetail = ({ inspectionId }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

    const fetchDatas = async () => {
        setLoading(true);
        try {
            const response = await getSubInspection(inspectionId);
            setData(response.data);
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
        if (inspectionId) {
            fetchDatas();
        }
    }, [inspectionId]);

    return (
        <div style={{ padding: 16 }}>
            {loading ? (
                <Spin size="large" />
            ) : (
                <Row gutter={[16, 16]}>
                    {data.map((item) => (
                        <Col xs={24} md={12} lg={8} key={item.id_sub_inspection_gen}>
                            <Card
                                hoverable
                                cover={
                                    <Image
                                        className="userImg"
                                        src={`${DOMAIN}/${item.img}`}
                                        style={{ height: 200, objectFit: 'cover' }}
                                        alt="Profil utilisateur"
                                    />
                                }
                            >
                                <Title level={5}>{item.nom_marque} - {item.immatriculation}</Title>
                                <div style={{display:'flex', flexDirection:'column'}}>
                                    <Text strong>Type de réparation:</Text> <Text>{item.type_rep}</Text><br />
                                    <Text strong>Catégorie:</Text> <Text>{item.nom_cat_inspection}</Text><br />
                                    <Text strong>Caractéristique:</Text> <Text>{item.nom_carateristique_rep}</Text><br />
                                    <Text strong>Montant:</Text> <Text>{item.montant} $</Text><br />
                                    <Text strong>Date inspection:</Text> <Text>{moment(item.date_inspection).format('DD/MM/YYYY')}</Text><br />
                                    <Text strong>Statut:</Text> <Tag color="orange">{item.nom_type_statut}</Tag><br />
                                    <Paragraph>
                                        <Text strong>Commentaire:</Text><br />
                                        {item.commentaire}
                                    </Paragraph>
                                    <Paragraph>
                                        <Text strong>Avis:</Text><br />
                                        {item.avis}
                                    </Paragraph>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default InspectionGenDetail;
