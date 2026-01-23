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
  Select,
  DatePicker,
  Space,
  notification,
} from 'antd';
import { useProgress } from '../../absence/absenceForm/hooks/useProgress';
import { useCongeFormData } from './hooks/useCongeFormData';
import { postConge } from '../../../../services/presenceService';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const Congeform = ({ closeModal, fetchData }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    
    const { users, userId, permissions, scope_sites } = useCongeFormData();
    const { progress, start, finish, reset } = useProgress();

    const handleSubmit = useCallback(async (values) => {
        setSubmitting(true);
        setSuccess(false);
        start();

        try {
            const [dateDebut, dateFin] = values.periode;

            const payload = {
                id_utilisateur: values.id_utilisateur,
                date_debut: dateDebut.format('YYYY-MM-DD'),
                date_fin: dateFin.format('YYYY-MM-DD'),
                type_conge: values.type_conge,
                statut: 'EN_ATTENTE',
                commentaire: values.commentaire || null,
                created_by: userId,
                permissions,
                scope_sites
            };

            await postConge(payload);

            finish();
            setSuccess(true);

            notification.success({
            message: 'Succès',
            description: 'Le congé a été enregistré avec succès.',
            });

            setTimeout(() => {
            form.resetFields();
            setSuccess(false);
            closeModal?.();
            fetchData?.();
            }, 1000);

        } catch (error) {
            reset();
            notification.error({
            message: 'Erreur',
            description: "Erreur lors de l'enregistrement du congé.",
            });
        } finally {
            setSubmitting(false);
        }
    }, [form, start, finish, reset, closeModal, fetchData]);


  return (
    <>
        <Card bordered={false} className="vehicule-card pro shine-card">
            <Spin spinning={submitting} indicator={<LoadingOutlined spin />}>
                <div className="vehicule-header">
                    <FileTextOutlined className="vehicule-icon pulse" />
                    <div>
                        <Title level={3}>FORMULAIRE DE CONGE</Title>
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
                                label="Période"
                                name="periode"
                                rules={[{ required: true }]}
                            >
                                <RangePicker
                                    size="large"
                                    style={{ width: '100%' }}
                                    format="YYYY-MM-DD"
                                    disabledDate={null}
                                />
                            </Form.Item>
                        </Col>

                        <Col md={12} xs={24}>
                            <Form.Item
                                label="Type de congé"
                                name="type_conge"
                                rules={[{ required: true, message: 'Type de congé requis' }]}
                            >
                                <Select size="large" placeholder="Sélectionner le type">
                                <Select.Option value="ANNUEL">Annuel</Select.Option>
                                <Select.Option value="MALADIE">Maladie</Select.Option>
                                <Select.Option value="EXCEPTIONNEL">Exceptionnel</Select.Option>
                                </Select>
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
    </>
  )
}

export default Congeform