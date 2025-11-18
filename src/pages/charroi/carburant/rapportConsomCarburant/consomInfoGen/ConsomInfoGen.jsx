import React from "react";
import "./consomInfoGen.scss";
import { Divider, Card } from "antd";
import ConsomInfoSiegeKin from "./consomInfoSiegeKin/ConsomInfoSiegeKin";
import ConsomInfoSites from "./consomInfoSites/ConsomInfoSites";
import ConsomInfoVehicule from "./consomInfoVehicule/ConsomInfoVehicule";

    
const ConsomInfoGen = ({ siteData, siegeData, parValue, loading }) => {

  return (
    <div className="consomInfoGen">
      <Divider>Informations générales</Divider>

      <div className="consomInfoGen__container">
        <div className="consomInfoGen__row">
          <Card type="inner" title="MES INFOS">
            {
                parValue === 'sites' ? 
                <ConsomInfoSites siteData={siteData} loading={loading} /> : 
                <ConsomInfoVehicule siteData={siteData} loading={loading} />
            }
          </Card>
        </div>

        <div className="consomInfoGen__row">
          <ConsomInfoSiegeKin siegeData={siegeData} />
        </div>
      </div>
    </div>
  );
};

export default ConsomInfoGen;
