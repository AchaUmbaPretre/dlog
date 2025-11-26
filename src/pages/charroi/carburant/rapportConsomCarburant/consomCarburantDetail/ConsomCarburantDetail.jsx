import React from 'react';
import ConsomDetailSite from './consomDetailSite/ConsomDetailSite';
import ConsomDetailVehicule from './consomDetailVehicule/ConsomDetailVehicule';

const ConsomCarburantDetail = ({ spectreValue, siteAllData, siegeData, loading  }) => {

  const views = {
    mesSites: () => <ConsomDetailSite siteAllData={siteAllData} loading={loading} />,
    mesVehicules: () => <ConsomDetailVehicule siegeData={siegeData} loading={loading} />,
  };

  const SelectedView = views[spectreValue] || views["mesVehicules"];

  return (
    <div className="consomCarburantDetail">
      <SelectedView loading={loading}  />
    </div>
  );
};

export default ConsomCarburantDetail;
