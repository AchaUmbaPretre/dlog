import { useCallback, useState } from 'react';
import moment from 'moment';
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
  Tooltip,
  Spin,
  Divider,
  Progress,
  Typography,
  Input,
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  Space,
  notification,
} from 'antd';

import { postAbsence } from '../../../../services/presenceService';
import { useAbsenceFormData } from './hooks/useAbsenceFormData';
import { useProgress } from './hooks/useProgress';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const AbsenceForm = ({ closeModal, fetchData }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { users, absenceTypes } = useAbsenceFormData();
  const { progress, start, finish, reset } = useProgress();

  const handleSubmit = useCallback(
    async (values) => {
      setSubmitting(true);
      setSuccess(false);
      start();

      try {
        const [date_debut, date_fin] = values.periode;

        const payload = {
          id_utilisateur: values.id_utilisateur,
          id_absence_type: values.id_absence_type,
          date_debut: moment(date_debut).format('YYYY-MM-DD'),
          date_fin: moment(date_fin).format('YYYY-MM-DD'),
          commentaire: values.commentaire?.trim() || null,
        };

        await postAbsence(payload);

        finish();
        setSuccess(true);

        notification.success({
          message: 'Succès',
          description: "La demande d'absence a été enregistrée avec succès.",
        });

        setTimeout(() => {
          form.resetFields();
          setSuccess(false);
          closeModal?.();
          fetchData?.();
        }, 1200);
      } catch {
        reset();
        notification.error({
          message: 'Erreur',
          description: "Une erreur est survenue lors de l'enregistrement.",
        });
      } finally {
        setSubmitting(false);
      }
    },
    [form, start, finish, reset, closeModal, fetchData]
  );

  return (
    <Card bordered={false} className="vehicule-card pro shine-card">
      <Spin spinning={submitting} indicator={<LoadingOutlined spin />}>
        <div className="vehicule-header">
          <FileTextOutlined className="vehicule-icon pulse" />
          <div>
            <Title level={3}>FORMULAIRE D’ABSENCE</Title>
            <Text type="secondary">Veuillez renseigner les informations requises.</Text>
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
                label="Agent"
                name="id_utilisateur"
                rules={[{ required: true, message: 'Agent requis' }]}
              >
                <Select
                  size="large"
                  showSearch
                  placeholder="Sélectionner un agent"
                  options={users.map((u) => ({
                    value: u.id_utilisateur,
                    label: u.nom,
                  }))}
                />
              </Form.Item>
            </Col>

            <Col md={12} xs={24}>
              <Form.Item
                label="Type d'absence"
                name="id_absence_type"
                rules={[{ required: true, message: 'Type requis' }]}
              >
                <Select
                  size="large"
                  placeholder="Sélectionner un type"
                  options={absenceTypes.map((t) => ({
                    value: t.id_absence_type,
                    label: t.libelle,
                  }))}
                />
              </Form.Item>
            </Col>

            <Col md={12} xs={24}>
              <Form.Item
                label="Période"
                name="periode"
                rules={[{ required: true }]}
              >
                <RangePicker
                  size="large"
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                  disabledDate={(d) => d && d < moment().startOf('day')}
                />
              </Form.Item>
            </Col>

            <Col md={12} xs={24}>
              <Form.Item label="Commentaire" name="commentaire">
                <Input.TextArea rows={4} maxLength={500} showCount />
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

      <div className={`confetti ${success ? "show" : ""}`} aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>
    </Card>
  );
};

export default AbsenceForm;
