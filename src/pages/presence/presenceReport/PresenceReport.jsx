import React, { useMemo, useState } from "react";
import { Card, Table, DatePicker, Button, Space, notification, Input } from "antd";
import { ExportOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import 'dayjs/locale/fr';
import * as XLSX from "xlsx";
import { usePresenceReport } from "./hooks/usePresenceReport";
import { formatDuration } from "../../../utils/renderTooltip";

dayjs.locale('fr');

const { MonthPicker } = DatePicker;
const { Search } = Input;

const PresenceReport = () => {
  const [searchValue, setSearchValue] = useState("");
  const { data, loading, monthRange, setMonthRange } = usePresenceReport();

  const columns = useMemo(() => {
    if (!data?.report) return [];

    return [
      { title: "#", render: (_, __, idx) => idx + 1, width: 50, fixed: "left" },
      { title: "Nom", dataIndex: "nom", width: 180, fixed: "left" },
      { title: "Jours travaillés", dataIndex: "joursTravailles", align: "center", width: 120 },
      { title: "Absences", dataIndex: "absences", align: "center", width: 100 },
      { title: "Retards (min)", dataIndex: "retards", align: "center", width: 100, render:(v) => formatDuration(v)},
      { title: "Heures sup.", dataIndex: "heuresSupp", align: "center", width: 100,  render:(v) => formatDuration(v)},
      { title: "Congés payés", dataIndex: "congesPayes", align: "center", width: 120 },
      { title: "Jours fériés", dataIndex: "joursFerie", align: "center", width: 120 },
      { title: "Non travaillés", dataIndex: "nonTravaille", align: "center", width: 120 }
    ];
  }, [data]);

  // Source de données
  const dataSource = useMemo(() => {
    if (!data?.report) return [];
    return data.report
      .filter(u => u.nom.toLowerCase().includes(searchValue.toLowerCase()))
      .map(u => ({
        key: u.id_utilisateur,
        ...u
      }));
  }, [data, searchValue]);

  const exportExcel = () => {
    if (!dataSource.length) return;

    try {
      const ws = XLSX.utils.json_to_sheet(
        dataSource.map(row => ({
          Nom: row.nom,
          "Jours travaillés": row.joursTravailles,
          Absences: row.absences,
          "Retards (min)": row.retards,
          "Heures sup.": row.heuresSupp,
          "Congés payés": row.congesPayes,
          "Jours fériés": row.joursFerie,
          "Non travaillés": row.nonTravaille
        }))
      );
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Rapport Mensuel");
      XLSX.writeFile(wb, `rapport_mensuel_${dayjs().format("YYYYMM")}.xlsx`);
      notification.success({ message: "Export Excel réussi !" });
    } catch (err) {
      notification.error({ message: "Erreur export Excel", description: err.message });
    }
  };

  return (
    <Card
      bordered={false}
      title="Rapport Mensuel de Présence"
      extra={
        <Space wrap>
          <MonthPicker
            placeholder="Sélectionner le mois"
            format="MMMM YYYY"
            value={dayjs(`${monthRange.year}-${monthRange.month}-01`)}
            onChange={(date) =>
              date &&
              setMonthRange({
                month: date.month() + 1,
                year: date.year()
              })
            }
          />
          <Search
            placeholder="Recherche utilisateur"
            allowClear
            onChange={e => setSearchValue(e.target.value)}
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
        sticky
        pagination={{ pageSize: 20 }}
        bordered
      />
    </Card>
  );
};

export default PresenceReport;
