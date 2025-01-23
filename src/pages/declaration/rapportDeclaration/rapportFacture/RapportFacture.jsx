import React, { useEffect, useRef, useState } from 'react'
import './rapportFacture.scss'
import { Button, notification, Space, Table, Tabs, Tag } from 'antd';
import { getRapportFacture } from '../../../../services/templateService';
import moment from 'moment';
import {
    AreaChartOutlined,
    PieChartOutlined,
    SwapOutlined
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

    const handleTabChange = (key) => {
        setActiveKey(key);
      };

      const handleTabChanges = (key) => {
        setActiveKeys(key);
      };

      const fetchData = async () => {
        try {
          const { data } = await getRapportFacture(filteredDatas);
      
          const uniqueMonths = Array.from(
            new Set(data.map((item) => `${item.Mois}-${item.Année}`))
          ).sort((a, b) => {
            const [monthA, yearA] = a.split("-");
            const [monthB, yearB] = b.split("-");
            return yearA - yearB || monthA - monthB;
          });
      
          const groupedData = data.reduce((acc, curr) => {
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
              align: 'left', // Les données restent alignées à droite
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
                        {text ? Math.round(parseFloat(text)).toLocaleString() : 0}
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
                    {text ? Math.round(parseFloat(text)).toLocaleString() : 0}
                </div>
              ),
              align: 'right', // Les données restent alignées à droite
              // Centrer le titre uniquement
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

  return (
    <>
        <div style={{boxShadow:'0px 0px 15px -10px rgba(0,0,0,0.75)', width:'max-content', margin:'10px 0 15px 0'}}>
            <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'10px', padding:'10px 15px', borderRadius:'5px'}}>
                <span style={{fontSize:'.8rem',  fontWeight:'200'}}>Nbre de client : <strong></strong></span>
                <span style={{fontSize:'.8rem',  fontWeight:'200'}}>Nbre de ville : <strong></strong></span>
                <span style={{fontSize:'.8rem',  fontWeight:'200'}}>Total M2 facture : <strong></strong></span>
                <span style={{fontSize:'.8rem',  fontWeight:'200'}}>Total M2 facture Extérieur : <strong></strong></span>
                <span style={{fontSize:'.8rem',  fontWeight:'200'}}>Total M2 facture Intérieur : <strong></strong></span>
            </div>
        </div>
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
{/*                                 <h2 className="rapport_h2">CLIENT DIVERS M² FACTURE</h2>
 */}                                    <Button
                                    type="default"
                                    onClick={handFilter}
                                    style={{margin:'10px 0'}}
                                >
                                    {filterVisible ? 'Cacher les filtres' : 'Afficher les filtres'}
                                </Button>

                            { filterVisible && <RapportFiltrage onFilter={handleFilterChange} filtraVille={false}/>        }
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
                        <AreaChartOutlined  style={{ color: 'blue' }} /> Line
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