import React, { useEffect, useState } from 'react'
import { Table, Menu, notification, Tag, Tooltip } from 'antd';
import { ScheduleOutlined, DollarOutlined, BarcodeOutlined, EnvironmentOutlined  } from '@ant-design/icons';
import { getDeclarationClientOneAll } from '../../../../services/templateService';

const DeclarationSituationClient = ({idClients}) => {
    const [loading, setLoading] = useState(true);
    const [columnsVisibility, setColumnsVisibility] = useState({
        '#': true,
        'Template': true,
        'Desc man': false,
        'Periode': true,
        'M² occupe': false,
        "M² facture": true,
        "Tarif Entr": true,
        'Debours Entr': true,
        'Total Entr': true,
        "TTC Entr": true,
        "Ville": true,
        "Client": true,
        "Bâtiment": false,
        "Objet fact": false,
        "Manutention": true,
        "Tarif Manu": true,
        "Debours Manu": true,
        "Total Manu": true,
        "TTC Manu": true
      });
    const [idClient, setidClient] = useState('');
    const [titre, setTitre] = useState('');
    const [data, setData] = useState([]);
    const scroll = { x: 400 };

    const fetchData = async () => {
        try {

            const { data } = await getDeclarationClientOneAll(idClients);
            setTitre(data[0]?.nom);
            setData(data);
            setLoading(false);
            
        } catch (error) {
            notification.error({
                message: 'Erreur de chargement',
                description: 'Une erreur est survenue lors du chargement des données.',
            });
            setLoading(false);
        }
    }

    useEffect(()=> {
        fetchData()
    }, [idClients])

    const columns = [
        {
          title: '#',
          dataIndex: 'id',
          key: 'id',
          render: (text, record, index) => index + 1,
          width: "3%",
          ...(columnsVisibility['#'] ? {} : { className: 'hidden-column' }),
        },
        
        // Groupe Entreposage
        {
          title: 'Entreposage',
          children: [
            {
              title: 'M² facture',
              dataIndex: 'm2_facture',
              key: 'm2_facture',
              sorter: (a, b) => a.m2_facture - b.m2_facture,
              sortDirections: ['descend', 'ascend'],
              render: (text) => (
                <Tag icon={<BarcodeOutlined />} color="cyan">{text?.toLocaleString() ?? 'Aucun'}</Tag>
              ),
              ...(columnsVisibility['M² facture'] ? {} : { className: 'hidden-column' }),
            },
            {
              title: 'Total Entr',
              dataIndex: 'total_entreposage',
              key: 'total_entreposage',
              sorter: (a, b) => a.tarif_entreposage - b.tarif_entreposage,
              sortDirections: ['descend', 'ascend'],
              render: (text) => (
                <Tag icon={<DollarOutlined />} color="gold">
                  {text
                        ? `${parseFloat(text)
                            .toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            })
                            .replace(/,/g, " ")} $`
                        : "0.00"}
                </Tag>
              ),
              ...(columnsVisibility['Total Entr'] ? {} : { className: 'hidden-column' }),
            },
            {
              title: 'TTC Entr',
              dataIndex: 'ttc_entreposage',
              key: 'ttc_entreposage',
              sorter: (a, b) => a.total_entreposage - b.total_entreposage,
              sortDirections: ['descend', 'ascend'],
              render: (text) => (
                <Tag icon={<DollarOutlined />} color="volcano">
                  {text
                        ? `${parseFloat(text)
                            .toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            })
                            .replace(/,/g, " ")} $`
                        : "0.00"}
                </Tag>
              ),
              ...(columnsVisibility['TTC Entr'] ? {} : { className: 'hidden-column' }),
            },        
            {
              title: 'Nbre',
              dataIndex: 'declarations_count',
              key: 'declarations_count',
              sorter: (a, b) => a.declarations_count - b.declarations_count,
              sortDirections: ['descend', 'ascend'],
              render: (text) => (
                <Tag icon={<BarcodeOutlined />} color="cyan">{text ?? 'Aucun'}</Tag>
              ),
            },
          ]
        },
      
        // Groupe Manutention
        {
          title: 'Manutention',
          children: [
            {
              title: 'Ville',
              dataIndex: 'capital',
              key: 'capital',
              render: (capital) => {
                const formattedCapital = Array.isArray(capital) ? capital.join(', ') : 'Aucun'; // Joindre les villes par des virgules
                return (
                  <Tag icon={<EnvironmentOutlined />} color="blue">{formattedCapital}</Tag>
                );
              },
              ...(columnsVisibility['Ville'] ? {} : { className: 'hidden-column' }),
            },        
            {
              title: 'Tarif Manu',
              dataIndex: 'tarif_manutation',
              key: 'tarif_manutation',
              render: (text) => (
                <Tag color="green">
                  {text
                        ? `${parseFloat(text)
                            .toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            })
                            .replace(/,/g, " ")} $`
                        : "0.00"}  
                </Tag>
              ),
              ...(columnsVisibility['Tarif Manu'] ? {} : { className: 'hidden-column' }),
            },
            {
              title: 'Total Manu',
              dataIndex: 'total_manutation',
              key: 'total_manutation',
              render: (text) => (
                <Tag color="gold">{text
                  ? `${parseFloat(text)
                      .toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                      })
                      .replace(/,/g, " ")} $`
                  : "0.00"}  
                </Tag>
              ),
              ...(columnsVisibility['Total Manu'] ? {} : { className: 'hidden-column' }),
            },
            {
              title: 'TTC Manu',
              dataIndex: 'ttc_manutation',
              key: 'ttc_manutation',
              render: (text) => (
                <Tag icon={<DollarOutlined />} color="volcano">
                  {text
                        ? `${parseFloat(text)
                            .toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            })
                            .replace(/,/g, " ")} $`
                        : "0.00"}
                </Tag>
              ),
              ...(columnsVisibility['TTC Manu'] ? {} : { className: 'hidden-column' }),
            },
          ]
        }
      ];
    
  return (
    <>
        <div className="client">
            <div className="client-wrapper">
                <div className="client-row">
                    <div className="client-row-icon">
                        <ScheduleOutlined className='client-icon' />
                    </div>
                    <h2 className="client-h2">Déclarations {titre}</h2>
                </div>

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

export default DeclarationSituationClient