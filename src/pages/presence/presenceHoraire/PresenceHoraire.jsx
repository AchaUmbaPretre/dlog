import { useEffect, useState } from 'react';
import { Table, Button, Input, Typography, Tooltip, notification, Modal, Tag } from 'antd';
import {
  FileTextOutlined,
  PrinterOutlined,
  PlusOutlined,
  UserOutlined,
  CalendarOutlined,
  LoginOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import PresenceHoraireForm from './presenceHoraireForm/PresenceHoraireForm';
import { getHoraire } from '../../../services/presenceService';
import { renderDate } from '../absence/absenceForm/utils/renderStatusAbsence';

const { Search } = Input;
const { Text } = Typography

const PresenceHoraire = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const scroll = { x: 400 };
  const [searchValue, setSearchValue] = useState('');
  

   const fetchData = async () => {
      try {
        const res = await getHoraire();
        setData(res?.data);
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

  

  const handleAddClient = () => {
    setIsModalVisible(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCancel = () => {
    setIsModalVisible(false)
  };

const columns = [
  {
    title: '#',
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
    key: 'agent',
    render: (_, record) => (
      <Text strong>{`${record.utilisateur_nom} ${record.utilisateur_prenom}`}</Text>
    ),
  },
  {
    title: (
      <>
        <CalendarOutlined /> Horaire
      </>
    ),
    key: 'horaire',
    render: (_, record) => (
      <Tag color="green">{record.horaire_nom}</Tag>
    ),
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
  }
];

const filteredData = data?.filter(item =>
  `${item.utilisateur_nom} ${item.utilisateur_prenom}`
    .toLowerCase()
    .includes(searchValue.toLowerCase())
);

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <FileTextOutlined className='client-icon' />
            </div>
            <h2 className="client-h2">Horaire des personnels</h2>
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
              <Button
                icon={<PrinterOutlined />}
                onClick={handlePrint}
              >
                Print
              </Button>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={filteredData}
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
        <PresenceHoraireForm closeModal={setIsModalVisible} fetchData={fetchData} />
      </Modal>
    </>
  );
};

export default PresenceHoraire;
