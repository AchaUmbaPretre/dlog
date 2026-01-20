import React, { useEffect, useState } from 'react'
import { Input, Button, Table, Modal, notification } from 'antd';
import { FieldTimeOutlined, PrinterOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Congeform from './congeform/Congeform';
import { getConge } from '../../../services/presenceService';

const { Search } = Input;

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
        }
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