import React, { useEffect, useRef, useState } from 'react';
import { notification, Skeleton, Alert, Button, Divider } from 'antd';
import {
  CarOutlined,
  UserOutlined,
  DashboardOutlined,
  DollarOutlined,
  FilePdfOutlined,
  CalendarOutlined,
  FireOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import './carburantDetail.scss';
import { getCarburantOne } from '../../../../services/carburantService';
import { formatNumber } from '../../../../utils/formatNumber';

const CarburantDetail = ({ id_vehicule, idCarburant }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const { data } = await getCarburantOne(id_vehicule, idCarburant);
      setData(data[0]);
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Impossible de charger les détails du carburant.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idCarburant) {
      setLoading(true);
      fetchData();
    }
  }, [idCarburant]);

  if (loading) return <Skeleton active paragraph={{ rows: 6 }} />;

  if (!data)
    return (
      <Alert
        message="Aucune donnée"
        description="Aucun détail trouvé."
        type="warning"
        showIcon
      />
    );

  return (
    <div className="carburantPro">

      <div className="top-header">
        <div className="title-block">
          <FireOutlined className="icon" />
          <h2>Détails Carburant</h2>
        </div>
      </div>

      <div id="pdf-content" className="content-wrapper">

        <div className="col">

          <section className="box">
            <h3><CarOutlined /> Informations Véhicule</h3>
            <Divider />
            <p><strong>Marque :</strong> {data.nom_marque}</p>
            <p><strong>Modèle :</strong> {data.nom_modele}</p>
            <p><strong>Chauffeur :</strong> <UserOutlined /> {data.nom_chauffeur || '—'}</p>
          </section>

          <section className="box">
            <h3><FireOutlined /> Carburant</h3>
            <Divider />
            <p><strong>Type :</strong> {data.nom_type_carburant}</p>
            <p><strong>Quantité :</strong> {formatNumber(data.quantite_litres)} L</p>
            <p><strong>Prix USD/L :</strong> {formatNumber(data.prix_usd)} $</p>
            <p><strong>Prix CDF/L :</strong> {formatNumber(data.prix_cdf)}</p>
          </section>

        </div>

        <div className="col">

          <section className="box">
            <h3><DollarOutlined /> Montants</h3>
            <Divider />
            <p><strong>Total USD :</strong> {formatNumber(data.montant_total_usd)} $</p>
            <p><strong>Total CDF :</strong> {formatNumber(data.montant_total_cdf)}</p>
          </section>

          <section className="box">
            <h3><DashboardOutlined /> Opération</h3>
            <Divider />
            <p><strong>Date :</strong> <CalendarOutlined /> {new Date(data.date_operation).toLocaleString()}</p>
            <p><strong>Compteur KM :</strong> {formatNumber(data.compteur_km)}</p>
            <p><strong>Distance :</strong> {formatNumber(data.distance)} km</p>
            <p><strong>Consommation :</strong> {formatNumber(data.consommation)} L/100km</p>
          </section>
        </div>
      </div>

      <section className="commentaire-box">
        <h3><MessageOutlined /> Commentaire</h3>
        <Divider />
        <p>{data.commentaire || "Aucun commentaire"}</p>
      </section>

    </div>
  );
};

export default CarburantDetail;
