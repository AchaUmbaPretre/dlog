import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Dropdown, Menu, notification, Popover, Skeleton, Space, Table, Tabs, Tag } from 'antd';
import moment from 'moment';
import { getRapportSuperficie } from '../../../../services/templateService';
import RapportFiltrage from '../rapportFiltrage/RapportFiltrage';

const RapportSuperficie = () => {
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
  });
  const [filterVisible, setFilterVisible] = useState(false);
  const [filteredDatas, setFilteredDatas] = useState(null);
  const [visibleCities, setVisibleCities] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [detail, setDetail] = useState([]);
  const scroll = { x: 400 };
  const [activeKeys, setActiveKeys] = useState(['1', '2']);

  const fetchData = async () => {
    try {
      const { data } = await getRapportSuperficie(filteredDatas);
  
      // Regrouper les données par mois et par bâtiment
      const groupedData = data.reduce((acc, item) => {
        const mois = moment(item.periode).format('MMM-YY');
  
        if (!acc[mois]) acc[mois] = {};
  
        if (!acc[mois][item.nom_batiment]) {
          acc[mois][item.nom_batiment] = {
            total_facture: 0,
            total_occupe: 0,
          };
        }
  
        acc[mois][item.nom_batiment].total_facture += item.total_facture || 0;
        acc[mois][item.nom_batiment].total_occupe += item.total_occupe || 0;
  
        return acc;
      }, {});
  
      // Transformer les données en un format compatible avec Ant Design Table
      const formattedData = Object.entries(groupedData).map(([mois, batiments]) => {
        const row = { Mois: mois };
        for (const [batiment, valeurs] of Object.entries(batiments)) {
          row[`${batiment}_Facture`] = valeurs.total_facture;
          row[`${batiment}_Occupe`] = valeurs.total_occupe;
        }
        return row;
      });
      
  
      // Extraire tous les bâtiments pour les colonnes dynamiques
      const extractedBatiments = [...new Set(data.map(item => item.nom_batiment))];
  
      // Définition des colonnes dynamiques
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
        ...extractedBatiments.map(batiment => ({
          title: `${batiment}`,
          key: batiment,
          children: [
            {
              title: 'Facture',
              dataIndex: `${batiment}_Facture`,
              key: `${batiment}_Facture`,
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
              title: 'Occupé',
              dataIndex: `${batiment}_Occupe`,
              key: `${batiment}_Occupe`,
              render: text => <Space>{text ? text : "0"}</Space>,
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
        <h2 className="rapport_h2">RAPPORT SUPERFICIE</h2>
        <Button
          type={filterVisible ? 'primary' : 'default'}
          onClick={() => setFilterVisible(!filterVisible)}
          style={{ margin: '10px 10px 10px 0' }}
        >
          {filterVisible ? 'Cacher les filtres' : 'Afficher les filtres'}
        </Button>
        {filterVisible && <RapportFiltrage onFilter={handleFilterChange} filtraVille={true} />}

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
    </>
  );
};

export default RapportSuperficie;
