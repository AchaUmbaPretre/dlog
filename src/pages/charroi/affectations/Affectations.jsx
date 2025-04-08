import React, { useState } from 'react'
import { Input, Button, Table, Space, Tooltip, Popconfirm, Modal } from 'antd';
import { SwapOutlined, CalendarOutlined, PlusCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import AffectationsForm from './affectationsForm/AffectationsForm';

const { Search } = Input;

const Affectations = () => {
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const scroll = { x: 400 };
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
    });
    const [modalType, setModalType] = useState(null);
    
    const closeAllModals = () => {
        setModalType(null);
      };
      
    const openModal = (type) => {
        closeAllModals();
        setModalType(type);
      };

    const columns = [
        { 
          title: '#', 
          dataIndex: 'id', 
          key: 'id', 
          render: (text, record, index) => (
            <span style={{ fontWeight: 'bold' }}>{index + 1}</span>
          ),
          width: "5%", 
        },
        {
          title: 'Chauffeur',
          dataIndex: 'nom_chauffeur',
          render: (text, record) => (
            <div>
              <span style={{ color: '#1890ff' }}>{`${record.prenom_chauffeur}`}</span> - <span style={{ fontWeight: 'bold' }}>{record.nom_chauffeur}</span>
            </div>
          ),
        },
        {
          title: 'Nom site',
          dataIndex: 'nom_site',
          render: (text) => (
            <div>
              <span style={{ color: '#52c41a', fontStyle: 'italic' }}>{text}</span>
            </div>
          ),
        },
        {
          title: 'Description',
          dataIndex: 'commentaire',
          render: (text) => (
            <div>
              <span style={{ fontStyle: 'italic' }}>{text}</span>
            </div>
          ),
        },
        {
          title: "Date d'affectation",
          dataIndex: 'created_at',
          render: (text) => (
            <Tooltip title="Date d'affectation">
              <div>
                <CalendarOutlined style={{ color: '#fa8c16', marginRight: 8 }} /> 
                <span>{moment(text).format('DD-MM-yyyy')}</span>
              </div>
            </Tooltip>
          ),
        },
        {
          title: 'Créé par',
          dataIndex: 'affectation',
          render: (text, record) => (
            <div>
              <span style={{ color: '#722ed1' }}>{record.prenom}</span> - <span style={{ fontWeight: 'bold' }}>{record.nom}</span>
            </div>
          ),
        },
        {
          title: 'Actions',
          dataIndex: 'actions',
          key: 'actions',
          width: '10%',
          render: (text, record) => (
            <Space size="middle">
                          <Tooltip title="Modifier" placement="top">
                  <Button
                    icon={<EditOutlined />}
                    style={{
                      color: '#fff',
                      backgroundColor: '#52c41a',
                      borderColor: '#52c41a',
                      transition: 'all 0.3s ease',
                    }}
                    aria-label="Modifier"
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#45b22d'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#52c41a'}
                  />
                </Tooltip>
        
                <Tooltip title="Supprimer" placement="top">
                  <Popconfirm
                    title="Êtes-vous sûr de vouloir supprimer ce client ?"
                    okText="Oui"
                    cancelText="Non"
                    onConfirm={() => {}}
                  >
                    <Button
                      icon={<DeleteOutlined />}
                      style={{
                        color: '#fff',
                        backgroundColor: '#ff4d4f',
                        borderColor: '#ff4d4f',
                        transition: 'all 0.3s ease',
                      }}
                      aria-label="Supprimer"
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#e10000'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#ff4d4f'}
                    />
                  </Popconfirm>
                </Tooltip>
            </Space>
          )
        }
      ];

    const handleAddAffectation = () => openModal('Add')


  return (
    <>
        <div className="client">
            <div className="client-wrapper">
                <div className="client-row">
                    <div className="client-row-icon">
                        <SwapOutlined className='client-icon'/>
                    </div>
                    <h2 className="client-h2">Affectation</h2>
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
                        <Button
                            type="primary"
                            icon={<PlusCircleOutlined />}
                            onClick={handleAddAffectation}
                        >
                            Ajouter une affectation
                        </Button>
                    </div>
                </div>
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id_projet"
                    loading={loading}
                    scroll={scroll}
                    size="small"
                    bordered
                    rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                />
            </div>
        </div>

        <Modal
            title=""
            visible={modalType === 'Add'}
            onCancel={closeAllModals}
            footer={null}
            width={900}
            centered
        >
            <AffectationsForm />
      </Modal>
    </>
  )
}

export default Affectations