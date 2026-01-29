import React from 'react';
import './../dashboardSection.scss';

const DashlistePresence = () => {
  return (
    <div className="dashboard-section">
      
      <div className="section-header">
        Liste des employés
      </div>

      <div className="section-body">
        {/* Table Ant Design ici */}
        <span className="section-placeholder">
          Tableau des présences
        </span>
      </div>

    </div>
  );
};

export default DashlistePresence;
