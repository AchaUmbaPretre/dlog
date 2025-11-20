import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Typography, Select, DatePicker, Table, notification, Input, Space } from 'antd';
import moment from 'moment';
import 'moment/locale/fr';
import { CarOutlined, SearchOutlined } from '@ant-design/icons';
import { getRapportCatPeriode } from '../../../../../../services/carburantService';
import { getSite, getVehicule } from '../../../../../../services/charroiService';

const { Title } = Typography;

const RapportCatPeriode = () => {
  const [month, setMonth] = useState(moment().format('YYYY-MM'));
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [vehicule, setVehicule] = useState([]);
  const [site, setSite] = useState([]);
  const [vehiculeData, setVehiculeData] = useState([]);
  const [siteData, setSiteData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [rawData, setRawData] = useState([]);
  const tableRef = useRef();

  // Générer tous les jours du mois
  const jours = useMemo(() => {
    const totalDays = moment(month, "YYYY-MM").daysInMonth();
    return Array.from({ length: totalDays }, (_, i) => i + 1);
  }, [month]);

  // Formater les jours pour l'affichage
  const formatDayWithMonth = (day) => {
    const monthYear = moment(month, 'YYYY-MM');
    const fullDate = monthYear.date(day);
    return fullDate.format('D MMM'); // ex: "1 janv."
  };

  // Récupérer les données
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getRapportCatPeriode(month);
      setRawData(data);

      const formatted = [
        {
          titre: "Total Pleins",
          ...Object.fromEntries(jours.map(j => {
            const day = data.find(d => parseInt(d.jour) === j);
            return [j, day ? day.total_pleins : 0];
          }))
        },
        {
          titre: "Total Kilométrage",
          ...Object.fromEntries(jours.map(j => {
            const day = data.find(d => parseInt(d.jour) === j);
            return [j, day ? day.total_kilometrage : 0];
          }))
        },
        {
          titre: "Total Litres",
          ...Object.fromEntries(jours.map(j => {
            const day = data.find(d => parseInt(d.jour) === j);
            return [j, day ? day.total_litres : 0];
          }))
        },
        {
          titre: "Consommation",
          ...Object.fromEntries(jours.map(j => {
            const day = data.find(d => parseInt(d.jour) === j);
            return [j, day ? day.total_consom : 0];
          }))
        },
        {
          titre: "Distance",
          ...Object.fromEntries(jours.map(j => {
            const day = data.find(d => parseInt(d.jour) === j);
            return [j, day ? day.total_distance : 0];
          }))
        },
        {
          titre: "Montant Total (CDF)",
          ...Object.fromEntries(jours.map(j => {
            const day = data.find(d => parseInt(d.jour) === j);
            return [j, day ? day.total_total_cdf : 0];
          }))
        },
        {
          titre: "Montant Total (USD)",
          ...Object.fromEntries(jours.map(j => {
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

  const fetchDatas = async() => {
    try {
        const [vehiculeData, siteData] = await Promise.all([
            getVehicule(),
            getSite()
        ])

        setVehicule(vehiculeData?.data?.data)
        setSite(siteData?.data?.data)
    } catch (error) {
        console.log(error)
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    fetchData();
    fetchDatas()
  }, [month]);

  // Colonnes pour le tableau
  const columns = [
    {
      title: '#',
      render: (text, record, index) => index + 1,
      width: 10,
      fixed: 'left'
    },
    {
      title: 'Titre',
      dataIndex: 'titre',
      fixed: 'left',
      width: 180,
      filterDropdown: () => (
        <Input
          placeholder="Rechercher"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 180, marginBottom: 8 }}
          prefix={<SearchOutlined />}
        />
      ),
      render: (text) => (
        <strong>
          {text}
        </strong>
      ),
    },
    ...jours.map(j => ({
      title: formatDayWithMonth(j),
      dataIndex: j,
      key: j,
      align: 'center',
      render: (value) => {
        const rounded = Math.round(value || 0);
        return rounded.toLocaleString('fr-FR');
      }
    })),
    {
      title: 'Total',
      key: 'total',
      fixed: 'right',
      align: 'center',
      render: (record) => {
        const total = jours.reduce((sum, j) => sum + (record[j] || 0), 0);
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
          onChange={(date) => setMonth(date.format('YYYY-MM'))}
        />

        <Select
            showSearch
            allowClear
            options={vehicule.map((item) => ({
                value: item.id_vehicule                                      ,
                label: `${item.nom_marque} / ${item.immatriculation}`,
            }))}
            placeholder="Sélectionnez un véhicule..."
            optionFilterProp="label"
            onChange={setVehiculeData}
            style={{width:'200px'}}
        />

        <Select
            showSearch
            allowClear
            options={site.map((item) => ({
                value: item.id_site                                           ,
                label: item.nom_site,
            }))}
            placeholder="Sélectionnez un site..."
            optionFilterProp="label"
            onChange={setSiteData}
            style={{width:'200px'}}
        />
      </Space>

      <div ref={tableRef}>
        <Table
          dataSource={data}
          columns={columns}
          scroll={{ x: 'max-content' }}
          pagination={false}
          bordered
          rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
          size="middle"
          loading={loading}
        />
      </div>
    </>
  );
};

export default RapportCatPeriode;
