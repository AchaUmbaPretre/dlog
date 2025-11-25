import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Tag, notification, Typography } from "antd";
import { PlusCircleOutlined, PercentageOutlined, CalendarOutlined, FireOutlined, DollarOutlined } from "@ant-design/icons";
import CarburantPriceForm from "./carburantPriceForm/CarburantPriceForm";
import { getCarburantPrice } from "../../../../services/carburantService";
import moment from "moment";

const { Text } = Typography;

const CarburantPrice = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });
  const [data, setData] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getCarburantPrice();
      if (response?.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des prix du carburant :", error);
      notification.error({
        message: "Erreur de chargement",
        description:
          error.response?.data?.message ||
          "Impossible de charger les données du prix du carburant.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (type) => {
    setModalType(type);
  };

  const closeModal = () => {
    setModalType(null);
  };

const columns = [
  {
    title: "#",
    key: "index",
    width: 80,
    align: "center",
    render: (_, __, index) =>
      (pagination.current - 1) * pagination.pageSize + index + 1,
  },
  {
    title: (
      <span>
        <CalendarOutlined style={{ color: "#1677ff", marginRight: 6 }} />
        Date effective
      </span>
    ),
    dataIndex: "date_effective",
    key: "date_effective",
    align: "center",
    render: (value) => (value ? moment(value).format("DD-MM-YYYY") : "—"),
  },
  {
    title: (
      <span>
        <FireOutlined style={{ color: "#fa8c16", marginRight: 6 }} />
        Type carburant
      </span>
    ),
    dataIndex: "nom_type_carburant",
    key: "nom_type_carburant",
    align: "center",
    render: (text) => {
      let color = text === "Essence" ? "volcano" : "green"; // couleur selon le type
      return <Tag color={color}>{text}</Tag>;
    },
  },
  {
    title: (
      <span>
        <DollarOutlined style={{ color: "#52c41a", marginRight: 6 }} />
        Prix (CDF)
      </span>
    ),
    dataIndex: "prix_cdf",
    key: "prix_cdf",
    align: "right",
    render: (value) => <Text strong style={{ color: "#52c41a" }}>{Number(value).toLocaleString()} CDF</Text>,
  },
  {
    title: (
      <span>
        <PercentageOutlined style={{ color: "#722ed1", marginRight: 6 }} />
        Taux du jour
      </span>
    ),
    dataIndex: "taux_usd",
    key: "taux_usd",
    align: "right",
    render: (value) => <Text strong style={{ color: "#722ed1" }}>{Number(value).toFixed(2)} CDF</Text>,
  },
];


  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">🛢️</div>
            <h2 className="client-h2">Gestion des prix du carburant</h2>
          </div>

          <div className="client-actions">
            <div className="client-rows-right">
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={() => openModal("add")}
              >
                Ajouter un prix
              </Button>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={data}
            pagination={{
              ...pagination,
              total: data.length,
              onChange: (page, pageSize) =>
                setPagination({ current: page, pageSize }),
            }}
            rowKey="id_prix_carburant"
            bordered
            size="middle"
            scroll={{ x: 600 }}
            loading={loading}
          />
        </div>
      </div>

      <Modal
        title=""
        open={modalType === "add"}
        onCancel={closeModal}
        footer={null}
        width={700}
        centered
        destroyOnClose
      >
        <CarburantPriceForm fetchData={fetchData} onClose={closeModal} />
      </Modal>
    </>
  );
};

export default CarburantPrice;
