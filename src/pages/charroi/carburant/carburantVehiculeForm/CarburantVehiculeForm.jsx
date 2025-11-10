import { useState, useCallback } from "react";
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
} from "antd";
import {
  LoadingOutlined,
  CarOutlined,
  BarcodeOutlined,
  NumberOutlined,
  IdcardOutlined,
  ClearOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { postCarburantVehicule } from "../../../../services/carburantService";
import "./carburantVehiculeForm.scss";

const { Title, Text } = Typography;

const CarburantVehiculeForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (values) => {
      setLoading(true);
      try {
        await postCarburantVehicule(values);
        notification.success({
          message: "Succès",
          description: "Le véhicule a été enregistré avec succès 🚗💨",
          placement: "topRight",
        });
        form.resetFields();
      } catch (error) {
        console.error("Erreur lors de l'enregistrement :", error);
        notification.error({
          message: "Erreur",
          description:
            "Une erreur est survenue lors de l'enregistrement du véhicule.",
          placement: "topRight",
        });
      } finally {
        setLoading(false);
      }
    },
    [form]
  );

  return (
    <Card bordered={false} className="vehicule-card">
      <Spin
        spinning={loading}
        indicator={<LoadingOutlined style={{ fontSize: 28 }} spin />}
        tip="Enregistrement en cours..."
      >
        <div className="vehicule-header">
          <div className="vehicule-header-content">
            <CarOutlined className="vehicule-icon animate-icon" />
            <div>
              <Title level={3} className="vehicule-title">
                Enregistrer un nouveau véhicule ou groupe électrogène
              </Title>
              <Text type="secondary">
                Veuillez remplir les champs ci-dessous avec soin.
              </Text>
            </div>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="vehicule-form"
          autoComplete="off"
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Marque"
                name="nom_marque"
                rules={[{ required: true, message: "Veuillez entrer la marque" }]}
              >
                <Input
                  prefix={<CarOutlined className="input-icon" />}
                  placeholder="Ex: Toyota"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Modèle"
                name="nom_modele"
                rules={[{ required: true, message: "Veuillez entrer le modèle" }]}
              >
                <Input
                  prefix={<BarcodeOutlined className="input-icon" />}
                  placeholder="Ex: Corolla"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="N° série" name="num_serie">
                <Input
                  prefix={<NumberOutlined className="input-icon" />}
                  placeholder="Ex: ABC123456"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Immatriculation" name="immatriculation">
                <Input
                  prefix={<IdcardOutlined className="input-icon" />}
                  placeholder="Ex: 1234-AB-01"
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
                    className="vehicule-btn"
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
                  >
                    Annuler
                  </Button>
                </Tooltip>
              </Space>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Card>
  );
};

export default CarburantVehiculeForm;
