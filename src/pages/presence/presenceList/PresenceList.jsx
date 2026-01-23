import React, { useMemo, useState, useCallback } from "react";
import { Table, Card, Space, DatePicker, Input, Button, Tooltip, Tag, notification } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { usePresenceData } from "../hooks/usePresenceData";
import { postAttendanceAdjustment, postPresence } from "../../../services/presenceService";
import { useSelector } from "react-redux";
import AttendanceAdjustmentModal from "../autorisationSortie/attendanceAdjustmentModal/AttendanceAdjustmentModal";
import { PresenceCell } from "./utils/presenceCell";

const { MonthPicker } = DatePicker;
const { Search } = Input;



const PresenceList = () => {
  const [searchValue, setSearchValue] = useState("");
  const today = dayjs();
  const currentMonth = { month: today.month() + 1, year: today.year() };

  const { data, loading, reload, dateRange, setDateRange } = usePresenceData(currentMonth);
  const { permissions } = useSelector((state) => state.user?.currentUser);
  const [adjustmentOpen, setAdjustmentOpen] = useState(false);
  const [selectedPresence, setSelectedPresence] = useState(null);
  const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);

  const isFutureDate = (date) => dayjs(date).isAfter(today, "day");

  const handleClickCell = useCallback(
    async (userId, date, cell) => {
      if (isFutureDate(date) || !["ABSENT", "PRESENT"].includes(cell?.statut)) return;

      const payload = { id_utilisateur: userId, date_presence: date, source: 1, permissions };
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

  const columns = useMemo(() => {
    if (!data) return [];

    const dynamicColumns = data.dates.map((d) => ({
      title: d.label,
      dataIndex: d.date,
      align: "center",
      width: 100,
     render: (cell, record) => {
  const disabled =
    isFutureDate(d.date) ||
    cell?.adjustment_statut === "VALIDE" ||
    !["ABSENT", "PRESENT"].includes(cell?.statut);

  return (
    <PresenceCell
      cell={cell || {}}
      disabled={disabled}
      onClick={() =>
        handleClickCell(record.id_utilisateur, d.date, cell)
      }
      onRightClick={() => {
        setSelectedPresence({
          id_presence: cell?.id_presence,
          date: d.date,
          nom: record.nom
        });
        setAdjustmentOpen(true);
      }}
    />
  );
}

    }));

    dynamicColumns.push({
      title: "Total",
      dataIndex: "total",
      fixed: "right",
      width: 80,
      align: "center",
      render: (_, record) => {
        const total = Object.values(record)
          .filter((v) => v?.statut === "PRESENT")
          .length;
        return <strong>{total}</strong>;
      }
    });

    return [
      { title: "#", fixed: "left", width: 50, render: (_, __, index) => index + 1 },
      { title: "Utilisateur", dataIndex: "nom", fixed: "left", width: 150, render: (text, record) => <strong>{`${record.nom} - ${record.prenom}`}</strong> },
      ...dynamicColumns
    ];
  }, [data, handleClickCell]);

  const dataSource = useMemo(() => {
    if (!data) return [];
    return data.utilisateurs
      .filter((u) => u.nom.toLowerCase().includes(searchValue.toLowerCase()))
      .map((u) => ({
        key: u.id_utilisateur,
        id_utilisateur: u.id_utilisateur,
        nom: u.nom,
        prenom:u.prenom,
        ...u.presences
      }));
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
        pagination={false}
        rowKey="id_utilisateur"
        scroll={{ x: "max-content", y: 600 }}
        size="middle"
        sticky
        bordered
      />

      {adjustmentOpen && selectedPresence && (
  <AttendanceAdjustmentModal
    open={adjustmentOpen}
    presence={selectedPresence}
    onClose={() => setAdjustmentOpen(false)}
    onSubmit={async (values) => {
      try {
        await postAttendanceAdjustment({
          id_presence: selectedPresence.id_presence,
          created_by: userId,
          ...values
        });

        notification.success({
          message: "Demande envoyée",
          description: "La demande sera traitée par les RH"
        });

        setAdjustmentOpen(false);
        reload();
      } catch (err) {
        notification.error({
          message: "Erreur",
          description:
            err?.response?.data?.message ||
            "Impossible de soumettre la demande"
        });
      }
    }}
  />
)}

    </Card>
  );
};

export default PresenceList;
