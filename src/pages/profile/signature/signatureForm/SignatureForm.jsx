import { useRef, useState } from 'react'
import SignaturePad from 'react-signature-canvas';
import { Button, Form, Card, Col, Row, message, notification, Select, Tabs } from 'antd';
import { useSelector } from 'react-redux';
import { postSignature } from '../../../../services/userService';

const SignatureForm = ({closeModal, fetchData}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [info, setInfo] = useState([]);
    const sigCanvas = useRef();
    const [signatureURL, setSignatureURL] = useState('');
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);

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
        const loadingKey = 'loadingDemandeVehicule';
        message.loading({ content: 'Traitement en cours, veuillez patienter...', key: loadingKey, duration: 0 });

        try {
            const v = {
                ...values,
                userId : userId
            }
            await postSignature(v);

            message.success({ content: 'La signature a été enregistrée avec succès.', key: loadingKey });
            form.resetFields();
            fetchData();
            closeModal();
            
        } catch (error) {
            notification.error({
                message: 'Erreur',
                description: 'Erreur lors de l\'enregistrement de demande.',
            });
        } finally {
            setLoading(false);
        }
    }

  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <div className="controle_h2">Créer une signature</div>
            </div>
            <div className="controle_wrapper">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Card>
                        <Row gutter={16}>
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
    </>
  )
}

export default SignatureForm