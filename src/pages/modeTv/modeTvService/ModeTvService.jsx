import React from "react";
import { Table, Progress } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  CrownOutlined,
  CarOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import "./modeTvService.scss";

const ModeTvService = ({dataService}) => {
  // Données factices Leaderboard par service
  console.log(dataService)
  const leaderboardData = (dataService || []).map((item, index) => ({
    key: index + 1,
    service: item.nom_service,
    score: item.nbre_service,
  }));

  // Colonnes leaderboard
  const leaderboardCols = [
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
      render: (text, record, index) => (
        <span className="leaderboard_service">
          {index === 0 && <CrownOutlined className="crown_icon" />}
          {text}
        </span>
      ),
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      render: (score) => (
        <Progress
          percent={score}
          size="small"
          strokeColor={score >= 85 ? "#52c41a" : score >= 70 ? "#faad14" : "#ff4d4f"}
          showInfo={false}
        />
      ),
    },
    {
      title: "%",
      dataIndex: "score",
      key: "percent",
      render: (score) => <b>{score}%</b>,
    },
  ];

  // Données Courses par chauffeur
  const coursesData = [
    { key: 1, chauffeur: "Ali", courses: 42 },
    { key: 2, chauffeur: "Moussa", courses: 38 },
    { key: 3, chauffeur: "Fatou", courses: 31 },
    { key: 4, chauffeur: "Karim", courses: 29 },
  ];

  const coursesCols = [
    {
      title: "Chauffeur",
      dataIndex: "chauffeur",
      key: "chauffeur",
      render: (text) => (
        <span className="chauffeur_name">
          <CarOutlined /> {text}
        </span>
      ),
    },
    {
      title: "Courses",
      dataIndex: "courses",
      key: "courses",
      render: (val) => <b>{val}</b>,
    },
  ];

  // Données Mini-tendances
  const trendsData = [
    { key: 1, label: "Ponctualité Départ", trend: "up", value: "+4%" },
    { key: 2, label: "Ponctualité Retour", trend: "down", value: "-2%" },
    { key: 3, label: "Utilisation Parc", trend: "up", value: "+6%" },
  ];

  return (
    <div className="mode_service">
      {/* Leaderboard par service */}
      <div className="mode_service_card">
        <h3>🏆 Classement par service</h3>
        <Table
          dataSource={leaderboardData}
          columns={leaderboardCols}
          pagination={false}
          size="small"
        />
      </div>

      {/* Courses par chauffeur */}
      <div className="mode_service_card">
        <h3>🚗 Courses par chauffeur</h3>
        <Table
          dataSource={coursesData}
          columns={coursesCols}
          pagination={false}
          size="small"
        />
      </div>

      {/* Mini-tendances */}
      <div className="mode_service_card">
        <h3>📈 Mini-tendances</h3>
        <div className="trends_wrapper">
          {trendsData.map((item) => (
            <div
              key={item.key}
              className={`trend_item ${item.trend}`}
            >
              <LineChartOutlined />
              <span className="trend_label">{item.label}</span>
              <span className="trend_value">{item.value}</span>
              {item.trend === "up" ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModeTvService;
