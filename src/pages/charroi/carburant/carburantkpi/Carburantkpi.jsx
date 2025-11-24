import React from "react";
import "./carburantKpi.scss";

const CarburantKpi = ({ icon, title, value, color }) => {
  return (
    <div className="kpi-cards">
      <div className="kpi-icons" style={{ background: color }}>
        {icon}
      </div>

      <div className="kpi-contents">
        <div className="kpi-titles">{title}</div>
        <div className="kpi-bars"></div>
        <div className="kpi-values">{value}</div>
      </div>
    </div>
  );
};

export default CarburantKpi;
