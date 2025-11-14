import React from 'react';
import ConsomDetailSite from './consomDetailSite/ConsomDetailSite';
import ConsomDetailVehicule from './consomDetailVehicule/ConsomDetailVehicule';

const ConsomCarburantDetail = ({ spectreValue, siteAllData, siegeData }) => {

  const views = {
    mesSites: () => <ConsomDetailSite siteAllData={siteAllData} />,
    mesVehicules: () => <ConsomDetailVehicule siegeData={siegeData} />,
  };

  const SelectedView = views[spectreValue] || views["mesVehicules"];

  return (
    <div className="consomCarburantDetail">
      <SelectedView />
    </div>
  );
};

export default ConsomCarburantDetail;
