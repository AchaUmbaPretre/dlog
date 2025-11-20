import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Typography, Select, DatePicker, Table, notification, Input, Space } from 'antd';
import moment from 'moment';
import 'moment/locale/fr';
import { CarOutlined, SearchOutlined } from '@ant-design/icons';
import { getCarburantVehicule, getRapportCatPeriode } from '../../../../../../services/carburantService';
import { getSite, getVehicule } from '../../../../../../services/charroiService';

const { Title } = Typography;

const RapportCatPeriode = () => {
  const [month, setMonth] = useState(moment().format('YYYY-MM'));
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [vehicule, setVehicule] = useState([]);
  const [site, setSite] = useState([]);
  const [vehiculeData, setVehiculeData] = useState(null);
  const [siteData, setSiteData] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [rawData, setRawData] = useState([]);
  const tableRef = useRef();

  // Récupérer les données API
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getRapportCatPeriode(month, vehiculeData, siteData);
      setRawData(data);

      // Générer les lignes du tableau
      const formatted = [
        {
          titre: "Total Pleins",
          ...Object.fromEntries(data.map(d => [parseInt(d.jour), d.total_pleins])),
        },
        {
          titre: "Total Kilométrage",
          ...Object.fromEntries(data.map(d => [parseInt(d.jour), d.total_kilometrage])),
        },
        {
          titre: "Total Litres",
          ...Object.fromEntries(data.map(d => [parseInt(d.jour), d.total_litres])),
        },
        {
          titre: "Consommation",
          ...Object.fromEntries(data.map(d => [parseInt(d.jour), d.total_consom])),
        },
        {
          titre: "Distance",
          ...Object.fromEntries(data.map(d => [parseInt(d.jour), d.total_distance])),
        },
        {
          titre: "Montant Total (CDF)",
          ...Object.fromEntries(data.map(d => [parseInt(d.jour), d.total_total_cdf])),
        },
        {
          titre: "Montant Total (USD)",
          ...Object.fromEntries(data.map(d => [parseInt(d.jour), d.total_total_usd])),
        },
      ];

      setData(formatted);
    } catch (err) {
        const errorMessage = err?.response?.data?.message || "Impossible de récupérer les données du rapport";

        notification.error({
            message: "Erreur de chargement",
            description: errorMessage,
        });
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les véhicules et sites
  const fetchDatas = async () => {
    try {
      const [vehiculeData, siteData] = await Promise.all([getCarburantVehicule(), getSite()]);
      setVehicule(vehiculeData?.data || []);
      setSite(siteData?.data?.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDatas();
  }, [month, vehiculeData, siteData]);

  // Récupérer uniquement les jours présents dans l'API
  const jours = useMemo(() => {
    return rawData.map(d => parseInt(d.jour)).sort((a, b) => a - b);
  }, [rawData]);

  const formatDayWithMonth = (day) => {
    const monthYear = moment(month, 'YYYY-MM');
    const fullDate = monthYear.date(day);
    return fullDate.format('D MMM'); // ex: "1 janv."
  };

  // Colonnes du tableau
  const columns = [
    {
      title: '#',
      render: (_, __, index) => index + 1,
      width: 10,
      fixed: 'left',
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
      render: (value) => (value != null ? Math.round(value).toLocaleString('fr-FR') : '0'),
    })),
    {
      title: 'Total',
      key: 'total',
      fixed: 'right',
      align: 'center',
      render: (record) => {
        const total = jours.reduce((sum, j) => sum + (record[j] || 0), 0);
        return Math.round(total).toLocaleString('fr-FR');
      },
    },
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
          options={vehicule.map(item => ({
            value: item.id_enregistrement,
            label: `${item.nom_marque} / ${item.immatriculation}`,
          }))}
          placeholder="Sélectionnez un véhicule..."
          optionFilterProp="label"
          onChange={setVehiculeData}
          style={{ width: 200 }}
        />

        <Select
          showSearch
          allowClear
          options={site.map(item => ({
            value: item.id_site,
            label: item.nom_site,
          }))}
          placeholder="Sélectionnez un site..."
          optionFilterProp="label"
          onChange={setSiteData}
          style={{ width: 200 }}
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
