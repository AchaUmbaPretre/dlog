import React, { useEffect, useState } from "react";
import { Table, Button, Modal, notification } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import CarburantPriceForm from "./carburantPriceForm/CarburantPriceForm";
import { getCarburantPrice } from "../../../../services/carburantService";
import moment from "moment";

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
      title: "Prix (CDF)",
      dataIndex: "prix_cdf",
      key: "prix_cdf",
      align: "right",
      render: (value) => `${Number(value).toLocaleString()} CDF`,
    },
    {
      title: "Prix (USD)",
      dataIndex: "taux_usd",
      key: "taux_usd",
      align: "right",
      render: (value) => `${Number(value).toFixed(2)} $`,
    },
    {
      title: "Date effective",
      dataIndex: "date_effective",
      key: "date_effective",
      align: "center",
      render: (value) =>
        value ? moment(value).format("DD-MM-YYYY") : "—",
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
