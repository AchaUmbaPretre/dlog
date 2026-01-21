import { useEffect, useState } from 'react';
import { Table, Button, Input, Typography, notification, Modal, Tag } from 'antd';
import {
  FileTextOutlined,
  PrinterOutlined,
  PlusOutlined,
  UserOutlined,
  CalendarOutlined,
  LoginOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { getAbsence, getAttendanceAdjustment } from '../../../services/presenceService';
import AbsenceForm from './absenceForm/AbsenceForm';
import { renderDate, renderStatus } from './absenceForm/utils/renderStatusAbsence';
import { calculateDuration } from '../conge/utils/calculateDuration';

const { Search } = Input;
const { Text } = Typography

const AutorisationSortie = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const scroll = { x: 400 };
  const [searchValue, setSearchValue] = useState('');

   const fetchData = async () => {
      try {
        const { data } = await getAttendanceAdjustment();
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
    dataIndex: 'utilisateur',
    key: 'utilisateur',
    render: (text, record) => <Text strong>{`${record.utilisateur} - ${record.utilisateur_lastname}`}</Text>,
  },
  {
    title: (
      <>
        <CalendarOutlined /> Type
      </>
    ),
    dataIndex: 'type',
    key: 'type',
    render: text => (
      <Tag color="blue">{text.toUpperCase()}</Tag>
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
    title: 'Durée (jours)',
    key: 'duree',
    align: 'center',
    render: (_, record) => calculateDuration(record.date_debut, record.date_fin)
  },
  {
    title: 'Statut',
    dataIndex: 'statut',
    key: 'statut',
    align: 'center',
    render: status => renderStatus(status),
  },
  {
    title: (
      <>
        <UserOutlined /> Créé par
      </>
    ),
    dataIndex: 'created_name',
    key: 'created_name',
    render: (text, record) => <Text strong>{`${record.created_name} - ${record.created_lastname}`}</Text>,
  },
];


  const filteredData = data?.filter(item =>
    item.utilisateur?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <FileTextOutlined className='client-icon' />
            </div>
            <h2 className="client-h2">Liste d'absences</h2>
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
        <AbsenceForm closeModal={setIsModalVisible} fetchData={fetchData} />
      </Modal>
    </>
  );
};

export default AutorisationSortie;
