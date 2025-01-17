import React, { useEffect, useState } from 'react'
import { Button, notification, Space, Table, Tag } from 'antd';
import moment from 'moment';
import { getRapportVille } from '../../../../services/templateService';
import RapportFiltrage from '../rapportFiltrage/RapportFiltrage';
import RapportVueEnsembleChart from './rapportVueEnsembleChart/RapportVueEnsembleChart';


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
    const scroll = { x: 400 };
    const [ uniqueMonths, setUniqueMonths] = useState([]);


    const fetchData = async () => {
        try {
          const { data } = await getRapportVille(filteredDatas);
      
          // Regrouper les données par mois
          const groupedData = data.reduce((acc, item) => {
            const mois = moment(item.periode).format("MMM-YY");
      
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
              title: "Mois",
              dataIndex: "Mois",
              key: "Mois",
              fixed: "left",
              render: (text) => (
                <Space>
                  <Tag color={'#2db7f5'}>{text}</Tag>
                </Space>
              ),
              align: 'left',
            },
            ...data.reduce((acc, item) => {
              const capital = item.capital;
              if (!acc.some(col => col.title === capital)) {
                acc.push({
                  title: capital,
                  children: [
                    {
                      title: "Entrep",
                      dataIndex: `${capital}_Entreposage`,
                      key: `${capital}_Entreposage`,
                      render: (text) => (
                        <Space>
                          <Tag color={text == null ? 'red' : 'blue'}>
                            {text == null ? "Aucun" : `${text.toLocaleString()} $`}
                          </Tag>
                        </Space>
                      ),
                      align: 'right',
                      title: <div style={{ textAlign: 'center' }}>Entrep</div>,
                    },
                    {
                      title: "Manut",
                      dataIndex: `${capital}_Manutention`,
                      key: `${capital}_Manutention`,
                      render: (text) => (
                        <Space>
                          <Tag color={text == null ? 'red' : 'purple'}>
                            {text === 0 ? "0" : text == null ? "Aucun" : `${text.toLocaleString()} $`}
                          </Tag>
                        </Space>
                      ),
                      align: 'right',
                      title: <div style={{ textAlign: 'center' }}>Manut</div>
                    },
                    {
                      title: "Total",
                      dataIndex: `${capital}_Total`,
                      key: `${capital}_Total`,
                      render: (text) => (
                        <Space>
                          <Tag color={text == null ? 'red' : '#87d068'}>
                            {text == null ? "Aucun" : `${text.toLocaleString()} $`}
                          </Tag>
                        </Space>
                      ),
                      align: 'right',
                      title: <div style={{ textAlign: 'center' }}>Total</div>
                    },
                  ],
                });
              }
              return acc;
            }, []),
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
            <h2 className="rapport_h2">DIVERS VILLE</h2>
                <Button
                    type="default"
                    onClick={handFilter}
                    style={{margin:'10px 0'}}
                >
                    {filterVisible ? 'Cacher les filtres' : 'Afficher les filtres'}
                </Button>
                { filterVisible && <RapportFiltrage onFilter={handleFilterChange} filtraVille={true}/>        }

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
        <div className="rapport_chart">
            <RapportVueEnsembleChart groupedData={dataSource} uniqueMonths={uniqueMonths} />
        </div>
    </>
  )
}

export default RapportVueEnsemble;