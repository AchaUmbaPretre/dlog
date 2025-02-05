import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Dropdown, Menu, notification, Popover, Skeleton, Space, Table, Tabs, Tag, Tooltip } from 'antd';
import moment from 'moment';
import {
    AreaChartOutlined,
    PieChartOutlined,
    SwapOutlined,
    FileExcelOutlined
} from '@ant-design/icons';
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
            superficie: 0, // 🔹 Ajout de l'initialisation
          };
        }
      
        acc[mois][item.nom_batiment].total_facture += item.total_facture || 0;
        acc[mois][item.nom_batiment].total_occupe += item.total_occupe || 0;
        acc[mois][item.nom_batiment].superficie += item.superficie || 0; // 🔹 Ajout du cumul de superficie
      
        return acc;
      }, {});
      
  
      // Transformer les données en un format compatible avec Ant Design Table
      const formattedData = Object.entries(groupedData).map(([mois, batiments]) => {
        const row = { Mois: mois };
        for (const [batiment, valeurs] of Object.entries(batiments)) {
          row[`${batiment}_Facture`] = valeurs.total_facture;
          row[`${batiment}_Occupe`] = valeurs.total_occupe;
          row[`${batiment}_Superficie`] = valeurs.superficie; // 🔹 Ajout ici
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
          width: '2%',
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
          width: '2%',
          render: text => (
            <Space>
              <Tag color={'#2db7f5'}>{text}</Tag>
            </Space>
          ),
          align: 'left',
        },
        ...extractedBatiments.map(batiment => ({
          title: batiment,
          key: batiment,
          children: [
            {
              title: 'M2',
              key: `${batiment}_M2`,
              children: [
                {
                  title: 'Facturé',
                  dataIndex: `${batiment}_Facture`,
                  key: `${batiment}_Facture`,
                  width: '5%',
                  render: text => (
                    <Space>
                      {text
                        ? Math.round(parseFloat(text))?.toLocaleString() : 0}
                    </Space>
                  ),
                  align: 'right',
                },
                {
                  title: 'Occupé',
                  dataIndex: `${batiment}_Occupe`,
                  key: `${batiment}_Occupe`,
                  width: '5%',
                  render: text => (
                    <Space>
                      {text ?
                        Math.round(parseFloat(text))?.toLocaleString() : 0}
                    </Space>
                  ),
                  align: 'right',
                },
                {
                    title: 'M² Diff',
                    dataIndex: `${batiment}_Superficie`,
                    key: `${batiment}_Superficie`,
                    width: '5%',
                    render: text => (
                      <Space>
                        {text !== 0 ? (
                        <Tag color="red">{text ? 
                            Math.round(parseFloat(text))?.toLocaleString() : 0}
                        </Tag>
                        ) : (
                          <Tag color="green">{text ? 
                            Math.round(parseFloat(text))?.toLocaleString() : 0}</Tag>
                        )}
                      </Space>
                    ),
                    align: 'right',
                  }
              ],
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

  const exportToExcelHTML = async () => {
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
            superficie: 0,
          };
        }
  
        acc[mois][item.nom_batiment].total_facture += item.total_facture || 0;
        acc[mois][item.nom_batiment].total_occupe += item.total_occupe || 0;
        acc[mois][item.nom_batiment].superficie += item.superficie || 0;
  
        return acc;
      }, {});
  
      // Formater les données pour l'exportation Excel
      const formattedData = Object.entries(groupedData).map(([mois, batiments]) => {
        const row = { Mois: mois };
        for (const [batiment, valeurs] of Object.entries(batiments)) {
          row[`${batiment}_Facture`] = valeurs.total_facture;
          row[`${batiment}_Occupe`] = valeurs.total_occupe;
          row[`${batiment}_Superficie`] = valeurs.superficie;
        }
        return row;
      });
  
      // Extraire les noms des bâtiments pour générer dynamiquement les colonnes
      const extractedBatiments = [...new Set(data.map(item => item.nom_batiment))];
  
      // Créer l'HTML du tableau pour l'export Excel
      let tableHTML = `
        <table border="1" style="border-collapse: collapse; font-size: 12px; text-align: right;">
          <thead>
            <tr>
              <th>#</th>
              <th>Mois</th>
              ${extractedBatiments.map(batiment => `
                <th colspan="3">${batiment}</th>
              `).join('')}
            </tr>
            <tr>
              <th></th>
              <th></th>
              ${extractedBatiments.map(batiment => `
                <th>Facturé</th>
                <th>Occupé</th>
                <th>M² Diff</th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
      `;
  
      // Ajouter les lignes de données
      formattedData.forEach((row, index) => {
        tableHTML += `
          <tr>
            <td>${index + 1}</td>
            <td>${row.Mois}</td>
            ${extractedBatiments.map(batiment => {
              const facture = row[`${batiment}_Facture`] || 0;
              const occupe = row[`${batiment}_Occupe`] || 0;
              const superficie = row[`${batiment}_Superficie`] || 0;
              const diff = superficie !== 0 ? (facture - occupe) : 0;
  
              return `
                <td>${Math.round(facture).toLocaleString()}</td>
                <td>${Math.round(occupe).toLocaleString()}</td>
                <td>${superficie !== 0 ? (diff !== 0 ? `<span style="color: red">${Math.round(diff).toLocaleString()}</span>` : `<span style="color: green">${Math.round(diff).toLocaleString()}</span>`) : ''}</td>
              `;
            }).join('')}
          </tr>
        `;
      });
  
      tableHTML += `
        </tbody>
      </table>
      `;
  
      // Créer un Blob pour le téléchargement Excel
      const blob = new Blob([tableHTML], { type: "application/vnd.ms-excel" });
      const url = URL.createObjectURL(blob);
  
      const a = document.createElement("a");
      a.href = url;
      a.download = "rapport_superficie_export.xls";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données.',
      });
    }
  };
  
  
  
  
  
  
  
  
  
  
  
  return (
    <>
      <div className="rapport_facture">
        <h2 className="rapport_h2">RAPPORT SUPERFICIE</h2>
        <div className='rapport_row_excel'>
            <Button
            type={filterVisible ? 'primary' : 'default'}
            onClick={() => setFilterVisible(!filterVisible)}
            style={{ margin: '10px 10px 10px 0' }}
            >
            {filterVisible ? 'Cacher les filtres' : 'Afficher les filtres'}
            </Button>
            <Tooltip title={'Importer en excel'}>
                <Button className="export-excel" onClick={exportToExcelHTML} >
                    <FileExcelOutlined className="excel-icon" />
                </Button>
            </Tooltip>
        </div>
        {filterVisible && <RapportFiltrage onFilter={handleFilterChange} filtraVille={false} filtraStatus={true} />}

        <div className="rapport_wrapper_facture">
          <Table
            dataSource={dataSource}
            columns={columns}
            bordered
            scroll={{ x: 'max-content' }}
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
