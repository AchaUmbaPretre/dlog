import React, { useEffect, useState } from 'react';
import { Input, Button, Table, Modal, Typography, notification, Space } from 'antd';
import {
  FieldTimeOutlined,
  LogoutOutlined,
  LoginOutlined,
  UserOutlined,
  PrinterOutlined,
  PlusCircleOutlined
} from '@ant-design/icons';
import Congeform from './congeform/Congeform';
import { getConge, validateConge } from '../../../services/presenceService';
import { renderDate } from '../absence/absenceForm/utils/renderStatusAbsence';
import { renderStatutConge, renderTypeConge } from './utils/renderStatutConge';
import { calculateDuration } from './utils/calculateDuration';
import { useSelector } from 'react-redux';
import CongeDecisionModal from './congeDecisionModal/CongeDecisionModal';

const { Search } = Input;
const { Text } = Typography;

const Conge = () => {
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const scroll = { x: 700 };
  const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
  const [decisionModal, setDecisionModal] = useState({
    visible: false,
    record: null
    });
  const [decisionLoading, setDecisionLoading] = useState(false);

  // Fetch congés
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getConge();
      setData(data);
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données.'
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Ouvrir modal ajout
  const handleAdd = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

    const openDecisionModal = (record) => {
    setDecisionModal({ visible: true, record });
    };

  // Ouvrir modal décision
  const handleValidate = (record) => {
    setDecisionModal({ visible: true, record });
  };

  const handleDecisionConfirm = async (statut, commentaire) => {
  setDecisionLoading(true);

  try {
    await validateConge({
      id_conge: decisionModal.record.id_conge,
      statut,
      commentaire,
      validated_by: userId
    });

    notification.success({
      message: 'Décision enregistrée',
      description: `Le congé a été ${statut === 'VALIDE' ? 'validé' : 'refusé'}`
    });

    fetchData();
    setDecisionModal({ visible: false, record: null });
  } catch (err) {
    notification.error({
      message: 'Erreur',
      description: err.message
    });
  } finally {
    setDecisionLoading(false);
  }
};


  const columns = [
    {
      title: '#',
      key: 'index',
      width: 50,
      align: 'center',
      render: (_, __, index) => index + 1
    },
    {
      title: <><UserOutlined /> Agent</>,
      dataIndex: 'utilisateur',
      key: 'utilisateur',
      render: (_, record) => <Text strong>{`${record.agent_name} ${record.agent_lastname}`}</Text>
    },
    {
      title: <><LoginOutlined /> Date début</>,
      dataIndex: 'date_debut',
      key: 'date_debut',
      align: 'center',
      render: (date) => renderDate(date)
    },
    {
      title: <><LogoutOutlined /> Date fin</>,
      dataIndex: 'date_fin',
      key: 'date_fin',
      align: 'center',
      render: (date) => renderDate(date)
    },
    {
      title: 'Durée (jours)',
      key: 'duree',
      align: 'center',
      render: (_, record) => calculateDuration(record.date_debut, record.date_fin)
    },
    {
      title: 'Type congé',
      dataIndex: 'type_conge',
      key: 'type_conge',
      align: 'center',
      render: (type) => renderTypeConge(type)
    },
    {
      title: 'Statut',
      dataIndex: 'statut',
      key: 'statut',
      align: 'center',
      render: (status) => renderStatutConge(status)
    },
    {
        title: 'Décision',
        align: 'center',
        render: (_, record) => {
            if (record.statut !== 'EN_ATTENTE') {
            return (
                <Text>
                {record.statut === 'VALIDE' ? 'Validé' : 'Refusé'}
                <br />
                par {record.validated_name}
                </Text>
            );
            }

            return (
            <Button
                type="primary"
                size="small"
                onClick={() => openDecisionModal(record)}
            >
                Décider
            </Button>
            );
        }
    }

  ];

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <FieldTimeOutlined />
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

              <Button icon={<PrinterOutlined />}>
                Print
              </Button>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={data.filter(d => {
              const search = searchValue.toLowerCase();
              return (
                d.agent_name.toLowerCase().includes(search) ||
                d.agent_lastname.toLowerCase().includes(search)
              );
            })}
            loading={loading}
            pagination={{ pageSize: 15 }}
            rowKey="id_conge"
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

      <CongeDecisionModal
        visible={decisionModal.visible}
        record={{
            ...decisionModal.record,
            duree: calculateDuration(
            decisionModal.record?.date_debut,
            decisionModal.record?.date_fin
            )
        }}
        onClose={() => setDecisionModal({ visible: false, record: null })}
        onConfirm={handleDecisionConfirm}
        loading={decisionLoading}
        />

    </>
  );
};

export default Conge;
