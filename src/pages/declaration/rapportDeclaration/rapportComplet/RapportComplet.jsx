import React, { useEffect, useRef, useState } from 'react'
import { Button, notification, Popover, Skeleton, Space, Table, Tabs, Tag, Tooltip } from 'antd';
import RapportFiltrage from '../rapportFiltrage/RapportFiltrage';
import { getRapportComplet } from '../../../../services/templateService';

const RapportComplet = () => {
    const [loading, setLoading] = useState(true);
    const [filteredDatas, setFilteredDatas] = useState(null);
    const [filterVisible, setFilterVisible] = useState(false);
    const [data, setData] = useState([]);
    const [ detail, setDetail] = useState('');
    const scroll = { x: 400 };

    const handleFilterChange = (newFilters) => {
        setFilteredDatas(newFilters); 
      };

      const fetchData = async () => {

        try {
            const { data } = await getRapportComplet(filteredDatas);

            setData(data.data);
            setDetail(data.resume)
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
      }, [filteredDatas])

      
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
      sorter: (a, b) => parseFloat(a.total_occupe) - parseFloat(b.total_occupe),
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
        sorter: (a, b) => parseFloat(a.total_facture) - parseFloat(b.total_facture),
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
        sorter: (a, b) => parseFloat(a.total_entrep) - parseFloat(b.total_entrep),
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
        sorter: (a, b) => parseFloat(a.total_manu) - parseFloat(b.total_manu),
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
        sorter: (a, b) => parseFloat(a.total_superficie) - parseFloat(b.total_superficie),
        render: (text) => (
          <Space>
            <div style={{
              color: '#007bff', 
              backgroundColor: '#e0f7fa', 
              padding: '5px', 
              borderRadius: '5px'
            }}>
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
      }   
  ]

  const handFilter = () => {
    fetchData()
    setFilterVisible(!filterVisible)
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
                            <span
                                style={{
                                fontSize: '0.9rem',
                                fontWeight: '400',
                                cursor: 'pointer',
                                color: '#1890ff',
                                }}
                            >
                                Nbre de client : <strong>{detail?.nbre_client}</strong>
                            </span>
                            <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                            M² facturé :{' '}
                            <strong>{Math.round(parseFloat(detail.total_facture))?.toLocaleString() ?? 0}</strong>
                            </span>
                            <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                            M² Occupé :{' '}
                            <strong>{detail.total_occupe?.toLocaleString() ?? 0}</strong>
                            </span>
                            <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                            Entreposage :{' '}
                            <strong>{detail.total_entrep?.toLocaleString()} $</strong>
                            </span>
                            <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                            Manutention :{' '}
                            <strong>{detail.total_manu?.toLocaleString()} $</strong>
                            </span>
                            <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                            Sup :{' '}
                            <strong>{detail.total_superficie?.toLocaleString() ?? 0}</strong>
                            </span>
                        </div>
                    </div>
                )
            }
        <div className="rapport_facture">
            <div className="rapport_row_excel">
                <Button
                    type={filterVisible ? 'primary' : 'default'}
                        onClick={handFilter}
                        style={{ margin: '10px 0' }}
                >
                    {filterVisible ? 'Cacher les filtres' : 'Afficher les filtres'}
                </Button>
            </div>
            { filterVisible && <RapportFiltrage onFilter={handleFilterChange} filtraVille={false} filtraClient={true} filtraStatus={true} filtreMontant={false}/>}
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