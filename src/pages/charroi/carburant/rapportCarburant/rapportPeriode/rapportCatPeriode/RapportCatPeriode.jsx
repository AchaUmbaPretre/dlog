import React, { useEffect, useState, useRef } from 'react';
import { Typography, DatePicker, Table, notification, Space, Input } from 'antd';
import moment from 'moment';
import 'moment/locale/fr';
import { CarOutlined, SearchOutlined } from '@ant-design/icons';
import { getRapportCatPeriode } from '../../../../../../services/carburantService';

const { Title } = Typography;

const RapportCatPeriode = () => {
  const [month, setMonth] = useState(moment().format('YYYY-MM'));
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const tableRef = useRef();

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getRapportCatPeriode(month);

      // Nombre de jours dans le mois sélectionné
      const totalDays = moment(month, "YYYY-MM").daysInMonth();
      const joursDuMois = Array.from({ length: totalDays }, (_, i) => i + 1);

      // Créer le tableau formaté
      const formatted = [
        {
          titre: "Total Pleins",
          ...Object.fromEntries(joursDuMois.map(j => {
            const day = data.find(d => parseInt(d.jour) === j);
            return [j, day ? day.total_pleins : 0];
          }))
        },
        {
          titre: "Total Kilométrage",
          ...Object.fromEntries(joursDuMois.map(j => {
            const day = data.find(d => parseInt(d.jour) === j);
            return [j, day ? day.total_kilometrage : 0];
          }))
        },
        {
          titre: "Total Litres",
          ...Object.fromEntries(joursDuMois.map(j => {
            const day = data.find(d => parseInt(d.jour) === j);
            return [j, day ? day.total_litres : 0];
          }))
        },
        {
          titre: "Consommation",
          ...Object.fromEntries(joursDuMois.map(j => {
            const day = data.find(d => parseInt(d.jour) === j);
            return [j, day ? day.total_consom : 0];
          }))
        },
        {
          titre: "Distance",
          ...Object.fromEntries(joursDuMois.map(j => {
            const day = data.find(d => parseInt(d.jour) === j);
            return [j, day ? day.total_distance : 0];
          }))
        },
        {
          titre: "Montant Total (CDF)",
          ...Object.fromEntries(joursDuMois.map(j => {
            const day = data.find(d => parseInt(d.jour) === j);
            return [j, day ? day.total_total_cdf : 0];
          }))
        },
        {
          titre: "Montant Total (USD)",
          ...Object.fromEntries(joursDuMois.map(j => {
            const day = data.find(d => parseInt(d.jour) === j);
            return [j, day ? day.total_total_usd : 0];
          }))
        }
      ];

      setData(formatted);

    } catch (err) {
      notification.error({
        message: "Erreur de chargement",
        description: "Impossible de récupérer les données du rapport",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [month]);

  const formatDayWithMonth = (day) => {
    const monthYear = moment(month, 'YYYY-MM');
    const fullDate = monthYear.date(day);
    return fullDate.format('D MMM'); // ex: 1 janv.
  };

  // Colonnes du tableau
  const totalDays = moment(month, "YYYY-MM").daysInMonth();
  const joursDuMois = Array.from({ length: totalDays }, (_, i) => i + 1);

  const columns = [
    { title: '#', render: (t,r,i)=>i+1, width: 10, fixed: 'left' },
    { 
      title: 'Titre', 
      dataIndex: 'titre', 
      fixed: 'left', 
      width: 180, 
      filterDropdown: () => (
        <Input
          placeholder="Rechercher véhicule"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 180, marginBottom: 8 }}
          prefix={<SearchOutlined />}
        />
      ),
      render: text => <strong>{text}</strong>
    },
    ...joursDuMois.map(j => ({
      title: formatDayWithMonth(j),
      dataIndex: j,
      key: j,
      align: 'center',
      render: v => (Math.round(v || 0)).toLocaleString('fr-FR')
    })),
    {
      title: 'Total',
      key: 'total',
      fixed: 'right',
      align: 'center',
      render: record => {
        const total = joursDuMois.reduce((sum, j) => sum + (record[j] || 0), 0);
        return Math.round(total).toLocaleString('fr-FR');
      }
    }
  ];

  return (
    <>
      <Title level={3} style={{ marginBottom: 24 }}>
        📅 Rapport de categorie
      </Title>

      <Space style={{ marginBottom: 24 }}>
        <DatePicker
          picker="month"
          defaultValue={moment()}
          onChange={date => setMonth(date.format('YYYY-MM'))}
        />
      </Space>

      <div ref={tableRef}>
        <Table
          dataSource={data}
          columns={columns}
          scroll={{ x: 'max-content' }}
          pagination={false}
          bordered
          size="middle"
        />
      </div>
    </>
  );
};

export default RapportCatPeriode;
