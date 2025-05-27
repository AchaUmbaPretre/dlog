import { useEffect, useState, useRef } from 'react';
import { Spin, Descriptions, notification, Button } from 'antd';
import { getDemandeVehiculeOne } from '../../../../services/charroiService';
import html2pdf from 'html2pdf.js';

const DemandeVehiculeDetail = ({ id_demande_vehicule }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const detailRef = useRef();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getDemandeVehiculeOne(id_demande_vehicule);
      const [demande] = response.data;
      setData(demande || null);
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
    if (id_demande_vehicule) {
      fetchData();
    }
  }, [id_demande_vehicule]);

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleString() : 'N/A';

  const handleExportPDF = () => {
    const element = detailRef.current;
    const opt = {
      margin:       0.5,
      filename:     `demande_vehicule_${id_demande_vehicule}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" tip="Chargement des détails..." />
      </div>
    );
  }

  if (!data) {
    return <p style={{ textAlign: 'center' }}>Aucune donnée disponible.</p>;
  }

  return (
    <>
      <div style={{ textAlign: 'right', marginBottom: 16 }}>
        <Button type="primary" onClick={handleExportPDF}>
          Exporter en PDF
        </Button>
      </div>

      <div ref={detailRef}>
        <Descriptions
          title="Détails de la Demande de Véhicule"
          bordered
          column={1}
          size="middle"
        >
          <Descriptions.Item label="Client">{data.nom}</Descriptions.Item>
          <Descriptions.Item label="Service">{data.nom_service}</Descriptions.Item>
          <Descriptions.Item label="Type de véhicule">{data.nom_type_vehicule}</Descriptions.Item>
          <Descriptions.Item label="Immatriculation">{data.immatriculation}</Descriptions.Item>
          <Descriptions.Item label="Chauffeur">{data.nom_chauffeur}</Descriptions.Item>
          <Descriptions.Item label="Statut">{data.nom_type_statut}</Descriptions.Item>
          <Descriptions.Item label="Motif">{data.nom_motif_demande}</Descriptions.Item>
          <Descriptions.Item label="Localisation">{data.localisation}</Descriptions.Item>
          <Descriptions.Item label="Date de chargement">{formatDate(data.date_chargement)}</Descriptions.Item>
          <Descriptions.Item label="Date prévue">{formatDate(data.date_prevue)}</Descriptions.Item>
          <Descriptions.Item label="Date de retour">{formatDate(data.date_retour)}</Descriptions.Item>
          <Descriptions.Item label="Crée par">{data.nom_user}</Descriptions.Item>
        </Descriptions>
      </div>
    </>
  );
};

export default DemandeVehiculeDetail;