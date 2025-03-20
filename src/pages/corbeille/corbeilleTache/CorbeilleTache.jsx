import React, { useEffect, useRef, useState } from 'react'
import { Table, Button,Input, message, Dropdown, Menu, notification, Space, Tag, Tooltip, Popover, Tabs, Popconfirm, Collapse, Select, Skeleton, Alert } from 'antd';
import { 
     ApartmentOutlined,EnvironmentOutlined, EditOutlined,
    CalendarOutlined, TeamOutlined,DeleteOutlined, UserOutlined, FileTextOutlined, FileDoneOutlined 
  } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { deletePutTache } from '../../../services/tacheService';
const { Search } = Input;


const CorbeilleTache = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const role = useSelector((state) => state.user?.currentUser.role);
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
      });
    const [searchValue, setSearchValue] = useState('');
    const scroll = { x: 400 };

    const handleEdit = () => {

    }

      const handleDelete = async (id) => {
        try {
           await deletePutTache(id, userId);
          setData(data.filter((item) => item.id_tache !== id));
          message.success('Tache a ete supprimée avec succès');
        } catch (error) {
          notification.error({
            message: 'Erreur de suppression',
            description: 'Une erreur est survenue lors de la suppression du budget.',
          });
        }
      };

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
        { 
          title: 'DPT', 
          dataIndex: 'departement', 
          key: 'nom_departement',
          render: text => (
            <Space>
              <Tag icon={<ApartmentOutlined />} color='cyan'>{text}</Tag>
            </Space>
          ),    
        },
        {   
          title: 'Titre',
          dataIndex: 'nom_tache', 
          key: 'nom_tache',
          render: (text,record) => (
            <Space style={columnStyles.title} className={columnStyles.hideScroll}>
              <Tag icon={<FileTextOutlined />} color='cyan'>{text}</Tag>
            </Space>
          ),
        },
        {   
          title: 'Client', 
          dataIndex: 'nom_client', 
          key: 'nom_client',
          render: text => (
            <Space>
              <Tag icon={<UserOutlined />} color='green'>{text ?? 'Aucun'}</Tag>
            </Space>
          ),
        },
        {
          title: 'Date debut & fin',
          dataIndex: 'date_debut',
          key: 'date_debut',
          sorter: (a, b) => moment(a.date_debut) - moment(b.date_debut),
          sortDirections: ['descend', 'ascend'],
          render: (text,record) => 
            <Tag icon={<CalendarOutlined />} color="blue">
              {moment(text).format('DD-MM-yyyy')} & {moment(record.date_fin).format('DD-MM-yyyy')}
            </Tag>,
    
        },
        { 
          title: 'Fréquence', 
          dataIndex: 'frequence', 
          key: 'frequence',
          render: text => (
            <Space>
              <Tag icon={<CalendarOutlined />} color='blue'>{text}</Tag>
            </Space>
          )    
        },
        { 
          title: 'Ville', 
          dataIndex: 'ville', 
          key: 'ville',
          render: text => (
            <Space>
              <Tag color='red' icon={<EnvironmentOutlined />}>{text ?? 'Aucun'}</Tag>
            </Space>
          ),
        },
        {
          title: 'Owner', 
          dataIndex: 'owner', 
          key: 'owner',
          render: text => (
            <Space>
              <Tag icon={<TeamOutlined />} color='purple'>{text}</Tag>
            </Space>
          ),
    
        },
        {
          title: 'Action',
          key: 'action',
          width: '10%',
          render: (text, record) => (
      
              <Space size="middle">
                <Tooltip title="Modifier">
                  <Button
                    icon={<EditOutlined />}
                    style={{ color: 'green' }}
                    onClick={() => handleEdit(record.id_tache)}
                    aria-label="Edit tache"
                  />
                </Tooltip>

                {role === 'Admin' ? (
                <Tooltip title="Supprimer">
                  <Popconfirm
                    title="Êtes-vous sûr de vouloir supprimer cette tâche ?"
                    onConfirm={() => handleDelete(record.id_tache)}
                    okText="Oui"
                    cancelText="Non"
                  >
                    <Button
                      icon={<DeleteOutlined />}
                      style={{ color: 'red' }}
                      aria-label="Supprimer"
                    />
                  </Popconfirm>
                </Tooltip>
              ) : null}
              </Space>
          )
        }
      ];

  return (
    <>
        <div className="client">
            <div className="client-wrapper">
                <div className="client-rows">
                    <div className="client-row">
                        <div className="client-row-icon">
                            <FileDoneOutlined className='client-icon'/>
                        </div>
                        <h2 className="client-h2">Tâches</h2>
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
                </div>
                <div className="tableau_client">
                    <Table
                        id="printableTable"
                        columns={columns}
                        dataSource={data}
                        rowKey="id_tache"
                        size="small"
                        bordered
                        rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                        onChange={(pagination) => setPagination(pagination)}
                        loading={loading}
                        scroll={scroll}
                    />;
                </div>
            </div>
        </div>
    </>
  )
}

export default CorbeilleTache