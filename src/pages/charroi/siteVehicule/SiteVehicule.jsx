import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Select,
  Row,
  Col,
  Card,
  Divider,
  message,
  Spin,
  Typography,
  Modal,
  Tag,
  Empty,
  Alert,
  Space,
} from 'antd';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CarOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { getSite, getVehiculeOne, postSiteVehicule } from '../../../services/charroiService';
import './siteVehicule.scss';

const { Title, Text } = Typography;
const { confirm } = Modal;

const SiteVehicule = ({ idVehicule }) => {
  const [form] = Form.useForm();
  const [vehicule, setVehicule] = useState(null);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // --- Charger les données véhicule + sites ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiculeRes, sitesRes] = await Promise.all([
          getVehiculeOne(idVehicule),
          getSite(),
        ]);
        setVehicule(vehiculeRes.data?.data[0]);
        setSites(sitesRes.data?.data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        messageApi.error('Erreur de chargement. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    if (idVehicule) fetchData();
  }, [idVehicule]);

  // --- Soumission du formulaire ---
  const handleSubmit = (values) => {
    confirm({
      title: 'Confirmer l’affectation',
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: 'Voulez-vous vraiment affecter ce véhicule à ce site ?',
      okText: 'Oui, confirmer',
      cancelText: 'Annuler',
      onOk: () => executeAffectation(values),
    });
  };

const executeAffectation = async (values) => {
  setSubmitting(true);
  try {
    messageApi.open({
      type: 'loading',
      content: 'Affectation en cours...',
      key: 'submit',
    });

    const response = await postSiteVehicule({
      id_vehicule: idVehicule,
      id_site: values.id_site,
    });

    messageApi.open({
      type: 'success',
      content: response?.message || 'Véhicule affecté avec succès ✅',
      key: 'submit',
    });

    setSuccess(true);
    form.resetFields();
    setTimeout(() => setSuccess(false), 4000);
  } catch (error) {
    console.error('Erreur lors de l’affectation:', error);

    const backendMessage =
      error.response?.data?.message || 
      error.response?.data?.error ||
      'Une erreur est survenue lors de l’affectation.';

    messageApi.open({
      type: 'error',
      content: backendMessage,
      key: 'submit',
    });
  } finally {
    setSubmitting(false);
  }
};


  if (loading) {
    return (
      <div className="siteVehicule__loading">
        <Spin tip="Chargement des données..." size="large" />
      </div>
    );
  }

  return (
    <div className="siteVehicule">
      {contextHolder}

      <Card
        bordered={false}
        className="siteVehicule__card"
        title={
          <Space direction="vertical" size={0}>
            <Title level={4} className="siteVehicule__title">
              <CarOutlined style={{ marginRight: 8, color: '#1890ff' }} />
              Affectation du véhicule
            </Title>
            {vehicule ? (
              <Text type="secondary" className="siteVehicule__subtitle">
                <Tag color="blue">{vehicule.immatriculation}</Tag>
                <Tag color="geekblue">{vehicule.nom_marque}</Tag>
                <Tag color="purple">{vehicule.modele}</Tag>
                <Tag color='green'>{vehicule.nom_cat}</Tag>
              </Text>
            ) : (
              <Text type="secondary">Aucune donnée véhicule disponible</Text>
            )}
          </Space>
        }
      >
        <Divider />

        {success && (
          <Alert
            message="Véhicule affecté avec succès"
            description="L’opération s’est terminée sans erreur."
            type="success"
            showIcon
            closable
            className="siteVehicule__alert"
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          className="siteVehicule__form"
        >
          <Row gutter={[24, 12]}>
            <Col xs={24} md={24}>
              <Form.Item
                name="id_site"
                label={<Text strong>Site d’affectation</Text>}
                rules={[{ required: true, message: 'Veuillez sélectionner un site.' }]}
              >
                <Select
                  showSearch
                  allowClear
                  size="large"
                  placeholder="Sélectionnez un site..."
                  suffixIcon={<EnvironmentOutlined />}
                  options={sites.map((site) => ({
                    value: site.id_site,
                    label: site.nom_site,
                  }))}
                  optionFilterProp="label"
                  notFoundContent={<Empty description="Aucun site trouvé" />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Row justify="end">
            <Col>
              <Button
                type="primary"
                size="large"
                icon={<CheckCircleOutlined />}
                htmlType="submit"
                loading={submitting}
                className="siteVehicule__btn"
              >
                Affecter le véhicule
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default SiteVehicule;
