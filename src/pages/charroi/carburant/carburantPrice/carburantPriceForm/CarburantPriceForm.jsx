import { useEffect, useState } from "react";
import { Form, Input, DatePicker, Skeleton, Select, Row, Col, Button, notification } from "antd";
import { postCarburantPrice } from "../../../../../services/carburantService";
import { getTypeCarburant } from "../../../../../services/charroiService";

const CarburantPriceForm = ({fetchData, onClose }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(()=> {
    const fetchData = async() => {
      setLoadingData(true)
      try {
        const { data } = await getTypeCarburant();
        setType(data)
      } catch (error) {
        notification.error({
        message: "Erreur de chargement",
        description: "Impossible de récupérer les données carburant.",
        placement: "topRight",
      });
      } finally {
         setLoadingData(false)
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const payload = {
        ...values,
        date_effective: values.date_effective.format("YYYY-MM-DD"),
      };

      await postCarburantPrice(payload);

      notification.success({
        message: "Succès",
        description: "Le prix du carburant a été enregistré avec succès.",
        placement: "topRight",
      });

      form.resetFields();
      fetchData();
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout du prix du carburant :", error);

      notification.error({
        message: "Erreur d'enregistrement",
        description:
          error.response?.data?.error ||
          "Une erreur est survenue lors de l'enregistrement du prix.",
        placement: "topRight",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="controle_form">
      <div className="controle_title_rows">
        <h2 className="controle_h2">Ajouter un prix du carburant</h2>
      </div>

      <div className="controle_wrapper">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark="optional"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Date effective"
                name="date_effective"
                rules={[
                  {
                    required: true,
                    message: "Veuillez sélectionner une date effective.",
                  },
                ]}
              >
                <DatePicker
                  placeholder="Sélectionnez la date"
                  format="YYYY-MM-DD"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
              name="id_type_carburant"
              label="Type carburant"
              rules={[
                {
                  required: true,
                  message: 'Veuillez fournir un type du carburant...',
                },
              ]}
            >
              { loadingData ? <Skeleton.Input active={true} /> : 
              <Select
                showSearch
                allowClear
                options={type.map((item) => ({
                  value: item.id_type_carburant                                          ,
                  label: item.nom_type_carburant,
                }))}
                placeholder="Sélectionnez un type de carburant..."
                optionFilterProp="label"
              />
              }
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Prix du litre en CDF"
                name="prix_cdf"
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer le prix en CDF.",
                  },
                  {
                    pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
                    message: "Veuillez entrer une valeur numérique valide.",
                  },
                ]}
              >
                <Input placeholder="Ex: 3000" type="number" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Taux du jour"
                name="taux_usd"
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer le taux du jour.",
                  },
                  {
                    pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
                    message: "Veuillez entrer une valeur numérique valide.",
                  },
                ]}
              >
                <Input placeholder="Ex: 2200" type="number" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  disabled={isLoading}
                  style={{ marginTop: 8 }}
                >
                  {isLoading ? "Enregistrement..." : "Soumettre"}
                </Button>
              </Form.Item>
            </Col>

          </Row>
        </Form>
      </div>
    </div>
  );
};

export default CarburantPriceForm;
