import { Table, Tag } from "antd";
import { CarOutlined, UserOutlined } from "@ant-design/icons";
import "./tableauHorsTiming.scss";

const TableauHorsTiming = ({evenementLiveRow}) => {
    
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
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Départ réel",
      dataIndex: "departReel",
      key: "departReel",
      render: (text, record) => (
        <span className={record.horsTiming ? "late" : ""}>{text}</span>
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

  const data = [
    {
      key: "1",
      vehicule: "ABC-1234",
      chauffeur: "Jean Pierre",
      service: "Livraison",
      destination: "Kinshasa",
      departPrev: "02/09/2025 08:00",
      departReel: "02/09/2025 08:30",
      retour: "02/09/2025 12:00",
      horsTiming: true,
    },
    {
      key: "2",
      vehicule: "XYZ-5678",
      chauffeur: "Marie Claire",
      service: "Maintenance",
      destination: "Lubumbashi",
      departPrev: "02/09/2025 09:00",
      departReel: "02/09/2025 09:00",
      retour: "02/09/2025 13:30",
      horsTiming: false,
    },
  ];

  return (
    <div className="tableauHorsTiming">
      <h3 className="title_timing">🚛 Départ hors timing</h3>
      <div className="tableauHorsTiming_wrapper">
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 5 }}
          scroll={{ x: "max-content", y: 300 }}
          rowClassName={(record) =>
            record.horsTiming ? "row-hors-timing" : ""
          }
        />
      </div>
    </div>
  );
};

export default TableauHorsTiming;
