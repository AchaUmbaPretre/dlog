import React, { useState } from 'react';
import { Form, Col, InputNumber, Button, DatePicker, Row, Divider, Card } from 'antd';

const RapportSpecialForm = () => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [periode, setPeriode] = useState(null);
    
    const onFinish = (values) => {
        console.log("Données soumises:", values);
    };
    
    return (
        <div className="rapportSpecialForm" style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
            <Form form={form} name="declaration_form" layout="vertical" onFinish={onFinish} >
                
                <Card bordered={false} style={{ marginBottom: '20px', borderRadius: '8px' }}>
                    <Divider orientation="center" style={styles.title}>
                        PERIODE
                    </Divider>
                    <Row gutter={16}>
                        <Col xs={24} md={24}>
                        <Form.Item
                                    name="periode"
                                    label="Période"
                                    rules={[{ required: true, message: "Veuillez entrer la période" }]}
                                >
                                    <DatePicker
                                    picker="month"
                                    placeholder="Sélectionnez le mois"
                                    format="YYYY-MM-DD"
                                    style={{ width: '100%' }}
                                    onChange={(date, dateString) => setPeriode(dateString)}
                                    />
                                </Form.Item>
                        </Col>
                    </Row>
                </Card>

                {/* ENTREPOSAGE GLOBAL */}
                <Card bordered={false} style={{ marginBottom: '20px', borderRadius: '8px' }}>
                    <Divider orientation="center" style={styles.title}>
                        ENTREPOSAGE GLOBAL
                    </Divider>
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item name="superficie" label="Superficie">
                                <InputNumber min={0} style={styles.input} placeholder="Superficie" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="entreposage" label="Entreposage">
                                <InputNumber min={0} style={styles.input} placeholder="Entreposage" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                {/* TRANSPORT NRJ */}
                <Card bordered={false} style={{  marginBottom: '20px', borderRadius: '8px' }}>
                    <Divider orientation="center" style={styles.title}>
                        TRANSPORT NRJ
                    </Divider>

                    {/* Sous-titre LIVRAISON DIRECTE */}
                    <Divider orientation="left" style={styles.subTitle}>
                        LIVRAISON DIRECTE
                    </Divider>
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item name="teu" label="TEU">
                                <InputNumber min={0} style={styles.input} placeholder="TEU" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="lourd" label="20' LOURDS">
                                <InputNumber min={0} style={styles.input} placeholder="20' LOURDS" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left" style={styles.subTitle}>
                        LIVRAISON AU WAREHOUSE
                    </Divider>
                    <Row gutter={16}>
                        <Col xs={24} md={8}>
                            <Form.Item name="tonnage" label="Tonnage">
                                <InputNumber min={0} style={styles.input} placeholder="Tonnage" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item name="peage_camion" label="Péage Camion">
                                <InputNumber min={0} style={styles.input} placeholder="Péage Camion" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item name="teu_retour" label="TEU Retour">
                                <InputNumber min={0} style={styles.input} placeholder="TEU Retour" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                <Card bordered={false} style={{ marginBottom: '20px', borderRadius: '8px' }}>
                    <Divider orientation="center" style={styles.title}>
                        MANUTENTION
                    </Divider>

                    {/* Sous-titre LIVRAISON DIRECTE */}
                    <Divider orientation="left" style={styles.subTitle}>
                        CONTRAT NRJ (2000m²)  /  tarif 200$/camion
                    </Divider>
                    <Row gutter={16}>
                        <Col xs={24} md={8}>
                            <Form.Item name="camions_manut" label="camions manut">
                                <InputNumber min={0} style={styles.input} placeholder="camions manut" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item name="sacs_manut_IN" label="Sacs manut IN">
                                <InputNumber min={0} style={styles.input} placeholder="sacs manut IN" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item name="sacs_manut_OUT" label="Sacs manut OUT">
                                <InputNumber min={0} style={styles.input} placeholder="sacs manut OUT" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left" style={styles.subTitle}>
                        CONTRAT BRACONGO2 (4500m²) / tarif 10$/T, 10$/pallettes
                    </Divider>
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item name="intrants" label="Bout. /Intrants (T)">
                                <InputNumber min={0} style={styles.input} placeholder="Bout. /Intrants (T)" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item name="charge_decharge" label="CAMION charg/décharge">
                                <InputNumber min={0} style={styles.input} placeholder="CAMION charg/décharge" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item name="sacs_tonne" label="Sacs ( Tonne)">
                                <InputNumber min={0} style={styles.input} placeholder="Sacs ( Tonne)" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item name="palette" label="Palettes (mise en bac)">
                                <InputNumber min={0} style={styles.input} placeholder="Palettes (mise en bac)" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left" style={styles.subTitle}>
                        AVENANT BRACONGO3 (2800m²) / 10$/T
                    </Divider>
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item name="bout" label="Bout. (T)">
                                <InputNumber min={0} style={styles.input} placeholder="Bout. (T)" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item name="avenant_palettes" label="Palettes">
                                <InputNumber min={0} style={styles.input} placeholder="Palettes" />
                            </Form.Item>
                        </Col>

                    </Row>
                </Card>

                <Card bordered={false} style={{ borderRadius: '8px' }}>
                    <Divider orientation="center" style={styles.title}>
                        LIVRAISON
                    </Divider>
                    <div style={{display:'flex', gap:'20px', width:'100%', justifyContent:'space-between'}}>
                        <div style={{width:'100%'}}>
                            <Divider orientation="left" style={styles.subTitle}>
                            Camions livrés
                            </Divider>
                            <Row gutter={16}>
                                <Col xs={24} md={24}>
                                    <Form.Item name="camions_livre" label="Camions livrés">
                                        <InputNumber min={0} style={styles.input} placeholder="camions livrés" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>
                        <div style={{width:'100%'}}>
                            <Divider orientation="left" style={styles.subTitle}>
                                BRACONGO2
                            </Divider>
                            <Row gutter={16}>
                                <Col xs={24} md={24}>
                                    <Form.Item name="camions_livre_bracongo2" label="camions livrés">
                                        <InputNumber min={0} style={styles.input} placeholder="camions livrés" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Card>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{ margin: '10px 0' }}
                        loading={isLoading}
                        disabled={isLoading}
                        >
                        Soumettre
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

const styles = {
    title: {
        fontSize: '15px',
        fontWeight: 'bold',
        color: '#1890ff',
    },
    subTitle: {
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#333',
        textTransform: 'uppercase',
        letterSpacing: '0.3px',
        paddingBottom: '4px',
        marginBottom: '12px',
    },
    input: {
        width: '100%',
        borderRadius: '5px',
    },
};

export default RapportSpecialForm;
