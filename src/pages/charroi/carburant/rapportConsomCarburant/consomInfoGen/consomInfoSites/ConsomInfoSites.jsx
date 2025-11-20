import React from 'react'
import {
  EnvironmentOutlined,
  CarOutlined,
  ArrowRightOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { Card, Table, Tag, Tooltip, Typography } from "antd";
import { formatNumber } from '../../../../../../utils/formatNumber';
const { Text } = Typography;

const ConsomInfoSites = ({siteData, loading}) => {

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
        <>
          <EnvironmentOutlined style={{ color: "#52c41a" }} /> Mes Sites
        </>
      ),
      dataIndex: "nom_site",
      render: (text) => (
        <Tooltip title="Nom du site">
          <Tag color="green">{text || "—"}</Tag>
        </Tooltip>
      ),
    },
    {
      title: "Plein",
      dataIndex: "total_pleins",
      render: (text) => (
        <Text type="secondary">{formatNumber(text)}</Text>
      ),
    },
    {
      title: (
        <>
          <CarOutlined style={{ color: "#1890ff" }} /> Véhicule
        </>
      ),
      dataIndex: "nbre_vehicule",
      render: (text) => (
        <Text type="secondary">{text}</Text>
      ),
    },
    {
      title: (
        <>
          <ArrowRightOutlined style={{ color: "#722ed1" }} /> Litres
        </>
      ),
      dataIndex: "total_litres",
      render: (text) => (
        <Text type="secondary">{formatNumber(text)}</Text>
      ),
    },
    {
      title: (
        <>
          <DashboardOutlined style={{ color: "#eb2f96" }} /> Km
        </>
      ),
      dataIndex: "total_kilometrage",
      render: (text) => (
        <Text type="secondary">{formatNumber(text)}</Text>
      ),
    },
  ];

  return (
    <div>
        <Card type="inner" title="MES SITES">
            <Table
              columns={columns}
              dataSource={siteData}
              rowKey={(row) => row.id || Math.random()}
              size="small"
              loading={loading}
              scroll={{ x: 400 }}
              pagination={false}
              rowClassName={(_, index) =>
                index % 2 === 0 ? "table-row-light" : "table-row-dark"
              }
              summary={(pageData) => {
                if (!pageData || pageData.length === 0) {
                  return (
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0}>
                        Aucune donnée
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} colSpan={5}></Table.Summary.Cell>
                    </Table.Summary.Row>
                  );
                }

                let totalPlein = 0;
                let totalVehicule = 0;
                let totalLitre = 0;
                let totalKm = 0;

                pageData.forEach((d) => {
                  totalPlein += d.total_pleins || 0;
                  totalVehicule += d.nbre_vehicule || 0;
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
                      <Table.Summary.Cell index={2}>{formatNumber(totalPlein)}</Table.Summary.Cell>
                      <Table.Summary.Cell index={3}>{formatNumber(totalVehicule)}</Table.Summary.Cell>
                      <Table.Summary.Cell index={4}>{formatNumber(totalLitre)}</Table.Summary.Cell>
                      <Table.Summary.Cell index={5}>{formatNumber(totalKm)}</Table.Summary.Cell>
                    </Table.Summary.Row>

                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0}>Moyenne</Table.Summary.Cell>
                      <Table.Summary.Cell index={1}></Table.Summary.Cell>
                      <Table.Summary.Cell index={2}>
                        {moyenne(totalPlein)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={3}>
                        {moyenne(totalVehicule)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={4}>
                        {moyenne(totalLitre)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={5}>
                        {moyenne(totalKm)}
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                );
              }}
            />
        </Card>
    </div>
  )
}

export default ConsomInfoSites