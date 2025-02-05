import React, { useEffect, useRef, useState } from 'react'
import { Button, notification, Popover, Tooltip, Dropdown, Skeleton, Space, Table, Tabs, Tag, Menu } from 'antd';
import {
    AreaChartOutlined,
    PieChartOutlined,
    MenuOutlined,
    DownOutlined,
    FileExcelOutlined
} from '@ant-design/icons';
import moment from 'moment';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { getRapportManutentation } from '../../../../services/templateService';
import RapportManuChart from './rapportManuChart/RapportManuChart';
import TabPane from 'antd/es/tabs/TabPane';
import RapportManuPie from './rapportManuPie/RapportManuPie';
import RapportFiltrage from '../rapportFiltrage/RapportFiltrage';
import getColumnSearchProps from '../../../../utils/columnSearchUtils';

const RapportManu = () => {
    const [loading, setLoading] = useState(true);
    const [columns, setColumns] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [pagination, setPagination] = useState({
                current: 1,
                pageSize: 20,
              });
    const [searchedColumn, setSearchedColumn] = useState('');
    const [filterVisible, setFilterVisible] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [columnsVisibility, setColumnsVisibility] = useState({
            'id': true,
            'Total': true,
            "TotalTTC": false,
            "Client" : true,
            "Mois" : true
    });
    const scroll = { x: 400 };
    const [filteredDatas, setFilteredDatas] = useState(null);
    const [ uniqueMonths, setUniqueMonths] = useState([]);
    const [activeKeys, setActiveKeys] = useState(['1', '2']);
    const [detail, setDetail] = useState([]);
    const searchInput = useRef(null);
  
    const fetchData = async () => {
        try {
          const { data } = await getRapportManutentation(filteredDatas);
         
          setDetail(data.resume)
          const uniqueMonths = Array.from(
            new Set(
              data.data.map((item) => `${item.Mois}-${item.Année}`)
            )
          ).sort((a, b) => {
            const [monthA, yearA] = a.split("-");
            const [monthB, yearB] = b.split("-");
            return yearA - yearB || monthA - monthB;
          });

          setUniqueMonths(uniqueMonths)

          const generatedColumns = () => {
            const columns = [
              {
                title: "#",
                dataIndex: "id",
                key: "id",
                render: (text, record, index) => {
                  const pageSize = pagination.pageSize || 10;
                  const pageIndex = pagination.current || 1;
                  return (pageIndex - 1) * pageSize + index + 1;
                },
                width: "4%",
              },
              {
                title: "Client",
                dataIndex: "Client",
                key: "Client",
                fixed: "left",
                ...getColumnSearchProps(
                    'Client',
                    searchText,
                    setSearchText,
                    setSearchedColumn,
                    searchInput
                  ),
                render: (text) => (
                  <Space>
                    {text}
                  </Space>
                ),
                align: "left",
                title: <div style={{ textAlign: 'left' }}>Client</div>
              },
              ...uniqueMonths.map((month) => {
                const [numMonth, year] = month.split("-");
                const monthName = moment(`${year}-${numMonth}-01`).format("MMM-YYYY");
          
                return {
                  title: <div style={{ textAlign: 'center' }}><Tag color={"#2db7f5"}>{monthName}</Tag></div>,
                  dataIndex: monthName,
                  key: 'Mois',
                  sorter: (a, b) => {
                    const valueA = a[monthName] || 0;
                    const valueB = b[monthName] || 0;
                    return valueA - valueB;
                  },
                  sortDirections: ["descend", "ascend"],
                  render: (text) => (
                    <Space>
                      <div style={{color: text ? 'black' : 'red'}}>
                      {text
                            ? `${parseFloat(text)
                                .toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                                })
                                .replace(/,/g, " ")} $` // Remplace les virgules par des espaces
                            : "0.00"}
                        </div>
                    </Space>
                  ),
                  align: "right",
                  ...(columnsVisibility['Mois'] ? {} : { className: 'hidden-column' })

                };
              }),
              {
                title: "Total",
                dataIndex: "Total",
                key: "Total",
                render: (_, record) => {
                  const total = uniqueMonths.reduce((sum, month) => {
                    const [numMonth, year] = month.split("-");
                    const monthName = moment(`${year}-${numMonth}-01`).format("MMM-YYYY");
                    return sum + (record[monthName] || 0);
                  }, 0);
                  return (
                    <Space>
                        <div style={{ color: total ? 'black' : 'red' }}>
                            {total
                            ? `${parseFloat(total)
                                .toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                                })
                                .replace(/,/g, " ")} $` // Remplace les virgules par des espaces
                            : "0.00"}
                        </div>
                    </Space>
                  );
                },
                align: "right",
                title: <div style={{ textAlign: 'center' }}>Total</div>,
                ...(columnsVisibility['Total'] ? {} : { className: 'hidden-column' })
              },
              {
                title: "Total TTC",
                dataIndex: "TotalTTC",
                key: "TotalTTC",
                render: (_, record) => {
                    const totalTTC = uniqueMonths.reduce((sum, month) => {
                        const [numMonth, year] = month.split("-");
                        const monthName = moment(`${year}-${numMonth}-01`).format("MMM-YYYY");
                        return sum + (record[`${monthName}_TTC`] || 0);
                    }, 0);
                    return (
                        <div>
                            <div style={{color: totalTTC ? 'black' : 'red'}}>
                            {totalTTC
                            ? `${parseFloat(totalTTC)
                                .toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                                })
                                .replace(/,/g, " ")} $` // Remplace les virgules par des espaces
                            : "0.00"}
                            </div>
                        </div>
                    );
                },
                align: "right",
                ...(columnsVisibility["TotalTTC"] ? {} : { className: "hidden-column" }),
            }
            ];
          
            return columns;
          };
  
          const groupedData = data.data.reduce((acc, curr) => {
            const client = acc.find((item) => item.Client === curr.Client);
            const [numMonth, year] = [curr.Mois, curr.Année];
            const monthName = moment(`${year}-${numMonth}-01`).format("MMM-YYYY");
  
            if (client) {
              client[monthName] = curr.Montant;
            } else {
              acc.push({
                Client: curr.Client,
                [monthName]: curr.Montant,
              });
            }
            return acc;
          }, []);
  
          setColumns(generatedColumns());
          setDataSource(groupedData);
          setLoading(false);
        } catch (error) {
          notification.error({
            message: 'Erreur de chargement',
            description: 'Une erreur est survenue lors du chargement des données.',
          });
          setLoading(false);
        }
      };

      const toggleColumnVisibility = (columnName, e) => {
        e.stopPropagation();
        setColumnsVisibility((prev) => ({
          ...prev,
          [columnName]: !prev[columnName],
        }));
      };

      const handleTabChanges = (key) => {
        setActiveKeys(key);
      };

      const handleFilterChange = (newFilters) => {
        setFilteredDatas(newFilters); 
      };
  
    useEffect(() => {
      fetchData();
    }, [columnsVisibility,filteredDatas]);

    const handFilter = () => {
      fetchData()
      setFilterVisible(!filterVisible)
    }

    const menus = (
      <Menu>
        {Object.keys(columnsVisibility).map((columnName) => (
          <Menu.Item key={columnName}>
            <span onClick={(e) => toggleColumnVisibility(columnName, e)}>
              <input type="checkbox" checked={columnsVisibility[columnName]} readOnly />
              <span style={{ marginLeft: 8 }}>{columnName}</span>
            </span>
          </Menu.Item>
        ))}
      </Menu>
    );

    const getVisibleColumns = () => {
      return columns.filter((col) => columnsVisibility[col.key]);
    };

    const exportToExcelHTML = () => {
      // Définir les colonnes dynamiques
      const columns = [
        {
          title: "#",
          key: "id",
        },
        {
          title: "Client",
          key: "Client",
        },
        ...uniqueMonths.map((month) => {
          const [numMonth, year] = month.split("-");
          const monthName = moment(`${year}-${numMonth}-01`).format("MMM-YYYY");
          return {
            title: monthName,
            key: monthName,
          };
        }),
        {
          title: "Total",
          key: "Total",
        },
        {
          title: "Total TTC",
          key: "TotalTTC",
        },
      ];
    
      // Construire les lignes de données
      const excelData = dataSource.map((row, index) => {
        let dataRow = {
          id: index + 1,
          Client: row.Client,
        };
    
        // Ajouter les valeurs des mois
        uniqueMonths.forEach((month) => {
          const [numMonth, year] = month.split("-");
          const monthName = moment(`${year}-${numMonth}-01`).format("MMM-YYYY");
          dataRow[monthName] = row[monthName] || 0;
        });
    
        // Ajouter le total par mois
        const total = uniqueMonths.reduce((sum, month) => {
          const [numMonth, year] = month.split("-");
          const monthName = moment(`${year}-${numMonth}-01`).format("MMM-YYYY");
          return sum + (row[monthName] || 0);
        }, 0);
        dataRow["Total"] = total;
    
        // Ajouter le total TTC
        const totalTTC = uniqueMonths.reduce((sum, month) => {
          const [numMonth, year] = month.split("-");
          const monthName = moment(`${year}-${numMonth}-01`).format("MMM-YYYY");
          return sum + (row[`${monthName}_TTC`] || 0);
        }, 0);
        dataRow["TotalTTC"] = totalTTC;
    
        return dataRow;
      });
    
      // Créer la feuille de calcul
      const ws = XLSX.utils.json_to_sheet(excelData, { header: columns.map(col => col.key) });
    
      // Créer un classeur et ajouter la feuille de données
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Rapport Manutentation');
    
      // Télécharger le fichier Excel
      XLSX.writeFile(wb, 'Rapport_Manutentation.xlsx');
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
                    Total :{' '}
                    <strong>{Math.round(parseFloat(detail.Total))?.toLocaleString()} $</strong>
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    Total TTC :{' '}
                    <strong>{Math.round(parseFloat(detail.Total_ttc))?.toLocaleString()} $</strong>
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
            <h2 className="rapport_h2">CLIENT DIVERS MANUTENTION</h2>
            <div className="rapport_row_excel">
            <Button
                  type={filterVisible ? 'primary' : 'default'}
                  onClick={handFilter}
                  style={{ margin: '10px 0' }}
              >
                  {filterVisible ? 'Cacher les filtres' : 'Afficher les filtres'}
              </Button>

              <Dropdown overlay={menus} trigger={['click']}>
                <Button icon={<MenuOutlined />} className="ant-dropdown-link">
                  Colonnes <DownOutlined />
                </Button>
              </Dropdown>

              <Tooltip title={'Importer en excel'}>
                <Button className="export-excel" onClick={exportToExcelHTML} >
                  <FileExcelOutlined className="excel-icon" />
                </Button>
              </Tooltip>
            </div>

            { filterVisible && <RapportFiltrage onFilter={handleFilterChange} filtraVille={true} filtraClient={true} filtraStatus={true}/>}
            <div className="rapport_wrapper_facture">
                <Table
                    dataSource={dataSource}
                    columns={getVisibleColumns()}
                    bordered
                    pagination={pagination}
                    onChange={(pagination) => setPagination(pagination)}
                    scroll={scroll}
                    loading={loading}
                    size="small"
                    rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                />
            </div>
            <div className="rapport_chart" style={{marginTop:'40px'}}>
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
                        <RapportManuChart groupedData={dataSource} uniqueMonths={uniqueMonths} />
                    </TabPane>

                    <TabPane
                        tab={
                        <span>
                            <PieChartOutlined style={{ color: 'ORANGE' }} /> Pie
                        </span>
                    }
                        key="2"
                    >
                        <RapportManuPie groupedData={dataSource} uniqueMonths={uniqueMonths} />
                    </TabPane>
                </Tabs>
            </div>
        </div>
    </>
  )
}

export default RapportManu