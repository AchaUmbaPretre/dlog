// presenceCell.js
import { Tooltip, Tag } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const STATUTS = {
  PRESENT: { label: "Présent", color: "#52c41a" },
  ABSENT: { label: "Absent", color: "#f5222d" },
  ABSENCE_JUSTIFIEE: { label: "Absence justifiée", color: "#faad14" },
  JOUR_FERIE: { label: "Jour férié", color: "#722ed1" },
  JOUR_NON_TRAVAILLE: { label: "Jour off", color: "#bfbfbf" },
  SUPPLEMENTAIRE: { label: "Supplémentaire", color: "#13c2c2" },
};

const DEFAULT_STATUT = { label: "--", color: "#d9d9d9" };

export const PresenceCell = ({ cell = {}, onClick, onRightClick, disabled }) => {

  const statut = cell?.statut || "ABSENT";

  const info = STATUTS[statut] || DEFAULT_STATUT;

const formatHeure = (heure) => {
  if (!heure) return "--";
  return dayjs(heure).format("HH:mm");
};

  return (
    <Tooltip
      title={
        cell?.heure_entree || cell?.heure_sortie
          ? `Entrée: ${formatHeure(cell.heure_entree)} | Sortie: ${formatHeure(cell.heure_sortie)}`
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
        <Tag
          color={info.color}
          style={{
            fontWeight: 600,
            fontSize: 12,
            width: "100%",
            textAlign: "center"
          }}
        >
          {info.label}
        </Tag>

        <div style={{ fontSize: 10, color: "#555" }}>
          {formatHeure(cell?.heure_entree)} / {formatHeure(cell?.heure_sortie)}
        </div>
      </div>
    </Tooltip>
  );
};
