import React, { useEffect, useRef, useState } from 'react'
import { Button, notification, Popover, Skeleton, Space, Table, Tabs, Tag, Tooltip } from 'antd';
import RapportFiltrage from '../rapportFiltrage/RapportFiltrage';
import { getRapportComplet } from '../../../../services/templateService';

const RapportComplet = () => {
    const [loading, setLoading] = useState(true);
    const [filteredDatas, setFilteredDatas] = useState(null);
    const [filterVisible, setFilterVisible] = useState(false);
    const [data, setData] = useState([]);
    const scroll = { x: 400 };

    const handleFilterChange = (newFilters) => {
        setFilteredDatas(newFilters); 
      };

      const fetchData = async () => {

        try {
            const { data } = await getRapportComplet(filteredDatas);

            setData(data);
            setLoading(false);
        } catch (error) {
            if (error.response && error.response.status === 404) {
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
            } finally{
                setLoading(false)
            }
      }

      useEffect(()=> {
        fetchData()
      }, [])

      
  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => index + 1,
      width: "3%",
    },
    {
      title: 'Client',
      dataIndex: 'nom_client',
      key: 'nom_client',
      render: (text) => (
        <div>
            {text}
        </div>
      ),
    },
    {
      title: 'M² Occupé',
      dataIndex: 'total_occupe',
      key: 'total_occupe',
      render: (text) => (
        <Space>
        <div style={{color: text ? 'black' : 'red'}}>
            {text
                ? `${parseFloat(text)
                    .toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                    })
                    .replace(/,/g, " ")}` 
            : "0.00"}
        </div>
    </Space>
      ),
      align: 'right' 
    },
    {
        title: 'M² facture',
        dataIndex: 'total_facture',
        key: 'total_facture',
        render: (text) => (
            <Space>
                <div style={{color: text ? 'black' : 'red'}}>
                    {text
                        ? `${parseFloat(text)
                            .toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            })
                            .replace(/,/g, " ")}` 
                    : "0.00"}
                </div>
            </Space>
        ),
        align: 'right' 

      },
      {
        title: 'TOT Entreposage',
        dataIndex: 'total_entrep',
        key: 'total_entrep',
        render: (text) => (
            <Space>
                <div style={{color: text ? 'black' : 'red'}}>
                    {text
                        ? `${parseFloat(text)
                            .toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            })
                            .replace(/,/g, " ")} $` 
                    : "0.00"}
                </div>
            </Space>
        ),
        align: 'right' 

      },
      {
        title: 'TOT Manutention',
        dataIndex: 'total_manu',
        key: 'total_manu',
        render: (text) => (
            <Space>
                <div style={{color: text ? 'black' : 'red'}}>
                    {text
                        ? `${parseFloat(text)
                            .toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            })
                            .replace(/,/g, " ")} $` 
                    : "0.00"}
                </div>
            </Space>
        ),
        align: 'right' 

      },
      {
        title: 'Superficie',
        dataIndex: 'total_superficie',
        key: 'total_superficie',
        render: (text) => (
            <Space>
                <div style={{color: text ? 'black' : 'red'}}>
                    {text
                        ? `${parseFloat(text)
                            .toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            })
                            .replace(/,/g, " ")} $` 
                    : "0.00"}
                </div>
            </Space>
        ),
        align: 'right' 

      },
  ]

  return (
    <>
        <div className="rapport_facture">
            <div className="rapport_row_excel">

            </div>
            { filterVisible && <RapportFiltrage onFilter={handleFilterChange} filtraVille={true} filtraClient={true} filtraStatus={true} filtreMontant={true}/>}
            <div className="rapport_wrapper_facture">
                <Table
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    rowKey="id"
                    bordered
                    size="middle"
                    scroll={scroll}
                />
            </div>
        </div>
    </>
  )
}

export default RapportComplet