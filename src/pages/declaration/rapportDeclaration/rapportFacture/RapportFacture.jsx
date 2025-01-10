import React, { useEffect, useState } from 'react'
import './rapportFacture.scss'
import { notification, Space, Table, Tag } from 'antd';
import { getRapportFacture } from '../../../../services/templateService';
import moment from 'moment';

const RapportFacture = () => {
    const [loading, setLoading] = useState(true);
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const scroll = { x: 400 };
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
      });



    const fetchData = async () => {
        try {
          const { data } = await getRapportFacture();
         
          const uniqueMonths = Array.from(
            new Set(
              data.map((item) => `${item.Mois}-${item.Année}`)
            )
          ).sort((a, b) => {
            // Trier par année et mois
            const [monthA, yearA] = a.split("-");
            const [monthB, yearB] = b.split("-");
            return yearA - yearB || monthA - monthB;
          });
  
          // Générer dynamiquement les colonnes avec le nom abrégé du mois
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
                width: "3%",
            },
            {
              title: "Client",
              dataIndex: "Client",
              key: "Client",
              fixed: "left",
              render: text => (
                <Space>
                  <Tag color={'green'}>
                    {text}
                  </Tag>
                </Space>
              ),
            },
            ...uniqueMonths.map((month) => {
              const [numMonth, year] = month.split("-");
              const monthName = moment(`${year}-${numMonth}-01`).format("MMM-YYYY");
  
              return {
                title: <Tag color={'#2db7f5'}>{monthName}</Tag>,
                dataIndex: monthName,
                key: monthName,
                render: text => (
                    <Space>
                      <Tag color={text == null ? 'red' : 'blue'}>
                        {text == null ? "Aucun" : `${text} $`}
                      </Tag>
                    </Space>
                  ),
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
                  <Tag color={'#87d068'}>
                    {`${total.toFixed(2)} $`}
                  </Tag>
                </Space> ;
                },
              },
          ];
  
          // Transformer les données pour correspondre aux colonnes
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
  
    useEffect(() => {
      fetchData();
    }, []);


  return (
    <>
        <div className="rapport_facture">
            <h2 className="rapport_h2">CLIENT DIVERS M² FACTURE</h2>
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
                />
            </div>
        </div>
    </>
  )
}

export default RapportFacture