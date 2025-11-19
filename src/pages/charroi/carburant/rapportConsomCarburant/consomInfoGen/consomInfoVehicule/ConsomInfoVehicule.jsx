import React from 'react'
import {
  CarOutlined,
  AppstoreOutlined,
  ArrowRightOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { Card, Table, Tag, Tooltip, Typography, Space } from "antd";
const { Text } = Typography;

const ConsomInfoVehicule = ({vehiculeData, loading}) => {

  const columns = [
    {
      title: "#",
      render: (_, __, index) => (
        <Tooltip title={`Ligne ${index + 1}`}>
          <Tag color="blue">{index + 1}</Tag>
        </Tooltip>
      ),
      width: "3%",
    },
    {
      title: (
        <Space>
          <AppstoreOutlined style={{ color: "#52c41a" }} />
          Marque
        </Space>
      ),
      dataIndex: "nom_marque",
      render: (text) => (
          <Text color="green">{text || "N/A"}</Text>
      ),
    },
    {
      title: (
        <Space>
          <CarOutlined style={{ color: "#1890ff" }} />
          Véhicule
        </Space>
      ),
      dataIndex: "immatriculation",
      render: (text) => (
        <Tooltip title={text || "N/A"}>
          <Tag color="blue">{text || "N/A"}</Tag>
        </Tooltip>
      ),
    },
    {
      title: "Plein",
      dataIndex: "total_pleins",
      render: (text) => <Text type="secondary">{text}</Text>,
    },
    {
      title: (
        <Space>
          <ArrowRightOutlined style={{ color: "#722ed1" }} />
          Litres
        </Space>
      ),
      dataIndex: "total_litres",
      render: (text) => <Text type="secondary">{text}</Text>,
    },
    {
      title: (
        <Space>
          <DashboardOutlined style={{ color: "#eb2f96" }} />
          Km
        </Space>
      ),
      dataIndex: "total_kilometrage",
      render: (text) => <Text type="secondary">{text}</Text>,
    },
  ];

  return (
    <Card type="inner" title="MES VEHICULES">
      <Table
        columns={columns}
        dataSource={vehiculeData}
        rowKey={(row) => row.id || Math.random()}
        size="small"
        loading={loading}
        scroll={{ x: 600 }}
        pagination={false}
        rowClassName={(_, index) =>
          index % 2 === 0 ? "table-row-light" : "table-row-dark"
        }
        summary={(pageData) => {
          if (!pageData || pageData.length === 0) {
            return (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>Aucune donnée</Table.Summary.Cell>
                <Table.Summary.Cell index={1} colSpan={5}></Table.Summary.Cell>
              </Table.Summary.Row>
            );
          }

          let totalPlein = 0;
          let totalLitre = 0;
          let totalKm = 0;

          pageData.forEach((d) => {
            totalPlein += d.total_pleins || 0;
            totalLitre += d.total_litres || 0;
            totalKm += d.total_kilometrage || 0;
          });

          const moyenne = (value) =>
            pageData.length ? (value / pageData.length).toFixed(2) : 0;

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
                <Table.Summary.Cell index={1}></Table.Summary.Cell>
                <Table.Summary.Cell index={2}>{totalPlein}</Table.Summary.Cell>
                <Table.Summary.Cell index={3}></Table.Summary.Cell>
                <Table.Summary.Cell index={4}>{totalLitre}</Table.Summary.Cell>
                <Table.Summary.Cell index={5}>{totalKm}</Table.Summary.Cell>
              </Table.Summary.Row>

              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>Moyenne</Table.Summary.Cell>
                <Table.Summary.Cell index={1}></Table.Summary.Cell>
                <Table.Summary.Cell index={2}>{moyenne(totalPlein)}</Table.Summary.Cell>
                <Table.Summary.Cell index={3}></Table.Summary.Cell>
                <Table.Summary.Cell index={4}>{moyenne(totalLitre)}</Table.Summary.Cell>
                <Table.Summary.Cell index={5}>{moyenne(totalKm)}</Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
    </Card>
  )
}

export default ConsomInfoVehicule;
