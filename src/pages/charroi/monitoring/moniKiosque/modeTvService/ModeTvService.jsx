import { Table, Progress, Tooltip } from "antd";
import { CrownOutlined, CarOutlined } from "@ant-design/icons";
import "./modeTvService.scss";

const ModeTvService = ({ dataService, courseVehicule, motif }) => {

  const leaderboardData = (dataService || []).map((item, index) => ({
    key: index + 1,
    service: item.nom_service,
    score: item.nbre_service,
  }));

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
        <Tooltip title={`${score}% d'utilisation`}>
          <Progress
            percent={score}
            size="small"
            strokeColor={{
              "0%": "#ff4d4f",
              "75%": "#faad14",
              "100%": "#52c41a"
            }}
            showInfo={false}
            strokeWidth={16}
          />
        </Tooltip>
      ),
    },
    {
      title: "%",
      dataIndex: "score",
      key: "percent",
      render: (score) => <b>{score}%</b>,
    },
  ];

  const coursesData = (courseVehicule || []).map((item, index) => ({
    key: index + 1,
    chauffeur: item.chauffeur,
    courses: item.courses,
  }));

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
      title: "Nombre",
      dataIndex: "courses",
      key: "courses",
      render: (val) => <b>{val}</b>,
    },
  ];

  const motifCols = [
    {
      title: "Motif",
      dataIndex: "nom_motif_demande",
      key: "nom_motif_demande",
      render: (text) => <span className="motif_name">{text}</span>,
    },
    {
      title: "Nombre",
      dataIndex: "nbre_course",
      key: "nbre_course",
      render: (val) => <b>{val}</b>,
    },
  ];

  return (
    <div className="mode_service">
      <div className="mode_service_card">
        <h3>🏆 Utilisation par les services</h3>
        <Table
          dataSource={leaderboardData}
          columns={leaderboardCols}
          pagination={false}
          size="small"
          bordered={false}
        />
      </div>

      <div className="mode_service_card">
        <h3>🚗 Nbre de courses par chauffeurs</h3>
        <Table
          dataSource={coursesData}
          columns={coursesCols}
          pagination={false}
          size="small"
          bordered={false}
        />
      </div>

      <div className="mode_service_card">
        <h3>📈 Nbre de courses par Motif</h3>
        <Table
          dataSource={motif}
          columns={motifCols}
          pagination={false}
          size="small"
          bordered={false}
        />
      </div>
    </div>
  );
};

export default ModeTvService;
