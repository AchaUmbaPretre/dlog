import React, { useEffect, useState } from 'react';
import { Input, Button, Table, Modal, Typography, notification, Space } from 'antd';
import {
  FieldTimeOutlined,
  LogoutOutlined,
  LoginOutlined,
  UserOutlined,
  PrinterOutlined,
  PlusCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import Congeform from './congeform/Congeform';
import { getConge, validateConge } from '../../../services/presenceService';
import { renderDate } from '../absence/absenceForm/utils/renderStatusAbsence';
import { renderStatutConge, renderTypeConge } from './utils/renderStatutConge';
import { calculateDuration } from './utils/calculateDuration';

const { Search } = Input;
const { Text } = Typography;

const Conge = () => {
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [decisionModal, setDecisionModal] = useState({ visible: false, record: null });
  const scroll = { x: 700 };

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

  // Ouvrir modal décision
  const handleValidate = (record) => {
    setDecisionModal({ visible: true, record });
  };

  // Confirmer validation ou refus
  const confirmDecision = async (statut) => {
    const { record } = decisionModal;
    try {
      await validateConge(record.id_conge, statut);
      notification.success({
        message: `Congé ${statut === 'VALIDE' ? 'validé' : 'refusé'} !`
      });
      fetchData();
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: error.message || 'Impossible de mettre à jour le congé.'
      });
    } finally {
      setDecisionModal({ visible: false, record: null });
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
      key: 'decision',
      align: 'center',
      render: (_, record) => {
        if (record.statut === 'VALIDE')
          return <Text>{`Validé par ${record.validated_name} ${record.validated_lastname}`}</Text>;
        if (record.statut === 'REFUSE')
          return <Text>{`Refusé par ${record.validated_name} ${record.validated_lastname}`}</Text>;
        // En attente : bouton pour manager
        return (
          <Space>
            <Button
              type="primary"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => handleValidate(record)}
            >
              Valider
            </Button>
            <Button
              type="danger"
              size="small"
              icon={<CloseCircleOutlined />}
              onClick={() => handleValidate(record)}
            >
              Refuser
            </Button>
          </Space>
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

      {/* Modal Ajout Congé */}
      <Modal
        title="Ajouter un congé"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={950}
        centered
      >
        <Congeform closeModal={setIsModalVisible} fetchData={fetchData} />
      </Modal>

      {/* Modal Décision */}
      <Modal
        title="Décision du congé"
        visible={decisionModal.visible}
        onCancel={() => setDecisionModal({ visible: false, record: null })}
        footer={null}
        centered
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Text>Voulez-vous valider ou refuser ce congé ?</Text>
          <Text strong>{decisionModal.record && `${decisionModal.record.agent_name} ${decisionModal.record.agent_lastname}`}</Text>
          <Space>
            <Button
              type="primary"
              onClick={() => confirmDecision('VALIDE')}
            >
              Valider
            </Button>
            <Button
              type="danger"
              onClick={() => confirmDecision('REFUSE')}
            >
              Refuser
            </Button>
          </Space>
        </Space>
      </Modal>
    </>
  );
};

export default Conge;
