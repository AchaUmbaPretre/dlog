import { Tooltip, Tag } from "antd";
import dayjs from "dayjs";

const STATUTS = {
  PRESENT: { label: "Présent", color: "#52c41a" },
  ABSENT: { label: "Absent", color: "#f5222d" },
  CONGE: { label: "Congé", color: "#1890ff" },
  FERIE: { label: "Férié", color: "#722ed1" },
  NON_TRAVAILLE: { label: "Jour off", color: "#bfbfbf" },
  TRAVAIL: { label: "Jour off", color: "#bfbfbf" }
};

export const PresenceCell = ({ cell, onClick, onRightClick, disabled }) => {
  const isAutoAbsent = cell?.auto_generated;
  const statut = isAutoAbsent
    ? "ABSENT"
    : cell?.statut || (cell?.heure_entree || cell?.heure_sortie ? "PRESENT" : "ABSENT");

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
        onContextMenu={(e) => {
          e.preventDefault();
          if (!disabled && onRightClick) onRightClick();
        }}
        style={{
          cursor: disabled ? "not-allowed" : "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 50,
          width: "100%",
          userSelect: "none"
        }}
      >
        <Tag color={info.color} style={{ fontWeight: 600, fontSize: 12, width: "100%", textAlign: "center" }}>
          {info.label}
        </Tag>
        <div style={{ fontSize: 10, color: "#555" }}>
          {cell?.heure_entree ? dayjs(cell.heure_entree).format("HH:mm") : "--"} / {cell?.heure_sortie ? dayjs(cell.heure_sortie).format("HH:mm") : "--"}
        </div>
      </div>
    </Tooltip>
  );
};
