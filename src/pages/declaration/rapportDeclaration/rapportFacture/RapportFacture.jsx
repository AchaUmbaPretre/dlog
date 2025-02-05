import React, { useEffect, useRef, useState } from 'react'
import './rapportFacture.scss'
import { Button, notification, Popover, Skeleton, Space, Table, Tabs, Tag } from 'antd';
import { getRapportFacture, getRapportFactureClient } from '../../../../services/templateService';
import moment from 'moment';
import {
    AreaChartOutlined,
    PieChartOutlined,
    SwapOutlined,
    FileExcelOutlined
} from '@ant-design/icons';
import RapportFiltrage from '../rapportFiltrage/RapportFiltrage';
import RapportFactureChart from './rapportFactureChart/RapportFactureChart';
import getColumnSearchProps from '../../../../utils/columnSearchUtils';
import TabPane from 'antd/es/tabs/TabPane';
import RapportFactureVille from './rapportFactureVille/RapportFactureVille';
import RapportFacturePie from './rapportFacturePie/RapportFacturePie';
import RapportFactureExterneEtInterne from './rapportFactureExterneEtInterne/RapportFactureExterneEtInterne';

const RapportFacture = () => {
    const [loading, setLoading] = useState(true);
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const scroll = { x: 400 };
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
      });
    const [filteredDatas, setFilteredDatas] = useState(null);
    const [filterVisible, setFilterVisible] = useState(false);
    const [ uniqueMonths, setUniqueMonths] = useState([]);
    const [activeKey, setActiveKey] = useState(['1', '2']);
    const [activeKeys, setActiveKeys] = useState(['1', '2']);
    const [ detail, setDetail] = useState('');
    const [ clientdetail, setClientDetail] = useState([]);


    const handleTabChange = (key) => {
        setActiveKey(key);
      };

      const handleTabChanges = (key) => {
        setActiveKeys(key);
      };

      const fetchData = async () => {
        try {
          const { data } = await getRapportFacture(filteredDatas);

          const res = await getRapportFactureClient()

          setDetail(data?.resume);
          setClientDetail(res?.data)
      
          const uniqueMonths = Array.from(
            new Set(data?.data.map((item) => `${item.Mois}-${item.Année}`))
          ).sort((a, b) => {
            const [monthA, yearA] = a.split("-");
            const [monthB, yearB] = b.split("-");
            return yearA - yearB || monthA - monthB;
          });
      
          const groupedData = data.data.reduce((acc, curr) => {
            const client = acc.find((item) => item.Client === curr.Client);
            const [numMonth, year] = [curr.Mois, curr.Année];
            const monthName = moment(`${year}-${numMonth}-01`).format("MMM-YYYY");
      
            if (client) {
              client[monthName] = curr.Montant || 0;
              client.Total = (client.Total || 0) + (curr.Montant || 0);
            } else {
              acc.push({
                Client: curr.Client,
                [monthName]: curr.Montant || 0,
                Total: curr.Montant || 0,
              });
            }
            return acc;
          }, []);

          setUniqueMonths(uniqueMonths)
      
          const generatedColumns = [
            {
              title: '#',
              dataIndex: 'id',
              key: 'id',
              render: (text, record, index) => {
                const pageSize = pagination.pageSize || 10;
                const pageIndex = pagination.current || 1;
                return (pageIndex - 1) * pageSize + index + 1;
              },
              width: "4%",
              align: 'right',
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
                  <div>
                    {text}
                  </div>
                </Space>
              ),
              align: 'left', 
              title: <div style={{ textAlign: 'left' }}>Client</div>,
            },
            ...uniqueMonths.map((month) => {
              const [numMonth, year] = month.split("-");
              const monthName = moment(`${year}-${numMonth}-01`).format("MMM-YYYY");
          
              return {
                title: <div style={{ textAlign: 'center' }}><Tag color="#2db7f5">{monthName}</Tag></div>,
                dataIndex: monthName,
                key: monthName,
                sorter: (a, b) => (a[monthName] || 0) - (b[monthName] || 0),
                sortDirections: ['descend', 'ascend'],
                render: (text) => (
                  <Space>
                    <div style={{color: text ? 'black' : 'red'}}>
                        {text ? Math.round(parseFloat(text))?.toLocaleString() : 0}
                    </div>
                  </Space>
                ),
                align: 'right' 
              };
            }),
            {
              title: "Total",
              dataIndex: "Total",
              key: "Total",
              sorter: (a, b) => a.Total - b.Total,
              sortDirections: ['descend', 'ascend'],
              render: (text) => (
                <div style={{color: text ? 'black' : 'red'}}>
                    {text ? Math.round(parseFloat(text))?.toLocaleString() : 0}
                </div>
              ),
              align: 'right',
              title: <div style={{ textAlign: 'center' }}>Total</div>,
            },
          ];
          
      
          setColumns(generatedColumns);
          setDataSource(groupedData);
          setLoading(false);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // Gérer l'erreur 404
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

    const handleFilterChange = (newFilters) => {
        setFilteredDatas(newFilters); 
      };

    const handFilter = () => {
        fetchData()
        setFilterVisible(!filterVisible)
      }
    
      const clientListContent = (
        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {clientdetail.map((client, index) => (
              <li key={index} style={{ padding: "5px 0", borderBottom: "1px solid #f0f0f0", fontSize:'12px' }}>
                {index + 1}. {client.nom}
              </li>
            ))}
          </ul>
        </div>
      );

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
                    <Popover content={clientListContent} title="Liste des clients" trigger="hover">
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
                    Total M² facturé :{' '}
                    <strong>{Math.round(parseFloat(detail.Total_M2_facture))?.toLocaleString()}</strong>
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    Total Extérieur :{' '}
                    <strong>{detail.Total_M2_facture_Extérieur?.toLocaleString()}</strong>
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    Total Intérieur :{' '}
                    <strong>{detail.Total_M2_facture_Intérieur?.toLocaleString()}</strong>
                    </span>
                </div>
                </div>
            )
        }
        <Tabs
            activeKey={activeKey[0]}
            onChange={handleTabChange}
            type="card"
            tabPosition="top"
            renderTabBar={(props, DefaultTabBar) => (
                <DefaultTabBar {...props} />
            )}
        >
            <TabPane
                tab={
                    <span>
                        <AreaChartOutlined style={{ color: '#13c2c2' }} /> CLIENT DIVERS M² FACTURE
                    </span>
                }
                    key="1"
            >
                <div className="rapport_facture">
                  <div className='rapport_row_excel'>
                    <Button
                      type={filterVisible ? 'primary' : 'default'}
                      onClick={handFilter}
                      style={{ margin: '10px 0' }}
                    >
                      {filterVisible ? 'Cacher les filtres' : 'Afficher les filtres'}
                    </Button>
                    <div className="export-excel">
                      <FileExcelOutlined className="excel-icon" />
                    </div>
                  </div>

                    { filterVisible && <RapportFiltrage onFilter={handleFilterChange} filtraVille={false} filtraClient={true}/>        }
                    <div className="rapport_wrapper_facture">
                        <Table
                            dataSource={dataSource}
                            columns={columns}
                            bordered
                            scroll={scroll}
                            loading={loading}
                            size="small"
                            pagination={pagination}
                            onChange={(pagination) => setPagination(pagination)}
                            rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                        />
                    </div>
                </div>
            </TabPane>

            <TabPane
                tab={
                    <span>
                        <AreaChartOutlined style={{ color: 'ORANGE' }} /> DETAIL PAR VILLE
                    </span>
                }
                    key="2"
            >
                 <RapportFactureVille/>
            </TabPane>

            <TabPane
                tab={
                        <span>
                            <SwapOutlined style={{ color: 'red' }} /> Intérieur & Extérieur
                        </span>
                    }
                    key="3"
            >
                <RapportFactureExterneEtInterne groupedData={dataSource} uniqueMonths={uniqueMonths} />
            </TabPane>
            
        </Tabs>
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
                        <AreaChartOutlined  style={{ color: 'blue' }} /> Bar
                    </span>
                }
                    key="1"
                >
                    <RapportFactureChart groupedData={dataSource} uniqueMonths={uniqueMonths} />
                </TabPane>

                <TabPane
                    tab={
                    <span>
                        <PieChartOutlined style={{ color: 'ORANGE' }} /> Pie
                    </span>
                }
                    key="2"
                >
                    <RapportFacturePie groupedData={dataSource} uniqueMonths={uniqueMonths} />
                </TabPane>
            </Tabs>
        </div>
    </>
  )
}

export default RapportFacture