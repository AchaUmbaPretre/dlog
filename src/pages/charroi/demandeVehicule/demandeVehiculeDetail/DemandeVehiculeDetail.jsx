import { useEffect, useState, useRef } from 'react';
import { Spin, Descriptions, notification, Button } from 'antd';
import { getDemandeVehiculeOne } from '../../../../services/charroiService';
import html2pdf from 'html2pdf.js';

const DemandeVehiculeDetail = ({ id_demande_vehicule }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const detailRef = useRef();

  console.log(data)

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getDemandeVehiculeOne(id_demande_vehicule);
      setData(response.data);
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
          <Descriptions.Item label="Client">{data[0]?.nom}</Descriptions.Item>
          <Descriptions.Item label="Service">{data[0]?.nom_service}</Descriptions.Item>
          <Descriptions.Item label="Type de véhicule">{data[0]?.nom_type_vehicule}</Descriptions.Item>
          <Descriptions.Item label="Immatriculation">{data[0]?.immatriculation}</Descriptions.Item>
          <Descriptions.Item label="Chauffeur">{data[0]?.nom_chauffeur}</Descriptions.Item>
          <Descriptions.Item label="Statut">{data[0]?.nom_type_statut}</Descriptions.Item>
          <Descriptions.Item label="Motif">{data[0]?.nom_motif_demande}</Descriptions.Item>
          <Descriptions.Item label="Localisation">{data[0]?.localisation}</Descriptions.Item>
          <Descriptions.Item label="Date de chargement">{formatDate(data[0]?.date_chargement)}</Descriptions.Item>
          <Descriptions.Item label="Date prévue">{formatDate(data[0]?.date_prevue)}</Descriptions.Item>
          <Descriptions.Item label="Date de retour">{formatDate(data[0]?.date_retour)}</Descriptions.Item>
          <Descriptions.Item label="Le(s) personnel(s)">
            {data?.map((d) => d.nom_user).join(', ')}
          </Descriptions.Item>

        </Descriptions>
      </div>
    </>
  );
};

export default DemandeVehiculeDetail;