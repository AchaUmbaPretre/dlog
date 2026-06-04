import React from "react";
import {
  DollarOutlined,
  DashboardOutlined,
  CarOutlined,
  RiseOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";

import "./statiCarbItems.scss";

const stats = [
  {
    title: "Dépenses",
    value: "24 560 $",
    trend: "+12.5%",
    positive: true,
    icon: <DollarOutlined />,
    color: "blue",
  },
  {
    title: "Volume",
    value: "8 652 L",
    trend: "+8.7%",
    positive: true,
    icon: <DashboardOutlined />,
    color: "cyan",
  },
  {
    title: "Ravitaillements",
    value: "156",
    trend: "+5.3%",
    positive: true,
    icon: <CarOutlined />,
    color: "purple",
  },
  {
    title: "Coût moyen",
    value: "1.42 $",
    trend: "-2.1%",
    positive: false,
    icon: <RiseOutlined />,
    color: "orange",
  },
];

const StatiCarbItems = () => {
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
                item.positive
                  ? "positive"
                  : "negative"
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