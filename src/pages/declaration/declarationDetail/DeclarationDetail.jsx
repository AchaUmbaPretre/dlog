import { Card, Divider, Descriptions, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { getDeclarationOne } from '../../../services/templateService';
import { HomeOutlined, InfoCircleOutlined } from '@ant-design/icons';

const DeclarationDetail = ({ idDeclaration }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDatas = async () => {
    try {
      const response = await getDeclarationOne(idDeclaration);
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

  useEffect(() => {
    fetchDatas();
  }, [idDeclaration]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="declaration">
      <Card loading={loading} title="Détails de la Déclaration" bordered={false} style={{ maxWidth: 800, margin: 'auto' }}>
        {data ? (
          <>
            {/* General Information Section */}
            <Descriptions title="Informations Générales" column={1} bordered>
              <Descriptions.Item label="Nom"><strong>{data.nom}</strong></Descriptions.Item>
              <Descriptions.Item label="Capital">{data.capital || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Date de Création">{formatDate(data.date_creation)}</Descriptions.Item>
              <Descriptions.Item label="Date de Modification">{formatDate(data.date_modification)}</Descriptions.Item>
            </Descriptions>

            <Divider />

            {/* Entreposage Section */}
            <Descriptions title={<><HomeOutlined /> Entreposage</>} column={1} bordered>
              <Descriptions.Item label="Débours Entreposage">{data.debours_entreposage}</Descriptions.Item>
              <Descriptions.Item label="Description">{data.desc_entreposage}</Descriptions.Item>
              <Descriptions.Item label="Entreposage">{data.entreposage}</Descriptions.Item>
              <Descriptions.Item label="Tarif Entreposage">{data.tarif_entreposage}</Descriptions.Item>
              <Descriptions.Item label="Total Entreposage">{data.total_entreposage}</Descriptions.Item>
              <Descriptions.Item label="TTC Entreposage">{data.ttc_entreposage}</Descriptions.Item>
            </Descriptions>

            <Divider />

            {/* Manutention Section */}
            <Descriptions title={<><InfoCircleOutlined /> Manutention</>} column={1} bordered>
              <Descriptions.Item label="Débours Manutention">{data.debours_manutation}</Descriptions.Item>
              <Descriptions.Item label="Description">{data.desc_manutation}</Descriptions.Item>
              <Descriptions.Item label="Manutention">{data.manutation}</Descriptions.Item>
              <Descriptions.Item label="Tarif Manutention">{data.tarif_manutation}</Descriptions.Item>
              <Descriptions.Item label="Total Manutention">{data.total_manutation}</Descriptions.Item>
              <Descriptions.Item label="TTC Manutention">{data.ttc_manutation}</Descriptions.Item>
            </Descriptions>

            <Divider />

            {/* Additional Information */}
            <Descriptions title="Informations Supplémentaires" column={1} bordered>
              <Descriptions.Item label="Nom Bâtiment">{data.nom_batiment || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Nom Objet Facturé">{data.nom_objet_fact}</Descriptions.Item>
              <Descriptions.Item label="Période">{formatDate(data.periode)}</Descriptions.Item>
            </Descriptions>
          </>
        ) : (
          <p>Aucune donnée disponible.</p>
        )}
      </Card>
    </div>
  );
};

export default DeclarationDetail;
