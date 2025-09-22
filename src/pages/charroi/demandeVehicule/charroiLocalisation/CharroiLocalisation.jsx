import React, { useEffect } from 'react'
import { CarOutlined, EyeOutlined } from '@ant-design/icons';
import { getFalcon } from '../../../../services/rapportService';
import { useState } from 'react';
import { notification, Typography } from 'antd';

const { Text } = Typography;


const CharroiLocalisation = () => {
    const [ falcon, setFalcon ] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
    });
    const scroll = { x: 400 };


    const fetchData = async () => {
        try {
            const [falconData] = await Promise.all([
              getFalcon()
            ])
            setFalcon(falconData.data)
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

        const columns = [
                {
                    title: 'Matricule',
                    dataIndex: 'immatriculation',
                    render: (text) => (
                        <div className="vehicule-matricule">
                            <span className="car-wrapper">
                                <span className="car-boost" />
                                    <CarOutlined className="car-icon-animated" />
                                <span className="car-shadow" />
                            </span>
                            <span>{text}</span>
                        </div>
                    )
                }, 
                {
                    title: 'Marque',
                    dataIndex: 'nom_marque',
                        render: (text, record) => (
                            <Text icon={<CarOutlined />} color="cyan">
                                {text}
                            </Text>
                        )
                },
                {
                    title: 'Modèle',
                    dataIndex: 'modele',
                    render : (text) => (
                        <Text>
                            {text ?? 'Aucun'}
                        </Text>
                    )
                },
                {
                    title: 'Actions',
                    dataIndex: 'actions',
                    key: 'actions',
                    render: (text, record) => (
                        <Space size="middle" style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                            <Tooltip title="Voir les détails">
                                <Button
                                icon={<EyeOutlined />}
                                aria-label="Voir les détails de la tâche"
                                style={{ color: 'blue' }}
                                onClick={()=> handleDetail(record.id_vehicule)}
                                />
                            </Tooltip>
                        </Space>
                    )
                }
            ];

  return (
    <>
        <div className="client">
            <div className="client-wrapper">
              <div className="client-row">
                <div className="client-row-icon">
                  <CarOutlined className='client-icon' />
                </div>
                <h2 className="client-h2">Véhicules</h2>
              </div>
              <div className="client-actions">
                <div className="client-row-left">
                  <Search 
                    placeholder="Recherche..." 
                    onChange={(e) => setSearchValue(e.target.value)}
                    enterButton 
                  />
                </div>
                <div className="client-rows-right">
                </div>
              </div>
              <Table
                columns={columns}
                dataSource={filteredData}
                loading={loading}
                pagination={pagination}
                onChange={(pagination) => setPagination(pagination)}
                rowKey="id"
                bordered
                size="small"
                scroll={scroll}
                rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
              />
            </div>
          </div>
    </>
  )
}

export default CharroiLocalisation