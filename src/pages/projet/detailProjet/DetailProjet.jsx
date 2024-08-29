import React, { useEffect, useState } from 'react';
import { Descriptions, Card, Badge, Avatar, Row, Col, Divider, notification } from 'antd';
import { UserOutlined, ProjectOutlined, CalendarOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { getProjetOne } from '../../../services/projetService';

const DetailProjet = ({ idProjet }) => {
    const [projet, setProjet] = useState([]);
    const [tache, setTache] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await getProjetOne(idProjet);
            setProjet(response.data[0]);
          } catch (error) {
            notification.error({
              message: 'Erreur de chargement',
              description: 'Une erreur est survenue lors du chargement des données. Veuillez réessayer plus tard.',
            });
          } finally {
            setLoading(false);
          }
        };
      
        fetchData();
      }, [idProjet]);

  const statusColor = projet.nom_type_statut === 'En attente' ? 'orange' : 'green';

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ProjectOutlined style={{ marginRight: 8 }} />
          {projet.nom_projet}
        </div>
      }
      bordered={false}
      style={{ maxWidth: 800, margin: '20px auto', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: 8 }}
      headStyle={{ backgroundColor: '#f0f2f5' }}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Descriptions size="middle" column={1} bordered>
            <Descriptions.Item label={<><InfoCircleOutlined /> Description</>}>
              {projet.description}
            </Descriptions.Item>
            <Descriptions.Item label={<><CalendarOutlined /> Date de Début</>}>
              {new Date(projet.date_debut).toLocaleDateString()}
            </Descriptions.Item>
            <Descriptions.Item label={<><CalendarOutlined /> Date de Fin</>}>
              {new Date(projet.date_fin).toLocaleDateString()}
            </Descriptions.Item>
{/*             <Descriptions.Item label={<><InfoCircleOutlined /> Statut</>}>
              <Badge status={statusColor} text={projet?.nom_type_statut} />
            </Descriptions.Item> */}
          </Descriptions>
        </Col>

        <Col span={24}>
          <Divider orientation="left">Responsable</Divider>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
            <div style={{ marginLeft: 16 }}>
              <p style={{ margin: 0, fontWeight: 500 }}>{projet.responsable}</p>
              <p style={{ margin: 0, color: 'gray' }}>{projet.nom}</p>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default DetailProjet;