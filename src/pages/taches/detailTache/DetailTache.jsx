import React, { useEffect, useState } from 'react';
import { getTacheOne } from '../../../services/tacheService';
import { notification, Spin, Card, Row, Col, Tag, Tooltip } from 'antd';
import { UserOutlined, CalendarOutlined, EnvironmentOutlined, InfoCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import './detailTache.css';

const DetailTache = ({ idTache }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTacheOne(idTache);
        setData(response.data[0]);
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
  }, [idTache]);

  if (loading) {
    return <Spin tip="Chargement..." />;
  }

  if (!data) {
    return <Card><div>Aucune donnée disponible</div></Card>;
  }

  return (
    <Card title="Détails de la tâche" bordered className="detail-tache-card">
      <Row gutter={16}>
        <Col span={12}>
          <Card type="inner" title="Informations générales" bordered className="detail-tache-inner-card">
            <p className="detail-tache-paragraph">
              <strong>Nom de la tâche : </strong>
              {data.nom_tache || 'Non disponible'}
            </p>
            <p className="detail-tache-paragraph">
              <strong>Description : </strong>
              {data.description || 'Non disponible'}
            </p>
            <p className="detail-tache-paragraph">
              <strong>Client : </strong>
              <Tag icon={<UserOutlined />} color="blue">
                {data.nom_client || 'Non disponible'}
              </Tag>
            </p>
            <p className="detail-tache-paragraph">
              <strong>Propriétaire : </strong>
              <Tag icon={<UserOutlined />} color="blue">
                {data.owner || 'Non disponible'}
              </Tag>
            </p>
            <p className="detail-tache-paragraph">
              <strong>Demandeur : </strong>
              <Tag icon={<UserOutlined />} color="blue">
                {data.demandeur || 'Non disponible'}
              </Tag>
            </p>
          </Card>
        </Col>
        <Col span={12}>
          <Card type="inner" title="Détails supplémentaires" bordered className="detail-tache-inner-card">
            <p className="detail-tache-paragraph">
              <strong>Ville : </strong>
              <Tag icon={<EnvironmentOutlined />} color="green">
                {data.ville || 'Non disponible'}
              </Tag>
            </p>
            <p className="detail-tache-paragraph">
              <strong>Département : </strong>
              {data.departement || 'Non disponible'}
            </p>
            <p className="detail-tache-paragraph">
              <strong>Entité : </strong>
              {data.nom_batiment || 'Non disponible'}
            </p>
            <p className="detail-tache-paragraph">
              <strong>Fréquence : </strong>
              <Tag color="blue">{data.frequence || 'Non disponible'}</Tag>
            </p>
            <p className="detail-tache-paragraph">
              <strong>Statut : </strong>
              <Tag color={data.statut === 'En attente' ? 'orange' : 'green'}>
                {data.statut || 'Non disponible'}
              </Tag>
            </p>
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card type="inner" title="Dates" bordered className="detail-tache-inner-card">
            <p className="detail-tache-paragraph">
              <strong>Date de début : </strong>
              <Tag icon={<CalendarOutlined />} color="purple">
                {moment(data.date_debut).format('LL') || 'Non disponible'}
              </Tag>
            </p>
            <p className="detail-tache-paragraph">
              <strong>Date de fin : </strong>
              <Tag icon={<CalendarOutlined />} color="purple">
                {moment(data.date_fin).format('LL') || 'Non disponible'}
              </Tag>
            </p>
            <p className="detail-tache-paragraph">
              <strong>Nombre de jours : </strong>
              {data.nbre_jour !== null ? `${data.nbre_jour} jours` : 'Non disponible'}
            </p>
          </Card>
        </Col>
{/*         <Col span={12}>
          <Card type="inner" title="Contrôle" bordered className="detail-tache-inner-card">
            <p className="detail-tache-paragraph">
              <Tooltip title="Contrôle de base effectué" color="blue">
                <InfoCircleOutlined style={{ marginRight: 8 }} />
                <strong>Contrôle de base : </strong>
              </Tooltip>
              {data.controle_de_base !== null ? 'Effectué' : 'Non effectué'}
            </p>
          </Card>
        </Col> */}
      </Row>
    </Card>
  );
};

export default DetailTache;
