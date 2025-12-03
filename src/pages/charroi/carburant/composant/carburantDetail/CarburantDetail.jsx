import { useCallback, useEffect, useMemo, useState } from 'react';
import { notification, Tooltip, Skeleton, Alert, Button, Divider, Tag } from 'antd';
import {
  CarOutlined,
  UserOutlined,
  DashboardOutlined,
  DollarOutlined,
  RightCircleFilled,
  LeftCircleFilled,
  CalendarOutlined,
  FireOutlined,
  MessageOutlined,
} from '@ant-design/icons';

import './carburantDetail.scss';
import { getCarburantOne } from '../../../../../services/carburantService';
import { formatNumber } from '../../../../../utils/formatNumber';

const CarburantDetail = ({ id_vehicule, idCarburant, allIds = [] }) => {
  const [data, setData] = useState(null);
  const [currentId, setCurrentId] = useState(idCarburant);
  const [loading, setLoading] = useState(true);

  const currentIndex = allIds.indexOf(currentId);
  const isFirst = currentIndex <= 0;
  const isLast = currentIndex === allIds.length - 1;

  const loadData = useCallback(async () => {
    if (!currentId) return;

    setLoading(true);

    try {
      const { data } = await getCarburantOne(id_vehicule, currentId);

      if (!data || !data[0]) {
        setData(null);
        return;
      }

      setData(data[0]);
    } catch (err) {
      notification.error({
        message: 'Erreur de chargement',
        description:
          err.response?.data?.message ||
          "Impossible de charger les détails du carburant.",
      });
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [currentId, id_vehicule]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const goNext = () => !isLast && setCurrentId(allIds[currentIndex + 1]);
  const goPrevious = () => !isFirst && setCurrentId(allIds[currentIndex - 1]);

  const dateOperation = useMemo(() => {
    if (!data?.date_operation) return '';
    return new Date(data.date_operation).toLocaleString();
  }, [data]);

  if (loading) return <Skeleton active paragraph={{ rows: 6 }} />;
  if (!data)
    return (
      <Alert
        message="Aucune donnée"
        description="Aucun détail carburant trouvé pour cet identifiant."
        type="warning"
        showIcon
      />
    );

  return (
    <div className="carburantPro fadeIn">

      <div className="top-navigation floating-nav">

        <Tooltip title="Précédent">
          <Button
            className="nav-arrow-btn"
            onClick={goPrevious}
            disabled={isFirst}
            icon={<LeftCircleFilled />}
          />
        </Tooltip>

        <div className="title-block">
          <FireOutlined className="main-icon pulse" />
          <h2>Détails Carburant</h2>
        </div>

        <Tooltip title="Suivant">
          <Button
            className="nav-arrow-btn"
            onClick={goNext}
            disabled={isLast}
            icon={<RightCircleFilled />}
          />
        </Tooltip>

      </div>

      <div id="pdf-content" className="content-wrapper">

        <div className="col">
          <section className="box elevated">
            <h3><CarOutlined style={{ color: "#1677ff" }}/> Informations Véhicule</h3>
            <Divider />
            <p><strong>Marque :</strong> {data.nom_marque}</p>
            <p><strong>Modèle :</strong> {data.nom_modele}</p>
            <p><strong>Chauffeur :</strong> <UserOutlined /> {data.nom_chauffeur || '—'}</p>
          </section>

          <section className="box elevated">
            <h3><FireOutlined style={{ color: "#ff4d4f" }}/> Carburant</h3>
            <Divider />
            <p><strong>Type :</strong> {data.nom_type_carburant}</p>
            <p><strong>Quantité :</strong> {formatNumber(data.quantite_litres)} L</p>
            <p><strong>Prix USD/L :</strong> {formatNumber(data.prix_usd)} $</p>
            <p><strong>Prix CDF/L :</strong> {formatNumber(data.prix_cdf)} Fc</p>
          </section>
        </div>

        <div className="col">
          <section className="box elevated">
            <h3><DollarOutlined style={{ color: "#faad14" }} /> Montants</h3>
            <Divider />
            <p><strong>Total USD :</strong> {formatNumber(data.montant_total_usd)} $</p>
            <p><strong>Total CDF :</strong> {formatNumber(data.montant_total_cdf)} Fc</p>
          </section>

          <section className="box elevated">
            <h3><DashboardOutlined style={{ color: "#0958d9" }}/> Opération</h3>
            <Divider />
            <p><strong>Date :</strong> <CalendarOutlined /> {dateOperation}</p>
            <p><strong>Compteur KM :</strong> {formatNumber(data.compteur_km)} Km</p>
            <p><strong>Distance :</strong> {formatNumber(data.distance)} km</p>
            <p><strong>Consommation :</strong> {formatNumber(data.consommation)} L/100km</p>
          </section>
        </div>

      </div>

      <section className="commentaire-box elevated">
        <h3><MessageOutlined /> Commentaire</h3>
        <Divider />
        <p>{data.commentaire || "Aucun commentaire"}</p>
      </section>

    </div>
  );
};

export default CarburantDetail;
