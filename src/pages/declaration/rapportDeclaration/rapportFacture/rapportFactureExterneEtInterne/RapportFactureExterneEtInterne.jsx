import React, { useEffect, useState } from 'react';
import { Button, notification, Table, Tag } from 'antd';
import moment from 'moment';
import { getRapportFactureVille } from '../../../../../services/templateService';
import RapportFiltrage from '../../rapportFiltrage/RapportFiltrage';

const RapportFactureExterneEtInterne = () => {
    const [loading, setLoading] = useState(true);
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
    });
    const [filteredDatas, setFilteredDatas] = useState(null);
    const [filterVisible, setFilterVisible] = useState(false);
    const [uniqueMonths, setUniqueMonths] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data } = await getRapportFactureVille(filteredDatas);

            const uniqueMonths = Array.from(
                new Set(data.map((item) => `${item.Mois}-${item.Année}`))
            ).sort((a, b) => {
                const [monthA, yearA] = a.split('-').map(Number);
                const [monthB, yearB] = b.split('-').map(Number);
                return yearA - yearB || monthA - monthB;
            });

            // Grouper les données par "capital"
            const groupedData = data.reduce((acc, curr) => {
                const client = acc.find((item) => item.Client === curr.capital);
                const monthName = moment(`${curr.Année}-${curr.Mois}-01`).format('MMM-YYYY');

                if (client) {
                    client[monthName] = curr.Montant || 0;
                    client.Total = (client.Total || 0) + (curr.Montant || 0);
                } else {
                    acc.push({
                        Client: curr.capital,
                        [monthName]: curr.Montant || 0,
                        Total: curr.Montant || 0,
                    });
                }
                return acc;
            }, []);

            // Générer les colonnes dynamiques
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
                    width: '4%',
                    align: 'right',
                },
                {
                    title: 'Client',
                    dataIndex: 'Client',
                    key: 'Client',
                    fixed: 'left',
                    align: 'left',
                },
                ...uniqueMonths.map((month) => {
                    const monthName = moment(`${month.split('-')[1]}-${month.split('-')[0]}-01`).format('MMM-YYYY');
                    return {
                        title: <Tag color="#2db7f5">{monthName}</Tag>,
                        dataIndex: monthName,
                        key: monthName,
                        sorter: (a, b) => (a[monthName] || 0) - (b[monthName] || 0),
                        sortDirections: ['descend', 'ascend'],
                        render: (text) => (
                            <div style={{ color: text ? 'black' : 'red' }}>
                                {text ? Math.round(parseFloat(text)).toLocaleString() : 0}
                            </div>
                        ),
                        align: 'right',
                    };
                }),
                {
                    title: 'Total',
                    dataIndex: 'Total',
                    key: 'Total',
                    sorter: (a, b) => a.Total - b.Total,
                    sortDirections: ['descend', 'ascend'],
                    render: (text) => (
                        <div style={{ color: text ? 'black' : 'red' }}>
                            {text ? Math.round(parseFloat(text)).toLocaleString() : 0}
                        </div>
                    ),
                    align: 'right',
                },
            ];

            setColumns(generatedColumns);
            setDataSource(groupedData);
            setUniqueMonths(uniqueMonths);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Une erreur est survenue.';
            notification.error({
                message: 'Erreur',
                description: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filteredDatas]);

    const handleFilterToggle = () => {
        setFilterVisible(!filterVisible);
    };

    const handleFilterChange = (newFilters) => {
        setFilteredDatas(newFilters); 
      };

    return (
        <div className="rapport_facture">
            <Button type="default" onClick={handleFilterToggle} style={{ margin: '10px 0' }}>
                {filterVisible ? 'Cacher les filtres' : 'Afficher les filtres'}
            </Button>
            { filterVisible && <RapportFiltrage onFilter={handleFilterChange} filtraVille={false}/>        }
            <div className="rapport_wrapper_facture">
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    bordered
                    loading={loading}
                    size="small"
                    pagination={pagination}
                    onChange={(pagination) => setPagination(pagination)}
                    rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                    scroll={{ x: 400 }}
                />
            </div>
        </div>
    );
};

export default RapportFactureExterneEtInterne;
