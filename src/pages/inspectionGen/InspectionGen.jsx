import React, { useEffect, useState } from 'react'
import { Input, Button, Tag, Table, Modal, notification } from 'antd';
import { FileSearchOutlined, CalendarOutlined, PlusCircleOutlined } from '@ant-design/icons'
import InspectionGenForm from './inspectionGenForm/InspectionGenForm';
import { getInspectionGen } from '../../services/charroiService';
import moment from 'moment';

const { Search } = Input;

const InspectionGen = () => {
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
    });
    const [modalType, setModalType] = useState(null);
    const scroll = { x: 400 };

        const fetchData = async() => {
            try {
                const { data } = await getInspectionGen();
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
        }, [])

    const handleAddInspection = () => openModal('Add');

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
            title: 'Date rep',
            dataIndex: 'date_reparation',
            render: (text) => (
              <Tag icon={<CalendarOutlined />} color="blue">
                  {moment(text).format('DD-MM-YYYY')}
              </Tag>
            )
        },
        {
            title: 'Date',
            dataIndex: 'date_validation',
            render: (text) => (
              <Tag icon={<CalendarOutlined />} color="blue">
                  {moment(text).format('DD-MM-YYYY')}
              </Tag>
            )
        },
        {
            title: 'Préoccupations',
            dataIndex: 'commentaire',
        },
        {
            title: "Avis d'expert",
            dataIndex: 'avis',
        },
        {
            title: 'Date validation',
            dataIndex: 'date_validation',
            render: (text) => (
              <Tag icon={<CalendarOutlined />} color="blue">
                  {moment(text).format('DD-MM-YYYY')}
              </Tag>
            )
        }
    ]
    

  return (
    <>
        <div className="client">
            <div className="client-wrapper">
                <div className="client-row">
                    <div className="client-row-icon">
                        <FileSearchOutlined className='client-icon'/>
                    </div>
                    <h2 className="client-h2">Inspection</h2>
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
                            onClick={handleAddInspection}
                        >
                            Ajouter une inspection
                        </Button>
                    </div>
                </div>
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id_inspection"
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
            <InspectionGenForm closeModal={() => setModalType(null)} fetchData={fetchData} />
        </Modal>
    </>
  )
}

export default InspectionGen