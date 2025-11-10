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
} from "antd";
import { postCarburantVehicule } from "../../../../services/carburantService";
import { LoadingOutlined } from "@ant-design/icons";

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
          description: "Le véhicule a été enregistré avec succès.",
        });
        form.resetFields();
      } catch (error) {
        console.error("Erreur lors de l'enregistrement :", error);
        notification.error({
          message: "Erreur",
          description:
            "Une erreur est survenue lors de l'enregistrement du véhicule.",
        });
      } finally {
        setLoading(false);
      }
    },
    [form]
  );

  return (
    <Card
      title="Enregistrer un nouveau véhicule ou groupe électrogène"
      bordered={false}
      className="shadow-md rounded-2xl"
    >
      <Spin
        spinning={loading}
        indicator={<LoadingOutlined style={{ fontSize: 28 }} spin />}
        tip="Enregistrement en cours..."
        delay={300}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 10 }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label="Marque"
                name="nom_marque"
                rules={[{ required: true, message: "Veuillez entrer la marque" }]}
              >
                <Input placeholder="Ex: Toyota" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label="Modèle"
                name="nom_modele"
                rules={[{ required: true, message: "Veuillez entrer le modèle" }]}
              >
                <Input placeholder="Ex: Corolla" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Form.Item label="N° série" name="num_serie">
                <Input placeholder="Ex: ABC123456" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Immatriculation" name="immatriculation">
                <Input placeholder="Ex: 1234-AB-01" />
              </Form.Item>
            </Col>

            <Col span={24} style={{ textAlign: "right", marginTop: 20 }}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  style={{ minWidth: 150 }}
                >
                  Enregistrer
                </Button>
                <Button
                  onClick={() => form.resetFields()}
                  disabled={loading}
                  style={{ minWidth: 120 }}
                >
                  Annuler
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Card>
  );
};

export default CarburantVehiculeForm;
