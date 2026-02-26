import React, { useState } from "react";
import { Card, DatePicker, Button, Space, Input, Table, Progress } from "antd";
import {
  EnvironmentOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileDoneOutlined,
  ClockCircleOutlined,
  FieldTimeOutlined,
  TeamOutlined,
  ExportOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { useRapportPresenceSite } from "./hooks/useRapportPresenceSite";
import { formatDuration } from "../../../utils/renderTooltip";

dayjs.locale("fr");

const { RangePicker } = DatePicker;
const { Search } = Input;

const RapportPresenceSite = () => {
  const [searchValue, setSearchValue] = useState("");

  // Plage par défaut = mois courant
  const [dateRange, setDateRange] = useState([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);

  const { data, loading } = useRapportPresenceSite(dateRange);

  // Filtrage dynamique
  const filteredData = (data || []).filter((item) =>
    item.nom_site?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const exportExcel = () => {
    console.log("Export Excel", filteredData);
  };

  const columns = [
    {
      title: "#",
      key: "index",
      width: 50,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: (
        <>
          <EnvironmentOutlined style={{ marginRight: 6 }} />
          Site
        </>
      ),
      dataIndex: "nom_site",
    },
    {
      title: (
        <>
          <CheckCircleOutlined style={{ marginRight: 6, color: "#52c41a" }} />
          Présents
        </>
      ),
      dataIndex: "total_presents",
    },
    {
      title: (
        <>
          <CloseCircleOutlined style={{ marginRight: 6, color: "#ff4d4f" }} />
          Absents
        </>
      ),
      dataIndex: "total_absents",
    },
    {
      title: (
        <>
          <FileDoneOutlined style={{ marginRight: 6, color: "#1890ff" }} />
          Absences justifiées
        </>
      ),
      dataIndex: "total_absences_justifiees",
    },
    {
      title: (
        <>
          <ClockCircleOutlined style={{ marginRight: 6, color: "#faad14" }} />
          Retards
        </>
      ),
      dataIndex: "total_retard_minutes",
      render :(text) => <>{formatDuration(text)}</>
    },
    {
      title: (
        <>
          <FieldTimeOutlined style={{ marginRight: 6, color: "#722ed1" }} />
          Heures supplémentaires
        </>
      ),
      dataIndex: "total_heures_supplementaires",
    },
    {
      title: (
        <>
          <TeamOutlined style={{ marginRight: 6 }} />
          Employés distincts
        </>
      ),
      dataIndex: "total_employes_distincts",
    },
/*     {
      title: (
        <>
          <CheckCircleOutlined style={{ marginRight: 6, color: "#1890ff" }} />
          % Présence
        </>
      ),
      key: "percent_presence",
      render: (_, record) => {
        const total =
          (record.total_employes_distincts || 0) ||
          1; // éviter division par zéro
        const percent = Math.round(
          ((record.total_presents || 0) / total) * 100
        );
        return <Progress percent={percent} size="small" status="active" />;
      },
    }, */
  ];

  return (
    <Card
      bordered={false}
      title="Rapport des présences par site"
      extra={
        <Space wrap>
          <RangePicker
            format="DD/MM/YYYY"
            value={dateRange}
            onChange={(dates) => {
              if (dates) {
                setDateRange(dates);
              }
            }}
          />

          <Search
            placeholder="Recherche site"
            allowClear
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ width: 250 }}
          />

          <Button icon={<ExportOutlined />} onClick={exportExcel}>
            Exporter Excel
          </Button>
        </Space>
      }
    >
      <Table
        loading={loading}
        dataSource={filteredData}
        rowKey="id_site"
        pagination={{ pageSize: 10 }}
        bordered
        columns={columns}
      />
    </Card>
  );
};

export default RapportPresenceSite;
