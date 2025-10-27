import React, { useEffect, useState } from 'react';
import {
  EnvironmentOutlined,
  MobileOutlined,
  UserOutlined,
  PlusCircleOutlined,
  ManOutlined,
  WomanOutlined,
} from '@ant-design/icons';
import {
  Table,
  Button,
  Input,
  Tooltip,
  Tag,
  Modal,
  notification,
  Card,
  Row,
  Col,
  Statistic,
} from 'antd';
import FormChauffeur from './formChauffeur/FormChauffeur';
import { getChauffeur } from '../../services/charroiService';
const { Search } = Input;

const Chauffeur = () => {
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [showResume, setShowResume] = useState(false); // ✅ Résumé masqué par défaut
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });

  const fetchData = async () => {
    try {
      const { data } = await getChauffeur();
      setData(data.data);
      setLoading(false);
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => {
        const pageSize = pagination.pageSize || 10;
        const pageIndex = pagination.current || 1;
        return (pageIndex - 1) * pageSize + index + 1;
      },
      width: '3%',
    },
    {
      title: 'Nom',
      dataIndex: 'nom',
      key: 'nom',
    },
    {
      title: 'Prénom',
      dataIndex: 'prenom',
      key: 'prenom',
    },
    {
      title: 'Téléphone',
      dataIndex: 'telephone',
      key: 'telephone',
      render: (text) => (
        <Tooltip title="Téléphone">
          <Tag icon={<MobileOutlined />} color="blue">
            {text}
          </Tag>
        </Tooltip>
      ),
    },
    {
      title: 'Adresse',
      dataIndex: 'adresse',
      key: 'adresse',
      render: (text) => (
        <Tooltip title="Adresse">
          <Tag icon={<EnvironmentOutlined />} color="orange">
            {text}
          </Tag>
        </Tooltip>
      ),
    },
    {
      title: 'Sexe',
      dataIndex: 'sexe',
      key: 'sexe',
      render: (text) => (
        <Tag color={text === 'M' ? 'blue' : 'magenta'}>
          {text === 'M' ? 'Homme' : 'Femme'}
        </Tag>
      ),
    },
  ];

  const handleAddClient = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const filteredData = data.filter(
    (item) =>
      item.nom?.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.prenom?.toLowerCase().includes(searchValue.toLowerCase())
  );

  // ✅ Résumé des chauffeurs
  const totalChauffeurs = data.length;
  const chauffeursHommes = data.filter(
    (c) => c.sexe?.toUpperCase() === 'M' || c.sexe?.toUpperCase() === 'H'
  ).length;
  const chauffeursFemmes = data.filter(
    (c) => c.sexe?.toUpperCase() === 'F'
  ).length;

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          {/* --- Titre --- */}
          <div className="client-row" style={{ marginBottom: 20 }}>
            <div className="client-row-icon">
              <UserOutlined className="client-icon" />
            </div>
            <h2 className="client-h2">
              Gestion des Chauffeurs
            </h2>
          </div>

          {/* --- Résumé --- */}
          {showResume && (
            <Card
              style={{
                marginBottom: 25,
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}
            >
              <Row gutter={[16, 16]} justify="space-around">
                <Col xs={24} sm={12} md={8}>
                  <Card bordered={false} style={{ textAlign: 'center', borderRadius: 12 }}>
                    <Statistic
                      title="Total Chauffeurs"
                      value={totalChauffeurs}
                      prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Card bordered={false} style={{ textAlign: 'center', borderRadius: 12 }}>
                    <Statistic
                      title="Hommes"
                      value={chauffeursHommes}
                      prefix={<ManOutlined style={{ color: '#1677ff' }} />}
                      valueStyle={{ color: '#1677ff' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Card bordered={false} style={{ textAlign: 'center', borderRadius: 12 }}>
                    <Statistic
                      title="Femmes"
                      value={chauffeursFemmes}
                      prefix={<WomanOutlined style={{ color: '#eb2f96' }} />}
                      valueStyle={{ color: '#eb2f96' }}
                    />
                  </Card>
                </Col>
              </Row>
            </Card>
          )}

          {/* --- Barre d’action --- */}
          <div
            className="client-actions"
            style={{
              marginBottom: 20,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Search
              placeholder="Recherche..."
              enterButton
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: 300 }}
            />
            <div className="client-rows-right">
              <Button
                onClick={() => setShowResume(!showResume)}
                type="default"
                style={{ borderRadius: 8 }}
              >
              {showResume ? 'Masquer le résumé' : 'Afficher le résumé'}
              </Button>
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={handleAddClient}
                style={{ borderRadius: 8 }}
              >
                Ajouter un chauffeur
              </Button>
            </div>
          </div>

          {/* --- Tableau --- */}
          <Table
            columns={columns}
            dataSource={filteredData}
            onChange={(pagination) => setPagination(pagination)}
            rowKey="id"
            bordered
            size="middle"
            loading={loading}
            pagination={pagination}
            rowClassName={(record, index) =>
              index % 2 === 0 ? 'odd-row' : 'even-row'
            }
          />
        </div>
      </div>

      {/* --- Modal --- */}
      <Modal
        title=""
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={900}
        centered
      >
        <FormChauffeur
          closeModal={() => setIsModalVisible(false)}
          fetchData={fetchData}
        />
      </Modal>
    </>
  );
};

export default Chauffeur;
