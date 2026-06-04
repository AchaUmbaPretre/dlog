// StatiCarbItems.jsx
import React from 'react';
import {
  DollarOutlined,
  DashboardOutlined,
  CarOutlined,
  RiseOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { Skeleton } from 'antd';
import "./statiCarbItems.scss";

const StatiCarbItems = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="fuelStats">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="fuelCard">
            <Skeleton active paragraph={{ rows: 2 }} />
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Dépenses",
      value: data?.kpi?.depenses.valeur_formatee || "0 $",
      value_raw: data?.kpi?.depenses.valeur || 0,
      trend: `${Math.abs(data?.kpi?.depenses.tendance || 0)}%`,
      positive: data?.kpi?.depenses.positif || false,
      icon: <DollarOutlined />,
      color: "blue",
    },
    {
      title: "Volume",
      value: data?.kpi?.volume.valeur_formatee || "0 L",
      value_raw: data?.kpi?.volume.valeur || 0,
      trend: `${Math.abs(data?.kpi?.volume.tendance || 0)}%`,
      positive: data?.kpi?.volume.positif || false,
      icon: <DashboardOutlined />,
      color: "cyan",
    },
    {
      title: "Ravitaillements",
      value: data?.kpi?.ravitaillements.valeur_formatee || "0",
      value_raw: data?.kpi?.ravitaillements.valeur || 0,
      trend: `${Math.abs(data?.kpi?.ravitaillements.tendance || 0)}%`,
      positive: data?.kpi?.ravitaillements.positif || false,
      icon: <CarOutlined />,
      color: "purple",
    },
    {
      title: "Coût moyen",
      value: data?.kpi?.coutMoyen.valeur_formatee || "0 $",
      value_raw: data?.kpi?.coutMoyen.valeur || 0,
      trend: `${Math.abs(data?.kpi?.coutMoyen.tendance || 0)}%`,
      positive: data?.kpi?.coutMoyen.positif || false,
      icon: <RiseOutlined />,
      color: "orange",
    },
  ];

  return (
    <div className="fuelStats">
      {stats.map((item, index) => (
        <div
          key={index}
          className={`fuelCard ${item.color}`}
        >
          <div className="fuelCardGlow"></div>

          <div className="fuelCardHeader">
            <div className="fuelCardTitleSection">
              <div className="fuelCardIcon">
                {item.icon}
              </div>

              <span className="fuelCardTitle">
                {item.title}
              </span>
            </div>

            <div
              className={`fuelCardBadge ${
                item.positive ? "positive" : "negative"
              }`}
            >
              {item.positive ? (
                <ArrowUpOutlined />
              ) : (
                <ArrowDownOutlined />
              )}
              {item.trend}
            </div>
          </div>

          <h2 className="fuelCardValue">
            {item.value}
          </h2>

          <div className="fuelCardBottom">
            <span className="fuelCardDesc">
              vs période précédente
            </span>

            <div className="miniBars">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <div className="fuelCardLine"></div>
        </div>
      ))}
    </div>
  );
};

export default StatiCarbItems;