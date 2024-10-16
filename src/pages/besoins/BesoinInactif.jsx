import React, { useEffect, useState } from 'react';
import { Table, Button, Input,notification, Space, Tag, Collapse, Modal, Tabs } from 'antd';
import { ProfileOutlined, UserOutlined, PlusCircleOutlined, PrinterOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import config from '../../config';
import { getBesoin, getBesoinInactif } from '../../services/besoinsService';
import ProjetBesoin from '../projet/projetBesoin/ProjetBesoin';

const { Search } = Input;
const { Panel } = Collapse;

const BesoinInactif = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [modalType, setModalType] = useState(null);

  const closeAllModals = () => {
    setModalType(null)
  };

  const openModal = (type, idBesoin = '') => {
    closeAllModals();
    setModalType(type);
  };

  const handleAddBesoin = () => {
    openModal('AddBesoin')
  };


    const fetchData = async () => {
      try {
        const { data } = await getBesoinInactif();
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
  }, [DOMAIN]);

  // Filtrage des données
  const filteredData = data.filter(item =>
    item.description?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const nestedColumns = [
    {
      title: 'Client',
      dataIndex: 'nom',
      key: 'nom',
      render: (text) => (
        <Tag icon={<UserOutlined />} color="green">{text ?? 'Aucun'}</Tag>
      ),
    },
    {
      title: 'Article',
      dataIndex: 'nom_article',
      key: 'nom_article',
      render: (text) => (
        <Tag color="blue">{text ?? 'Aucun'}</Tag>
      ),
    },
    {
      title: 'Quantité',
      dataIndex: 'quantite',
      key: 'quantite',
      render: (text) => (
        <Tag color='orange'>{text ?? 'Aucune'}</Tag>
      ),
    },
    {
      title: 'Déscription',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (
        <Tag color={"magenta"}>{text ?? 'Aucune'}</Tag>
      ),
    }
  ];

  const mainColumns = [
    {
      title: 'Projet',
      dataIndex: 'nom_projet',
      key: 'nom_projet',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
  ];

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
            <div className="client-row">
                <div className="client-row-icon">
                <ProfileOutlined className='client-icon' />
                </div>
                <h2 className="client-h2">Liste des besoins sans projet</h2>
            </div>
            <div className="client-actions">
                    <div className="client-row-left">
                    <Search
                        placeholder="Recherche..."
                        enterButton
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    </div>
                <div className="client-rows-right">
                <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    onClick={handleAddBesoin}
                    >
                    Besoin
                </Button>
                <Button
                    icon={<PrinterOutlined />}
                    onClick={() => window.print()}
                >
                    Print
                </Button>
            </div>
            </div>
            <Table
                columns={nestedColumns}
                dataSource={filteredData}
                loading={loading}
                pagination={false}
                rowKey="id_projet"
                bordered
                size="middle"
            />
        </div>
      </div>
      <Modal
        title=""
        visible={modalType === 'AddBesoin'}
        onCancel={closeAllModals}
        footer={null}
        width={800}
        centered
      >
        <ProjetBesoin idProjet={''} fetchData={fetchData} closeModal={closeAllModals}/>
      </Modal>
    </>
  );
};

export default BesoinInactif;
