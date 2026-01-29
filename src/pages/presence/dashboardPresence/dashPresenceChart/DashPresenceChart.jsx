import React from 'react';
import './../dashboardSection.scss';

const DashPresenceChart = () => {
  return (
    <div className="dashboard-section">
      
      <div className="section-header">
        Statistiques de présence
      </div>

      <div className="section-body section-body-center">
        {/* Chart viendra ici */}
        <span className="section-placeholder">
          Graphique de présence (en cours)
        </span>
      </div>

    </div>
  );
};

export default DashPresenceChart;
