import React, { useEffect, useState } from 'react'
import { UsergroupAddOutlined, EnvironmentOutlined, DropboxOutlined,ToolOutlined, PrinterOutlined,EditOutlined, PlusCircleOutlined,DeleteOutlined} from '@ant-design/icons';
import { Table, Button, Input, Dropdown, Space, Tooltip, Popconfirm, Tag, Modal, notification } from 'antd';
import FormChauffeur from './formChauffeur/FormChauffeur'
import { getChauffeur } from '../../services/charroiService';
const { Search } = Input;

const Chauffeur = () => {
    const [searchValue ,setSearchValue] = useState('')
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [data, setData] = useState([]);
    const scroll = { x: 400 };
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
    });

    const fetchData = async () => {
        try {
          const { data } = await getChauffeur();
          setData(data.data);
          setLoading(false);
        } catch (error) {
          notification.error({
            message: 'Erreur de chargement',
            description: 'Une erreur est survenue lors du chargement des données.',
          });
          setLoading(false);
        }
      };

      useEffect(()=> {
        fetchData()
      }, [])

    const columns = [
        { 
          title: '#', 
          dataIndex: 'id', 
          key: 'id', 
          render: (text, record, index) => (
            <Tooltip title={`Ligne ${index + 1}`}>
              <Tag color="blue">{index + 1}</Tag>
            </Tooltip>
          ), 
          width: "3%" 
      },
/*       {
        title: 'Image',
        dataIndex: 'img',
        key: 'img',
        render: (text, record) => (
          <div className="userList">
            <Image
              className="userImg"
              src={`${api.defaults.baseURL}/${record.profil}`} // Utilisation directe de l'URL complète
              fallback={`${api.defaults.baseURL}/default-image.jpg`} // Image de secours en cas d'échec
              width={40}
              height={40}
              style={{ borderRadius: '50%' }}
              alt="Profil utilisateur"
            />
          </div>
        ),
      }, */
      {
        title: 'Matricule',
        dataIndex: 'matricule',
        key: 'matricule',
        render: (text) => (
          <Tooltip title={`Matricule`}>
            <Tag color="blue">{text}</Tag>
          </Tooltip>
        )
      },
      {
        title: 'Nom',
        dataIndex: 'nom',
        key: 'nom',
      },
      {
        title: 'Prénom',
        dataIndex: 'prenom',
        key: 'prenom',
      },
      {
        title: 'Téléphone',
        dataIndex: 'telephone',
        key: 'telephone',
        render: (text) => (
          <Tooltip title={`Telephone`}>
            <Tag color="blue">{text}</Tag>
          </Tooltip>
        )
      },
      {
        title: 'Adresse',
        dataIndex: 'adresse',
        key: 'adresse',
        render: (text) => (
          <Tooltip title={`Telephone`}>
            <Tag icon={<EnvironmentOutlined/>} color="orange">{text}</Tag>
          </Tooltip>
        ),
      },
      {
        title: 'Sexe',
        dataIndex: 'sexe',
        key: 'sexe',
        render: (text) => (
          <Tooltip title={`Sexe`}>
            <Tag color="blue">{text}</Tag>
          </Tooltip>
        )
      },
      {
        title: 'Affectation',
        dataIndex: 'nom_site',
        key: 'nom_site',
        render: (text) => (
          <Tooltip title={`Sexe`}>
            <Tag color="green">{text}</Tag>
          </Tooltip>
        )
      },
      {
        title: 'Congés',
        dataIndex: 'conges',
        key: 'conges',
        render: (text) => (
          <div>
            {text?? 'Aucun'}
          </div>
        )
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        width: '10%',
        render: (text, record) => (
          <Space size="middle">
{/*             <Tooltip title="Modifier">
              <Button
                icon={<EditOutlined />}
                style={{
                  color: '#fff',
                  backgroundColor: '#52c41a',
                  borderColor: '#52c41a',
                }}
                aria-label="Modifier"
              />
            </Tooltip>
            <Tooltip title="Supprimer">
              <Popconfirm
                title="Êtes-vous sûr de vouloir supprimer ce client ?"
                okText="Oui"
                cancelText="Non"            >
                <Button
                  icon={<DeleteOutlined />}
                  style={{
                    color: '#fff',
                    backgroundColor: '#ff4d4f',
                    borderColor: '#ff4d4f',
                  }}
                  aria-label="Supprimer"
                />
              </Popconfirm>
            </Tooltip> */}
          </Space>
        ),
      },
    ];

    const handleAddClient = () => {
        setIsModalVisible(true);
      };
    
      const handleCancel = () => {
        setIsModalVisible(false);
      };

  return (
    <>
        <div className="client">
            <div className="client-wrapper">
            <div className="client-row">
                <div className="client-row-icon">
                <DropboxOutlined className='client-icon'/>
                </div>
                <h2 className="client-h2">Chauffeur</h2>
            </div>
            <div className="client-actions">
                <div className="client-row-left">
                <Search placeholder="Recherche..." 
                    enterButton 
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                </div>
                <div className="client-rows-right">
                    <Button
                        type="primary"
                        icon={<PlusCircleOutlined />}
                        onClick={handleAddClient}
                    >
                        Ajouter un chauffeur
                    </Button>
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={data}
                onChange={(pagination) => setPagination(pagination)}
                rowKey="key"
                bordered
                size="middle"
                scroll={scroll}
                loading={loading}
                rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
            />
            </div>
        </div>

        <Modal
            title=""
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={null}
            width={900}
            centered
        >
            <FormChauffeur closeModal={() => setIsModalVisible(false)} fetchData={fetchData}/>
        </Modal>
    </>
  )
}

export default Chauffeur