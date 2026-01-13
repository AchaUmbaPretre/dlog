import React, { useMemo, useState } from "react";
import { Table, Tag, Card, Space, DatePicker, Input, notification } from "antd";
import { usePresenceData } from "./hooks/usePresenceData";
import { postPresence } from "../../services/presenceService";

const { Search } = Input;
const { MonthPicker } = DatePicker;

const Presence = () => {
    const [searchValue, setSearchValue] = useState("");   
    const { data, loading, reload, dateRange, setDateRange } = usePresenceData();

    const renderStatut = (statut) => {
        const map = {
        PRESENT: { label: "✔", color: "green" },
        ABSENT: { label: "✖", color: "red" },
        CONGE: { label: "C", color: "blue" },
        FERIE: { label: "F", color: "purple" },
        NON_TRAVAILLE: { label: "—", color: "gray" }
        };
        return map[statut] ? <Tag color={map[statut].color}>{map[statut].label}</Tag> : null;
    };

  const handleClickCell = async (userId, date, statut) => {
    if (statut !== "ABSENT") {
      notification.warning({ message: "Action non autorisée", description: `Impossible de pointer sur un jour ${statut}` });
      return;
    }
    try {
      await postPresence({ id_utilisateur: userId, date_presence: date, heure_entree: new Date().toISOString(), source: 1 });
      notification.success({ message: "Présence enregistrée" });
      reload();
    } catch (err) {
      notification.error({ message: "Erreur", description: err?.response?.data?.message || "Impossible d'enregistrer la présence" });
    }
  };

  const columns = useMemo(() => {
    if (!data) return [];
    return [
      { title: "Utilisateur", dataIndex: "nom", fixed: "left", width: 220 },
      ...data.dates.map(d => ({
        title: d.label,
        dataIndex: d.date,
        align: "center",
        render: (statut, record) => {
          const clickable = statut === "ABSENT";
          return (
            <div
              onClick={() => clickable && handleClickCell(record.id_utilisateur, d.date, statut)}
              style={{ cursor: clickable ? "pointer" : "not-allowed", opacity: clickable ? 1 : 0.5 }}
            >
              {renderStatut(statut)}
            </div>
          );
        }
      }))
    ];
  }, [data]);

  const dataSource = useMemo(() => {
    if (!data) return [];
    return data.utilisateurs.map(u => ({ key: u.id_utilisateur, id_utilisateur: u.id_utilisateur, nom: u.nom, ...u.presences }));
  }, [data]);

  return (
    <Card 
        title="Planning des présences"
        bordered={false}
        extra={
            <Space wrap>
                <Search
                    placeholder="Recherche..."
                    allowClear
                    onChange={(e) => setSearchValue(e.target.value)}
                    style={{ width: 260 }}
                />
                <MonthPicker
                    placeholder="Sélectionner un mois"
                    format="MMMM YYYY"
                    onChange={(date) => {
                        if (!date) {
                        setDateRange(null);
                        return;
                        }

                        setDateRange({
                        month: date.month() + 1,
                        year: date.year()
                        });
                    }}
                />

            </Space>
        }
    >
      <Table columns={columns} dataSource={dataSource} loading={loading} scroll={{ x: "max-content" }} bordered pagination={false} />
    </Card>
  );
};

export default Presence;
