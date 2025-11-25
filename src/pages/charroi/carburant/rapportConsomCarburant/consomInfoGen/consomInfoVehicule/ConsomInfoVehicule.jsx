import React, { useState } from 'react';
import {
  CarOutlined,
  AppstoreOutlined,
  ArrowRightOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { Card, Table, Tag, Tooltip, Typography, Space } from "antd";
import { formatNumber } from '../../../../../../utils/formatNumber';
import './consomInfoVehicule.scss'
const { Text } = Typography;

const ConsomInfoVehicule = ({ vehiculeData, loading }) => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const columns = [
    {
      title: "#",
      key: "index",
      width: 30,
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: (
        <Space>
          <AppstoreOutlined style={{ color: "#52c41a" }} />
          Marque
        </Space>
      ),
      dataIndex: "nom_marque",
      render: (text) => <Text italic>{text || "N/A"}</Text>,
    },
    {
      title: (
        <Space>
          <CarOutlined style={{ color: "#1890ff" }} />
          Immatr.
        </Space>
      ),
      dataIndex: "immatriculation",
      render: (text) => (
        <Tooltip title={text || "N/A"}>
          <Text code>{text || "N/A"}</Text>
        </Tooltip>
      ),
    },
    {
      title: "Plein",
      dataIndex: "total_pleins",
      render: (text) => <Text type="secondary">{formatNumber(text)}</Text>,
    },
    {
      title: (
        <Space>
          <ArrowRightOutlined style={{ color: "#722ed1" }} />
          Litres
        </Space>
      ),
      dataIndex: "total_litres",
      render: (text) => <Text type="secondary" mark>{formatNumber(text)} L</Text>,
    },
    {
      title: (
        <Space>
          <DashboardOutlined style={{ color: "#eb2f96" }} />
          Km
        </Space>
      ),
      dataIndex: "total_kilometrage",
      render: (text) => <Text type="secondary">{formatNumber(text)} Km</Text>,
    },
  ];

  // Calcul global pour total et moyenne
  const totalGlobal = vehiculeData.reduce(
    (acc, curr) => {
      acc.totalPlein += curr.total_pleins || 0;
      acc.totalLitre += curr.total_litres || 0;
      acc.totalKm += curr.total_kilometrage || 0;
      return acc;
    },
    { totalPlein: 0, totalLitre: 0, totalKm: 0 }
  );

  const moyenneGlobal = (value) =>
    vehiculeData.length ? (value / vehiculeData.length).toFixed(2).toLocaleString('fr-FR') : 0;

  return (
    <Card type="inner" title="MES VEHICULES">
      <Table
        columns={columns}
        dataSource={vehiculeData}
        rowKey={(row) => row.id || Math.random()}
        size="small"
        loading={loading}
        scroll={{ x: 600 }}
        onChange={(pagination) => setPagination(pagination)}
        rowClassName={(_, index) =>
          index % 2 === 0 ? "table-row-light" : "table-row-dark"
        }
        summary={() => (
          <>
            <Table.Summary.Row className="summary-total">
              <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
              <Table.Summary.Cell index={1}></Table.Summary.Cell>
              <Table.Summary.Cell index={2}>{totalGlobal.totalPlein}</Table.Summary.Cell>
              <Table.Summary.Cell index={3}></Table.Summary.Cell>
              <Table.Summary.Cell index={4}>{totalGlobal.totalLitre}</Table.Summary.Cell>
              <Table.Summary.Cell index={5}>{totalGlobal.totalKm}</Table.Summary.Cell>
            </Table.Summary.Row>

            <Table.Summary.Row className="summary-total">
              <Table.Summary.Cell index={0}>Moyenne</Table.Summary.Cell>
              <Table.Summary.Cell index={1}></Table.Summary.Cell>
              <Table.Summary.Cell index={2}>{moyenneGlobal(totalGlobal.totalPlein)}</Table.Summary.Cell>
              <Table.Summary.Cell index={3}></Table.Summary.Cell>
              <Table.Summary.Cell index={4}>{moyenneGlobal(totalGlobal.totalLitre)}</Table.Summary.Cell>
              <Table.Summary.Cell index={5}>{moyenneGlobal(totalGlobal.totalKm)}</Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        )}
      />
    </Card>
  );
};

export default ConsomInfoVehicule;
