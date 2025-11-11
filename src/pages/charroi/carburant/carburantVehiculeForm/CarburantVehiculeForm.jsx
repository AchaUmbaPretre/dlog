import React, { useState, useCallback, useRef } from "react";
import {
  Button,
  Form,
  Input,
  Row,
  Col,
  notification,
  Card,
  Spin,
  Space,
  Typography,
  Tooltip,
  Divider,
  Progress,
  AutoComplete
} from "antd";
import {
  LoadingOutlined,
  CarOutlined,
  BarcodeOutlined,
  NumberOutlined,
  IdcardOutlined,
  ClearOutlined,
  SaveOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { postCarburantVehicule } from "../../../../services/carburantService";
import "./carburantVehiculeForm.scss";

const { Title, Text } = Typography;

// Exemples de suggestions prédictives
const marques = ["Toyota", "Ford", "Honda", "BMW", "Mercedes"];
const modeles = ["Corolla", "Civic", "Mustang", "X5", "Sprinter"];

export default function CarburantVehiculeForm({ closeModal, fetchData }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filteredMarques, setFilteredMarques] = useState([]);
  const [filteredModeles, setFilteredModeles] = useState([]);
  const progressRef = useRef(null);

  const startProgress = () => {
    setProgress(10);
    if (progressRef.current) clearInterval(progressRef.current);
    progressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) { clearInterval(progressRef.current); return p; }
        return p + Math.floor(Math.random() * 10) + 5;
      });
    }, 500);
  };

  const finishProgress = () => {
    if (progressRef.current) clearInterval(progressRef.current);
    setProgress(100);
    setTimeout(() => setProgress(0), 800);
  };

  const handleSubmit = useCallback(
    async (values) => {
      setLoading(true);
      setSuccess(false);
      startProgress();

      try {
        await postCarburantVehicule(values);
        finishProgress();
        setSuccess(true);

        notification.success({
          message: "Succès",
          description: "Le véhicule a été enregistré avec succès 🚗💨",
          placement: "topRight",
          className: "success-notification",
        });

        setTimeout(() => {
          form.resetFields();
          setSuccess(false);
          closeModal();
          fetchData();
        }, 1400);
      } catch (error) {
        console.error("Erreur :", error);
        if (progressRef.current) clearInterval(progressRef.current);
        setProgress(0);
        notification.error({
          message: "Erreur",
          description: "Erreur lors de l'enregistrement du véhicule.",
          placement: "topRight",
        });
      } finally {
        setLoading(false);
      }
    },
    [form, closeModal, fetchData]
  );

  const handleMarqueSearch = (value) => {
    setFilteredMarques(
      marques.filter((m) => m.toLowerCase().includes(value.toLowerCase()))
    );
  };

  const handleModeleSearch = (value) => {
    setFilteredModeles(
      modeles.filter((m) => m.toLowerCase().includes(value.toLowerCase()))
    );
  };

  return (
    <Card bordered={false} className="vehicule-card pro shine-card">
      <Spin
        spinning={loading}
        indicator={<LoadingOutlined style={{ fontSize: 28 }} spin />}
        tip={loading ? "Enregistrement en cours..." : null}
      >
        <div className="vehicule-header">
          <div className="vehicule-header-content">
            <div className="vehicule-icon-wrap">
              <CarOutlined className="vehicule-icon pulse" />
            </div>

            <div style={{ flex: 1 }}>
              <Title level={3} className="vehicule-title">
                Enregistrer un véhicule / groupe électrogène
              </Title>
              <Text type="secondary">
                Remplissez les champs ci-dessous avec soin.
              </Text>
            </div>

            <div className="header-actions">
              {progress > 0 && (
                <div className="progress-wrap">
                  <Progress
                    percent={Math.min(progress, 100)}
                    size="small"
                    strokeWidth={6}
                    showInfo={false}
                  />
                </div>
              )}

              {success && (
                <div className="success-badge fade-in">
                  <CheckCircleOutlined />
                </div>
              )}
            </div>
          </div>
        </div>

        <Divider />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="vehicule-form"
          autoComplete="off"
        >
          <Row gutter={[20, 12]}>
            <Col xs={24} md={12}>
            <Form.Item
                label="Marque"
                name="nom_marque"
                rules={[{ required: true, message: "Veuillez entrer la marque" }]}
            >
                <AutoComplete
                options={filteredMarques.map((m) => ({ value: m }))}
                onSearch={handleMarqueSearch}
                filterOption={false}
                >
                <Input
                    placeholder="Ex: Toyota"
                    size="large"
                    prefix={<CarOutlined className="input-icon" />}
                />
                </AutoComplete>
            </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Modèle"
                name="nom_modele"
                rules={[{ required: true, message: "Veuillez entrer le modèle" }]}
              >
                <AutoComplete
                    options={filteredModeles.map((m) => ({ value: m }))}
                    onSearch={handleModeleSearch}
                    filterOption={false}
                >
                    <Input
                        placeholder="Ex: Corolla"
                        size="large"
                        prefix={<BarcodeOutlined className="input-icon" />}
                    />
                </AutoComplete>

              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="N° série" name="num_serie">
                <Input
                  prefix={<NumberOutlined className="input-icon" />}
                  placeholder="Ex: ABC123456"
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Immatriculation" name="immatriculation">
                <Input
                  prefix={<IdcardOutlined className="input-icon" />}
                  placeholder="Ex: 1234-AB-01"
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col span={24} className="vehicule-actions">
              <Space size="middle">
                <Tooltip title="Enregistrer ce véhicule">
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={loading}
                    className="vehicule-btn shine-btn"
                    size="large"
                  >
                    Enregistrer
                  </Button>
                </Tooltip>

                <Tooltip title="Effacer tous les champs">
                  <Button
                    onClick={() => form.resetFields()}
                    icon={<ClearOutlined />}
                    disabled={loading}
                    className="vehicule-btn-cancel"
                    size="large"
                  >
                    Annuler
                  </Button>
                </Tooltip>
              </Space>
            </Col>
          </Row>
        </Form>
      </Spin>

      <div className={`confetti ${success ? "show" : ""}`} aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>
    </Card>
  );
}
