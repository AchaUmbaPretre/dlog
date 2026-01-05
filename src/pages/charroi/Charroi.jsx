import { useState } from "react";
import { Tabs } from "antd";
import {
  CarOutlined,
  AppstoreOutlined,
  TagsOutlined,
} from "@ant-design/icons";

import Vehicule from "./vehicule/Vehicule";
import Modele from "../modeles/Modele";
import Marque from "../marque/Marque";

const Charroi = () => {
  const [activeKey, setActiveKey] = useState("1");

  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  const tabItems = [
    {
      key: "1",
      label: (
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <CarOutlined style={{ color: "#1890ff" }} />
          Véhicules
        </span>
      ),
      children: <Vehicule />,
    },
    {
      key: "2",
      label: (
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <AppstoreOutlined style={{ color: "#faad14" }} />
          Modèles
        </span>
      ),
      children: <Modele />,
    },
    {
      key: "3",
      label: (
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <TagsOutlined style={{ color: "rgb(255, 85, 0)" }} />
          Marques
        </span>
      ),
      children: <Marque />,
    },
  ];

  return (
    <Tabs
      activeKey={activeKey}
      onChange={handleTabChange}
      type="card"
      tabPosition="top"
      items={tabItems}
      destroyInactiveTabPane
    />
  );
};

export default Charroi;
