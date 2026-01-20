import React, { useEffect, useState } from 'react'
import { Input, Button, Table, Modal, Typography, notification } from 'antd';
import { FieldTimeOutlined, LogoutOutlined, LoginOutlined, UserOutlined, PrinterOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Congeform from './congeform/Congeform';
import { getConge } from '../../../services/presenceService';
import { renderDate } from '../absence/absenceForm/utils/renderStatusAbsence';

const { Search } = Input;
const { Text } = Typography;

const Conge = () => {
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const scroll = { x: 400 };

    const fetchData = async() => {
        try {
            const { data } = await getConge();
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

    const handleAdd = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false)
    };


    const columns = [
        {
            title: "#",
            key: 'index',
            width: 50,
            align: 'center',
            render: (_, __, index) => index + 1,
        },
        {
            title: (
            <>
                <UserOutlined /> Agent
            </>
            ),
            dataIndex: 'utilisateur',
            key: 'utilisateur',
            render: (text, record) => <Text strong>{`${record.agent_name} - ${record.agent_lastname}`}</Text>,
        },
        {
            title: (
            <>
                <LoginOutlined /> Date début
            </>
            ),
            dataIndex: 'date_debut',
            key: 'date_debut',
            align: 'center',
            render: date => renderDate(date),
        },
        {
            title: (
            <>
                <LogoutOutlined /> Date fin
            </>
            ),
            dataIndex: 'date_fin',
            key: 'date_fin',
            align: 'center',
            render: date => renderDate(date),
        },
        {
            title: 'Type conge',
            dataIndex: 'type_conge',
            key: 'type_conge',
            align: 'center'
        },
        {
            title: 'Statut',
            dataIndex: 'statut',
            key: 'statut',
            align: 'center'
        },
        {
            title: (
            <>
                <UserOutlined /> Créé par
            </>
            ),
            dataIndex: 'created_name',
            key: 'created_name',
            render: (text, record) => 
             text ?
                <Text strong>{`${record.created_name} - ${record.created_name}`}</Text>
                : 'Aucun'
        },
    ]

  return (
    <>
        <div className="client">
            <div className="client-wrapper">
                <div className="client-row">
                    <div className="client-row-icon">
                        <FieldTimeOutlined/>
                    </div>
                    <div className="client-h2">Liste des congés</div>
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
                            onClick={handleAdd}
                        >
                            Ajouter
                        </Button>

                        <Button
                            icon={<PrinterOutlined />}
                        >
                            Print
                        </Button>
                    </div>
                </div>
                <Table
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    pagination={{ pageSize: 15 }}
                    rowKey="id"
                    bordered
                    size="middle"
                    scroll={scroll}
                />
            </div>
        </div>

      <Modal
        title=""
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={950}
        centered
      >
        <Congeform closeModal={setIsModalVisible} fetchData={fetchData} />
      </Modal>

    </>
  )
}

export default Conge