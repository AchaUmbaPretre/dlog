import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Dropdown, Menu, notification, Space, Table, Tabs, Tag } from 'antd';
import moment from 'moment';
import { AreaChartOutlined, PieChartOutlined } from '@ant-design/icons';
import { getRapportVille } from '../../../../services/templateService';
import RapportFiltrage from '../rapportFiltrage/RapportFiltrage';
import RapportVueEnsembleChart from './rapportVueEnsembleChart/RapportVueEnsembleChart';
import TabPane from 'antd/es/tabs/TabPane';
import RapportVueEnsemblePie from './rapportVueEnsemblePie/RapportVueEnsemblePie';

const RapportVueEnsemble = () => {
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

  const scroll = { x: 400 };
  const [uniqueMonths, setUniqueMonths] = useState([]);
  const [activeKeys, setActiveKeys] = useState(['1', '2']);

  const fetchData = async () => {
    try {
      const { data } = await getRapportVille(filteredDatas);

      // Regrouper les données par mois
      const groupedData = data.reduce((acc, item) => {
        const mois = moment(item.periode).format('MMM-YY');

        if (!acc[mois]) acc[mois] = {};

        acc[mois][item.capital] = {
          Entreposage: item.total_entreposage || 0,
          Manutention: item.total_manutation || 0,
          Total: item.total_facture || 0,
        };

        return acc;
      }, {});

      const formattedData = Object.entries(groupedData).map(([mois, provinces]) => {
        const row = { Mois: mois };
        for (const [province, valeurs] of Object.entries(provinces)) {
          row[`${province}_Entreposage`] = valeurs.Entreposage;
          row[`${province}_Manutention`] = valeurs.Manutention;
          row[`${province}_Total`] = valeurs.Total;
        }
        return row;
      });

      const extractedCities = [...new Set(data.map(item => item.capital))];
      setAllCities(extractedCities);
      setVisibleCities(extractedCities);

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
        ...extractedCities.map(capital => ({
          title: capital,
          key: capital,
          children: [
            {
              title: 'Entrep',
              dataIndex: `${capital}_Entreposage`,
              key: `${capital}_Entreposage`,
              render: text => (
                <Space>{text
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
              dataIndex: `${capital}_Manutention`,
              key: `${capital}_Manutention`,
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
              dataIndex: `${capital}_Total`,
              key: `${capital}_Total`,
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
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données.',
      });
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
      <div className="rapport_facture">
        <h2 className="rapport_h2">RAPPORT VILLE</h2>
        <Button
          type="default"
          onClick={() => setFilterVisible(!filterVisible)}
          style={{ margin: '10px 10px 10px 0' }}
        >
          {filterVisible ? 'Cacher les filtres' : 'Afficher les filtres'}
        </Button>
        {filterVisible && <RapportFiltrage onFilter={handleFilterChange} filtraVille={true} />}

        {/* Menu pour afficher/masquer les villes */}
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
          <Button>Afficher/Masquer les villes</Button>
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
      <div className="rapport_chart">
      <Tabs
                    activeKey={activeKeys[0]}
                    onChange={handleTabChanges}
                    type="card"
                    tabPosition="top"
                    renderTabBar={(props, DefaultTabBar) => (
                        <DefaultTabBar {...props} />
                    )}
                >
                    <TabPane
                        tab={
                        <span>
                            <AreaChartOutlined  style={{ color: 'blue' }} /> Line
                        </span>
                    }
                        key="1"
                    >
                        <RapportVueEnsembleChart groupedData={dataSource} uniqueMonths={uniqueMonths} />
                    </TabPane>

                 <TabPane
                        tab={
                        <span>
                            <PieChartOutlined style={{ color: 'ORANGE' }} /> Pie
                        </span>
                    }
                        key="2"
                    >
                        <RapportVueEnsemblePie groupedData={dataSource} uniqueMonths={uniqueMonths} />
                    </TabPane>
                </Tabs>
      </div>
    </>
  );
};

export default RapportVueEnsemble;
