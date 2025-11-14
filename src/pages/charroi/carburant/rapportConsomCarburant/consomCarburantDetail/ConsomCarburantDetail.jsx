import React from 'react';
import ConsomDetailSite from './consomDetailSite/ConsomDetailSite';
import ConsomDetailVehicule from './consomDetailVehicule/ConsomDetailVehicule';

const ConsomCarburantDetail = ({ spectreValue }) => {
  return (
    <div className="consomCarburantDetail">
      {spectreValue === 'mesSites' ? (
        <ConsomDetailSite />
      ) : (
        <ConsomDetailVehicule />
      )}
    </div>
  );
};

export default ConsomCarburantDetail;
