import React, { useEffect, useState } from 'react';
import { notification, Skeleton, Card, Row, Col, Tag } from 'antd';
import { UserOutlined, BankOutlined,CalendarOutlined, DollarOutlined } from '@ant-design/icons';
import { getProjetOne } from '../../../../services/projetService';
import moment from 'moment';

const ProjetDetailGeneral = ({ idProjet }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProjetOne(idProjet);
        setData(response.data[0])
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

  if (loading) {
    return (
      <Card title="Chargement des détails de la tâche">
        <Skeleton active paragraph={{ rows: 4 }} />
      </Card>
    );
  }

  if (!data) {
    return <Card><div>Aucune donnée disponible</div></Card>;
  }

  return (
    <Card title="Détails du projet" bordered className="detail-tache-card">
      <Row gutter={18}>
        <Col xs={24} sm={12}>
          <Card type="inner" title="Informations générales" bordered className="detail-tache-inner-card">
            <p className="detail-tache-paragraph">
              <strong>Titre : </strong>
              {data.nom_projet || 'Non disponible'}
            </p>
            <p className="detail-tache-paragraph">
              <strong>Description : </strong>
              {data.description || 'Non disponible'}
            </p>
            <p className="detail-tache-paragraph">
              <strong>Client : </strong>
              <Tag icon={<UserOutlined />} color="blue">
                {data.nom || 'Non disponible'}
              </Tag>
            </p>
            <p className="detail-tache-paragraph">
              <strong>Batiment : </strong>
              <Tag icon={<BankOutlined />} color="blue">
                {data.nom_batiment || 'Non disponible'}
              </Tag>
            </p>
            <p className="detail-tache-paragraph">
              <strong>Statut : </strong>
              <Tag color={data.nom_type_statut === 'En attente' ? 'orange' : 'green'}>
                {data.statut || 'Non disponible'}
              </Tag>
            </p>
            <p className="detail-tache-paragraph">
              <strong>Budget : </strong>
              <Tag icon={<DollarOutlined />} color="blue">
                {data.montant || 'Non disponible'}
              </Tag>
            </p>
            <p className="detail-tache-paragraph">
              <strong>Responsable : </strong>
              <Tag icon={<UserOutlined />} color="blue">
                {data.responsable || 'Non disponible'}
              </Tag>
            </p>
          </Card>
        </Col>
        <Col xs={12} sm={12}>
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
      </Row>
    </Card>
  );
};

export default ProjetDetailGeneral;
