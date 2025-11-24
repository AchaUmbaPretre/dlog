import React, { useEffect, useRef, useState } from 'react'
import { MenuOutlined, DownOutlined, FilePdfOutlined, FileExcelOutlined, PieChartOutlined, AreaChartOutlined } from '@ant-design/icons';
import { notification,Button, Space,Menu, Tooltip, Table, Tag, Dropdown, Tabs, Popover, Skeleton } from 'antd';
import moment from 'moment';
import * as XLSX from 'xlsx';
import jsPDF from "jspdf";
import "jspdf-autotable";
import { getRapportEntreposage } from '../../../../services/templateService';
import RapportFiltrage from '../rapportFiltrage/RapportFiltrage';
import RapportEntreposageChart from './rapportEntreposageChart/RapportEntreposageChart';
import getColumnSearchProps from '../../../../utils/columnSearchUtils';
import TabPane from 'antd/es/tabs/TabPane';
import RapportEntreposagePie from './rapportEntreposagePie/RapportEntreposagePie';

const RapportEntreposage = () => {
    const [loading, setLoading] = useState(true);
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
      });
    const [columnsVisibility, setColumnsVisibility] = useState({
        'id': true,
        'Total': true,
        "TotalTTC": false,
        "Client" : true,
        "Mois" : true
    });
    const [filterVisible, setFilterVisible] = useState(false);
    const scroll = { x: 400 };
    const [filteredDatas, setFilteredDatas] = useState(null);
    const [ uniqueMonths, setUniqueMonths] = useState([]);
    const [activeKeys, setActiveKeys] = useState(['1', '2']);
    const [detail, setDetail] = useState([]);

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

      
    const fetchData = async () => {
        try {
          const {data} = await getRapportEntreposage(filteredDatas);

          setDetail(data?.resume)
      
          const uniqueMonths = Array.from(
            new Set(data.data.map((item) => `${item.Mois}-${item.Année}`))
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
              client[`${monthName}_TTC`] = curr.TTC_montant;
            } else {
              acc.push({
                Client: curr.Client,
                [monthName]: curr.Montant,
                [`${monthName}_TTC`]: curr.TTC_montant,
              });
            }
            return acc;
          }, []);
      
          setColumns(generatedColumns());
          setDataSource(groupedData);
          setLoading(false);
        } catch (error) {
          notification.error({
            message: "Erreur",
            description: `${error.response.data.message}`,
          });
          setLoading(false);
        }
      };
      
    const handleFilterChange = (newFilters) => {
      setFilteredDatas(newFilters); 
    };
  
    useEffect(() => {
      fetchData();
    }, [columnsVisibility, filteredDatas])

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
      
        const ws = XLSX.utils.json_to_sheet(excelData, { header: columns.map(col => col.key) });
      
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Rapport Entreposage');
      
        // Télécharger le fichier Excel
        XLSX.writeFile(wb, 'Rapport_Entreposage.xlsx');
      };
      
      const exportToPDF = () => {
          const doc = new jsPDF();  
          const dateStr = moment().format("DD MMMM YYYY");
          const pageWidth = doc.internal.pageSize.getWidth();
                  
          const title = "Rapport entreposage";
          const titleWidth = doc.getTextWidth(title);
          const dateWidth = doc.getTextWidth(dateStr);

          const titleX = (pageWidth - titleWidth) / 2;
          const dateX = pageWidth - dateWidth - 14;
        
          doc.setFontSize(16);
          doc.text(title, titleX, 15);
          doc.setFontSize(12);
          doc.text(dateStr, dateX, 15);

                const tableColumns = columns.map(col => {
                  if (React.isValidElement(col.title)) {
                    return col.title.props?.children?.props?.children || col.title.props?.children || "Inconnu"; 
                  }
                  return col.title || "Inconnu";
                });
              
                const tableRows = dataSource.map((row, index) => {
                  return [
                    index + 1, 
                    typeof row.Client === "object" ? JSON.stringify(row.Client) : row.Client, // 🔍 Assurer une chaîne de caractères
                    ...uniqueMonths.map(month => {
                      const [numMonth, year] = month.split("-");
                      const monthName = moment(`${year}-${numMonth}-01`).format("MMM-YYYY");
                      return row[monthName] ?? 0;
                    }),
                    row.Total ?? 0
                  ];
                });
              
                // 📌 Ajout du tableau au PDF
                doc.autoTable({
                  head: [tableColumns.map(col => (typeof col === "object" ? JSON.stringify(col) : col))], // 🔍 Correction supplémentaire
                  body: tableRows,
                  startY: 25,
                  theme: "grid",
                  styles: { fontSize: 8, cellPadding: 2 },
                  headStyles: { fillColor: [41, 128, 185], textColor: 255 },
                });
              
                doc.save("rapport_Entreposage.pdf");

        }
      
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
                      Nbre de client : <strong>{detail?.Nbre_de_clients}</strong>
                    </span>
                    </Popover>
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
            <h2 className="rapport_h2">CLIENT DIVERS ENTREPOSAGE</h2>
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

              <Tooltip title={'Importer en pdf'}>
                <Button className="export-pdf" onClick={exportToPDF} >
                  <FilePdfOutlined className="pdf-icon" />
                </Button>
              </Tooltip>
            </div>
            { filterVisible && <RapportFiltrage onFilter={handleFilterChange} filtraVille={true} filtraClient={true} filtraStatus={true}/>}
            <div className="rapport_wrapper_facture">

                <Table
                    dataSource={dataSource}
                    columns={getVisibleColumns()}
                    bordered
                    scroll={scroll}
                    loading={loading}
                    size="small"
                    pagination={pagination}
                    onChange={(pagination) => setPagination(pagination)}
                    rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                />

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
                        <RapportEntreposageChart groupedData={dataSource} uniqueMonths={uniqueMonths} />
                    </TabPane>

                    <TabPane
                        tab={
                        <span>
                            <PieChartOutlined style={{ color: 'ORANGE' }} /> Pie
                        </span>
                    }
                        key="2"
                    >
                        <RapportEntreposagePie groupedData={dataSource} uniqueMonths={uniqueMonths} />
                    </TabPane> 
                </Tabs>
            </div>
        </div>
    </>
  )
}

export default RapportEntreposage