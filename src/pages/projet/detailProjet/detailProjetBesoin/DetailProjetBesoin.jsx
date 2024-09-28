import React, { useEffect, useState } from 'react'
import { getBesoinOne } from '../../../../services/besoinsService';
import { Card, Descriptions, Col, Row, Divider, Badge, List, notification } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';

const DetailProjetBesoin = ({idProjet}) => {
    const [besoin, setBesoin] = useState([]);
    const [loading, setLoading] = useState([]);

    useEffect(() => {
        const fetchBesoin = async () => {
            try {
                const response = await getBesoinOne(idProjet);
                setBesoin(response.data);
            } catch (error) {
                notification.error({
                    message: 'Erreur de chargement',
                    description: 'Une erreur est survenue lors du chargement des besoins. Veuillez réessayer plus tard.',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchBesoin();
    }, [idProjet]);

  return (
    <>
        <Card
            bordered={false}
            style={{ maxWidth: 800, margin: '20px auto', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: 8 }}
            headStyle={{ backgroundColor: '#f0f2f5' }}
        >
            <Row gutter={[16, 16]}>
            <Col span={24}>
                    <Divider orientation="left">Besoins</Divider>
                    <List
                        itemLayout="vertical"
                        size="large"
                        dataSource={besoin}
                        renderItem={item => (
                            <Card
                                style={{ marginBottom: 16 }}
                                type="inner"
                                title={item?.nom_article}
                                extra={<Badge status="default" text={`Quantité: ${item?.quantite}`} />}
                            >
                                <Descriptions size="small" column={1} bordered>
                                    <Descriptions.Item label={<><CalendarOutlined /> Date de Création</>}>
                                        {new Date(item?.date_creation).toLocaleDateString()}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Priorité">
                                        {item?.priorite}
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>
                        )}
                    />
                </Col>
            </Row>
        </Card>
    </>
  )
}

export default DetailProjetBesoin