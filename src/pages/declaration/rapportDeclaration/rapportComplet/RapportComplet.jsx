import { useEffect, useRef, useState } from 'react'
import { Button, notification, Skeleton, Space, Table, Tooltip } from 'antd';
import RapportFiltrage from '../rapportFiltrage/RapportFiltrage';
import { getRapportComplet } from '../../../../services/templateService';
import getColumnSearchProps from '../../../../utils/columnSearchUtils';
import { FileExcelOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

const RapportComplet = () => {
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [filteredDatas, setFilteredDatas] = useState(null);
    const [filterVisible, setFilterVisible] = useState(false);
    const [data, setData] = useState([]);
    const [ detail, setDetail] = useState('');
    const scroll = { x: 400 };
    const isDarkMode = localStorage.getItem('theme') === 'dark';


    const handleFilterChange = (newFilters) => {
        setFilteredDatas(newFilters); 
      };

      const exportToExcelHTML = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Rapport Complet');
        
        XLSX.writeFile(wb, 'Rapport_Complet.xlsx');
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
      ...getColumnSearchProps(
        'nom_client',
        searchText,
        setSearchText,
        setSearchedColumn,
        searchInput
      ),
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
        title: 'Entreposage',
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
        title: 'Manutention',
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
                        boxShadow: isDarkMode
                        ? '0 4px 10px rgba(255, 255, 255, 0.05)'
                        : '0 4px 10px rgba(0, 0, 0, 0.1)',
                        borderRadius: '8px',
                        backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
                        color: isDarkMode ? '#ddd' : '#000',
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
                <Tooltip title={'Importer en excel'}>
                    <Button className="export-excel" onClick={exportToExcelHTML} >
                        <FileExcelOutlined className="excel-icon" />
                    </Button>
                </Tooltip>
            </div>
            { filterVisible && <RapportFiltrage onFilter={handleFilterChange} filtraVille={true} filtraClient={true} filtraStatus={true} filtreBatiment={true} filtreMontant={false}/>}
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