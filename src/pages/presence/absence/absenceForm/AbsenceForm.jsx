import { useEffect, useState } from 'react'
import moment from 'moment';
import { 
    CheckCircleOutlined, 
    SaveOutlined, 
    LoadingOutlined, 
    ClearOutlined,
    FileTextOutlined } from '@ant-design/icons';
import { Button, Form, Tooltip, Spin, Divider, Upload, Progress, Typography, Input, Card, Row, Col, Select, DatePicker, Skeleton, InputNumber, Space, message, Modal, notification } from 'antd';
import { getUser } from '../../../../services/userService';
import { getAbsenceType } from '../../../../services/presenceService';

const { Title, Text } = Typography;

const AbsenceForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [progress, setProgress] = useState(0);
    const [users, setUsers] = useState([]);
    const [type, setType] = useState([]);


    useEffect(() => {
        const fetchData = async() => {
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
        fetchData();
    }, []);

    const handleSubmit = (values) => {

    };

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