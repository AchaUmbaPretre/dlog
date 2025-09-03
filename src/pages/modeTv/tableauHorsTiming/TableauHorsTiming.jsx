import { Table, Tag } from "antd";
import { CarOutlined, UserOutlined } from "@ant-design/icons";
import moment from "moment";
import "./tableauHorsTiming.scss";

const TableauHorsTiming = ({ departHorsTimingRow }) => {

  console.log(departHorsTimingRow);

  const columns = [
    {
      title: "Véhicule",
      dataIndex: "vehicule",
      key: "vehicule",
      render: (text) => (
        <span>
          <CarOutlined style={{ marginRight: 6, color: "#1890ff" }} />
          {text}
        </span>
      ),
    },
    {
      title: "Chauffeur",
      dataIndex: "chauffeur",
      key: "chauffeur",
      render: (text) => (
        <span>
          <UserOutlined style={{ marginRight: 6, color: "#52c41a" }} />
          {text}
        </span>
      ),
    },
    { title: "Service", dataIndex: "service", key: "service" },
    { title: "Destination", dataIndex: "destination", key: "destination" },
    {
      title: "Départ prévu",
      dataIndex: "departPrev",
      key: "departPrev",
      render: (text) => <span>{text ? moment(text).format("DD/MM/YYYY HH:mm") : "-"}</span>,
    },
    {
      title: "Départ réel",
      dataIndex: "departReel",
      key: "departReel",
      render: (text, record) => (
        <span className={record.horsTiming ? "late" : ""}>
          {text ? moment(text).format("DD/MM/YYYY HH:mm") : "-"}
        </span>
      ),
    },
    {
      title: "Retour",
      dataIndex: "retour",
      key: "retour",
      render: (text, record) =>
        record.horsTiming ? (
          <Tag color="error">Hors timing</Tag>
        ) : (
          <Tag color="success">Ok</Tag>
        ),
    },
  ];

  const data = departHorsTimingRow?.map((row, index) => ({
    key: row.id_bande_sortie || index,
    vehicule: row.immatriculation,
    chauffeur: row.nom_chauffeur,
    service: row.nom_service,
    destination: row.nom_destination,
    departPrev: row.date_prevue,
    departReel: row.sortie_time,
    retour: row.retour_time,
    horsTiming: row.statut_sortie !== "OK",
  }));

  return (
    <div className="tableauHorsTiming">
      <h3 className="title_timing">🚛 Départ hors timing</h3>
      <div className="tableauHorsTiming_wrapper">
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 5 }}
          scroll={{ x: "max-content", y: 300 }}
          rowClassName={(record) => (record.horsTiming ? "row-hors-timing" : "")}
        />
      </div>
    </div>
  );
};

export default TableauHorsTiming;
