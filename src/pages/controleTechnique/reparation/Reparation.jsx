import React, { useEffect, useState } from 'react'
import { ToolOutlined, PlusCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import { Input, Button, notification, Space, Table, Tag, Modal } from 'antd';
import moment from 'moment';
import ReparationForm from './reparationForm/ReparationForm';
import { getReparation } from '../../../services/charroiService';

const { Search } = Input;


const Reparation = () => {
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
    });
    const [data, setData] = useState([]);
    const [modalType, setModalType] = useState(null);
    const scroll = { x: 'max-content' };

    
   const fetchData = async() => {
        try {
            const { data } = await getReparation();
            setData(data.data);
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
    }, [])

    const columns = [
        { 
            title: '#', 
            dataIndex: 'id', 
            key: 'id', 
            render: (text, record, index) => index + 1, 
            width: "3%" 
          },
        {
          title: 'Matricule',
          dataIndex: 'immatriculation',
        },
        {
            title: 'Marque',
            dataIndex: 'nom_marque',
        },
        {
          title: 'Date debut',
          dataIndex: 'date_reparation',
          render: (text) => (
            <Tag icon={<CalendarOutlined />} color="blue">
                {moment(text).format('DD-MM-YYYY')}
            </Tag>
          )
        },
        {
            title: 'Date prevue',
            dataIndex: 'date_prevu',
            render: (text) => (
                <Tag icon={<CalendarOutlined />} color="blue">
                    {moment(text).format('DD-MM-YYYY')}
                </Tag>
              )
        },
        {
          title: 'Date fin',
          dataIndex: 'date_sortie',
          render: (text) => (
            <Tag icon={<CalendarOutlined />} color="blue">
                {moment(text).format('DD-MM-YYYY')}
            </Tag>
          )
        },
        {
            title: 'Nbre Jour',
            dataIndex: 'nb_jours_au_garage'
        },
        {
            title: 'Description',
            dataIndex: 'commentaire'
        },
        {
            title: 'Fournisseur',
            dataIndex: 'nom_fournisseur'
        },
        {
            title: 'Etat',
            dataIndex: 'nom_type_statut'
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render : (text, record) => (
                <Space>

                </Space>
            )
        }
      ];

    const handleAddReparation = () => openModal('Add')
    
    
    const closeAllModals = () => {
        setModalType(null);
      };
      
    const openModal = (type) => {
        closeAllModals();
        setModalType(type);
      };

  return (
    <>
        <div className="client">
            <div className="client-wrapper">
                <div className="client-row">
                    <div className="client-row-icon">
                        <ToolOutlined className='client-icon'/>
                    </div>
                    <h2 className="client-h2">Liste des réparations</h2>
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
                            onClick={handleAddReparation}
                        >
                            Ajouter une réparation
                        </Button>
                    </div>
                </div>
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id_controle_technique"
                    loading={loading}
                    scroll={scroll}
                    size="small"
                    onChange={(pagination)=> setPagination(pagination)}
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
            <ReparationForm closeModal={() => setModalType(null)} fetchData={fetchData} />
        </Modal>
    </>
  )
}

export default Reparation