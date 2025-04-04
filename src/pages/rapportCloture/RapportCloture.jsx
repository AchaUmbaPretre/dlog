import React, { useEffect, useState } from 'react'
import { Button, Input, Table, Tabs, Tag, Modal, notification, Tooltip, Space, Popconfirm, Dropdown, Menu } from 'antd';
import moment from 'moment';
import { AreaChartOutlined, MoreOutlined, CalendarOutlined, DeleteOutlined, EnvironmentOutlined, FileTextOutlined, BarcodeOutlined, ScheduleOutlined } from '@ant-design/icons';
import RapportClotureManueForm from './rapportClotureManueForm/RapportClotureManueForm';
import RapportClotureVilleForm from './rapportClotureVilleForm/RapportClotureVilleForm';
import RapportClotureTemplForm from './rapportClotureTemplForm/RapportClotureTemplForm';
import TabPane from 'antd/es/tabs/TabPane';
import { getCloture } from '../../services/rapportService';
import RapportClotureBar from './rapportClotureBar/RapportClotureBar';
const { Search } = Input;

const RapportCloture = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
      });
    const [columnsVisibility, setColumnsVisibility] = useState({
        '#': true,
        'Periode': true,
        'M² occupe': true,
        "M² facture": true,
        'Total Entr': true,
        "Total Manu": true,

      });  
    const [searchValue, setSearchValue] = useState(''); 
    const [modalType, setModalType] = useState(null); 
    const scroll = { x: 'max-content' };

        const fetchData = async () => {
          try {
            const { data } = await getCloture();
            setData(data);
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

    const closeAllModals = () => {
        setModalType(null);
      };

    const toggleColumnVisibility = (columnName, e) => {
        e.stopPropagation();
        setColumnsVisibility(prev => ({
          ...prev,
          [columnName]: !prev[columnName]
        }));
      };

    const openModal = (type, id = '') => {
        closeAllModals();
        setModalType(type);
      };

    const handleManuellement = (id) => {
        openModal('Manuellement', id)
      }

    const handleTemplate = (id) => {
        openModal('Template', id)
      }

    const handleVille = (id) => {
        openModal('Ville', id)
      }

    const handleDelete = () => {

    }

    const handleEdit = () => {

    }

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
            width: "4%"
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
                ...(columnsVisibility['Periode'] ? {} : { className: 'hidden-column' }),
        },
        {
            title: 'M² occupe',
            dataIndex: 'm2_occupe',
            key: 'm2_occupe',
                sorter: (a, b) => a.m2_occupe - b.m2_occupe,
                sortDirections: ['descend', 'ascend'],
                render: (text) => (
                    <div>{text ?? '0'}</div>
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
                    <div>{text?.toLocaleString() ?? '0'}</div>
                ),
                align: 'right', 
                ...(columnsVisibility['M² facture'] ? {} : { className: 'hidden-column' }),
            },
            {
                title: 'Total Entr',
                dataIndex: 'entreposage',
                key: 'entreposage',
                sorter: (a, b) => a.entreposage - b.entreposage,
                sortDirections: ['descend', 'ascend'],
                render: (text) => (
                    <div>
                          {text
                            ? `${parseFloat(text)
                                .toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                    })
                                    .replace(/,/g, " ")} $`
                                : "0.00"}
                        </div>
                    ),
                align: 'right', 
                ...(columnsVisibility['Total Entr'] ? {} : { className: 'hidden-column' }),
            },
            {
                title: 'Total Manu',
                dataIndex: 'manutation',
                key: 'total_manutation',
                sorter: (a, b) => a.manutation - b.manutation,
                sortDirections: ['descend', 'ascend'],
                render: (text) => (
                    <div>
                        {text
                            ? `${parseFloat(text)
                                .toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                                })
                                .replace(/,/g, " ")} $`
                                : "0.00"}
                        </div>
                      ),
                      align: 'right',
                      ...(columnsVisibility['Total Manu'] ? {} : { className: 'hidden-column' }),
            },
            {
                title: 'Total',
                dataIndex: 'total',
                key: 'total',
                sorter: (a, b) => a.total - b.total,
                sortDirections: ['descend', 'ascend'],
                render: (text) => (
                    <div>
                        {text
                            ? `${parseFloat(text)
                            .toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })
                            .replace(/,/g, " ")} $`
                            : "0.00"}
                    </div>
                    ),
                align: 'right'            
            },
            {
                title: 'Action',
                key: 'action',
                width: "4%",
                render: (text, record) => (
                    <Space>
                        <Tooltip title="Supprimer">
                            <Popconfirm
                                title="Êtes-vous sûr de vouloir supprimer ?"
                                onConfirm={() => handleDelete(record.id_cloture)}
                                okText="Oui"
                                cancelText="Non"
                            >
                                <Button
                                icon={<DeleteOutlined />}
                                style={{ color: 'red' }}
                                aria-label="Delete budget"
                                />
                            </Popconfirm>
                        </Tooltip>
                    </Space>
                )
            }
    ]

  return (
    <>
        <div className="client">
            <div className="client-wrapper">
                <div className="client-rows">
                    <div className="client-row">
                        <div className="client-row-icon">
                            <ScheduleOutlined className='client-icon' />
                        </div>
                        <h2 className="client-h2">RAPPORT CLOTURE</h2>
                    </div>
                </div>

                <div className="client-actions">
                    <div className="client-row-left">
                        <Search 
                            placeholder="Recherche..." 
                            enterButton
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>
                    <div className="client-rows-right">
                    <Dropdown
                        overlay={(
                        <Menu>
                            {/* Actions Document */}
                            <Menu.Item onClick={handleManuellement} >
                            <FileTextOutlined /> Manuellement
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item onClick={handleTemplate}>
                            <FileTextOutlined style={{color:'blue'}}/> Déclaration
                            </Menu.Item>
                            <Menu.Divider />
                        </Menu>
                        )}
                        trigger={['click']}
                    >
                        <Button
                        icon={<MoreOutlined />}
                        style={{ color: 'black', padding: '0' }}
                        aria-label="Menu actions"
                        />
                    </Dropdown>
                    </div>
                </div>

                <Table
                    dataSource={data}
                    columns={columns}
                    bordered
                    scroll={scroll}
                    loading={loading}
                    size="small"
                    pagination={pagination}
                    onChange={pagination => setPagination(pagination)}
                    rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                />
            </div>
        </div>
        <Modal
          title=""
          visible={modalType === 'Manuellement'}
          onCancel={closeAllModals}
          footer={null}
          width={900}
          centered
        >
            <RapportClotureManueForm fetchData={fetchData} closeModal={()=>setModalType(null)}/>
        </Modal>

        <Modal
          title=""
          visible={modalType === 'Template'}
          onCancel={closeAllModals}
          footer={null}
          width={1025}
          centered
        >
            <RapportClotureTemplForm fetchData={fetchData} closeModal={()=>setModalType(null)}/>
        </Modal>

        <Modal
          title=""
          visible={modalType === 'Ville'}
          onCancel={closeAllModals}
          footer={null}
          width={700}
          centered
        >
            <RapportClotureVilleForm/>
        </Modal>

        <Tabs defaultActiveKey="0">
            <TabPane
                tab={
                    <span>
                        <AreaChartOutlined
                            style={{
                                color: '#faad14',
                                fontSize: '18px',
                                marginRight: '8px',
                            }}
                        />
                        Bar
                    </span>
                }
             key="0"
            >
                <RapportClotureBar data={data} />
            </TabPane>
        </Tabs>
    </>
  )
}

export default RapportCloture