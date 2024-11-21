import React, { useEffect, useState } from 'react';
import { Table, notification, Tag } from 'antd';
import { CalendarOutlined,FileTextOutlined, UserOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getTemplate5derniers, getTemplateOne } from '../../../services/templateService';
import './templateOne.scss';

const TemplateOne = ({ idTemplate }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [dernier, setDernier] = useState([]);
  const scroll = { x: 400 };

  const fetchData = async () => {
    try {
      const { data } = await getTemplateOne(idTemplate);
      setData(data);
      setLoading(false);
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données.',
      });
      setLoading(false);
    }
  };

  const fetchData5derniers = async () => {
    try {
      const { data } = await getTemplate5derniers();
      setDernier(data);
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
    fetchData5derniers();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idTemplate]);

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', render: (_, __, index) => index + 1, width: "5%" },
    {
      title: 'Template',
      dataIndex: 'desc_template',
      key: 'desc_template',
      render: (text) => (
        <Tag icon={<FileTextOutlined />} color="blue">{text ?? 'Aucun'}</Tag>
      )    
    },
    {
      title: 'Client',
      dataIndex: 'nom_client',
      key: 'nom_client',
      render: (text) => <Tag icon={<UserOutlined />} color="blue">{text ?? 'Aucun'}</Tag>,
    },
    { title: 'Type', dataIndex: 'nom_type_d_occupation', key: 'nom_type_d_occupation', render: (text) => <Tag color="blue">{text ?? 'Aucun'}</Tag> },
    { title: 'Bâtiment', dataIndex: 'nom_batiment', key: 'nom_batiment', render: (text) => <Tag color="blue">{text ?? 'Aucun'}</Tag> },
    { title: 'Niveau', dataIndex: 'nom_niveau', key: 'nom_niveau', render: (text) => <Tag color="cyan">{text ?? 'Aucune'}</Tag> },
    {
      title: 'Statut',
      dataIndex: 'id_statut_template',
      key: 'id_statut_template',
      render: (text) => (
        text === 1 ? (
          <Tag color="green" icon={<CheckCircleOutlined />}>Activé</Tag>
        ) : (
          <Tag color="red" icon={<CloseCircleOutlined />}>Désactivé</Tag>
        )
      ),
    },
    { title: 'Dénomination', dataIndex: 'nom_denomination_bat', key: 'nom_denomination_bat', render: (text) => <Tag color="purple">{text}</Tag> },
    { title: 'fact', dataIndex: 'nom_whse_fact', key: 'nom_whse_fact', render: (text) => <Tag color="geekblue">{text}</Tag> },
    { title: 'Objet', dataIndex: 'nom_objet_fact', key: 'nom_objet_fact', render: (text) => <Tag color="green">{text}</Tag> },
    {
      title: 'Date active',
      dataIndex: 'date_actif',
      key: 'date_actif',
      sorter: (a, b) => moment(a.date_actif).unix() - moment(b.date_actif).unix(),
      render: text => <Tag icon={<CalendarOutlined />} color="purple">{moment(text).format('LL')}</Tag>,
    }
  ];

  return (
    <div className="client">
      <div className="row">
        <div className="column table-container">
          <h2 className='table-title'>5 derniers templates</h2>
          <Table
            columns={columns}
            dataSource={dernier}
            loading={loading}
            pagination={{ pageSize: 5 }}
            rowKey="id"
            bordered
            size="middle"
            scroll={scroll}
          />
        </div>
        { idTemplate && 
        <div className="column table-container">
          <h2 className='table-title'>Détails du Template</h2>
          <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={{ pageSize: 10 }}
            rowKey="id"
            bordered
            size="middle"
            scroll={scroll}
          />
        </div>
        }   
      </div>
    </div>
  );
};

export default TemplateOne;
