import React, { useState, useEffect } from 'react';
import { Table, Card, Tooltip, Space, Typography, Input, Spin, Modal, Button } from "antd";
import { getPresenceDashboardParSiteById } from '../../../../services/presenceService';

const { Search } = Input;
const { Text } = Typography;

const DetailKpisPresenceToday = ({ sites }) => {
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);

  useEffect(() => {
    if (sites?.length) {
      setData(sites.map(site => ({
        key: site.site_id,
        site_name: site.site_name,
        total_users: site.total_users,
        present_count: site.present.count,
        present_pct: site.present.pct,
        retard_count: site.retard.count,
        retard_pct: site.retard.pct,
        absent_count: site.absence.absent,
        justifie_count: site.absence.justifie,
        absence_pct: site.absence.pct
      })));
      setLoading(false);
    }
  }, [sites]);

  const showSiteDetail = async (site) => {
    setSelectedSite(site);
    setModalVisible(true);
    setModalLoading(true);
    try {
      const res = await getPresenceDashboardParSiteById(site.key);
      if (res.data.success) {
        setModalData(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setModalLoading(false);
    }
  };

  const columns = [
    {
      title: "#",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Site",
      dataIndex: "site_name",
      key: "site_name",
      fixed: "left",
      width: 120,
      render: (text, record) => (
        <Tooltip title={`Voir le détail du site: ${record.site_name}`}>
          <Button type="link" onClick={() => showSiteDetail(record)}>
            {text}
          </Button>
        </Tooltip>
      )
    },
    {
      title: "Nbre employé",
      dataIndex: "total_users",
      key: "total_users",
      align: "center"
    },
    {
      title: "Présents",
      children: [
        { title: "Nombre", dataIndex: "present_count", key: "present_count", align: "center" },
        { title: "%", dataIndex: "present_pct", key: "present_pct", align: "center",  width:'10%', render: pct => <Text>{pct}%</Text> }
      ]
    },
    {
      title: "Retards",
      children: [
        { title: "Nombre", dataIndex: "retard_count", key: "retard_count", align: "center" },
        { title: "%", dataIndex: "retard_pct", key: "retard_pct", align: "center", width:'10%', render: pct => <Text type="warning">{pct}%</Text> }
      ]
    },
    {
      title: "Absences & Justifiées",
      children: [
        { title: "Absent", dataIndex: "absent_count", key: "absent_count", align: "center" },
        { title: "Justifiées", dataIndex: "justifie_count", key: "justifie_count", align: "center" },
        { title: "%", dataIndex: "absence_pct", key: "absence_pct", align: "center", width:'10%', render: pct => <Text type="danger">{pct}%</Text> }
      ]
    }
  ];

  const modalColumns = [
    {
      title: "#",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    { title: "Nom & prénom", dataIndex: "nom_complet", key: "nom_complet" },
    { title: "Statut", dataIndex: "statut", key: "statut" },
    { title: "Retard (min)", dataIndex: "retard_minutes", key: "retard_minutes", align: "center" },
    { title: "Présent", dataIndex: "is_present", key: "is_present", align: "center", render: val => val ? "✅" : "❌" }
  ];

  return (
    <>
      <Card
        title="KPI Présence Aujourd'hui par Site"
        bordered={false}
        bodyStyle={{ padding: 10 }}
        extra={
          <Space wrap size="middle">
            <Search
              placeholder="Recherche site"
              allowClear
              onChange={e => setSearchValue(e.target.value)}
              style={{ width: 280 }}
            />
          </Space>
        }
      >
        {loading ? (
          <Spin tip="Chargement des données..." />
        ) : (
          <Table
            columns={columns}
            dataSource={data.filter(d => d.site_name.toLowerCase().includes(searchValue.toLowerCase()))}
            pagination={false}
            rowKey="key"
            scroll={{ x: "max-content", y: 700 }}
            size="middle"
            sticky
            bordered
          />
        )}
      </Card>

      <Modal
        title={selectedSite ? `Détails du site: ${selectedSite.site_name}` : 'Détails du site'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={1100}
      >
        {modalLoading ? <Spin tip="Chargement des détails..." /> : (
          <Table
            columns={modalColumns}
            dataSource={modalData}
            rowKey="id_utilisateur"
            pagination={{ pageSize: 10 }}
            size="middle"
            bordered
          />
        )}
      </Modal>
    </>
  );
};

export default DetailKpisPresenceToday;