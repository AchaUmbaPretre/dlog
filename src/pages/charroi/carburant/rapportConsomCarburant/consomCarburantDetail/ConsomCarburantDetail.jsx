import React from 'react';
import ConsomDetailSite from './consomDetailSite/ConsomDetailSite';
import ConsomDetailVehicule from './consomDetailVehicule/ConsomDetailVehicule';

const views = {
  mesSites: <ConsomDetailSite />,
  mesVehicules: <ConsomDetailVehicule />,
};

const ConsomCarburantDetail = ({ spectreValue }) => {
  return (
    <div className="consomCarburantDetail">
      {views[spectreValue] || <ConsomDetailVehicule />}
    </div>
  );
};

export default ConsomCarburantDetail;