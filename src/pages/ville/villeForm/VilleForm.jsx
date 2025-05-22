import { useEffect, useState } from 'react';
import {
  Col,
  Form,
  Card,
  notification,
  Input,
  Row,
  Select,
  Skeleton,
  Button,
  message,
} from 'antd';
import { SendOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { getProvince, postProvince } from '../../../services/clientService';
import { postVille } from '../../../services/transporteurService';

const VilleForm = ({ closeModal, fetchData, villeId }) => {
  const [form] = Form.useForm();
  const [loadingData, setLoadingData] = useState(true);
  const [province, setProvince] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPays = async () => {
      try {
        const { data } = await getProvince();
        setProvince(data);
      } catch (error) {
        console.error('Erreur lors du chargement des provinces :', error);
        notification.error({
          message: 'Chargement échoué',
          description: 'Impossible de charger la liste des provinces.',
        });
      } finally {
        setLoadingData(false);
      }
    };

    fetchPays();
  }, []);

  const onFinish = async (values) => {
    const loadingKey = 'loadingProvince';

    try {
      await form.validateFields();

      message.loading({
        content: 'Traitement en cours, veuillez patienter...',
        key: loadingKey,
        duration: 0,
      });

      setLoading(true);

      await postVille(values)

      message.success({
        content: villeId ? 'Ville mise à jour avec succès' : 'Ville enregistrée avec succès',
        key: loadingKey,
      });

      form.resetFields();
      fetchData();
      closeModal();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);

      const errorMsg =
        error?.response?.data?.error || "Une erreur inconnue est survenue. Veuillez réessayer.";

      message.error({
        content: 'Échec de l’enregistrement.',
        key: loadingKey,
      });

      notification.error({
        message: 'Erreur lors de l’enregistrement',
        description: errorMsg,
        placement: 'topRight',
        duration: 6,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="controle_form">
      <div className="controle_title_rows">
        <h2 className="controle_h2">
          {villeId ? 'MODIFIER' : 'ENREGISTRER'} UNE VILLE
        </h2>
      </div>
      <Card>
        <div className="controle_wrapper">
          <Form
            form={form}
            layout="vertical"
            autoComplete="off"
            className="custom-form"
            onFinish={onFinish}
          >
            <Row gutter={12}>
              <Col xs={24}>
                <Form.Item
                  name="nom_ville"
                  label="Nom"
                  rules={[
                    {
                      required: true,
                      message: "Veuillez fournir le nom de la ville.",
                    },
                  ]}
                >
                  {loadingData ? (
                    <Skeleton.Input active />
                  ) : (
                    <Input placeholder="Saisir le nom..." />
                  )}
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item
                  name="id_province"
                  label="Province"
                  rules={[
                    {
                      required: true,
                      message: 'Veuillez sélectionner une province.',
                    },
                  ]}
                >
                  {loadingData ? (
                    <Skeleton.Input active />
                  ) : (
                    <Select
                      allowClear
                      showSearch
                      options={province.map((item) => ({
                        value: item.id,
                        label: item.name,
                      }))}
                      placeholder={
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <EnvironmentOutlined style={{ color: '#8c8c8c' }} />
                          Sélectionnez une province...
                        </span>
                      }
                      optionFilterProp="label"
                    />
                  )}
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Button
                  type="primary"
                  loading={loading}
                  disabled={loading}
                  htmlType="submit"
                  icon={<SendOutlined />}
                  style={{ marginTop: '10px' }}
                >
                  {villeId ? 'Modifier' : 'Soumettre'}
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default VilleForm;
