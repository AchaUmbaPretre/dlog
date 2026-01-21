import { useEffect, useState } from 'react';
import { Table, Button, Input, Typography, notification, Modal, Tag } from 'antd';
import {
  FileTextOutlined,
  PrinterOutlined,
  PlusOutlined,
  UserOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import {getAttendanceAdjustment } from '../../../services/presenceService';
import { renderDate } from '../absence/absenceForm/utils/renderStatusAbsence';

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

const STATUS_COLORS = {
  PROPOSE: 'orange',
  VALIDE: 'green',
  REJETE: 'red',
};

const TYPE_LABELS = {
  RETARD_JUSTIFIE: 'Retard justifié',
  CORRECTION_HEURE: 'Correction heures',
  AUTORISATION_SORTIE: 'Autorisation de sortie',
};

const columns = [
  {
    title: '#',
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
    dataIndex: 'utilisateur_nom',
    key: 'utilisateur_nom',
    render: (text) => <Text strong>{text}</Text>,
  },
  {
    title: (
      <>
        <CalendarOutlined /> Date
      </>
    ),
    dataIndex: 'date_presence',
    align: 'center',
    render: (date) => renderDate(date),
  },
  {
    title: 'Type d’ajustement',
    dataIndex: 'type',
    align: 'center',
    render: (type) => (
      <Tag color="blue">
        {TYPE_LABELS[type] || type}
      </Tag>
    ),
  },
  {
    title: 'Ancienne valeur',
    dataIndex: 'ancienne_valeur',
    align: 'center',
    render: (v) => v || '--',
  },
  {
    title: 'Nouvelle valeur',
    dataIndex: 'nouvelle_valeur',
    align: 'center',
    render: (v) => (
      <Text strong>{v || '--'}</Text>
    ),
  },
  {
    title: 'Motif',
    dataIndex: 'motif',
    ellipsis: true,
  },
  {
    title: 'Statut RH',
    dataIndex: 'statut',
    align: 'center',
    render: (statut) => (
      <Tag color={STATUS_COLORS[statut]}>
        {statut}
      </Tag>
    ),
  },
  {
    title: 'Créée le',
    dataIndex: 'created_at',
    align: 'center',
    render: (date) => renderDate(date),
  },
  {
    title: 'Validée par',
    align: 'center',
    render: (_, record) =>
      record.validated_by_nom ? (
        <Text>{record.validated_by_nom}</Text>
      ) : (
        <Tag color="default">—</Tag>
      ),
  },
];


const filteredData = data?.filter(item =>
  item.utilisateur_nom?.toLowerCase().includes(searchValue.toLowerCase())
);


  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <FileTextOutlined className='client-icon' />
            </div>
            <h2 className="client-h2">Demandes d’ajustement de présence</h2>
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
    </>
  );
};

export default AutorisationSortie;
