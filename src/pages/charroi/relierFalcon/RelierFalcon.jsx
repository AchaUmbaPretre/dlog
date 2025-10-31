import { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Typography,
  message,
  Card,
  Space,
  Input,
  Spin,
  Select,
  Modal,
} from "antd";
import { CarOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import {
  getVehicule,
  getVehiculeOne,
  putRelierVehiculeFalcon,
} from "../../../services/charroiService";
import { getFalcon } from "../../../services/rapportService";
import { getOdometer } from "../../../utils/geocodeService";
import "./relierFalcon.scss";

const { Text } = Typography;
const { confirm } = Modal;
const { Option } = Select;


const RelierFalcon = ({ idVehicule, closeModal, fetchData }) => {
  const [vehicule, setVehicule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [falcon, setFalcon] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });
  const [searchValue, setSearchValue] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [vehiculeAll, setVehiculeAll] = useState([]);

  const rowSelection = {
    type: "radio",
    selectedRowKeys,
    onChange: (keys, rows) => {
      setSelectedRowKeys(keys);
      setSelectedRow(rows[0] || null);
    },
  };

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
      width: "4%",
    },
    {
      title: "Matricule",
      dataIndex: "name",
      render: (text) => (
        <Space>
          <CarOutlined style={{ color: "#1890ff" }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Vehicule Dlog",
      dataIndex: "vehicule",
      key:'vehicule',
      render: (text, record) => (
        <Select
          allowClear
          showSearch
          placeholder="Type"
          value={record.id_vehicule || undefined}
          optionFilterProp="children"
          style={{ width: 140 }}
          onChange={v => handleChange(record.id_vehicule, "type_geofence", v)}
        >
          {vehiculeAll.map(t => (
            <Option key={t.id_catGeofence} value={t.id_catGeofence}>
              {t.nom_catGeofence}
            </Option>
          ))}
        </Select>
      ),
      sorter: (a, b) =>
        moment(a.time, "DD-MM-YYYY HH:mm:ss").unix() -
        moment(b.time, "DD-MM-YYYY HH:mm:ss").unix(),
    },
    {
      title: "Km Total",
      dataIndex: "sensors",
      render: (sensors) => {
        const km = getOdometer(sensors);
        return !km || isNaN(km) ? (
          <Tag color="default">N/A</Tag>
        ) : (
          <Text>{Number(km).toLocaleString("fr-FR")} km</Text>
        );
      },
    },
  ];

  const handleChange = ()=> {

  }
  // 🔹 Fetch Falcon data
  useEffect(() => {
    const fetchFalcon = async () => {
      try {
        const [data, vehicleData] = await Promise.all([
          getFalcon(),
          getVehicule()
        ])
        setFalcon(data.data[0].items);
        setVehiculeAll(vehicleData.data.data)
      } catch (error) {
        console.error(error);
        message.error("Erreur lors du chargement des données Falcon");
      }
    };
    fetchFalcon();
  }, []);

  // 🔹 Fetch véhicule info
  useEffect(() => {
    if (!idVehicule) return;
    const fetchVehicule = async () => {
      setLoading(true);
      try {
        const { data } = await getVehiculeOne(idVehicule);
        setVehicule(data.data[0]);
      } catch (error) {
        message.error("Erreur de chargement du véhicule");
      } finally {
        setLoading(false);
      }
    };
    fetchVehicule();
  }, [idVehicule]);

  // 🔹 Submit
  const handleRelier = async () => {
    if (!selectedRow) {
      message.warning("Veuillez sélectionner un véhicule Falcon.");
      return;
    }

    const action = async () => {
      try {
        const { id: id_capteur, name: name_capteur } = selectedRow;
        await putRelierVehiculeFalcon(idVehicule, { id_capteur, name_capteur });
        message.success("Véhicule relié avec succès !");
        closeModal?.();
        fetchData?.();
      } catch (error) {
        console.error(error);
        message.error("Une erreur est survenue lors du reliement");
      }
    };

    // Si déjà relié → demander confirmation
    if (vehicule?.name_capteur) {
      confirm({
        title: "Voulez-vous modifier le capteur lié ?",
        icon: <ExclamationCircleOutlined />,
        content: (
          <>
            <Text>
              Ce véhicule est actuellement lié avec{" "}
              <b>{vehicule.name_capteur}</b>.
            </Text>
            <br />
            <Text strong>
              Voulez-vous remplacer ce capteur par{" "}
              <b>{selectedRow.name}</b> ?
            </Text>
          </>
        ),
        okText: "Oui, remplacer",
        cancelText: "Annuler",
        onOk: action,
      });
    } else {
      await action();
    }
  };

  return (
    <Card
      title="Relier un véhicule Falcon"
      className="relierFalconCard"
      bordered
    >
      {loading ? (
        <Spin tip="Chargement..." />
      ) : (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* 🔹 Infos véhicule */}
          <Card type="inner" size="small" title="Détails du véhicule">
            <Space direction="vertical" size="small">
              <Text>
                <b>Immatriculation:</b> {vehicule?.immatriculation}
              </Text>
              <Text>
                <b>Type:</b> {vehicule?.nom_cat}
              </Text>
              <Text>
                <b>Marque:</b> {vehicule?.nom_marque}
              </Text>
              <Text>
                <b>Modèle:</b> {vehicule?.modele}
              </Text>
              {vehicule?.name_capteur ? (
                <Text type="secondary">
                  🚗 Ce véhicule est déjà lié avec{" "}
                  <b>{vehicule.name_capteur}</b>.
                </Text>
              ) : (
                <Text type="danger">❌ Aucun capteur lié pour ce véhicule.</Text>
              )}
            </Space>
          </Card>

          {/* 🔹 Recherche */}
          <Input.Search
            placeholder="Rechercher par matricule..."
            allowClear
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ width: 300 }}
          />

          {/* 🔹 Table Falcon */}
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={falcon.filter((item) =>
              item.name?.toLowerCase().includes(searchValue.toLowerCase())
            )}
            rowKey="id"
            bordered
            size="middle"
            pagination={pagination}
            onChange={setPagination}
            rowClassName={(_, index) =>
              index % 2 === 0 ? "odd-row" : "even-row"
            }
          />

          {/* 🔹 Action */}
          <Button
            type="primary"
            onClick={handleRelier}
            disabled={!selectedRow}
            block
          >
            Relier le véhicule sélectionné
          </Button>
        </Space>
      )}
    </Card>
  );
};

export default RelierFalcon;
