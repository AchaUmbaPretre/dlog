import React, { useEffect, useState } from 'react'
import './rapportFacture.scss'
import { Button, notification, Space, Table, Tag } from 'antd';
import { getRapportFacture } from '../../../../services/templateService';
import moment from 'moment';
import RapportFiltrage from '../rapportFiltrage/RapportFiltrage';

const RapportFacture = () => {
    const [loading, setLoading] = useState(true);
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const scroll = { x: 400 };
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
      });
    const [filteredDatas, setFilteredDatas] = useState(null);
    const [filterVisible, setFilterVisible] = useState(false);

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
              render: (text) => (
                <Space>
                  <Tag color="green">{text}</Tag>
                </Space>
              ),
              align: 'right'
            },
            ...uniqueMonths.map((month) => {
              const [numMonth, year] = month.split("-");
              const monthName = moment(`${year}-${numMonth}-01`).format("MMM-YYYY");
      
              return {
                title: <Tag color="#2db7f5">{monthName}</Tag>,
                dataIndex: monthName,
                key: monthName,
                sorter: (a, b) => (a[monthName] || 0) - (b[monthName] || 0),
                sortDirections: ['descend', 'ascend'],
                render: (text) => (
                  <Space>
                    <Tag color={text == null ? 'red' : 'blue'}>
                      {text == null ? "Aucun" : `${text.toFixed(2)}`}
                    </Tag>
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
                <Space>
                  <Tag color="#87d068">{`${text.toFixed(2)} $`}</Tag>
                </Space>
              ),
              align: 'right'
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
        <div className="rapport_facture">
            <h2 className="rapport_h2">CLIENT DIVERS M² FACTURE</h2>
                <Button
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
                />
            </div>
        </div>
    </>
  )
}

export default RapportFacture