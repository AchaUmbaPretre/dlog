import { useEffect, useState, useRef } from 'react';
import { Form, Card, notification, Row, Col, Select, DatePicker, Button, message } from 'antd';
import SignaturePad from 'react-signature-canvas';
import { getUser } from '../../../../../services/userService';
import { getValidationDemande, getValidationDemandeOne, posValidationDemande } from '../../../../../services/charroiService';
import './validationDemandeForm.css';

const ValidationDemandeForm = ({closeModal, fetchData, id_demande_vehicule}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [validateur, setValidateur] = useState([]);
    const [info, setInfo] = useState([]);
    const sigCanvas = useRef();
    const [signatureURL, setSignatureURL] = useState('');

    console.log(id_demande_vehicule)

    const fetchDatas = async () => {
        try {
            const [userData] = await Promise.all([getUser()]);
            setValidateur(userData.data);

            if(id_demande_vehicule) {
                const { data: res} = await getValidationDemandeOne(id_demande_vehicule);
                setInfo(res)
            }
        } catch (error) {
            console.error('Erreur chargement données :', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDatas();
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
        const loadingKey = 'loadingDemandeVehicule';
        message.loading({ content: 'Traitement en cours, veuillez patienter...', key: loadingKey, duration: 0 });

        try {
            const v = {
                ...values,
                id_demande_vehicule : id_demande_vehicule
            }
            await posValidationDemande(v);

            message.success({ content: 'La validation a été envoyée avec succès.', key: loadingKey });
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
        <div className="controle_form">
            <div className="controle_title_rows">
                <div className="controle_h2">Validation de demande</div>
            </div>
            <div className="validation_rows_info">

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
