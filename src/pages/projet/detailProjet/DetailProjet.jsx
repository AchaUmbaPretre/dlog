import React, { useEffect, useState } from 'react';
import { Descriptions, Card, Badge, Avatar, Row, Col, Divider, notification, List } from 'antd';
import { UserOutlined, ProjectOutlined, CalendarOutlined, InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { getProjetOne, getProjetTacheOne } from '../../../services/projetService';

const DetailProjet = ({ idProjet }) => {
    const [projet, setProjet] = useState({});
    const [taches, setTaches] = useState([]);
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

      useEffect(() => {
        const fetchTaches = async () => {
          try {
            const response = await getProjetTacheOne(idProjet);
            setTaches(response.data);
          } catch (error) {
            notification.error({
              message: 'Erreur de chargement',
              description: 'Une erreur est survenue lors du chargement des données. Veuillez réessayer plus tard.',
            });
          } finally {
            setLoading(false);
          }
        };
      
        fetchTaches();
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
            <div dangerouslySetInnerHTML={{ __html: projet.description }} />
            </Descriptions.Item>
            <Descriptions.Item label={<><CalendarOutlined /> Date de Début</>}>
              {new Date(projet.date_debut).toLocaleDateString()}
            </Descriptions.Item>
            <Descriptions.Item label={<><CalendarOutlined /> Date de Fin</>}>
              {new Date(projet.date_fin).toLocaleDateString()}
            </Descriptions.Item>
            <Descriptions.Item label={<><InfoCircleOutlined /> Statut</>}>
              <Badge status={statusColor} text={projet?.nom_type_statut} />
            </Descriptions.Item>
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
        
        <Col span={24}>
          <Divider orientation="left">Tâches</Divider>
          <List
            itemLayout="vertical"
            size="large"
            dataSource={taches}
            renderItem={tache => (
              <Card
                style={{ marginBottom: 16 }}
                type="inner"
                title={tache.nom_tache}
                extra={<Badge status={tache.statut === 'En attente' ? 'orange' : 'green'} text={tache.statut} />}
              >
                <Descriptions size="small" column={1} bordered>
                  <Descriptions.Item label={<><CalendarOutlined /> Date de Début</>}>
                    {new Date(tache.date_debut).toLocaleDateString()}
                  </Descriptions.Item>
                  <Descriptions.Item label={<><CalendarOutlined /> Date de Fin</>}>
                    {new Date(tache.date_fin).toLocaleDateString()}
                  </Descriptions.Item>
                  <Descriptions.Item label={<><UserOutlined /> Responsable</>}>
                    {tache.owner}
                  </Descriptions.Item>
                  <Descriptions.Item label="Fréquence">{tache.frequence}</Descriptions.Item>
                  <Descriptions.Item label="Client">{tache.nom_client}</Descriptions.Item>
                  <Descriptions.Item label="Ville">{tache.ville}</Descriptions.Item>
                  <Descriptions.Item label="Département">{tache.departement}</Descriptions.Item>
                  <Descriptions.Item label="Nombre de Jours">{tache.nbre_jour}</Descriptions.Item>
                </Descriptions>
              </Card>
            )}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default DetailProjet;
