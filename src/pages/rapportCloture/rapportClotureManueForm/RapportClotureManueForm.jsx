import React, { useState } from 'react';
import { Button, Form, InputNumber, DatePicker, Row, Col, message, notification } from 'antd';
import { postClotureSimple } from '../../../services/rapportService';

const RapportClotureManueForm = ({fetchData, closeModal}) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);

    // Met à jour le total automatiquement
    const onValuesChange = (_, allValues) => {
        const { total_manutation = 0, total_entreposage = 0 } = allValues;
        form.setFieldsValue({
            total: total_manutation + total_entreposage
        });
    };

    const onFinish = async (values) => {
        const loadingKey = 'loadingDeclaration';

        try {
            await form.validateFields();
    
            message.loading({ content: 'Traitement en cours, veuillez patienter...', key: loadingKey, duration: 0 });
    
            setIsLoading(true);
    
            await postClotureSimple(values);
    
            message.destroy(loadingKey);
            message.success({ content: "L'opération a été effectuée avec succès.", key: loadingKey });
    
            form.resetFields();
            fetchData();
            closeModal();
        } catch (error) {
            console.error("Erreur lors de l'ajout du rapport clôturé :", error);
    
            message.destroy(loadingKey);
            message.error({ content: 'Une erreur est survenue.', key: loadingKey });
    
            notification.error({
                message: 'Erreur',
                description: error.response?.data?.error || 'Une erreur inconnue est survenue.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        form.resetFields();
        closeModal()
    };

    return (
        <div className="client_form">
            <div className="controle_title_rows">
                <h2 className="controle_h2">Manuellement</h2>
            </div>
            <div className="client_wrapper">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onValuesChange={onValuesChange}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Periode"
                                name="periode"
                                rules={[{ required: true, message: 'Veuillez entrer la période!' }]}
                            >
                                <DatePicker picker="month" style={{ width: '100%' }} size="large" />
                            </Form.Item>        
                        </Col>

                        <Col span={12}>
                            <Form.Item name="m2_occupe" label="M² Occupé">
                                <InputNumber min={0} size="large" style={{ width: '100%' }} placeholder="M² Occupé" />
                            </Form.Item>       
                        </Col>

                        <Col span={12}>
                            <Form.Item name="m2_facture" label="M² Facturé">
                                <InputNumber min={0} size="large" style={{ width: '100%' }} placeholder="M² Facturé" />
                            </Form.Item>    
                        </Col>

                        <Col span={12}>       
                            <Form.Item name="total_manutation" label="Total Manutention">
                                <InputNumber min={0} size="large" style={{ width: '100%' }} placeholder="Total Manutention" />
                            </Form.Item>         
                        </Col>

                        <Col span={12}>       
                            <Form.Item name="total_entreposage" label="Total Entreposage">
                                <InputNumber min={0} size="large" style={{ width: '100%' }} placeholder="Total Entreposage" />
                            </Form.Item>         
                        </Col>

                        <Col span={12}>       
                            <Form.Item name="total" label="Total">
                                <InputNumber min={0} size="large" style={{ width: '100%' }} placeholder="Total" disabled />
                            </Form.Item>         
                        </Col>

                        <Col span={24} style={{ textAlign: 'right' }}>
                            <Button
                                type="default"
                                onClick={handleReset}
                                style={{ marginRight: 10 }}
                                size="large"
                            >
                                Annuler
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isLoading}
                                disabled={isLoading}
                                size="large"
                            >
                                Soumettre
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    );
};

export default RapportClotureManueForm;
