import { useCallback, useEffect, useRef, useState } from 'react'
import moment from 'moment';
import { 
    CheckCircleOutlined, 
    SaveOutlined, 
    LoadingOutlined, 
    ClearOutlined,
    FileTextOutlined } from '@ant-design/icons';
import { Button, Form, Tooltip, Spin, Divider, Upload, Progress, Typography, Input, Card, Row, Col, Select, DatePicker, Skeleton, InputNumber, Space, message, Modal, notification } from 'antd';
import { getUser } from '../../../../services/userService';
import { getAbsenceType, postAbsence } from '../../../../services/presenceService';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const AbsenceForm = ({ closeModal, fetchData}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [progress, setProgress] = useState(0);
    const [users, setUsers] = useState([]);
    const [type, setType] = useState([]);
    const progressRef = useRef(null);


    const fetchDatas = async() => {
            try {
                const [dataUser, typeData] = await Promise.all([
                    getUser(),
                    getAbsenceType()
                ])
                
                setUsers(dataUser.data);
                setType(typeData.data)

            } catch (error) {
                notification.error({
                    message: "Erreur de chargement",
                    description: "Impossible de récupérer les données.",
                    placement: "topRight",
                })
            }
    };

    useEffect(() => {
        fetchDatas();
    }, []);

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
                await postAbsence(values);
                finishProgress();
                setSuccess(true);

                notification.success({
                    message: "Succès",
                    description: `l'absence a été enregistré avec succès 🚗💨`,
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
                    description: "Erreur lors de l'enregistrement",
                    placement: "topRight",
                });
            } finally {
                setLoading(false);
            }
        },
        [form, closeModal, fetchData]
    );

  return (
    <>
        <Card bordered={false} className="vehicule-card pro shine-card">
            <Spin
                spinning={loading}
                indicator={<LoadingOutlined style={{ fontSize: 28 }} spin />}
                tip={loading ? "Enregistrement en cours..." : null}
            >
                <div className="vehicule-header">
                    <div className="vehicule-header-content">
                        <div className="vehicule-icon-wrap">
                            <FileTextOutlined className="vehicule-icon pulse" />
                        </div>

                        <div style={{ flex: 1 }}>
                            <Title level={3} className="vehicule-title">FORM D'ABSENCE</Title>
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
                                label="Agents"
                                name="id_utilisateur"
                                rules={[{ required: true, message: "Veuillez entrer la marque" }]}
                            >
                                <Select
                                    showSearch
                                    allowClear
                                    options={users.map((item) => ({
                                        value: item.id_utilisateur                                          ,
                                        label: item.nom,
                                    }))}
                                    placeholder="Sélectionnez un agent..."
                                    optionFilterProp="label"
                                    size="large"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Type d'absence"
                                name="id_absence_type"
                                rules={[{ required: true, message: "Veuillez entrer la marque" }]}
                            >
                                <Select
                                    showSearch
                                    allowClear
                                    options={type.map((item) => ({
                                        value: item.id_absence_type                                          ,
                                        label: item.libelle
                                    }))}
                                    placeholder="Sélectionnez un type..."
                                    optionFilterProp="label"
                                    size="large"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Période d'absence"
                                name="periode"
                                rules={[
                                { required: true, message: "Veuillez sélectionner la période d'absence" }
                                ]}
                            >
                                <RangePicker
                                style={{ width: '100%' }}
                                size="large"
                                format="YYYY-MM-DD"
                                disabledDate={(current) => current && current < moment().startOf('day')}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Commentaire"
                                name="commentaire"
                            >
                                <Input.TextArea
                                rows={4}
                                placeholder="Motif ou remarque (optionnel)"
                                maxLength={500}
                                showCount
                                />
                            </Form.Item>
                        </Col>



                        <Col span={24} className="vehicule-actions">
                            <Space size="middle">
                                <Tooltip title="Enregistrer cette absence">
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
    </>
  )
}

export default AbsenceForm