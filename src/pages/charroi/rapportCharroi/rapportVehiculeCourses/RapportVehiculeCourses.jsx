import { useState } from "react";
import { Tabs } from "antd";
import {
  CarOutlined,
  GlobalOutlined
} from "@ant-design/icons";
import moment from "moment";
import RapportVehiculeCoursesAll from "./rapportVehiculeCoursesAll/RapportVehiculeCoursesAll";
import RapportVehiculeCoursesCarte from "./rapportVehiculeCoursesCarte/RapportVehiculeCoursesCarte";

export const getDurationColor = (elapsedMinutes, datePrevue) => {
  if (!datePrevue) return "default";

  const diff = moment().diff(moment(datePrevue), "minutes");

  if (diff <= 0) return "green";
  if (diff > 25 && diff <= 60) return "orange";
  if (diff > 60) return "red";
  return "green";
};

const RapportVehiculeCourses = ({ course }) => {
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
          Liste des courses
        </span>
      ),
      children: <RapportVehiculeCoursesAll course={course} />,
    },
    {
      key: "2",
      label: (
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <GlobalOutlined style={{ color: "green" }} />
          Localisation
        </span>
      ),
      children: <RapportVehiculeCoursesCarte />,
    }
  ];

  return (
    <div>
      <Tabs
        activeKey={activeKey}
        onChange={handleTabChange}
        type="card"
        tabPosition="top"
        items={tabItems}
        destroyInactiveTabPane
      />
    </div>
  );
};

export default RapportVehiculeCourses;
