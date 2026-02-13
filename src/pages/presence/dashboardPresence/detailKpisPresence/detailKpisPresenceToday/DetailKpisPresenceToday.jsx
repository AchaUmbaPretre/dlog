import React, { useState, useEffect } from 'react';
import { Table, Card, Space, Typography, Input, Spin } from "antd";

const { Search } = Input;
const { Text } = Typography;

const DetailKpisPresenceToday = ({ sites }) => {
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  // Charger les données depuis props ou API
  useEffect(() => {
    if (sites?.length) {
      // Formater le data pour Table
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

  const columns = [
    {
      title: "Site",
      dataIndex: "site_name",
      key: "site_name",
      fixed: "left",
      width: 100,
      render: text => <Text strong>{text}</Text>
    },
    {
      title: "Employé",
      dataIndex: "total_users",
      key: "total_users",
      align: "center"
    },
    {
      title: "Présents",
      children: [
        {
          title: "Nombre",
          dataIndex: "present_count",
          key: "present_count",
          align: "center"
        },
        {
          title: "%",
          dataIndex: "present_pct",
          key: "present_pct",
          align: "center",
          render: pct => <Text>{pct}%</Text>
        }
      ]
    },
    {
      title: "Retards",
      children: [
        {
          title: "Nombre",
          dataIndex: "retard_count",
          key: "retard_count",
          align: "center"
        },
        {
          title: "%",
          dataIndex: "retard_pct",
          key: "retard_pct",
          align: "center",
          render: pct => <Text type="warning">{pct}%</Text>
        }
      ]
    },
    {
      title: "Absences & Justifiées",
      children: [
        {
          title: "Absent",
          dataIndex: "absent_count",
          key: "absent_count",
          align: "center"
        },
        {
          title: "Justifiées",
          dataIndex: "justifie_count",
          key: "justifie_count",
          align: "center"
        },
        {
          title: "%",
          dataIndex: "absence_pct",
          key: "absence_pct",
          align: "center",
          render: pct => <Text type="danger">{pct}%</Text>
        }
      ]
    }
  ];

  return (
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
          dataSource={data.filter(d =>
            d.site_name.toLowerCase().includes(searchValue.toLowerCase())
          )}
          pagination={false}
          rowKey="key"
          scroll={{ x: "max-content", y: 700 }}
          size="middle"
          sticky
          bordered
        />
      )}
    </Card>
  );
};

export default DetailKpisPresenceToday;
