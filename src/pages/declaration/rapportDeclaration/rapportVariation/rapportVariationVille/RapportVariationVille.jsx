import React, { useEffect, useState } from 'react'
import { Modal, notification, Space, Table, Tag } from 'antd';
import moment from 'moment';
import { getRapportVariationVille } from '../../../../../services/templateService';
import RapportVariationClient from '../rapportVariationClient/RapportVariationClient';

const RapportVariationVille = ({annee, mois}) => {
      const [loading, setLoading] = useState(true);
      const [columns, setColumns] = useState([]);
      const [dataSource, setDataSource] = useState([]);
      const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
      });
     const [showInPercentage, setShowInPercentage] = useState(false);
     const [province, setProvince] = useState('');
     const [modalType, setModalType] = useState(null);
     

     const calculatePercentage = (value, entreposage, manutention) => {
        const total = entreposage + manutention; // Total des deux valeurs
        console.log('value : ', value, 'total : ', total); // Debugging
        return total ? ((value / total) * 100).toFixed(2) : 0;
      };

      const closeAllModals = () => {
        setModalType(null);
      };
      
      const openModal = (type, zone) => {
        closeAllModals();
        setModalType(type);
        setProvince(zone);
      };

      const handleProvince = (zone) => {
        openModal('zone', zone)
        console.log( 'zone : '+ zone)
      }

        const fetchData = async () => {
            const filteredDatas = {
                mois: mois,
                annees: annee
            };
          try {
            const { data } = await getRapportVariationVille(filteredDatas);
            
            // Regrouper les données par mois
            const groupedData = data.reduce((acc, item) => {
                const mois = moment(item.periode).format('MMM-YY');
              
                if (!acc[mois]) acc[mois] = {};
              
                acc[mois][item.capital] = {
                  Entreposage: item.total_entreposage || 0,
                  Manutention: item.total_manutation || 0,
                  Total: item.total_facture || 0,
                  Variation: item.variation_pourcentage || 0,
                };
              
                return acc;
              }, {});
              
      
            const formattedData = Object.entries(groupedData).map(([mois, provinces]) => {
              const row = { Mois: mois };
              for (const [province, valeurs] of Object.entries(provinces)) {
                row[`${province}_Entreposage`] = valeurs.Entreposage;
                row[`${province}_Manutention`] = valeurs.Manutention;
                row[`${province}_Total`] = valeurs.Total;
                row[`${province}_Variation`] = valeurs.Variation;

              }
              return row;
            });
      
            const extractedCities = [...new Set(data.map(item => item.capital))];
      
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
                title: 'Mois',
                dataIndex: 'Mois',
                key: 'Mois',
                fixed: 'left',
                render: text => (
                  <Space>
                    <Tag color={'#2db7f5'}>{text}</Tag>
                  </Space>
                ),
                align: 'left',
              },
              ...extractedCities.map(capital => ({
                title: <span onClick={() => handleProvince(capital)}>{capital}</span>,
                key: capital,
                children: [
                    {
                        title: 'Entrep',
                        dataIndex: `${capital}_Entreposage`,
                        key: `${capital}_Entreposage`,
                        width: '10%',
                        render: (text, record) => {
                          const entreposage = parseFloat(record[`${capital}_Entreposage`]) || 0;
                          const manutention = parseFloat(record[`${capital}_Manutention`]) || 0;
                          return (
                            <Space >
                              {showInPercentage
                                ? `${calculatePercentage(entreposage, entreposage, manutention)} %`
                                : text || text === 0
                                ? `${parseFloat(text)
                                    .toLocaleString('en-US', {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })
                                    .replace(/,/g, ' ')} $`
                                : '00.00'}
                            </Space>
                          );
                        },
                        align: 'right',
                      },
                      {
                        title: 'Manut',
                        dataIndex: `${capital}_Manutention`,
                        key: `${capital}_Manutention`,
                        width: '9%',
                        render: (text, record) => {
                          const entreposage = parseFloat(record[`${capital}_Entreposage`]) || 0;
                          const manutention = parseFloat(record[`${capital}_Manutention`]) || 0;
                          return (
                            <Space>
                              {showInPercentage
                                ? `${calculatePercentage(manutention, entreposage, manutention)} %`
                                : text || text === 0
                                ? `${parseFloat(text)
                                    .toLocaleString('en-US', {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })
                                    .replace(/,/g, ' ')} $`
                                : '00.00'}
                            </Space>
                          );
                        },
                        align: 'right',
                      },
                      {
                        title: 'Total',
                        dataIndex: `${capital}_Total`,
                        key: `${capital}_Total`,
                        width: '10%',
                        render: (text, record) => {
                          const entreposage = parseFloat(record[`${capital}_Entreposage`]) || 0;
                          const manutention = parseFloat(record[`${capital}_Manutention`]) || 0;
                          const total = entreposage + manutention;
                          return (
                            <Space>
                              {showInPercentage
                                ? `${calculatePercentage(total, entreposage, manutention)} %`
                                : text || text === 0
                                ? `${parseFloat(text)
                                    .toLocaleString('en-US', {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })
                                    .replace(/,/g, ' ')} $`
                                : '00.00'}
                            </Space>
                          );
                        },
                        align: 'right',
                      },
                      {
                        title: 'V%',
                        dataIndex: `${capital}_Variation`,
                        key: `${capital}_Variation`,
                        width: '10%',
                        render: (text, record) => {
                          return (
                            <Space>
                              {showInPercentage
                                ? `${text || text === 0 ? text : '00.00'} %`
                                : text || text === 0
                                ? `${parseFloat(text).toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }).replace(/,/g, ' ')} %`
                                : '00.00'}
                            </Space>
                          );
                        },
                        align: 'right',
                      },        
                ],
              })),
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
          }, [annee, mois]);

  return (
    <>
        <div className="rapport_facture">
            <h2 className="rapport_h2">RAPPORT VILLE</h2>
            <div className="rapport_wrapper_facture">
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    bordered
                    scroll={{ x: 'max-content' }}
                    loading={loading}
                    size="small"
                    pagination={pagination}
                    onChange={pagination => setPagination(pagination)}
                    rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                />
            </div>
            <Modal
                title=""
                visible={modalType === 'zone'}
                onCancel={closeAllModals}
                footer={null}
                width={1120}
                centered
            >
                <RapportVariationClient zone={province} />
            </Modal>
        </div>
    </>
  )
}

export default RapportVariationVille