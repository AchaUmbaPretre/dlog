import React, { useEffect, useState, useCallback } from 'react';
import {
  Table,
  Button,
  Input,
  Dropdown,
  Menu,
  Space,
  Tooltip,
  Tag,
  Modal,
  notification
} from 'antd';
import {
  ExportOutlined,
  BarcodeOutlined,
  HomeOutlined,
  PhoneOutlined,
  RetweetOutlined,
  EnvironmentOutlined,
  TruckOutlined,
  PrinterOutlined,
  PlusCircleOutlined
} from '@ant-design/icons';

import { getSite } from '../../../../services/charroiService';
import SitesForm from '../sitesForm/SitesForm';
import SiteUserForm from '../siteUser/siteUserForm/SiteUserForm';

const { Search } = Input;

const ListSites = () => {
  /* ===================== STATES ===================== */
  const [loading, setLoading] = useState(false);
  const [sites, setSites] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  const [isAddSiteModalOpen, setIsAddSiteModalOpen] = useState(false);
  const [isSiteUserModalOpen, setIsSiteUserModalOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);

  const scroll = { x: 'max-content' };

  /* ===================== DATA ===================== */
  const fetchSites = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getSite();
      setSites(data?.data || []);
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Impossible de charger la liste des sites.'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  /* ===================== HANDLERS ===================== */
  const openAddSiteModal = () => setIsAddSiteModalOpen(true);
  const closeAddSiteModal = () => setIsAddSiteModalOpen(false);

  const openSiteUserModal = (site) => {
    setSelectedSite(site);
    setIsSiteUserModalOpen(true);
  };

  const closeSiteUserModal = () => {
    setSelectedSite(null);
    setIsSiteUserModalOpen(false);
  };

  const handlePrint = () => window.print();

  const exportMenu = (
    <Menu>
      <Menu.Item key="excel">Exporter vers Excel</Menu.Item>
      <Menu.Item key="pdf">Exporter vers PDF</Menu.Item>
    </Menu>
  );

  /* ===================== COLUMNS ===================== */
  const columns = [
    {
      title: '#',
      width: 60,
      render: (_, __, index) => (
        <Tooltip title={`Ligne ${index + 1}`}>
          <Tag color="blue">{index + 1}</Tag>
        </Tooltip>
      )
    },
    {
      title: 'Code site',
      dataIndex: 'CodeSite',
      render: (text) => (
        <>
          <BarcodeOutlined style={{ marginRight: 6, color: '#1890ff' }} />
          {text}
        </>
      )
    },
    {
      title: 'Nom du site',
      dataIndex: 'nom_site',
      render: (text) => (
        <>
          <HomeOutlined style={{ marginRight: 6, color: '#1890ff' }} />
          {text}
        </>
      )
    },
    {
      title: 'Adresse',
      dataIndex: 'adress',
      render: (text) => (
        <>
          <EnvironmentOutlined style={{ marginRight: 6, color: '#faad14' }} />
          {text}
        </>
      )
    },
    {
      title: 'Ville',
      dataIndex: 'name',
      render: (text) => (
        <>
          <EnvironmentOutlined style={{ marginRight: 6, color: 'red' }} />
          {text}
        </>
      )
    },
    {
      title: 'Téléphone',
      dataIndex: 'tel',
      render: (text) => (
        <>
          <PhoneOutlined style={{ marginRight: 6, color: '#eb2f96' }} />
          {text}
        </>
      )
    },
    {
      title: 'Actions',
      align: 'center',
      width: 120,
      render: (_, record) => (
        <Tooltip title="Associer des utilisateurs au site">
          <Button
            icon={<RetweetOutlined />}
            style={{ color: 'green' }}
            onClick={() => openSiteUserModal(record)}
          />
        </Tooltip>
      )
    }
  ];

  const filteredSites = sites.filter((site) =>
    site.nom_site?.toLowerCase().includes(searchValue.toLowerCase())
  );

  /* ===================== RENDER ===================== */
  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <TruckOutlined className="client-icon" />
            <h2 className="client-h2">Liste des sites</h2>
          </div>

          <div className="client-actions">
            <Search
              placeholder="Rechercher un site..."
              allowClear
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: 300 }}
            />

            <Space>
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={openAddSiteModal}
              >
                Ajouter un site
              </Button>

              <Dropdown overlay={exportMenu}>
                <Button icon={<ExportOutlined />}>Export</Button>
              </Dropdown>

              <Button icon={<PrinterOutlined />} onClick={handlePrint}>
                Imprimer
              </Button>
            </Space>
          </div>

          <Table
            columns={columns}
            dataSource={filteredSites}
            rowKey="id_site"
            loading={loading}
            bordered
            size="small"
            pagination={{ pageSize: 10 }}
            scroll={scroll}
          />
        </div>
      </div>

      {/* MODAL AJOUT SITE */}
      <Modal
        open={isAddSiteModalOpen}
        footer={null}
        width={900}
        centered
        destroyOnClose
        onCancel={closeAddSiteModal}
      >
        <SitesForm closeModal={closeAddSiteModal} fetchData={fetchSites} />
      </Modal>

      {/* MODAL SITE ↔ UTILISATEURS */}
      <Modal
        open={isSiteUserModalOpen}
        footer={null}
        width={900}
        centered
        destroyOnClose
        onCancel={closeSiteUserModal}
      >
        <SiteUserForm
          site={selectedSite}
          closeModal={closeSiteUserModal}
          fetchData={fetchSites}
        />
      </Modal>
    </>
  );
};

export default ListSites;
