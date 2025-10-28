import { useEffect, useState } from 'react';
import { Card, Descriptions, Spin, Typography, Row, Col, Image, Tag } from 'antd';
import moment from 'moment';
import { getVehiculeCourseOne } from '../../../../../services/charroiService';
import config from '../../../../../config';
import './bandeSortieDetail.scss';

const { Title, Text } = Typography;

const BandeSortieDetail = ({ id_bon }) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  const fetchDatas = async () => {
    setIsLoading(true);
    try {
      const response = await getVehiculeCourseOne(id_bon);
      setData(response.data[0]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDatas();
  }, [id_bon]);

  if (isLoading || !data) {
    return (
      <div className="bande-sortie__loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="bande-sortie__container">
      <Card className="bande-sortie__card">
        {/* HEADER SOCIÉTÉ */}
        <Row justify="space-between" align="middle" className="bande-sortie__header">
          <Col span={14}>
            <Title level={4} className="bande-sortie__company-name">
              {data.nom_societe}
            </Title>
            <div className="bande-sortie__company-info">
              <Text strong>RCCM:</Text> {data.rccm} <br />
              <Text strong>NIF:</Text> {data.nif} <br />
              <Text strong>Email:</Text> {data.email} <br />
              <Text strong>Téléphone:</Text> {data.telephone}
            </div>
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Image
              width={110}
              src={`${DOMAIN}/${data.logo}`}
              alt="Logo"
              preview={false}
              className="bande-sortie__logo"
            />
          </Col>
        </Row>

        <Descriptions
          title={<span className="bande-sortie__section-title">🧾 Détails du Bon de Sortie</span>}
          bordered
          column={2}
          size="middle"
          className="bande-sortie__details"
        >
          <Descriptions.Item label="Nom">{data.nom}</Descriptions.Item>
          <Descriptions.Item label="Service">{data.nom_service}</Descriptions.Item>
          <Descriptions.Item label="Rôle">{data.role}</Descriptions.Item>
          <Descriptions.Item label="Motif">{data.nom_motif_demande}</Descriptions.Item>
          <Descriptions.Item label="Date prévue">
            {moment(data.date_prevue).format('DD/MM/YYYY HH:mm')}
          </Descriptions.Item>
          <Descriptions.Item label="Date retour">
            {moment(data.date_retour).format('DD/MM/YYYY HH:mm')}
          </Descriptions.Item>
          <Descriptions.Item label="Adresse">{data.adresse}</Descriptions.Item>
          <Descriptions.Item label="Destination">{data.nom_destination}</Descriptions.Item>
          <Descriptions.Item label="Immatriculation">
            {data.immatriculation} ({data.nom_marque})
          </Descriptions.Item>
          <Descriptions.Item label="Type véhicule">{data.nom_type_vehicule}</Descriptions.Item>
          <Descriptions.Item label="Personnes à bord">{data.personne_bord}</Descriptions.Item>
          <Descriptions.Item label="Commentaire">{data.commentaire || 'Aucun'}</Descriptions.Item>
          <Descriptions.Item label="Statut">
            <Tag
              color={
                data.nom_type_statut === 'BS validé'
                  ? 'green'
                  : data.nom_type_statut === 'Départ'
                  ? 'blue'
                  : 'red'
              }
              className="bande-sortie__status-tag"
            >
              {data.nom_type_statut}
            </Tag>
          </Descriptions.Item>
        </Descriptions>

        <Row justify="space-between" align="middle" className="bande-sortie__signature">
          <Col>
            <Text strong>Signé par:</Text> {data.personne_signe}
          </Col>
          <Col>
            <Image
              width={130}
              src={`${DOMAIN}/${data.signature}`}
              alt="Signature"
              preview={false}
              className="bande-sortie__signature-img"
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default BandeSortieDetail;
