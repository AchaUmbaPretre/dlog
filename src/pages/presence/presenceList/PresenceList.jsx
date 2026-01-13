import React, { useMemo, useState, useCallback } from "react";
import { Table, Card, Space, DatePicker, Input, Button, Tooltip, Tag, notification } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { usePresenceData } from "../hooks/usePresenceData";
import { postPresence } from "../../../services/presenceService";

const { MonthPicker } = DatePicker;
const { Search } = Input;

// Mapping statuts
const STATUTS = {
  PRESENT: { label: "Présent", color: "#52c41a" },
  ABSENT: { label: "Absent", color: "#f5222d" },
  CONGE: { label: "Congé", color: "#1890ff" },
  FERIE: { label: "Férié", color: "#722ed1" },
  NON_TRAVAILLE: { label: "Non travaillé", color: "#bfbfbf" }
};

// Cellule de présence
const PresenceCell = ({ cell, onClick, disabled }) => {
  const statut = cell?.statut || (cell?.heure_entree || cell?.heure_sortie ? "PRESENT" : "ABSENT");
  const info = STATUTS[statut];

  return (
    <Tooltip
      title={
        cell?.heure_entree || cell?.heure_sortie
          ? `Entrée: ${cell.heure_entree ? dayjs(cell.heure_entree).format("HH:mm") : "--"} | Sortie: ${cell.heure_sortie ? dayjs(cell.heure_sortie).format("HH:mm") : "--"}`
          : info.label
      }
    >
      <div
        onClick={!disabled ? onClick : undefined}
        style={{
          cursor: disabled ? "not-allowed" : "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 55,
          width: "100%",
          borderRadius: 4,
          transition: "all 0.2s",
          backgroundColor: disabled ? "#f5f5f5" : "#fff",
          opacity: disabled ? 0.5 : 1,
          userSelect: "none",
        }}
      >
        <Tag color={info.color} style={{ fontWeight: 600, width: "100%", textAlign: "center" }}>
          {info.label}
        </Tag>
        <div style={{ fontSize: 10, color: "#555" }}>
          {cell?.heure_entree ? dayjs(cell.heure_entree).format("HH:mm") : "--"} / {cell?.heure_sortie ? dayjs(cell.heure_sortie).format("HH:mm") : "--"}
        </div>
      </div>
    </Tooltip>
  );
};

const PresenceList = () => {
  const [searchValue, setSearchValue] = useState("");
  const today = dayjs();
  const currentMonth = { month: today.month() + 1, year: today.year() };

  const { data, loading, reload, dateRange, setDateRange } = usePresenceData(currentMonth);

  const isFutureDate = (date) => dayjs(date).isAfter(today, "day");
  const isWeekend = (date) => [0, 6].includes(dayjs(date).day());

  const handleClickCell = useCallback(
    async (userId, date, cell) => {
      if (isFutureDate(date) || !["ABSENT", "PRESENT"].includes(cell.statut)) return;

      const payload = { id_utilisateur: userId, date_presence: date, source: 1 };
      if (!cell.heure_entree) payload.heure_entree = new Date().toISOString();
      else if (!cell.heure_sortie) payload.heure_sortie = new Date().toISOString();
      else return notification.info({ message: "Déjà pointé", description: "Les deux pointages sont effectués" });

      try {
        await postPresence(payload);
        notification.success({ message: "Présence enregistrée" });
        reload();
      } catch (err) {
        notification.error({
          message: "Erreur",
          description: err?.response?.data?.message || "Impossible d'enregistrer la présence"
        });
      }
    },
    [reload]
  );

  // Colonnes dynamiques
  const columns = useMemo(() => {
    if (!data) return [];
    return [
      { title: "#", fixed: "left", width: 50, render: (_, __, index) => index + 1 },
      { title: "Utilisateur", dataIndex: "nom", fixed: "left", width: 220, render: (text) => <strong>{text}</strong> },
      ...data.dates.map((d) => ({
        title: d.label,
        dataIndex: d.date,
        align: "center",
        width: 100,
        onCell: () => ({ style: { backgroundColor: isWeekend(d.date) ? "#fafafa" : "#fff" } }),
        render: (cell, record) => {
          const disabled = isFutureDate(d.date) || !["ABSENT", "PRESENT"].includes(cell?.statut);
          return (
            <PresenceCell
              cell={cell || {}}
              disabled={disabled}
              onClick={() => handleClickCell(record.id_utilisateur, d.date, cell)}
            />
          );
        }
      }))
    ];
  }, [data, handleClickCell]);

  const dataSource = useMemo(() => {
    if (!data) return [];
    return data.utilisateurs
      .filter((u) => u.nom.toLowerCase().includes(searchValue.toLowerCase()))
      .map((u) => ({ key: u.id_utilisateur, id_utilisateur: u.id_utilisateur, nom: u.nom, ...u.presences }));
  }, [data, searchValue]);

  const changeMonth = (offset) => {
    const base = dayjs(`${dateRange.year}-${dateRange.month}-01`).add(offset, "month");
    setDateRange({ month: base.month() + 1, year: base.year() });
  };

  return (
    <Card
      title="Planning des présences"
      bordered={false}
      bodyStyle={{ padding: 16 }}
      extra={
        <Space wrap size="middle">
          <Button icon={<LeftOutlined />} onClick={() => changeMonth(-1)} />
          <MonthPicker
            format="MMMM YYYY"
            value={dayjs(`${dateRange.year}-${String(dateRange.month).padStart(2, "0")}-01`)}
            onChange={(date) => date && setDateRange({ month: date.month() + 1, year: date.year() })}
          />
          <Button icon={<RightOutlined />} onClick={() => changeMonth(1)} />
          <Search
            placeholder="Recherche utilisateur"
            allowClear
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ width: 280 }}
          />
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        bordered
        pagination={false}
        rowKey="id_utilisateur"
        scroll={{ x: "max-content", y: 600 }}
        size="middle"
        sticky
        rowClassName={(record, index) => (index % 2 === 0 ? "even-row" : "odd-row")}
      />
      <style jsx>{`
        .even-row { background-color: #ffffff; }
        .odd-row { background-color: #fafafa; }
        .ant-table-thead > tr > th {
          background-color: #f0f2f5;
          font-weight: 600;
          font-size: 13px;
        }
        .ant-table-tbody > tr:hover { background-color: #e6f7ff; }
      `}</style>
    </Card>
  );
};

export default PresenceList;
