import React, { useEffect, useState } from 'react'
import { notification,Button, Space,Menu, Tooltip, Table, Tag, Dropdown, Tabs, Popover, Skeleton } from 'antd';
import moment from 'moment';
import { getRapportTemplate }  from '../../../../services/templateService';

const RapportVariation = () => {
    const [loading, setLoading] = useState(true);
    const [columns, setColumns] = useState([]);
    const scroll = { x: 400 };
    const [dataSource, setDataSource] = useState([]);
    const [pagination, setPagination] = useState({current: 1, pageSize: 20,});
    const [filteredDatas, setFilteredDatas] = useState(null);
    const [ uniqueMonths, setUniqueMonths] = useState([]);

    const fetchData = async () => {
        try {
          const {data} = await getRapportTemplate(filteredDatas);      
          const uniqueMonths = Array.from(
            new Set(data.map((item) => `${item.Mois}-${item.Année}`))
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
      
          setColumns(generatedColumns);
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
    }, [filteredDatas])

  return (
    <>
        <div className="rapport-facture">
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
    </>
  )
}

export default RapportVariation