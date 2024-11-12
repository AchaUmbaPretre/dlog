import React, { useEffect, useState } from 'react';
import { getTemplateOne } from '../../../services/templateService';
import { notification, Card, Tag, Typography, Descriptions } from 'antd';
import { FileTextOutlined, UserOutlined, ApartmentOutlined, HomeOutlined, OrderedListOutlined, TagOutlined, CalendarOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;

const TemplateDetail = ({ idTemplate }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const { data } = await getTemplateOne(idTemplate);
      setData(data[0]);
      setLoading(false);
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données.',
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [idTemplate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Aucune donnée disponible</div>;
  }

  return (
    <div className="template_detail">
      <Card
        title="Détails du Template"
        bordered={false}
        style={{ width: '100%', marginTop: 20 }}
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Template">
            <Tag icon={<FileTextOutlined />} color="blue">{data.desc_template ?? 'Aucun'}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Client">
            <Tag icon={<UserOutlined />} color="blue">{data.nom_client ?? 'Aucun'}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Type d'occupation">
            <Tag icon={<ApartmentOutlined />} color={data.nom_type_d_occupation === 'Dédié' ? 'green' : 'blue'}>
              {data.nom_type_d_occupation ?? 'Aucun'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Bâtiment">
            <Tag icon={<HomeOutlined />} color="blue">{data.nom_batiment ?? 'Aucun'}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Niveau">
            <Tag icon={<OrderedListOutlined />} color="cyan">{data.nom_niveau ?? 'Aucun'}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Dénomination">
            <Tag icon={<TagOutlined />} color="purple">{data.nom_denomination_bat ?? 'Aucun'}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Whse fact">
            <Tag color="geekblue">{data.nom_whse_fact ?? 'Aucun'} $</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Objet fact">
            <Tag icon={<FileTextOutlined />} color="green">{data.nom_objet_fact ?? 'Aucun'}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Date active">
            <Tag icon={<CalendarOutlined />} color="purple">
              {data.date_actif ? moment(data.date_actif).format('DD-MM-yyyy') : 'Aucune'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Date inactive">
            <Tag icon={<CalendarOutlined />} color="red">
              {data.date_inactif ? moment(data.date_inactif).format('DD-MM-yyyy') : 'Aucune'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Statut">
            <Tag color={data.nom_statut_template === 'Activé' ? 'green' : 'red'}>{data.nom_statut_template}</Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default TemplateDetail;
