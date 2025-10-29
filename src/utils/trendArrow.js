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