import {
  Table,
  Space,
  Typography,
  Card,
  Button,
  Dropdown,
  Checkbox,
} from "antd";
import {
  CarOutlined,
  UserOutlined,
  EnvironmentOutlined,
  AppstoreOutlined,
  DashboardOutlined,
  EnvironmentFilled,
  FieldTimeOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import "./rapportVehiculeCourses.scss";
import {
  ChronoBox,
  EcartBox,
  MoyenneBox,
  TooltipBox,
} from "../../../../../utils/renderTooltips";
import VehicleSpeed from "../../../../../utils/vehicleSpeed";
import { VehicleAddress } from "../../../../../utils/vehicleAddress";
import { useState, useMemo } from "react";

const { Text } = Typography;

const RapportVehiculeCourses = ({ course }) => {
  const hasPosition = course?.some((r) => !!r?.position || !!r?.capteurInfo?.address);
  const hasSpeed = course?.some((r) => r?.capteurInfo?.speed !== undefined);

  // 1️⃣ Définition de baseColumns
  const baseColumns = [
    {
      title: "#",
      key: "index",
      render: (_, __, index) => (
        <Text style={{ fontSize: 18, fontWeight: 600, color: "#000" }}>{index + 1}</Text>
      ),
      width: 70,
      align: "center",
      fixed: "left",
    },
    {
      title: (
        <Space>
          <AppstoreOutlined style={{ color: "#1890ff", fontSize: 20 }} />
          <Text strong style={{ fontSize: 16, color: "#333" }}>Motif</Text>
        </Space>
      ),
      dataIndex: "nom_motif_demande",
      key: "nom_motif_demande",
      render: (text) => <TooltipBox text={text} bg="#f0f0f0" color="#000" />,
      width: 150,
    },
    {
      title: (
        <Space>
          <UserOutlined style={{ color: "orange", fontSize: 20 }} />
          <Text strong style={{ fontSize: 16, color: "#333" }}>Chauffeur</Text>
        </Space>
      ),
      dataIndex: "nom",
      key: "nom",
      render: (_, record) => (
        <TooltipBox
          text={`${record.prenom_chauffeur || "-"} ${record.nom || "-"}`}
          bg="#f0f0f0"
          color="#000"
        />
      ),
      width: 180,
    },
    {
      title: (
        <Space>
          <EnvironmentOutlined style={{ color: "red", fontSize: 20 }} />
          <Text strong style={{ fontSize: 16, color: "#333" }}>Destination</Text>
        </Space>
      ),
      dataIndex: "nom_destination",
      key: "nom_destination",
      render: (text) => <TooltipBox text={text} bg="#f0f0f0" color="#000" maxWidth={250} />,
      width: 200,
    },
    {
      title: (
        <Space>
          <CarOutlined style={{ color: "green", fontSize: 20 }} />
          <Text strong style={{ fontSize: 16, color: "#333" }}>Véhicule</Text>
        </Space>
      ),
      dataIndex: "abreviation",
      key: "abreviation",
      render: (text) => <TooltipBox text={text} bg="#f0f0f0" color="#000" />,
      width: 150,
    },
    {
      title: (
        <Space>
          <FieldTimeOutlined style={{ color: "#52c41a", fontSize: 20 }} />
          <Text strong style={{ fontSize: 16, color: "#333" }}>Durée R.</Text>
        </Space>
      ),
      key: "duree_reelle_min",
      align: "center",
      render: (_, record) => (
        <ChronoBox sortie_time={record.sortie_time} date_prevue={record.date_prevue} />
      ),
      width: 100,
    },
    {
      title: (
        <Space>
          <FieldTimeOutlined style={{ color: "#faad14", fontSize: 20 }} />
          <Text strong style={{ fontSize: 16, color: "#333" }}>Durée M</Text>
        </Space>
      ),
      key: "duree_moyenne_min",
      align: "center",
      render: (_, record) => <MoyenneBox duree_moyenne_min={record.duree_moyenne_min} />,
      width: 150,
    },
    {
      title: (
        <Space>
          <FieldTimeOutlined style={{ color: "#1890ff", fontSize: 20 }} />
          <Text strong style={{ fontSize: 16, color: "#333" }}>Écart</Text>
        </Space>
      ),
      key: "ecart_min",
      align: "center",
      render: (_, record) => (
        <EcartBox
          duree_reelle_min={record.duree_reelle_min}
          duree_moyenne_min={record.duree_moyenne_min}
        />
      ),
      width: 100,
    },
  ];

  // Ajouter Position si présent
  if (hasPosition) {
    baseColumns.splice(3, 0, {
      title: (
        <Space>
          <EnvironmentFilled style={{ color: "#eb2f96", fontSize: 20 }} />
          <Text strong style={{ fontSize: 16, color: "#333" }}>Position</Text>
        </Space>
      ),
      key: "address",
      render: (_, record) => <VehicleAddress record={record} />,
      width: 90,
    });
  }

  // Ajouter Vitesse si présent
  if (hasSpeed) {
    baseColumns.splice(hasPosition ? 4 : 3, 0, {
      title: (
        <Space>
          <DashboardOutlined style={{ color: "#722ed1", fontSize: 20 }} />
          <Text strong style={{ fontSize: 16, color: "#333" }}>Vitesse</Text>
        </Space>
      ),
      key: "speed",
      align: "center",
      render: (_, record) => (
        <VehicleSpeed
          speed={record?.capteurInfo?.speed || 0}
          engineOn={record?.capteurInfo?.engine_status === true}
        />
      ),
      width: 150,
    });
  }

  // 2️⃣ Colonnes visibles par défaut (Position & Vitesse masquées)
  const [visibleKeys, setVisibleKeys] = useState(
    baseColumns.map((c) => c.key).filter((k) => k !== "address" && k !== "speed"  && k !== "index")
  );

  const filteredColumns = useMemo(
    () => baseColumns.filter((col) => visibleKeys.includes(col.key)),
    [visibleKeys, baseColumns]
  );

  const columnOptions = baseColumns.map((c) => ({
    label: c.title.props?.children?.[1]?.props?.children || c.key,
    value: c.key,
  }));

  const dropdownMenu = (
    <div style={{ padding: "10px 15px" }}>
      <Checkbox.Group
        value={visibleKeys}
        onChange={setVisibleKeys}
        options={columnOptions}
      />
    </div>
  );

  return (
    <div className="rapportVehiculeCourses">
      <Card
        bordered={false}
        title={<Text style={{ fontSize: 18, fontWeight: 600, color: "#333" }}>Rapport des Courses</Text>}
        extra={
          <Dropdown
            overlay={dropdownMenu}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button icon={<EyeOutlined />}>Colonnes</Button>
          </Dropdown>
        }
      >
        <div className="table-scroll">
          <Table
            columns={filteredColumns}
            dataSource={course}
            rowKey={(record) => record.id_vehicule}
            pagination={{ pageSize: 15 }}
            scroll={{ x: "max-content" }}
            bordered={false}
            size="middle"
            rowClassName={(record) => (record.en_cours ? "row-en-cours" : "")}
          />
        </div>
      </Card>
    </div>
  );
};

export default RapportVehiculeCourses;
