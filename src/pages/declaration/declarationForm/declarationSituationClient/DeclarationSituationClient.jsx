import React, { useEffect, useState } from 'react'
import { Table, notification, Tag, Space } from 'antd';
import { ScheduleOutlined,CalendarOutlined, DollarOutlined, HomeOutlined, FileTextOutlined, BarcodeOutlined, EnvironmentOutlined  } from '@ant-design/icons';
import { getDeclarationClientOneAll } from '../../../../services/templateService';
import moment from 'moment';

const DeclarationSituationClient = ({idClients, mois, annee}) => {
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
    const [titre, setTitre] = useState('');
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 25,
      });
    const scroll = { x: 400 };

    const columnStyles = {
        title: {
          maxWidth: '220px',
          whiteSpace: 'nowrap',
          overflowX: 'scroll', 
          overflowY: 'hidden',
          textOverflow: 'ellipsis',
          scrollbarWidth: 'none',
          '-ms-overflow-style': 'none', 
        },
        titleClient: {
          maxWidth: '150px',
          whiteSpace: 'nowrap',
          overflowX: 'scroll', 
          overflowY: 'hidden',
          textOverflow: 'ellipsis',
          scrollbarWidth: 'none',
          '-ms-overflow-style': 'none', 
        },
        hideScroll: {
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      };

    const fetchData = async () => {
        try {

            const datas = {
                period : { mois : mois, annees: annee}
            }
            const { data } = await getDeclarationClientOneAll(idClients, datas);
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
    }, [idClients, mois])

    const columns = [
        {
          title: '#',
          dataIndex: 'id',
          key: 'id',
          render: (text, record, index) => {
            const pageSize = pagination.pageSize || 10;
            const pageIndex = pagination.current || 1;
            return (pageIndex - 1) * pageSize + index + 1;
          },
          width: "4%",
    
          ...(columnsVisibility['#'] ? {} : { className: 'hidden-column' })
        },
        
        // Groupe Entreposage
        {
          title: 'Entreposage',
          children: [
            {
              title: 'Template',
              dataIndex: 'desc_template',
              key: 'desc_template',
              render: (text, record) => (
                <Space style={columnStyles.title} className={columnStyles.hideScroll} >
                  <Tag icon={<FileTextOutlined />} color="geekblue">{text ?? 'Aucun'}</Tag>
                </Space>
              ),
              ...(columnsVisibility['Template'] ? {} : { className: 'hidden-column' }),
            },
            {
              title: 'Periode',
              dataIndex: 'periode',
              key: 'periode',
              sorter: (a, b) => moment(a.periode) - moment(b.periode),
              sortDirections: ['descend', 'ascend'],
              render: (text) => {
                const date = text ? new Date(text) : null;
                const formattedDate = date 
                  ? date.toLocaleString('default', { month: 'long', year: 'numeric' })
                  : 'Aucun';
                return (
                  <Tag icon={<CalendarOutlined />} color="purple">{formattedDate}</Tag>
                );
              },
              ...(columnsVisibility['Periode'] ? {} : { className: 'hidden-column' }),
            },
            {
              title: 'M² occupe',
              dataIndex: 'm2_occupe',
              key: 'm2_occupe',
              sorter: (a, b) => a.m2_occupe - b.m2_occupe,
              sortDirections: ['descend', 'ascend'],
              render: (text) => (
                <Tag icon={<BarcodeOutlined />} color="cyan">{text ?? '0'}</Tag>
              ),
              align: 'right', 
              ...(columnsVisibility['M² occupe'] ? {} : { className: 'hidden-column' }),
            },
            {
              title: 'M² facture',
              dataIndex: 'm2_facture',
              key: 'm2_facture',
              sorter: (a, b) => a.m2_facture - b.m2_facture,
              sortDirections: ['descend', 'ascend'],
              render: (text) => (
                <Tag icon={<BarcodeOutlined />} color="cyan">{text?.toLocaleString() ?? '0'}</Tag>
              ),
              align: 'right', 
              ...(columnsVisibility['M² facture'] ? {} : { className: 'hidden-column' }),
            },
            {
              title: 'Tarif Entr',
              dataIndex: 'tarif_entreposage',
              key: 'tarif_entreposage',
              sorter: (a, b) => a.tarif_entreposage - b.tarif_entreposage,
              sortDirections: ['descend', 'ascend'],
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
              align: 'right', 
              ...(columnsVisibility['Tarif Entr'] ? {} : { className: 'hidden-column' }),
            },
            {
              title: 'Debours Entr',
              dataIndex: 'debours_entreposage',
              key: 'debours_entreposage',
              sorter: (a, b) => a.debours_entreposage - b.debours_entreposage,
              sortDirections: ['descend', 'ascend'],
              render: (text) => (
                <Tag icon={<DollarOutlined />} color="green">
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
              align: 'right', 
              ...(columnsVisibility['Debours Entr'] ? {} : { className: 'hidden-column' }),
            },
            {
              title: 'Total Entr',
              dataIndex: 'total_entreposage',
              key: 'total_entreposage',
              sorter: (a, b) => a.total_entreposage - b.total_entreposage,
              sortDirections: ['descend', 'ascend'],
              render: (text) => (
                <Tag color="gold">
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
              align: 'right', 
              ...(columnsVisibility['Total Entr'] ? {} : { className: 'hidden-column' }),
            },
            {
              title: 'TTC Entr',
              dataIndex: 'ttc_entreposage',
              key: 'ttc_entreposage',
              sorter: (a, b) => a.ttc_entreposage - b.ttc_entreposage,
              sortDirections: ['descend', 'ascend'],
              render: (text) => (
                <Tag color="volcano">
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
              align: 'right', 
              ...(columnsVisibility['TTC Entr'] ? {} : { className: 'hidden-column' }),
            },
          ]
        },
      
        // Groupe Manutention
        {
          title: 'Manutention',
          children: [
            {
              title: 'Desc Man',
              dataIndex: 'desc_manutation',
              key: 'desc_manutation',
              render: (text) => (
                <Tag icon={<FileTextOutlined />} color="geekblue">{text ?? 'Aucun'}</Tag>
              ),
              ...(columnsVisibility['Desc man'] ? {} : { className: 'hidden-column' }),
            },
            {
              title: 'Ville',
              dataIndex: 'capital',
              key: 'capital',
              render: (text) => (
                <Tag icon={<EnvironmentOutlined />} color="blue">{text ?? 'Aucun'}</Tag>
              ),
              ...(columnsVisibility['Ville'] ? {} : { className: 'hidden-column' }),
            },
            {
              title: 'Bâtiment',
              dataIndex: 'nom_batiment',
              key: 'nom_batiment',
              render: (text) => (
                <Tag icon={<HomeOutlined />} color="purple">{text ?? 'Aucun'}</Tag>
              ),
              ...(columnsVisibility['Bâtiment'] ? {} : { className: 'hidden-column' }),
            },
            {
              title: 'Objet fact',
              dataIndex: 'nom_objet_fact',
              key: 'nom_objet_fact',
              render: (text) => (
                <Tag icon={<FileTextOutlined />} color="magenta">{text ?? 'Aucun'}</Tag>
              ),
              ...(columnsVisibility['Objet fact'] ? {} : { className: 'hidden-column' }),
            },
            {
              title: 'Manu.',
              dataIndex: 'manutation',
              key: 'manutation',
              sorter: (a, b) => a.manutation - b.manutation,
              sortDirections: ['descend', 'ascend'],
              render: (text) => (
                <Tag color="cyan">
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
              align: 'right', 
              ...(columnsVisibility['Manutention'] ? {} : { className: 'hidden-column' }),
            },
            {
              title: 'Tarif Manu',
              dataIndex: 'tarif_manutation',
              key: 'tarif_manutation',
              sorter: (a, b) => a.tarif_manutation - b.tarif_manutation,
              sortDirections: ['descend', 'ascend'],
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
              align: 'right', 
              ...(columnsVisibility['Tarif Manu'] ? {} : { className: 'hidden-column' }),
            },
            {
              title: 'Debours Manu',
              dataIndex: 'debours_manutation',
              key: 'debours_manutation',
              sorter: (a, b) => a.debours_manutation - b.debours_manutation,
              sortDirections: ['descend', 'ascend'],
              render: (text) => (
                <Tag icon={<DollarOutlined />} color="green">
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
              align: 'right', 
              ...(columnsVisibility['Debours Manu'] ? {} : { className: 'hidden-column' }),
            },
            {
              title: 'Total Manu',
              dataIndex: 'total_manutation',
              key: 'total_manutation',
              sorter: (a, b) => a.total_manutation - b.total_manutation,
              sortDirections: ['descend', 'ascend'],
              render: (text) => (
                <Tag color="gold">
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
              align: 'right',
              ...(columnsVisibility['Total Manu'] ? {} : { className: 'hidden-column' }),
            },
            {
              title: 'TTC Manu',
              dataIndex: 'ttc_manutation',
              key: 'ttc_manutation',
              sorter: (a, b) => a.ttc_manutation - b.ttc_manutation,
              sortDirections: ['descend', 'ascend'],
              render: (text) => (
                <Tag color="volcano">
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
              align: 'right', 
              ...(columnsVisibility['TTC Manu'] ? {} : { className: 'hidden-column' }),
            },
          ]
        },
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