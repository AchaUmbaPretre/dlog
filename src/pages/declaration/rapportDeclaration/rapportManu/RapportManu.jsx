import React, { useEffect, useState } from 'react'
import { notification, Space, Table, Tabs, Tag } from 'antd';
import {
    AreaChartOutlined,
    PieChartOutlined,
    SwapOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { getRapportManutentation } from '../../../../services/templateService';
import RapportManuChart from './rapportManuChart/RapportManuChart';
import TabPane from 'antd/es/tabs/TabPane';


const RapportManu = () => {
    const [loading, setLoading] = useState(true);
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const scroll = { x: 400 };
    const [ uniqueMonths, setUniqueMonths] = useState([]);
    const [activeKeys, setActiveKeys] = useState(['1', '2']);

    const fetchData = async () => {
        try {
          const { data } = await getRapportManutentation();
         
          const uniqueMonths = Array.from(
            new Set(
              data.map((item) => `${item.Mois}-${item.Année}`)
            )
          ).sort((a, b) => {
            const [monthA, yearA] = a.split("-");
            const [monthB, yearB] = b.split("-");
            return yearA - yearB || monthA - monthB;
          });

          setUniqueMonths(uniqueMonths)

          const generatedColumns = [
            {
                title: '#',
                dataIndex: 'id',
                key: 'id',
                render: (text, record, index) => index + 1,
                width: "4%",
            },
            {
              title: "Client",
              dataIndex: "Client",
              key: "Client",
              fixed: "left",
              render: text => (
                <Space>
                  {text}
                </Space>
              ),
              align: 'left',
            },
            ...uniqueMonths.map((month) => {
              const [numMonth, year] = month.split("-");
              const monthName = moment(`${year}-${numMonth}-01`).format("MMM-YYYY");
  
              return {
                title: <Tag color={'#2db7f5'}>{monthName}</Tag>,
                dataIndex: monthName,
                key: monthName,
                sorter: (a, b) => {
                    const valueA = a[monthName] || 0;
                    const valueB = b[monthName] || 0;
                    return valueA - valueB;
                  },
                  sortDirections: ['descend', 'ascend'],
                render: text => (
                    <Space>
                        <div style={{color: text ? 'black' : 'red'}}>
                            {text ? `${text.toLocaleString()} $` : 0}
                        </div>
                    </Space>
                  ),
                  align: 'right',
                  title: <div style={{ textAlign: 'center' }}> <Tag color={'#2db7f5'}>{monthName}</Tag></div>

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
                  return <Space>
                  <div style={{color: total ? 'black' : 'red'}}>
                        {total ? `${Math.round(parseFloat(total)).toLocaleString()} $` : '0'}

                        </div>
                </Space> ;
                },
                align: 'right',
                title: <div style={{ textAlign: 'center' }}>Total</div>

              },
          ];
  
          const groupedData = data.reduce((acc, curr) => {
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
  
          setColumns(generatedColumns);
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

      const handleTabChanges = (key) => {
        setActiveKeys(key);
      };
  
    useEffect(() => {
      fetchData();
    }, []);

  return (
    <>
        <div className="rapport_facture">
            <h2 className="rapport_h2">CLIENT DIVERS MANUTENTION</h2>
            <div className="rapport_wrapper_facture">
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    bordered
                    pagination={false}
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

{/*                     <TabPane
                        tab={
                        <span>
                            <PieChartOutlined style={{ color: 'ORANGE' }} /> Pie
                        </span>
                    }
                        key="2"
                    >
                    </TabPane> */}
                </Tabs>
            </div>
        </div>
    </>
  )
}

export default RapportManu