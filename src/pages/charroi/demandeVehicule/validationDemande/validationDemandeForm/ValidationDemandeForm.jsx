import React, { useEffect, useState, useRef } from 'react';
import { Form, Card, Row, Col, Select, DatePicker, Button, message } from 'antd';
import SignaturePad from 'react-signature-canvas';
import { getUser } from '../../../../../services/userService';


const ValidationDemandeForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [validateur, setValidateur] = useState([]);
    const sigCanvas = useRef();
    const [signatureURL, setSignatureURL] = useState('');

    const fetchData = async () => {
        try {
            const [userData] = await Promise.all([getUser()]);
            setValidateur(userData.data);
        } catch (error) {
            console.error('Erreur chargement données :', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSaveSignature = () => {
        if (!sigCanvas.current.isEmpty()) {
            const data = sigCanvas.current.getCanvas().toDataURL("image/png");
            setSignatureURL(data);
            form.setFieldsValue({ signature_data: data });
            message.success("Signature enregistrée.");
        } else {
            message.warning("Veuillez signer avant d'enregistrer.");
        }
    };

    const handleClearSignature = () => {
        sigCanvas.current.clear();
        setSignatureURL('');
        form.setFieldsValue({ signature_data: '' });
    };

    const onFinish = async (values) => {
        await form.validateFields();
        console.log('Données soumises :', values);
        // Appel API ici
    };

    return (
        <div className="controle_form">
            <div className="controle_title_rows">
                <div className="controle_h2">Validation de demande</div>
            </div>
            <div className="controle_wrapper">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Card>
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Validateur"
                                    name="validateur_id"
                                    rules={[{ required: true, message: 'Veuillez sélectionner un validateur' }]}
                                >
                                    <Select
                                        allowClear
                                        showSearch
                                        options={validateur.map((item) => ({
                                            value: item.id_utilisateur,
                                            label: `${item.prenom}`,
                                        }))}
                                        optionFilterProp="label"
                                        placeholder="Sélectionnez..."
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Date de validation"
                                    name="date_validation"
                                    rules={[{ required: true, message: "Veuillez fournir la date et l'heure" }]}
                                >
                                    <DatePicker
                                        style={{ width: '100%' }}
                                        showTime={{ format: 'HH:mm' }}
                                        format="YYYY-MM-DD HH:mm"
                                        placeholder="Choisir date et heure"
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24}>
                                <Form.Item
                                    label="Signature électronique"
                                    name="signature_data"
                                    rules={[{ required: true, message: 'Signature requise' }]}
                                >
                                    <>
                                        <div className="signature-container">
                                            <SignaturePad
                                                ref={sigCanvas}
                                                canvasProps={{
                                                    width: 500,
                                                    height: 200,
                                                    className: 'signature-canvas'
                                                }}
                                            />
                                        </div>
                                        <div style={{ marginTop: 10 }}>
                                            <Button onClick={handleClearSignature}>Effacer</Button>
                                            <Button type="primary" style={{ marginLeft: 10 }} onClick={handleSaveSignature}>
                                                Enregistrer la signature
                                            </Button>
                                        </div>
                                    </>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Soumettre
                            </Button>
                        </Form.Item>
                    </Card>
                </Form>
            </div>
        </div>
    );
};

export default ValidationDemandeForm;
