import React from "react";
import "./consomInfoGen.scss";
import { Divider, Card, Table, Tag, Tooltip, Typography } from "antd";
import ConsomInfoSiegeKin from "./consomInfoSiegeKin/ConsomInfoSiegeKin";
import ConsomInfoSites from "./consomInfoSites/ConsomInfoSites";

const { Text } = Typography;
    
const ConsomInfoGen = ({ siteData, siegeData, loading }) => {
  // Sécurisation : siteData sera toujours un tableau
  const dataSource = Array.isArray(siteData) ? siteData : [];

  return (
    <div className="consomInfoGen">
      <Divider>Informations générales</Divider>

      <div className="consomInfoGen__container">
        <div className="consomInfoGen__row">
          <Card type="inner" title="MES SITES">
            <ConsomInfoSites siteData={siteData} loading={loading} />
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
