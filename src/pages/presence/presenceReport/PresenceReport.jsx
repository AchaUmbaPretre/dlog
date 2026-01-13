import React, { useMemo, useState } from "react";
import { Card, Table, DatePicker, Button, Space, Tag, notification, Input, Tooltip } from "antd";
import { ExportOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { usePresenceReport } from "./hooks/usePresenceReport";

const { RangePicker } = DatePicker;
const { Search } = Input;

const STATUTS = {
  PRESENT: { label: "Présent", color: "#52c41a" },
  ABSENT: { label: "Absent", color: "#f5222d" },
  CONGE: { label: "Congé", color: "#1890ff" },
  FERIE: { label: "Férié", color: "#722ed1" },
  NON_TRAVAILLE: { label: "Non travaillé", color: "#bfbfbf" }
};

const PresenceCell = ({ presence }) => {
  const statut = presence.statut || (presence.heure_entree || presence.heure_sortie ? "PRESENT" : "ABSENT");
  const info = STATUTS[statut];

  return (
    <Tooltip
      title={
        presence.heure_entree || presence.heure_sortie
          ? `Entrée: ${presence.heure_entree ? dayjs(presence.heure_entree).format("HH:mm") : "--"} | Sortie: ${
              presence.heure_sortie ? dayjs(presence.heure_sortie).format("HH:mm") : "--"
            }`
          : info.label
      }
    >
      <Tag color={info.color} style={{ width: "100%", textAlign: "center", fontWeight: 600 }}>
        {info.label}
      </Tag>
    </Tooltip>
  );
};

const PresenceReport = () => {
  const [searchValue, setSearchValue] = useState("");
  const [dateRangeFilter, setDateRangeFilter] = useState(null);
  const { data, loading } = usePresenceReport(dateRangeFilter);

  const columns = useMemo(() => {
    if (!data?.dates) return [];
    return [
      { title: "#", render: (_, __, idx) => idx + 1, width: 50, fixed: "left" },
      { title: "Utilisateur", dataIndex: "nom", width: 200, fixed: "left" },
      ...data.dates.map((date) => ({
        title: dayjs(date).format("DD/MM"),
        dataIndex: date,
        align: "center",
        width: 100,
        render: (cell) => <PresenceCell presence={cell || {}} />
      }))
    ];
  }, [data]);

  const dataSource = useMemo(() => {
    if (!data?.report) return [];
    return data.report
      .filter((u) => u.nom.toLowerCase().includes(searchValue.toLowerCase()))
      .map((u) => {
        const row = { key: u.id_utilisateur, nom: u.nom };
        data.dates.forEach((d) => {
          row[d] = u.presences[d] || {};
        });
        return row;
      });
  }, [data, searchValue]);

  const exportExcel = () => {
    if (!dataSource.length) return;
    try {
      const ws = XLSX.utils.json_to_sheet(
        dataSource.map((row) => {
          const rowCopy = { nom: row.nom };
          data.dates.forEach((d) => {
            const p = row[d] || {};
            rowCopy[d] = p.statut || (p.heure_entree || p.heure_sortie ? "PRESENT" : "ABSENT");
          });
          return rowCopy;
        })
      );
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Rapport Présences");
      XLSX.writeFile(wb, `rapport_presences_${dayjs().format("YYYYMMDD_HHmm")}.xlsx`);
      notification.success({ message: "Export Excel réussi !" });
    } catch (err) {
      notification.error({ message: "Erreur export Excel", description: err.message });
    }
  };

  return (
    <Card
      bordered={false}
      title="Rapport des présences"
      extra={
        <Space wrap>
          <RangePicker onChange={setDateRangeFilter} format="DD/MM/YYYY" />
          <Search
            placeholder="Recherche utilisateur"
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
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowKey="key"
        scroll={{ x: "max-content", y: 600 }}
        size="middle"
        bordered
        sticky
        pagination={{ pageSize: 20 }}
      />
    </Card>
  );
};

export default PresenceReport;
