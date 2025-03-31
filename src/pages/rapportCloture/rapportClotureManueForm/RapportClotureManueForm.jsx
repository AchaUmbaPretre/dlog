import React, { useState } from 'react';
import { Button, Form, InputNumber, DatePicker, Row, Col } from 'antd';

const RapportClotureManueForm = () => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);

    // Met à jour le total automatiquement
    const onValuesChange = (_, allValues) => {
        const { total_manutation = 0, total_entreposage = 0 } = allValues;
        form.setFieldsValue({
            total: total_manutation + total_entreposage
        });
    };

    const onFinish = (values) => {
        console.log('Form submitted:', values);
    };

    // Fonction pour réinitialiser le formulaire
    const handleReset = () => {
        form.resetFields();
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
                                <DatePicker picker="month" style={{ width: '100%' }} />
                            </Form.Item>        
                        </Col>

                        <Col span={12}>
                            <Form.Item name="m2_occupe" label="M² Occupé">
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="M² Occupé" />
                            </Form.Item>       
                        </Col>

                        <Col span={12}>
                            <Form.Item name="m2_facture" label="M² Facturé">
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="M² Facturé" />
                            </Form.Item>    
                        </Col>

                        <Col span={12}>       
                            <Form.Item name="total_manutation" label="Total Manutention">
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="Total Manutention" />
                            </Form.Item>         
                        </Col>

                        <Col span={12}>       
                            <Form.Item name="total_entreposage" label="Total Entreposage">
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="Total Entreposage" />
                            </Form.Item>         
                        </Col>

                        <Col span={12}>       
                            <Form.Item name="total" label="Total">
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="Total" disabled />
                            </Form.Item>         
                        </Col>

                        {/* Boutons Créer et Annuler */}
                        <Col span={24} style={{ textAlign: 'right' }}>
                            <Button
                                type="default"
                                onClick={handleReset}
                                style={{ marginRight: 10 }}
                            >
                                Annuler
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isLoading}
                                disabled={isLoading}
                            >
                                Créer
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    );
};

export default RapportClotureManueForm;
