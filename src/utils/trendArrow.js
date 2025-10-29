import { ArrowUpOutlined, ArrowDownOutlined, MinusOutlined } from "@ant-design/icons";

// --- Composant flèche tendance ---
export const TrendArrow = ({ previous, current }) => {
  if (previous === null || previous === undefined) {
    return current > 0 ? (
      <ArrowUpOutlined className="trend up" />
    ) : (
      <MinusOutlined className="trend neutral" />
    );
  }

  if (current > previous) return <ArrowUpOutlined className="trend up" />;
  if (current < previous) return <ArrowDownOutlined className="trend down" />;
  return <MinusOutlined className="trend neutral" />;
};


  // --- Couleur de la jauge ---
export const getStrokeColor = (value, total = 100) => {
    const percent = total ? (value / total) * 100 : 0;
    if (percent >= 90) return "#52c41a"; // Vert
    if (percent >= 75) return "#faad14"; // Jaune
    return "#ff4d4f"; // Rouge
  };