import React, { useEffect, useRef, useState } from 'react'
import { MenuOutlined, DownOutlined, PieChartOutlined, AreaChartOutlined } from '@ant-design/icons';
import { notification,Button, Space,Menu, Table, Tag, Dropdown, Tabs, Popover, Skeleton } from 'antd';
import moment from 'moment';
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

      const handleFilterChange = (newFilters) => {
        setFilteredDatas(newFilters); 
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
            <h2 className="rapport_h2">CLIENT DIVERS ENTREPOSAGE</h2>
            <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
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
            </div>
            { filterVisible && <RapportFiltrage onFilter={handleFilterChange} filtraVille={false}/>        }
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