import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Dropdown, Menu, notification, Popover, Skeleton, Space, Table, Tabs, Tag } from 'antd';
import moment from 'moment';
import { AreaChartOutlined, PieChartOutlined } from '@ant-design/icons';
import { getRapportPays, getRapportVille } from '../../../../services/templateService';
import RapportFiltrage from '../rapportFiltrage/RapportFiltrage';

const RapportPays = () => {
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });
  const [filterVisible, setFilterVisible] = useState(false);
  const [filteredDatas, setFilteredDatas] = useState(null);
  const [visibleCities, setVisibleCities] = useState([]); // Gère les villes visibles
  const [allCities, setAllCities] = useState([]); // Liste de toutes les villes disponibles
  const [detail, setDetail] = useState([]);
  const scroll = { x: 400 };
  const [uniqueMonths, setUniqueMonths] = useState([]);
  const [activeKeys, setActiveKeys] = useState(['1', '2']);

  const fetchData = async () => {
    try {
      const { data } = await getRapportPays(filteredDatas);
  
      setDetail(data.resume);
  
      // Regrouper les données par mois et pays
      const groupedData = data.data.reduce((acc, item) => {
        const mois = moment(item.periode).format('MMM-YY');
  
        if (!acc[mois]) acc[mois] = {};
  
        acc[mois][item.nom_pays] = {
          Entreposage: item.total_entreposage || 0,
          Manutention: item.total_manutation || 0,
          Total: item.total || 0,
        };
  
        return acc;
      }, {});
  
      // Transformer les données pour le tableau
      const formattedData = Object.entries(groupedData).map(([mois, paysData]) => {
        const row = { Mois: mois };
        for (const [pays, valeurs] of Object.entries(paysData)) {
          row[`${pays}_Entreposage`] = valeurs.Entreposage;
          row[`${pays}_Manutention`] = valeurs.Manutention;
          row[`${pays}_Total`] = valeurs.Total;
        }
        return row;
      });
  
      // Extraire les noms de pays uniques
      const extractedCountries = [...new Set(data.data.map(item => item.nom_pays))];
      setAllCities(extractedCountries);
      setVisibleCities(extractedCountries);
  
      // Définition des colonnes dynamiques avec `nom_pays`
      const dynamicColumns = [
        {
          title: '#',
          dataIndex: 'id',
          key: 'id',
          width: '3%',
          render: (text, record, index) => {
            const pageSize = pagination.pageSize || 10;
            const pageIndex = pagination.current || 1;
            return (pageIndex - 1) * pageSize + index + 1;
          },
          align: 'right',
        },
        {
          title: 'Mois',
          dataIndex: 'Mois',
          key: 'Mois',
          fixed: 'left',
          render: text => (
            <Space>
              <Tag color={'#2db7f5'}>{text}</Tag>
            </Space>
          ),
          align: 'left',
        },
        ...extractedCountries.map(nom_pays => ({
          title: nom_pays,
          key: nom_pays,
          children: [
            {
              title: 'Entrep',
              dataIndex: `${nom_pays}_Entreposage`,
              key: `${nom_pays}_Entreposage`,
              sorter: (a, b) => (a[`${nom_pays}_Entreposage`] || 0) - (b[`${nom_pays}_Entreposage`] || 0),
              render: text => (
                <Space>
                  {text
                    ? `${parseFloat(text)
                        .toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                        .replace(/,/g, " ")} $`
                    : "0.00"}
                </Space>
              ),
              align: 'right',
            },
            {
              title: 'Manut',
              dataIndex: `${nom_pays}_Manutention`,
              key: `${nom_pays}_Manutention`,
              sorter: (a, b) => (a[`${nom_pays}_Manutention`] || 0) - (b[`${nom_pays}_Manutention`] || 0),
              render: text => (
                <Space>
                  {text
                    ? `${parseFloat(text)
                        .toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                        .replace(/,/g, " ")} $`
                    : "0.00"}
                </Space>
              ),
              align: 'right',
            },
            {
              title: 'Total',
              dataIndex: `${nom_pays}_Total`,
              key: `${nom_pays}_Total`,
              sorter: (a, b) => (a[`${nom_pays}_Total`] || 0) - (b[`${nom_pays}_Total`] || 0),
              render: text => (
                <Space>
                  {text
                    ? `${parseFloat(text)
                        .toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                        .replace(/,/g, " ")} $`
                    : "0.00"}
                </Space>
              ),
              align: 'right',
            },
          ],
        })),
      ];
  
      setColumns(dynamicColumns);
      setDataSource(formattedData);
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        notification.error({
          message: 'Erreur',
          description: `${error.response.data.message}`,
        });
        } else {
            notification.error({
              message: 'Erreur',
              description: 'Une erreur est survenue lors de la récupération des données.',
            });
        }
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [filteredDatas]);

  const handleFilterChange = newFilters => {
    setFilteredDatas(newFilters);
  };

  const handleTabChanges = (key) => {
    setActiveKeys(key);
  };

  const handleCityVisibilityChange = checkedValues => {
    setVisibleCities(checkedValues);
  };

  const filteredColumns = columns.filter(col => {
    // Filtrer uniquement les colonnes des villes sélectionnées
    if (col.key && col.key !== 'id' && col.key !== 'Mois') {
      return visibleCities.includes(col.title);
    }
    return true;
  });

  return (
    <>
         {
            loading ? (
                <Skeleton active paragraph={{ rows: 1 }} />
            ) : (
                <div
                  style={{
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                      borderRadius: '8px',
                      backgroundColor: '#fff',
                      width: 'fit-content',
                      margin: '20px 0',
                      padding: '15px',
                  }}
                >
                    <span
                        style={{
                        display: 'block',
                        padding: '10px 15px',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        borderBottom: '1px solid #f0f0f0',
                        }}
                    >
                      Résumé :
                    </span>
                <div
                    style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '15px',
                    padding: '15px',
                    }}
                >
                    <span
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: '400',
                          cursor: 'pointer',
                          color: '#1890ff',
                        }}
                    >
                        Nbre de pays : <strong>{detail?.nbre_pays}</strong>
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    Total Entreposage :{' '}
                    <strong>{Math.round(parseFloat(detail?.total_entreposage))?.toLocaleString()} $</strong>
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    Total Manutention :{' '}
                    <strong>{Math.round(parseFloat(detail?.total_manutation))?.toLocaleString()} $</strong>
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    Total Entre. & Manu. :{' '}
                    <strong>{Math.round(parseFloat(detail?.total))?.toLocaleString()} $</strong>
                    </span>
                </div>
              </div>
            )
        }
      <div className="rapport_facture">
        <h2 className="rapport_h2">RAPPORT PAYS</h2>
        <Button
          type={filterVisible ? 'primary' : 'default'}
          onClick={() => setFilterVisible(!filterVisible)}
          style={{ margin: '10px 10px 10px 0' }}
        >
          {filterVisible ? 'Cacher les filtres' : 'Afficher les filtres'}
        </Button>
        {filterVisible && <RapportFiltrage onFilter={handleFilterChange} filtraVille={true} filtraClient={true} />}

        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="cities">
                <Checkbox.Group
                  options={allCities.map(city => ({ label: city, value: city }))}
                  value={visibleCities}
                  onChange={handleCityVisibilityChange}
                />
              </Menu.Item>
            </Menu>
          }
          trigger={['click']}
        >
          <Button>Afficher/Masquer les pays</Button>
        </Dropdown>

        <div className="rapport_wrapper_facture">
          <Table
            dataSource={dataSource}
            columns={filteredColumns}
            bordered
            scroll={scroll}
            loading={loading}
            size="small"
            pagination={pagination}
            onChange={pagination => setPagination(pagination)}
            rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
          />
        </div>
      </div>
    </>
  );
};

export default RapportPays;
