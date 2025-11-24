import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Select, Tag, DatePicker, Table, notification, Input, Space } from 'antd';
import moment from 'moment';
import 'moment/locale/fr';
import { SearchOutlined } from '@ant-design/icons';
import { getCarburantVehicule, getRapportCatPeriode } from '../../../../../../services/carburantService';
import { getCatVehicule, getSite } from '../../../../../../services/charroiService';

const { RangePicker } = DatePicker;

const RapportCatPeriode = () => {
  const [month, setMonth] = useState(moment().format('YYYY-MM'));
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [vehicule, setVehicule] = useState([]);
  const [site, setSite] = useState([]);
  const [cat, setCat] = useState([]);
  const [vehiculeData, setVehiculeData] = useState(null);
  const [siteData, setSiteData] = useState(null);
  const [catData, setCatData] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [rawData, setRawData] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const tableRef = useRef();

  // Récupération données API
  const fetchData = async () => {
    setLoading(true);
    try {
      const date_start = dateRange?.[0] ? dateRange[0].format("YYYY-MM-DD") : undefined;
      const date_end = dateRange?.[1] ? dateRange[1].format("YYYY-MM-DD") : undefined;

      const { data } = await getRapportCatPeriode(
        month,
        vehiculeData,
        siteData,
        catData,
        date_start,
        date_end
      );

      setRawData(data);

      const formatted = [
        { titre: "Total Pleins", ...Object.fromEntries(data.map(d => [d.date_jour, d.total_pleins])) },
        { titre: "Total Kilométrage", ...Object.fromEntries(data.map(d => [d.date_jour, d.total_kilometrage])) },
        { titre: "Total Litres", ...Object.fromEntries(data.map(d => [d.date_jour, d.total_litres])) },
        { titre: "Consommation", ...Object.fromEntries(data.map(d => [d.date_jour, d.total_consom])) },
        { titre: "Distance", ...Object.fromEntries(data.map(d => [d.date_jour, d.total_distance])) },
        { titre: "Montant Total (CDF)", ...Object.fromEntries(data.map(d => [d.date_jour, d.total_total_cdf])) },
        { titre: "Montant Total (USD)", ...Object.fromEntries(data.map(d => [d.date_jour, d.total_total_usd])) },
      ];

      setData(formatted);
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Impossible de récupérer les données du rapport";
      notification.error({ message: "Erreur de chargement", description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les véhicules, sites et catégories
  const fetchDatas = async () => {
    try {
      const [vehiculeDataResp, siteDataResp, catDataResp] = await Promise.all([
        getCarburantVehicule(),
        getSite(),
        getCatVehicule()
      ]);
      setVehicule(vehiculeDataResp?.data || []);
      setSite(siteDataResp?.data?.data || []);
      setCat(catDataResp?.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDatas();
  }, [month, vehiculeData, siteData, catData, dateRange]);

  // Récupérer uniquement les jours présents
  const jours = useMemo(() => {
    return rawData.map(d => d.date_jour).sort((a, b) => new Date(a) - new Date(b));
  }, [rawData]);

  const formatDayWithMonth = (dateStr) => {
    return moment(dateStr).format('D MMM'); // ex: "1 oct."
  };

  // Colonnes du tableau
  const columns = [
    { title: '#', render: (_, __, index) => index + 1, width: 10, fixed: 'left' },
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
      render: text => <strong>{text}</strong>,
    },
    ...jours.map(j => ({
      title: (
        <div style={{ textAlign: "center" }}>
          <Tag color="#2db7f5">{formatDayWithMonth(j)}</Tag>
        </div>
      ),
      dataIndex: j,
      key: j,
      align: 'center',
      render: value => (value != null ? Math.round(value).toLocaleString('fr-FR') : '0'),
    })),
    {
      title: 'Total',
      key: 'total',
      fixed: 'right',
      align: 'center',
      render: record => jours.reduce((sum, j) => sum + (record[j] || 0), 0).toLocaleString('fr-FR'),
    },
  ];

  return (
    <div className="client">
      <div className="client-wrapper">
        <Space style={{ marginBottom: 24 }}>
          <DatePicker
            picker="month"
            defaultValue={moment()}
            onChange={date => setMonth(date.format('YYYY-MM'))}
          />

          <Select
            showSearch
            allowClear
            options={vehicule.map(item => ({ value: item.id_enregistrement, label: `${item.nom_marque} / ${item.immatriculation}` }))}
            placeholder="Sélectionnez un véhicule..."
            optionFilterProp="label"
            onChange={setVehiculeData}
            style={{ width: 200 }}
          />

          <Select
            showSearch
            allowClear
            options={cat.map(item => ({ value: item.id_cat_vehicule, label: item.abreviation }))}
            placeholder="Sélectionnez une catégorie..."
            optionFilterProp="label"
            onChange={setCatData}
            style={{ width: 200 }}
          />

          <Select
            showSearch
            allowClear
            options={site.map(item => ({ value: item.id_site, label: item.nom_site }))}
            placeholder="Sélectionnez un site..."
            optionFilterProp="label"
            onChange={setSiteData}
            style={{ width: 200 }}
          />

          <RangePicker
            showTime
            value={dateRange}
            onChange={setDateRange}
            format="YYYY-MM-DD"
            disabled={loading}
            style={{ borderRadius: 8 }}
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
      </div>
    </div>
  );
};

export default RapportCatPeriode;
