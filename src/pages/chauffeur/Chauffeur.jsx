import React, { useEffect, useState } from 'react'
import { EnvironmentOutlined, MobileOutlined, UserOutlined, PlusCircleOutlined} from '@ant-design/icons';
import { Table, Button, Input, Space, Tooltip, Tag, Modal, notification } from 'antd';
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
        } finally{
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
          render: (text, record, index) => {
            const pageSize = pagination.pageSize || 10;
            const pageIndex = pagination.current || 1;
            return (pageIndex - 1) * pageSize + index + 1;
          },
          width: "3%" 
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
            <Tag icon={<MobileOutlined />} color="blue">{text}</Tag>
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
            <Tag color="green">{text ?? 'Aucune'}</Tag>
          </Tooltip>
        )
      },
      {
        title: 'Congés',
        dataIndex: 'conges',
        key: 'conges',
        render: (text) => (
          text ? (
            <Tag color="blue">{text}</Tag>
          ) : (
            <Tag color="red">Aucun</Tag>
          )
        )
      }
    ];

    const handleAddClient = () => {
        setIsModalVisible(true);
      };
    
      const handleCancel = () => {
        setIsModalVisible(false);
      };

      const filteredData = data.filter(item => 
        item.nom?.toLowerCase().includes(searchValue.toLocaleLowerCase()) || 
        item.prenom?.toLowerCase().includes(searchValue.toLocaleLowerCase())
    )

  return (
    <>
        <div className="client">
            <div className="client-wrapper">
            <div className="client-row">
                <div className="client-row-icon">
                    <UserOutlined className='client-icon'/>
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
                dataSource={filteredData}
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