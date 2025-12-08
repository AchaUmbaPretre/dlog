import React, { useEffect, useState } from 'react';
import { Table, Skeleton, Divider, notification, Tag } from 'antd';
import moment from 'moment';
import { getCarburantByMonth } from '../../../../../../../services/carburantService';
import {
  CarOutlined,
  UserOutlined,
  FireOutlined,
  DashboardOutlined,
  CalendarOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { formatNumber } from '../../../../../../../utils/formatNumber';

const RapportCarbMoisDetail = ({ record }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!record) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [moisAbbrev, annee] = record.Mois.split(' - ').map(v => v.trim());
        const moisNumber = moment(moisAbbrev, 'MMM').month() + 1;

        const { data } = await getCarburantByMonth(moisNumber, annee);

        setData(data || []);
      } catch (error) {
        notification.error({
          message: 'Erreur',
          description: 'Impossible de charger les détails du mois.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [record]);

  const columns = [
    {
      title: (
        <span><CalendarOutlined style={{ color: '#1890ff' }} /> Date</span>
      ),
      dataIndex: 'date_operation',
      render: d => moment(d).format('DD-MM-YYYY'),
    },
    {
      title: (
        <span><CarOutlined style={{ color: '#722ed1' }} /> Véhicule</span>
      ),
      dataIndex: 'immatriculation',
      align: 'center',
      render: text => <Tag color="purple">{text}</Tag>
    },
    {
      title: (
        <span><DashboardOutlined style={{ color: '#13c2c2' }} /> Marque</span>
      ),
      dataIndex: 'nom_marque',
      align: 'center'
    },
    {
      title: (
        <span><UserOutlined style={{ color: '#fa8c16' }} /> Chauffeur</span>
      ),
      dataIndex: 'nom_chauffeur',
      align: 'center',
      render: text => text || <Tag color="red">Aucun</Tag>
    },
    {
      title: (
        <span><FireOutlined style={{ color: '#ff4d4f' }} /> Type</span>
      ),
      dataIndex: 'nom_type_carburant',
      align: 'center',
      render: text => text ? <Tag color="volcano">{text}</Tag> : '-'
    },
    {
      title: (
        <span><FireOutlined style={{ color: '#ff7a45' }} /> Litres</span>
      ),
      dataIndex: 'quantite_litres',
      align: 'right',
      render: val => <strong>{formatNumber(val)} L</strong>
    },
    {
      title: (
        <span><DashboardOutlined style={{ color: '#52c41a' }} /> Distance</span>
      ),
      dataIndex: 'distance',
      align: 'right',
      render: val => val ? `${formatNumber(val)} Km` : '-'
    },
    {
      title: (
        <span><FireOutlined style={{ color: '#eb2f96' }} /> Consommation</span>
      ),
      dataIndex: 'consommation',
      align: 'right',
      render: val => val ? `${formatNumber(val)} L/Km` : '-'
    },
    {
      title: (
        <span><DollarOutlined style={{ color: '#389e0d' }} /> USD</span>
      ),
      dataIndex: 'montant_total_usd',
      align: 'right',
      render: val => <span style={{ fontWeight: 600 }}>{val?.toFixed(2)} $</span>
    },
    {
      title: (
        <span><DollarOutlined style={{ color: '#cf1322' }} /> CDF</span>
      ),
      dataIndex: 'montant_total_cdf',
      align: 'right',
      render: val => val ? val.toLocaleString('fr-CD') + ' CDF' : '-'
    },
    {
      title: (
        <span><UserOutlined style={{ color: '#2f54eb' }} /> Créé par</span>
      ),
      dataIndex: 'createur',
      align: 'center',
      render: text => text || '-'
    }
  ];

  return (
    <div style={{ padding: '10px' }}>
      
      <h2 style={{
        marginBottom: '20px',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        color: '#003a8c',
        textTransform:'uppercase'
      }}>
        <CalendarOutlined style={{ marginRight: 8, fontSize: 22 }} />
        Rapport détaillé – {record?.Mois}
      </h2>
      <Divider />

      {loading ? (
        <Skeleton active />
      ) : (
        <Table
          dataSource={data}
          columns={columns}
          bordered
          size="small"
          rowKey="id_carburant"
        />
      )}
    </div>
  );
};

export default RapportCarbMoisDetail;