import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Tag, Space, Tooltip, Popconfirm, Skeleton, Tabs, Popover } from 'antd';
import { MenuOutlined, EditOutlined, PieChartOutlined, EyeOutlined, DeleteOutlined, CalendarOutlined, DownOutlined, EnvironmentOutlined, HomeOutlined, FileTextOutlined, DollarOutlined, BarcodeOutlined, ScheduleOutlined, PlusCircleOutlined, UserOutlined } from '@ant-design/icons';
import { getDeclaration_corbeille } from '../../../services/templateService';
const { Search } = Input;


const CorbeilleDeclaration = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 25,
      });
    const scroll = { x: 400 };

    const handleUpdateTemplate = () => {

    }

    const handleDelete = () => {

    }
    
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
                <Tooltip>
                  <Space 
                    className={columnStyles.hideScroll}
                  >
                    <Tag icon={<FileTextOutlined />} color="geekblue">
                      {text ?? 'Aucun'}
                    </Tag>
                  </Space>
                </Tooltip>
              ),
            },       
            {
              title: 'Client',
              dataIndex: 'nom',
              key: 'nom',
              render: (text, record) => (
                <Space style={columnStyles.titleClient} className={columnStyles.hideScroll}>
                  <Tag icon={<UserOutlined />} color="orange">
                    {text ?? 'Aucun'}
                  </Tag>
                </Space>
              ),
            },
            {
              title: 'Periode',
              dataIndex: 'periode',
              key: 'periode',
              sorter: (a, b) => moment(a.periode) - moment(b.periode),
              sortDirections: ['descend', 'ascend'],
              render: (text, record) => {
                const date = text ? new Date(text) : null;
                const mois = date ? date.getMonth() + 1 : null; // getMonth() renvoie 0-11, donc +1 pour avoir 1-12
                const annee = date ? date.getFullYear() : null;
                
                const formattedDate = date
                  ? date.toLocaleString('default', { month: 'long', year: 'numeric' })
                  : 'Aucun';
            
                return (
                  <Tag 
                    icon={<CalendarOutlined />} 
                    color="purple" 
                  >
                    {formattedDate}
                  </Tag>
                );
              },
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
              render: (text) => (
                <Tag icon={<EnvironmentOutlined />} color="blue">{text ?? 'Aucun'}</Tag>
              ),
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
            }
          ]
        },
        {
          title: 'Action',
          key: 'action',
          width: '10%',
          render: (text, record) => (
            <Space size="middle">
              <Tooltip title={'Restaurer'}>
                <Button
                  style={{ color: 'green' }}
                  icon={<EditOutlined />}
                  onClick={() => {
                      handleUpdateTemplate(record.id_declaration_super);        
                  }}
                />
              </Tooltip>
                <Tooltip title="Supprimer">
                  <Popconfirm
                    title="Êtes-vous sûr de vouloir supprimer cette déclaration ?"
                    onConfirm={() => handleDelete(record.id_declaration_super)}
                    okText="Oui"
                    cancelText="Non"
                  >
                    <Button
                      icon={<DeleteOutlined />}
                      style={{ color: 'red' }}
                      aria-label="Delete client"
                    />
                  </Popconfirm>
                </Tooltip>
            </Space>
          ),
        },
      ];
    
    const fetchData = async () => {
        try {
          const { data } = await getDeclaration_corbeille();
          setData(data);
    
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
      }

    useEffect(() => {
        fetchData();
    }, []); 
    
    
  return (
    <>
        <div className="client">
            <div className="client-wrapper">
                <div className="client-rows">
                    <div className="client-row">
                        <div className="client-row-icon">
                            <ScheduleOutlined className='client-icon' />
                        </div>
                        <h2 className="client-h2">Déclarations</h2>
                    </div>
                    <div className="client-actions">
                        <div className="client-row-left">
                            <Search 
                                placeholder="Recherche..." 
                                enterButton
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <Table
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        pagination={pagination}
                        onChange={(pagination) => setPagination(pagination)}
                        rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                        rowKey="id"
                        bordered
                        size="small"
                        scroll={scroll}
                    />
            </div>
        </div>
    </>
  )
}

export default CorbeilleDeclaration