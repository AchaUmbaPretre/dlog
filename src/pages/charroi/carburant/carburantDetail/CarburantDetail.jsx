import React, { useEffect, useRef, useState } from 'react';
import { notification, Skeleton, Alert, Button } from 'antd';
import {
  CarOutlined,
  UserOutlined,
  DashboardOutlined,
  DollarOutlined,
  FilePdfOutlined,
  CalendarOutlined,
  FireOutlined,
} from '@ant-design/icons';
import './carburantDetail.scss';
import html2pdf from "html2pdf.js";
import { getCarburantOne } from '../../../../services/carburantService';
import { formatNumber } from '../../../../utils/formatNumber';

const CarburantDetail = ({ id_vehicule, idCarburant }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const pdfRef = useRef(null);

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

  const exportPDF = () => {
    const element = pdfRef.current;
    const options = {
      margin: 0.5,
      filename: `carburant_${data?.id_carburant}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().from(element).set(options).save();
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
        description="Aucun détail trouvé pour ce carburant."
        type="warning"
        showIcon
      />
    );

  return (
    <div className="carburant-detail">
      <div className="header-action">
        <h2 className="title"><FireOutlined /> Détails Carburant</h2>

        <Button type="primary" icon={<FilePdfOutlined />} onClick={exportPDF}>
          Exporter en PDF
        </Button>
      </div>

      <div ref={pdfRef} id="pdf-content">
        <div className="detail-card">
          <h3><CarOutlined /> Véhicule</h3>
          <div className="grid">
            <div><span>Marque :</span> {data.nom_marque}</div>
            <div><span>Modèle :</span> {data.nom_modele}</div>
            <div><span>Chauffeur :</span> <UserOutlined /> {data.nom_chauffeur || '—'}</div>
          </div>
        </div>

        <div className="detail-card">
          <h3><FireOutlined /> Carburant</h3>
          <div className="grid">
            <div><span>Type :</span> {data.nom_type_carburant}</div>
            <div><span>Quantité :</span> {formatNumber(data.quantite_litres)} L</div>
            <div><span>Prix USD/L :</span> {formatNumber(data.prix_usd)} $</div>
            <div><span>Prix CDF/L :</span> {formatNumber(data.prix_cdf)}</div>
          </div>
        </div>

        <div className="detail-card">
          <h3><DollarOutlined /> Montants</h3>
          <div className="grid">
            <div><span>Total USD :</span> {formatNumber(data.montant_total_usd)} $</div>
            <div><span>Total CDF :</span> {formatNumber(data.montant_total_cdf)}</div>
          </div>
        </div>

        <div className="detail-card">
          <h3><DashboardOutlined /> Opération</h3>
          <div className="grid">
            <div>
              <span>Date opération :</span>
              <CalendarOutlined /> {new Date(data.date_operation).toLocaleString()}
            </div>
            <div><span>Compteur KM :</span> {formatNumber(data.compteur_km)}</div>
            <div><span>Distance :</span> {formatNumber(data.distance)} km</div>
            <div><span>Consommation :</span> {formatNumber(data.consommation)} L/100km</div>
          </div>
        </div>

        <div className="detail-card">
          <h3><FilePdfOutlined /> Commentaire</h3>
          <p className="commentaire">{data.commentaire || "Aucun commentaire"}</p>
        </div>

      </div>
    </div>
  );
};

export default CarburantDetail;
