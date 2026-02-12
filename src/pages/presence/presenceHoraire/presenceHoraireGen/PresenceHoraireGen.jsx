import { useEffect, useState } from 'react';
import { Table, Button, Input, Typography, notification, Modal } from 'antd';
import {
  FileTextOutlined,
  PrinterOutlined,
  PlusOutlined,
  UserOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { getHoraire } from '../../../../services/presenceService';
import PresenceHoraireForm from '../presenceHoraireForm/PresenceHoraireForm';

const { Search } = Input;

const PresenceHoraireGen = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchValue, setSearchValue] = useState('');

      // ✅ Colonnes du tableau
      const columns = [
        {
          title: '#',
          key: 'index',
          width: 50,
          align: 'center',
          render: (_, __, index) => index + 1,
        }
      ];

    const fetchData = async () => {
        try {
          setLoading(true);
          const res = await getHoraire();
          setData(res?.data || []);
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

    const handleAddClient = () => setIsModalVisible(true);
    const handleCancel = () => setIsModalVisible(false);

  return (
    <>
        <div className="client">
            <div className="client-wrapper">
            <div className="client-row">
                <div className="client-row-icon">
                <FileTextOutlined className='client-icon' />
                </div>
                <h2 className="client-h2">Horaire general</h2>
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
                      icon={<PlusOutlined />}
                    onClick={handleAddClient}
                  >
                    Ajouter
                  </Button>
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                pagination={{ pageSize: 10 }}
                rowKey="id_planning"
                bordered
                size="middle"
                scroll={{ x: 1400 }} // Scroll horizontal suffisant pour tous les jours
            />
            </div>
        </div>

    <Modal
        title=""
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        centered
      >
        <PresenceHoraireForm
          closeModal={setIsModalVisible} 
          fetchData={fetchData} 
        />
      </Modal>
    </>
  )
}

export default PresenceHoraireGen;