import React from "react";
import "./consomInfoGen.scss";
import { Divider, Card } from "antd";
import ConsomInfoSiegeKin from "./consomInfoSiegeKin/ConsomInfoSiegeKin";
import ConsomInfoSites from "./consomInfoSites/ConsomInfoSites";
import ConsomInfoVehicule from "./consomInfoVehicule/ConsomInfoVehicule";

    
const ConsomInfoGen = ({ siteData, siegeData, parValue, vehiculeData, loading }) => {

  return (
    <div className="consomInfoGen">
      <div className="consomInfoGen__container">
        <div className="consomInfoGen__row">
            {
                parValue === 'sites' ? 
                <ConsomInfoSites siteData={siteData} loading={loading} /> :
                <ConsomInfoVehicule vehiculeData={vehiculeData} loading={loading} />
            }

        </div>

        <div className="consomInfoGen__row">
          <ConsomInfoSiegeKin siegeData={siegeData} />
        </div>
      </div>
    </div>
  );
};

export default ConsomInfoGen;
