import { Table, Tooltip, Divider } from "antd";
import {
  CarOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import "./tableauHorsTiming.scss";

const TableauHorsTiming = ({ departHorsTimingRow }) => {
  const columns = [
    {
      title: "N°",
      dataIndex: "id",
      key: "id",
      width: 70,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Véhicule",
      dataIndex: "vehicule",
      key: "vehicule",
      render: (text) => (
        <span className="vehicule_cell">
          <CarOutlined /> {text}
        </span>
      ),
    },
    {
      title: "Chauffeur",
      dataIndex: "chauffeur",
      key: "chauffeur",
      render: (text) => (
        <span className="chauffeur_cell">
          <UserOutlined /> {text}
        </span>
      ),
    },
    { title: "Service", dataIndex: "service", key: "service", ellipsis: true },
    { title: "Destination", dataIndex: "destination", key: "destination" },
    {
      title: "Départ prévu",
      dataIndex: "departPrev",
      key: "departPrev",
      render: (text) => (text ? moment(text).format("DD/MM/YYYY HH:mm") : "-"),
    },
    {
      title: "Départ réel",
      dataIndex: "departReel",
      key: "departReel",
      ellipsis: true,
      render: (text, record) => (
        <Tooltip title={record.retardInfo || "Aucun retard"}>
          <span className={record.horsTiming ? "late" : ""}>
            {text ? moment(text).format("DD/MM/YYYY HH:mm") : "-"}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Retour prévu",
      dataIndex: "retourPrev",
      key: "retourPrev",
      render: (text) => (text ? moment(text).format("DD/MM/YYYY HH:mm") : "-"),
    },
    {
      title: "Retour réel",
      dataIndex: "retourReel",
      key: "retourReel",
      ellipsis: true,
      render: (text) => (text ? moment(text).format("DD/MM/YYYY HH:mm") : "-"),
    },
    {
      title: "Statut",
      dataIndex: "statut",
      key: "statut",
      render: (statut) => {
        let color = "#1890ff";
        let icon = null;
        switch (statut) {
          case "Validé":
            color = "#52c41a";
            icon = <CheckCircleOutlined />;
            break;
          case "En attente":
            color = "#faad14";
            icon = <ClockCircleOutlined />;
            break;
          case "En retard":
          case "Retard retour":
            color = "#ff4d4f";
            icon = <CloseCircleOutlined />;
            break;
        }
        return (
          <span className="status_cell" style={{ color }}>
            {icon} {statut}
          </span>
        );
      },
    },
    {
      title: "Validations",
      key: "validations",
      render: (_, record) => (
        <div className="validations_wrapper">
          <span className={record.resp === "✔" ? "validated" : ""}>Resp</span>
          <span className={record.dirlog === "✔" ? "validated" : ""}>Dir LOG</span>
          <span className={record.rh === "✔" ? "validated" : ""}>RH</span>
        </div>
      ),
    },
  ];

  const data = departHorsTimingRow?.map((row, index) => ({
    key: row.id_bande_sortie || index,
    id: row.id_bande_sortie,
    vehicule: row.vehicule,
    chauffeur: row.chauffeur,
    service: row.service,
    destination: row.destination,
    departPrev: row.depart_prevu,
    departReel: row.depart_reel,
    retourPrev: row.retour_prevu,
    retourReel: row.retour_reel,
    statut: row.statut,
    retardInfo: row.retard_info,
    resp: row.resp_validation,
    dirlog: row.dirlog_validation,
    rh: row.rh_validation,
    horsTiming: row.statut !== "Validé",
  }));

  return (
    <div className="tableauHorsTiming">
      <div className="header-bar">
        <h3 className="title_timing">🚛 Départs hors timing</h3>
        <Divider />
      </div>
      <div className="tableauHorsTiming_wrapper">
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 8 }}
          scroll={{ x: "max-content", y: 400 }}
          rowClassName={(record) => (record.horsTiming ? "row-hors-timing" : "")}
          locale={{
            emptyText: (
              <div className="empty_table">
                Aucun enregistrement pour les filtres actuels.{" "}
                <a href="#">Réinitialiser les filtres</a>
              </div>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default TableauHorsTiming;
