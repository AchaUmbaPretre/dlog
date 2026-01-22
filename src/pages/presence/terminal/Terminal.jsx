import React, { useEffect, useState } from 'react';
import { Input, Button, Table, Modal, Typography, notification } from 'antd';
import {
  FieldTimeOutlined,
  PrinterOutlined,
  PlusCircleOutlined
} from '@ant-design/icons';
import { getTerminal } from '../../../services/presenceService';
import TerminalForm from './terminalForm/TerminalForm';

const { Search } = Input;
const { Text } = Typography;

const Terminal = () => {
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const scroll = { x: 700 };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getTerminal();
      setData(data);
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des terminaux.'
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Ouvrir/fermer modal ajout
  const handleAdd = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  // 🔹 Colonnes du tableau
  const columns = [
    {
      title: '#',
      width: 50,
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
      key: 'name',
      render: (text) => <Text>{text}</Text>
    },
    {
      title: 'Zone',
      dataIndex: 'location_zone',
      key: 'location_zone',
      render: (text) => <Text>{text}</Text>
    },
    {
      title: 'Device model',
      dataIndex: 'device_model',
      key: 'device_model',
      render: (text) => <Text>{text}</Text>
    },
    {
      title: 'Device sn',
      dataIndex: 'device_sn',
      key: 'device_sn',
      render: (text) => <Text>{text}</Text>
    }
  ];

  // 🔹 Filtrer les données selon la recherche
  const filteredData = data?.filter(item =>
    item.nom_site?.toLowerCase().includes(searchValue.toLowerCase())
  );

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
            dataSource={filteredData}
            loading={loading}
            pagination={{ pageSize: 15 }}
            rowKey="id_terminal"
            rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
            bordered
            size="middle"
            scroll={scroll}
          />
        </div>
      </div>

      <Modal
        title="Ajouter un terminal"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={950}
        centered
      >
        <TerminalForm closeModal={handleCancel} fetchData={fetchData} />
      </Modal>
    </>
  );
};

export default Terminal;
