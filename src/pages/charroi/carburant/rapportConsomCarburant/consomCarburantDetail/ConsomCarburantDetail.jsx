import React from 'react';
import ConsomDetailSite from './consomDetailSite/ConsomDetailSite';
import ConsomDetailVehicule from './consomDetailVehicule/ConsomDetailVehicule';

const ConsomCarburantDetail = ({ spectreValue, siteAllData, siegeData }) => {
  
  const views = {
    mesSites: <ConsomDetailSite siteAllData={siteAllData} />,
    mesVehicules: <ConsomDetailVehicule siegeData={siegeData} />,
  };

  return (
    <div className="consomCarburantDetail">
      {views[spectreValue] || <ConsomDetailVehicule siegeData={siegeData} />}
    </div>
  );
};

export default ConsomCarburantDetail;
