import React, { useEffect, useState } from 'react'
import { Table, Button,Input, Typography, Modal, message, notification, Space, Tag, Tooltip, Popconfirm } from 'antd';
import { 
     ApartmentOutlined, ExclamationCircleOutlined, EnvironmentOutlined, RotateLeftOutlined,
    CalendarOutlined, TeamOutlined,DeleteOutlined, UserOutlined, FileTextOutlined, FileDoneOutlined 
  } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { deleteTache, getTacheCorbeille, putTacheCorbeille } from '../../../services/tacheService';
const { Search } = Input;
const { confirm } = Modal;
const { Text } = Typography;


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


        const fetchData = async () => {
          try {
            const { data } = await getTacheCorbeille();
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

      const handleEdit = async (id) => {
        try {
            await putTacheCorbeille(id);
            message.success(`La tâche a été restaurée avec succès`);
            fetchData();
        } catch (error) {
            message.error("Une erreur est survenue lors de la restauration de la tâche");
            console.error(error);
        }
    };
    

    const showDeleteConfirm = (id) => {
        confirm({
            title: (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <ExclamationCircleOutlined style={{ fontSize: 22, color: "#ff4d4f" }} />
                    <Text strong style={{ fontSize: 16 }}>Suppression Définitive</Text>
                </div>
            ),
            content: (
                <Text type="danger" style={{ fontSize: 14 }}>
                    Cette action est irréversible. Êtes-vous sûr de vouloir supprimer cette tache ?
                </Text>
            ),
            okText: "Oui, supprimer",
            cancelText: "Annuler",
            okType: "danger",
            centered: true,
            maskClosable: true,
            icon: null,
            onOk: async () => {
                try {
                    await deleteTache(id);
                    setData((prevData) => prevData.filter((item) => item.id_declaration_super !== id));
                    message.success("Déclaration supprimée avec succès.");
                } catch (error) {
                    notification.error({
                        message: "Erreur de suppression",
                        description: "Une erreur est survenue lors de la suppression de la déclaration.",
                    });
                }
            },
        });
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
                <Tooltip title="Restaurer">
                  <Button
                    icon={<RotateLeftOutlined />}
                    style={{ color: 'green' }}
                    onClick={() => handleEdit(record.id_tache)}
                    aria-label="Edit tache"
                  />
                </Tooltip>

                {role === 'Admin' ? (
                <Tooltip title="Supprimer">
                    <Button
                      icon={<DeleteOutlined />}
                      style={{ color: 'red' }}
                      aria-label="Supprimer"
                      onClick={() => showDeleteConfirm(record.id_tache)}

                    />
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