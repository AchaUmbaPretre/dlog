import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Input, Button, Table, Modal, Typography, notification } from 'antd';
import {
  FieldTimeOutlined,
  PrinterOutlined,
  PlusCircleOutlined,
  TeamOutlined
} from '@ant-design/icons';

import { getTerminal } from '../../../services/presenceService';
import TerminalForm from './terminalForm/TerminalForm';
import UserTerminal from './userTerminal/UserTerminalContainer';

const { Search } = Input;
const { Text } = Typography;

const Terminal = ({ id_terminal, closeModal }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  const [isTerminalModalVisible, setIsTerminalModalVisible] = useState(false);

  // Modal gestion utilisateurs par terminal
  const [isUserTerminalModalVisible, setIsUserTerminalModalVisible] = useState(false);
  const [selectedTerminal, setSelectedTerminal] = useState(null);

  const scroll = { x: 700 };

  /* ===========================
   * DATA FETCHING
   * =========================== */
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getTerminal();
      setData(data || []);
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Impossible de charger la liste des terminaux.'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openTerminalModal = () => setIsTerminalModalVisible(true);
  const closeTerminalModal = () => setIsTerminalModalVisible(false);

  const openUserTerminalModal = (id_terminal) => {
    setSelectedTerminal(id_terminal);
    setIsUserTerminalModalVisible(true);
  };

  const closeUserTerminalModal = () => {
    setSelectedTerminal(null);
    setIsUserTerminalModalVisible(false);
  };

  const columns = useMemo(
    () => [
      {
        title: '#',
        width: 60,
        align: 'center',
        render: (_, __, index) => index + 1
      },
      {
        title: 'Site',
        dataIndex: 'nom_site',
        key: 'nom_site',
        render: (text) => <Text strong>{text}</Text>
      },
      {
        title: 'Nom',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Zone',
        dataIndex: 'location_zone',
        key: 'location_zone'
      },
      {
        title: 'Device model',
        dataIndex: 'device_model',
        key: 'device_model'
      },
      {
        title: 'Device SN',
        dataIndex: 'device_sn',
        key: 'device_sn'
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 160,
        align: 'center',
        render: (_, record) => (
          <Button
            type="primary"
            icon={<TeamOutlined />}
            onClick={() => openUserTerminalModal(record)}
          >
            Utilisateurs
          </Button>
        )
      }
    ],
    []
  );

  const filteredData = useMemo(() => {
    if (!searchValue) return data;
    return data.filter(item =>
      item.nom_site?.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [data, searchValue]);

  return (
    <>
      <div className="client">
        <div className="client-wrapper">

          <div className="client-row">
            <div className="client-row-icon">
              <FieldTimeOutlined />
            </div>
            <h2 className="client-h2">Liste des terminaux</h2>
          </div>

          <div className="client-actions">
            <div className="client-row-left">
              <Search
                placeholder="Recherche par site..."
                allowClear
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>

            <div className="client-rows-right">
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={openTerminalModal}
              >
                Ajouter
              </Button>

              <Button icon={<PrinterOutlined />}>
                Imprimer
              </Button>
            </div>
          </div>

          {/* TABLE */}
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            pagination={{ pageSize: 15 }}
            rowKey="id_terminal"
            bordered
            size="middle"
            scroll={scroll}
            rowClassName={(_, index) =>
              index % 2 === 0 ? 'odd-row' : 'even-row'
            }
          />
        </div>
      </div>

      <Modal
        title=""
        open={isTerminalModalVisible}
        onCancel={closeTerminalModal}
        footer={null}
        width={950}
        centered
        destroyOnClose
      >
        <TerminalForm
          closeModal={closeTerminalModal}
          fetchData={fetchData}
        />
      </Modal>

      <Modal
        title="Gestion des utilisateurs du terminal"
        open={isUserTerminalModalVisible}
        onCancel={closeUserTerminalModal}
        footer={null}
        width={900}
        centered
        destroyOnClose
      >
        <UserTerminal
          terminal={selectedTerminal}
          closeModal={closeUserTerminalModal}
        />
      </Modal>
    </>
  );
};

export default Terminal;
