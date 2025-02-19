import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Dropdown, Menu, Tooltip, notification, Popover, Skeleton, Space, Table, Tabs, Tag } from 'antd';
import moment from 'moment';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from "jspdf";
import "jspdf-autotable";
import { AreaChartOutlined, PieChartOutlined, FilePdfOutlined, FileExcelOutlined } from '@ant-design/icons';
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
  const [detail, setDetail] = useState([]);
  const scroll = { x: 400 };
  const [uniqueMonths, setUniqueMonths] = useState([]);
  const [activeKeys, setActiveKeys] = useState(['1', '2']);
  const [showInPercentage, setShowInPercentage] = useState(false);

  const calculatePercentage = (value, entreposage, manutention) => {
    const total = entreposage + manutention; // Total des deux valeurs
    console.log('value : ', value, 'total : ', total); // Debugging
    return total ? ((value / total) * 100).toFixed(2) : 0;
  };
  

  const fetchData = async () => {
    try {
      const { data } = await getRapportVille(filteredDatas);

      setDetail(data.resume)

      // Regrouper les données par mois
      const groupedData = data.data.reduce((acc, item) => {
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

      const extractedCities = [...new Set(data.data.map(item => item.capital))];
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
              width: '10%',
              sorter: (a, b) => (a[`${capital}_Entreposage`] || 0) - (b[`${capital}_Entreposage`] || 0),
              render: (text, record) => {
                const entreposage = parseFloat(record[`${capital}_Entreposage`]) || 0;
                const manutention = parseFloat(record[`${capital}_Manutention`]) || 0;
                return (
                  <Space>
                    {showInPercentage
                      ? `${calculatePercentage(entreposage, entreposage, manutention)} %`
                      : text
                      ? `${parseFloat(text)
                          .toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                          .replace(/,/g, ' ')} $`
                      : '0.00'}
                  </Space>
                );
              },
              align: 'right',
            },
            {
              title: 'Manut',
              dataIndex: `${capital}_Manutention`,
              key: `${capital}_Manutention`,
              sorter: (a, b) => (a[`${capital}_Manutention`] || 0) - (b[`${capital}_Manutention`] || 0),
              width: '9%',
              render: (text, record) => {
                const entreposage = parseFloat(record[`${capital}_Entreposage`]) || 0;
                const manutention = parseFloat(record[`${capital}_Manutention`]) || 0;
                return (
                  <Space>
                    {showInPercentage
                      ? `${calculatePercentage(manutention, entreposage, manutention)} %`
                      : text
                      ? `${parseFloat(text)
                          .toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                          .replace(/,/g, ' ')} $`
                      : '0.00'}
                  </Space>
                );
              },
              align: 'right',
            },
            {
              title: 'Total',
              dataIndex: `${capital}_Total`,
              key: `${capital}_Total`,
              width: '10%',
              sorter: (a, b) => (a[`${capital}_Total`] || 0) - (b[`${capital}_Total`] || 0),
              render: (text, record) => {
                const entreposage = parseFloat(record[`${capital}_Entreposage`]) || 0;
                const manutention = parseFloat(record[`${capital}_Manutention`]) || 0;
                const total = entreposage + manutention;
                return (
                  <Space>
                    {showInPercentage
                      ? `${calculatePercentage(total, entreposage, manutention)} %`
                      : text
                      ? `${parseFloat(text)
                          .toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                          .replace(/,/g, ' ')} $`
                      : '0.00'}
                  </Space>
                );
              },
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
  }, [filteredDatas, showInPercentage]);

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

  const exportToExcelHTML = () => {
    // Créer les colonnes dynamiques pour l'export
    const columns = [
      {
        title: "#",
        key: "id",
      },
      {
        title: "Mois",
        key: "Mois",
      },
      ...allCities.map((capital) => [
        {
          title: `${capital} - Entrep`,
          key: `${capital}_Entreposage`,
        },
        {
          title: `${capital} - Manut`,
          key: `${capital}_Manutention`,
        },
        {
          title: `${capital} - Total`,
          key: `${capital}_Total`,
        },
      ]).flat(),
    ];
  
    // Générer les lignes de données pour l'export
    const excelData = dataSource.map((row, index) => {
      let dataRow = {
        id: index + 1,
        Mois: row.Mois,
      };
  
      // Remplir les valeurs pour chaque ville
      allCities.forEach((capital) => {
        dataRow[`${capital}_Entreposage`] = row[`${capital}_Entreposage`] || 0;
        dataRow[`${capital}_Manutention`] = row[`${capital}_Manutention`] || 0;
        dataRow[`${capital}_Total`] = row[`${capital}_Total`] || 0;
      });
  
      return dataRow;
    });
  
    // Convertir en feuille Excel avec la bibliothèque XLSX
    const ws = XLSX.utils.json_to_sheet(excelData, {
      header: columns.map(col => col.key),
    });
  
    // Créer un nouveau classeur
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Rapport Ville");
  
    // Télécharger le fichier Excel
    XLSX.writeFile(wb, "Rapport_Ville.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF("l", "mm", "a4"); // Mode paysage
    const dateStr = moment().format("DD MMMM YYYY");
    const pageWidth = doc.internal.pageSize.getWidth();
  
    // Ajouter le titre
    const title = "Rapport Ville";
    doc.setFontSize(16);
    doc.text(title, pageWidth / 2 - doc.getTextWidth(title) / 2, 15);
  
    // Ajouter la date
    doc.setFontSize(10);
    doc.text(dateStr, pageWidth - doc.getTextWidth(dateStr) - 10, 15);
  
    if (!Array.isArray(columns) || !Array.isArray(dataSource)) {
      console.error("Colonnes ou données invalides.");
      return;
    }
  
    // Extraire les titres des colonnes pour le PDF
    const tableColumns = columns.flatMap(col => {
      if (col.children) {
        return col.children.map(child => ({
          title: `${col.title} - ${child.title}`,
          dataKey: child.dataIndex,
        }));
      }
      return { title: col.title, dataKey: col.dataIndex };
    });
  
    // Formater les données du tableau
    const tableData = dataSource.map(row => {
      return tableColumns.reduce((acc, col) => {
        acc[col.dataKey] = row[col.dataKey] || "0.00";
        return acc;
      }, {});
    });
  
    // Générer le tableau PDF
    doc.autoTable({
      startY: 25,
      head: [tableColumns.map(col => col.title)],
      body: tableData.map(row => tableColumns.map(col => row[col.dataKey])),
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });
  
    // Sauvegarde du PDF
    doc.save("Rapport_Ville.pdf");
  };

        // Option de basculement entre dollars et pourcentage
        const togglePercentageMode = () => {
          setShowInPercentage(prevState => !prevState);
        };
        

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
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '15px',
                    padding: '15px',
                    }}
                >
                    <Popover title="Liste des clients" trigger="hover">
                      <span
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: '400',
                          cursor: 'pointer',
                          color: '#1890ff',
                          }}
                      >
                        Nbre de clients : <strong>{detail?.Nbre_de_clients}</strong>
                      </span>
                    </Popover>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    Nbre de villes : <strong>{detail.Nbre_de_villes}</strong>
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    Total Entreposage :{' '}
                    <strong>{Math.round(parseFloat(detail?.total_entreposage))?.toLocaleString()} $</strong>
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    Total Manutention :{' '}
                    <strong>{Math.round(parseFloat(detail.total_manutation))?.toLocaleString()} $</strong>
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    Total Entre. & Manu. :{' '}
                    <strong>{Math.round(parseFloat(detail.total))?.toLocaleString()} $</strong>
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    Total Extérieur :{' '}
                    <strong>{detail.Total_Extérieur?.toLocaleString()} $</strong>
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    Total Intérieur :{' '}
                    <strong>{detail.Total_Intérieur?.toLocaleString()} $</strong>
                    </span>
                </div>
              </div>
            )
        }
      <div className="rapport_facture">
        <h2 className="rapport_h2">RAPPORT VILLE</h2>
        <div className="rapport_row_excel">
          <Button
            type={filterVisible ? 'primary' : 'default'}
            onClick={() => setFilterVisible(!filterVisible)}
            style={{ margin: '10px 10px 10px 0' }}
          >
            {filterVisible ? 'Cacher les filtres' : 'Afficher les filtres'}
          </Button>
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

          <Button onClick={togglePercentageMode}>
            {showInPercentage ? 'Afficher en Dollars' : 'Afficher en Pourcentage'}
          </Button>

          <Tooltip title={'Importer en excel'}>
            <Button className="export-excel" onClick={exportToExcelHTML} >
              <FileExcelOutlined className="excel-icon" />
            </Button>
          </Tooltip>

          <Tooltip title={'Importer en pdf'}>
            <Button className="export-pdf" onClick={exportToPDF} >
              <FilePdfOutlined className="pdf-icon" />
            </Button>
          </Tooltip>

        </div>

        {filterVisible && <RapportFiltrage onFilter={handleFilterChange} filtraVille={true} filtraClient={true} filtraStatus={false} />}
        <div className="rapport_wrapper_facture">
          <Table
            dataSource={dataSource}
            columns={filteredColumns}
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
                        <RapportVueEnsembleChart groupedData={dataSource} showPercentage={showInPercentage} />
                    </TabPane>

                 <TabPane
                        tab={
                        <span>
                            <PieChartOutlined style={{ color: 'ORANGE' }} /> Pie
                        </span>
                    }
                        key="2"
                    >
                        <RapportVueEnsemblePie groupedData={dataSource} showPercentage={showInPercentage} uniqueMonths={uniqueMonths} />
                    </TabPane>
                </Tabs>
      </div>
    </>
  );
};

export default RapportVueEnsemble;
