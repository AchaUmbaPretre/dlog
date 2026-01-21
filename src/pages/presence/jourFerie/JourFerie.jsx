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
import { getConge, } from '../../../services/presenceService';
import { renderDate } from '../absence/absenceForm/utils/renderStatusAbsence';
import JourFerieForm from './jourFerieForm/JourFerieForm';

const { Search } = Input;
const { Text } = Typography;

const JourFerie = () => {
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
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
      title: 'Statut',
      dataIndex: 'statut',
      key: 'statut',
      align: 'center',
      render: (status) => renderStatutConge(status)
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
        <JourFerieForm closeModal={setIsModalVisible} fetchData={fetchData} />
      </Modal>

    </>
  );
};

export default JourFerie;
