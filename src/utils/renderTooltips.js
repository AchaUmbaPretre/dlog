import { Progress, Tooltip } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

export const TooltipCell = ({
  cellText,      // texte affiché dans la cellule
  tooltipText,   // texte affiché dans le tooltip
  bg = '#f0f0f0',
  color = '#000',
  maxWidth = 200,
  fontSize = 15,
  fontWeight = 600,
  border = '1px solid rgba(255,255,255,0.2)',
  boxShadow = '0 2px 6px rgba(0,0,0,0.15)',
  padding = '6px 8px',
  borderRadius = 8,
  textAlign = 'center',
}) => (
  <Tooltip title={tooltipText || '-'}>
    <div
      style={{
        maxWidth,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        backgroundColor: bg,
        color,
        fontWeight,
        fontSize,
        borderRadius,
        padding,
        textAlign,
        border,
        boxShadow,
      }}
    >
      {cellText || '-'}
    </div>
  </Tooltip>
);

// === BOX AVEC TOOLTIP ===
export const TooltipBox = ({ text, bg = '#2f3640', color = '#fff', maxWidth = 255 }) => (
  <Tooltip title={text || '-'}>
    <div
      style={{
        maxWidth,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        backgroundColor: bg,
        color,
        fontWeight: 600,
        fontSize: 15,
        borderRadius: 8,
        padding: '6px 8px',
        textAlign: 'center',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
      }}
    >
      {text || '-'}
    </div>
  </Tooltip>
);

// === FORMATAGE DUREE ===
export const formatDuration = (minutes) => {
  if (minutes == null) return "-";
  const totalMinutes = Math.floor(minutes);
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const mins = totalMinutes % 60;
  let result = "";
  if (days > 0) result += `${days}j `;
  if (hours > 0) result += `${hours}h `;
  result += `${mins}m`;
  return result.trim();
};

// === COULEURS DUREE ===
export const getDurationColor = (elapsedMinutes) => {
  if (elapsedMinutes <= 0) return "#52c41a";        // Vert
  if (elapsedMinutes > 25 && elapsedMinutes <= 60) return "#faad14"; // Orange
  if (elapsedMinutes > 60) return "#ff4d4f";        // Rouge
  return "#52c41a";
};

// === HOOK TEMPS ECOULE ===
export const useElapsedTime = (startTime) => {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!startTime) return;
    const interval = setInterval(() => {
      const diffMinutes = Math.floor(moment().diff(moment(startTime), "minutes", true));
      setElapsed(diffMinutes);
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);
  return elapsed;
};

// === CHRONO DYNAMIQUE ===
export const ChronoBox = ({ sortie_time }) => {
  const elapsedMinutes = useElapsedTime(sortie_time);
  const bgColor = getDurationColor(elapsedMinutes);
  return <TooltipBox text={formatDuration(elapsedMinutes)} bg={bgColor} />;
};

// === DUREE MOYENNE ===
export const MoyenneBox = ({ duree_moyenne_min }) => (
  <TooltipBox text={formatDuration(duree_moyenne_min)} bg="#722ed1" />
);

// === STATUT HORAIRE ===
export const StatutBox = (nom_statut_bs, date_prevue) => {
  if (!nom_statut_bs || !date_prevue) return <TooltipBox text="-" bg="#595959" />;
  const now = moment();
  const prevue = moment(date_prevue);
  const diffMinutes = now.diff(prevue, "minutes");

  let bgColor = "#52c41a";
  let label = "🟢 À l'heure";

  if (diffMinutes > 25 && diffMinutes <= 60) {
    bgColor = "#faad14";
    label = `🟠 ${diffMinutes} min de retard`;
  } else if (diffMinutes > 60) {
    bgColor = "#ff4d4f";
    label = `🔴 ${formatDuration(diffMinutes)} de retard`;
  }

  return <TooltipBox text={label} bg={bgColor} />;
};

// === ECART DYNAMIQUE ===
export const EcartBox = ({ duree_reelle_min, duree_moyenne_min }) => {
  if (duree_moyenne_min == null) return <TooltipBox text="Aucune moyenne" bg="#888" />;

  const diff = duree_moyenne_min - duree_reelle_min;
  let bgColor = "#1890ff";
  let text = `${formatDuration(Math.abs(diff))}`;

  if (diff < 0 && diff >= -60) {
    bgColor = "#faad14";
  } else if (diff < -60) {
    bgColor = "#ff4d4f";
  } else if (diff > 0) {
    bgColor = "#52c41a";
  }

  return <TooltipBox text={text} bg={bgColor} />;
};

// === SCORE ===
export const ScoreBox = (value) => {
  if (value == null) return <TooltipBox text="Aucun" bg="#555" />;

  let color = '#1890ff';
  if (value < 40) color = '#ff4d4f';
  else if (value < 70) color = '#faad14';
  else if (value < 90) color = '#52c41a';
  else color = '#13c2c2';

  return (
    <Tooltip title={`Score: ${value}%`}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          background: '#1e1e1e',
          borderRadius: 50,
          padding: 4,
          boxShadow: 'inset 0 0 6px rgba(0,0,0,0.4)',
        }}
      >
        <Progress
          type="circle"
          percent={value}
          width={90}
          strokeColor={color}
          trailColor="#333"
          format={(p) => (
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>
              {p}%
            </span>
          )}
        />
      </div>
    </Tooltip>
  );
};
