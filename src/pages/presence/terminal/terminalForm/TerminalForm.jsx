import { useCallback, useState } from 'react';
import {
  CheckCircleOutlined,
  SaveOutlined,
  LoadingOutlined,
  ClearOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import {
  Button,
  Form,
  Spin,
  Divider,
  Progress,
  Typography,
  Input,
  Card,
  Row,
  Col,
  Space,
  Select,
  InputNumber,
  notification,
} from 'antd';
import { useProgress } from '../../absence/absenceForm/hooks/useProgress';
import { getTerminalById, postTerminal, putTerminal } from '../../../../services/presenceService';
import { getSite } from '../../../../services/charroiService';
import { useEffect } from 'react';

const { Title, Text } = Typography;
const { Option } = Select;

const TerminalForm = ({ closeModal, fetchData, idTerminal }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [site, setSite] = useState([]);

  const { progress, start, finish, reset } = useProgress();

  const fetchDatas = async() => {
    try {
        const response = await getSite();
        setSite(response?.data.data)
    } catch (error) {
        notification.error({
            message: 'Erreur de chargement',
            description: 'Impossible de récupérer les données.',
        });
    }
  }

  const fetchDataById = async() => {
    try {
      const { data } = await getTerminalById(idTerminal);
      form.setFieldsValue(data[0])

    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Impossible de récupérer les données.',
      });
    }
  }

  useEffect(() => {
    fetchDatas()
  }, []);

  useEffect(() => {
    fetchDataById()
  }, [idTerminal]);

const handleSubmit = useCallback(async (values) => {
  setSubmitting(true);
  setSuccess(false);
  start();

  try {
    const basePayload = {
      site_id: values.site_id,
      name: values.name,
      location_zone: values.location_zone,
      device_model: values.device_model,
      device_sn: values.device_sn,
      ip_address: values.ip_address,
      port: values.port,
      usage_mode: values.usage_mode,
    };

    let response;
    
    if (idTerminal) {
      // Mode édition - mise à jour
      response = await putTerminal({
        id_terminal: idTerminal,
        ...basePayload
      });
      
      // Vérification de la réponse
      if (response?.status === 404) {
        throw new Error('Terminal non trouvé');
      }
    } else {
      response = await postTerminal({
        ...basePayload,
        credentials: {
          username: values.username,
          password: values.password,
        },
      });
    }

    finish();
    setSuccess(true);

    // Notification de succès
    notification.success({
      message: 'Succès',
      description: idTerminal 
        ? 'Le terminal a été mis à jour avec succès.' 
        : 'Le terminal a été créé avec succès.',
      duration: 3,
    });

    await new Promise(resolve => setTimeout(resolve, 800));

    form.resetFields();
    setSuccess(false);
    
    if (closeModal) {
      closeModal();
    }
    
    if (fetchData) {
      await fetchData(); 
    }

  } catch (error) {
    console.error('Erreur lors de la soumission:', error);
    reset();
    
    let errorMessage = "Erreur lors de l'enregistrement du terminal.";
    
    if (error.response) {
      errorMessage = error.response.data?.error || errorMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    notification.error({
      message: 'Erreur',
      description: errorMessage,
      duration: 4,
    });
  } finally {
    setSubmitting(false);
  }
}, [form, start, finish, reset, closeModal, fetchData, idTerminal]);

  return (
    <Card bordered={false} className="vehicule-card pro shine-card">
      <Spin spinning={submitting} indicator={<LoadingOutlined spin />}>
        <div className="vehicule-header">
          <FileTextOutlined className="vehicule-icon pulse" />
          <div>
            <Title level={3}>FORMULAIRE TERMINAL</Title>
            <Text type="secondary">
              Enregistrement d’un terminal biométrique
            </Text>
          </div>

          {progress > 0 && (
            <Progress percent={progress} size="small" showInfo={false} />
          )}

          {success && <CheckCircleOutlined className="success-badge" />}
        </div>

        <Divider />

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={[20, 12]}>

            <Col md={8} xs={24}>
              <Form.Item
                label="Site"
                name="site_id"
                rules={[{ required: true, message: 'Site requis' }]}
              >
                <Select
                    size="large"
                    showSearch
                    placeholder="Sélectionner un site"
                    options={site.map((u) => ({
                        value: u.id_site,
                        label: u.nom_site,
                    }))}
                />  
              </Form.Item>
            </Col>

            <Col md={8} xs={24}>
              <Form.Item
                label="Nom du terminal"
                name="name"
                rules={[{ required: true, message: 'Nom requis' }]}
              >
                <Input size="large" placeholder="Ex: Terminal Entrée" />
              </Form.Item>
            </Col>

            <Col md={8} xs={24}>
              <Form.Item label="Zone / Emplacement" name="location_zone">
                <Input size="large" placeholder="Ex: Entrée principale" />
              </Form.Item>
            </Col>

            <Col md={8} xs={24}>
              <Form.Item label="Modèle" name="device_model">
                <Input size="large" placeholder="Ex: ZKTeco K40" />
              </Form.Item>
            </Col>

            <Col md={8} xs={24}>
              <Form.Item
                label="Numéro de série"
                name="device_sn"
                rules={[{ required: true, message: 'Numéro de série requis' }]}
              >
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col md={8} xs={24}>
              <Form.Item label="Adresse IP" name="ip_address">
                <Input size="large" placeholder="192.168.1.10" />
              </Form.Item>
            </Col>

            <Col md={12} xs={24}>
              <Form.Item label="Port" name="port" initialValue={4370}>
                <InputNumber size="large" style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col md={12} xs={24}>
              <Form.Item
                label="Mode d’utilisation"
                name="usage_mode"
                initialValue="ATTENDANCE"
              >
                <Select size="large">
                  <Option value="ATTENDANCE">Présence</Option>
                  <Option value="ACCESS_CONTROL">Contrôle d’accès</Option>
                  <Option value="BOTH">Les deux</Option>
                </Select>
              </Form.Item>
            </Col>
          { !idTerminal &&
            <>
            <Col md={12} xs={24}>
              <Form.Item
                label="Utilisateur terminal"
                name="username"
                rules={[{ required: true, message: 'Utilisateur requis' }]}
              >
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col md={12} xs={24}>
              <Form.Item
                label="Mot de passe"
                name="password"
                rules={[{ required: true, message: 'Mot de passe requis' }]}
              >
                <Input.Password size="large" />
              </Form.Item>
            </Col>
            </>
          }
            <Col span={24}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={submitting}
                >
                  Enregistrer
                </Button>

                <Button
                  icon={<ClearOutlined />}
                  onClick={() => form.resetFields()}
                  disabled={submitting}
                >
                  Annuler
                </Button>
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
};

export default TerminalForm;
