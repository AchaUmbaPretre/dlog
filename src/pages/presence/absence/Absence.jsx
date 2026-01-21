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
import { getAbsence, validateAbsence } from '../../../services/presenceService';
import AbsenceForm from './absenceForm/AbsenceForm';
import { renderDate, renderStatus } from './absenceForm/utils/renderStatusAbsence';
import { calculateDuration } from '../conge/utils/calculateDuration';
import AbsenceDecisionModal from './absenceDecisionModal/AbsenceDecisionModal';
import { useSelector } from 'react-redux';

const { Search } = Input;
const { Text } = Typography

const Absence = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const scroll = { x: 400 };
  const [searchValue, setSearchValue] = useState('');
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [selectedAbsence, setSelectedAbsence] = useState(null);
  const [decisionLoading, setDecisionLoading] = useState(false);
  const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);

   const fetchData = async () => {
      try {
        const { data } = await getAbsence();
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

  const handleDecision = async (decision, commentaire) => {
  if (!selectedAbsence) return;

  try {
    setDecisionLoading(true);
    const payload = {
        id_absence: selectedAbsence.id_absence,
        decision,
        commentaire,
        validated_by: userId
    }
    await validateAbsence(payload)

    notification.success({
      message: 'Décision enregistrée',
      description:
        decision === 'VALIDEE'
          ? "L'absence a été validée avec succès."
          : "L'absence a été rejetée.",
    });

    setDecisionModalOpen(false);
    setSelectedAbsence(null);
    fetchData();

  } catch (error) {
    notification.error({
      message: 'Erreur',
      description: "Impossible d'enregistrer la décision.",
    });
  } finally {
    setDecisionLoading(false);
  }
};

  

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
        <CalendarOutlined /> Type d’absence
      </>
    ),
    dataIndex: 'type_absence',
    key: 'type_absence',
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
  {
    title: 'Décision',
    align: 'center',
    render: (_, record) => {
        if (record.statut !== 'PROPOSEE') {
            return (
                <Text>
                    {record.statut === 'VALIDEE' ? 'Validée' : 'Rejetée'}
                    <br />
                    <Text type="secondary">
                        par {record.validated_name}
                    </Text>
                </Text>
            );
        }

        return (
        <Button
            type="primary"
            size="small"
            onClick={() => {
            setSelectedAbsence(record);
            setDecisionModalOpen(true);
            }}
        >
            Décider
        </Button>
        );
    }
    }
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

        <AbsenceDecisionModal
            visible={decisionModalOpen}
            record={selectedAbsence}
            loading={decisionLoading}
            onClose={() => {
            setDecisionModalOpen(false);
            setSelectedAbsence(null);
            }}
            onConfirm={handleDecision}
        />

    </>
  );
};

export default Absence;
