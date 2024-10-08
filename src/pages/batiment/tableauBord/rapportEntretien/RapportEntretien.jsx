import React, { useEffect, useState } from 'react';
import './rapportEntretien.scss';
import { getRapportOne } from '../../../../services/batimentService';
import { Table, Tag, Spin, notification, Skeleton } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, ToolOutlined, CloseCircleOutlined, CalendarOutlined, HomeOutlined } from '@ant-design/icons';
import moment from 'moment';

const RapportEntretien = ({ idBatiment }) => {
  const [rapport, setRapport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nameBatiment, setNameBatiment] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getRapportOne(idBatiment);
        setRapport(res.data);
        setNameBatiment(res.data[0]?.nom_batiment || ''); // Handle empty data case
      } catch (error) {
        console.log(error);
        notification.error({
          message: 'Erreur',
          description: 'Impossible de récupérer les données du rapport d’entretien.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idBatiment]);

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => index + 1,
      width: "3%",
    },
    {
      title: 'Équipement',
      dataIndex: 'nom_article',
      key: 'nom_article',
      render: (text) => (
        <Tag color="blue">
          {text === 'Table' ? <HomeOutlined /> : <ToolOutlined />}
          {` ${text}`}
        </Tag>
      ),
    },
    {
      title: 'Statut',
      dataIndex: 'nom_statut',
      key: 'status',
      render: (text, record) => {
        let icon, color;
        if (record.status === 1) {
          icon = <CheckCircleOutlined />;
          color = 'green';
        } else if (record.status === 2) {
          icon = <ExclamationCircleOutlined />;
          color = 'orange';
        } else {
          icon = <CloseCircleOutlined />;
          color = 'red';
        }

        return (
          <Tag icon={icon} color={color}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: 'Date prochaine maintenance',
      dataIndex: 'date_prochaine_maintenance',
      key: 'date_prochaine_maintenance',
      render: (text) => {
        const date = moment(text);
        const isSoon = date.diff(moment(), 'days') < 7;
        const color = isSoon ? 'volcano' : 'geekblue';

        return (
          <Tag icon={<CalendarOutlined />} color={color}>
            {date.format('DD MMM YYYY')}
          </Tag>
        );
      },
    },
  ];

  return (
    <div className="rapport-entretien-container">
      <div className="title_row">
        <h1 className="title_h1">{nameBatiment ? `Rapport de ${nameBatiment}` : ''}</h1>
      </div>
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <Table 
          columns={columns} 
          dataSource={rapport} 
          rowKey="equipment_id" 
          pagination={{ pageSize: 10 }} 
          bordered
        />
      )}
    </div>
  );
};

export default RapportEntretien;
