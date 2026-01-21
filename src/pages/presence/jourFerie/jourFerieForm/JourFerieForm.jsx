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
  DatePicker,
  Space,
  Switch,
  notification,
} from 'antd';
import { useProgress } from '../../absence/absenceForm/hooks/useProgress';
import { postJourFerie } from '../../../../services/presenceService';

const { Title, Text } = Typography;

const JourFerieForm = ({ closeModal, fetchData }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { progress, start, finish, reset } = useProgress();

  const handleSubmit = useCallback(async (values) => {
    setSubmitting(true);
    setSuccess(false);
    start();

    try {
      const payload = {
        date_ferie: values.date_ferie.format('YYYY-MM-DD'),
        libelle: values.libelle,
        est_paye: values.est_paye ? 1 : 0,
      };

      await postJourFerie(payload);

      finish();
      setSuccess(true);

      notification.success({
        message: 'Succès',
        description: 'Le jour férié a été enregistré avec succès.',
      });

      setTimeout(() => {
        form.resetFields();
        setSuccess(false);
        closeModal?.();
        fetchData?.();
      }, 800);

    } catch (error) {
      console.error(error);
      reset();
      notification.error({
        message: 'Erreur',
        description: "Erreur lors de l'enregistrement du jour férié.",
      });
    } finally {
      setSubmitting(false);
    }
  }, [form, start, finish, reset, closeModal, fetchData]);

  return (
    <Card bordered={false} className="vehicule-card pro shine-card">
      <Spin spinning={submitting} indicator={<LoadingOutlined spin />}>
        <div className="vehicule-header">
          <FileTextOutlined className="vehicule-icon pulse" />
          <div>
            <Title level={3}>FORMULAIRE JOUR FÉRIÉ</Title>
            <Text type="secondary">
              Définition d’un jour férié officiel
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
            <Col md={12} xs={24}>
              <Form.Item
                label="Date du jour férié"
                name="date_ferie"
                rules={[{ required: true, message: 'Date requise' }]}
              >
                <DatePicker
                  size="large"
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>

            <Col md={12} xs={24}>
              <Form.Item
                label="Libellé"
                name="libelle"
                rules={[{ required: true, message: 'Libellé requis' }]}
              >
                <Input
                  size="large"
                  placeholder="Ex: Fête de l’indépendance"
                  maxLength={100}
                />
              </Form.Item>
            </Col>

            <Col md={12} xs={24}>
              <Form.Item
                label="Jour payé"
                name="est_paye"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch
                  checkedChildren="Payé"
                  unCheckedChildren="Non payé"
                />
              </Form.Item>
            </Col>

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

      <div className={`confetti ${success ? 'show' : ''}`} aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>
    </Card>
  );
};

export default JourFerieForm;
