import { useEffect, useState, useRef } from 'react';
import { Form, Card, Table, notification,Typography, Row, Col, Select, DatePicker, Button, message } from 'antd';
import SignaturePad from 'react-signature-canvas';
import { getUser } from '../../../../../services/userService';
import { getValidationDemandeOne, posValidationDemande } from '../../../../../services/charroiService';
import './validationDemandeForm.scss';
import config from '../../../../../config';

const { Text } = Typography;

const ValidationDemandeForm = ({ fetchData, id_demande_vehicule}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [validateur, setValidateur] = useState([]);
    const [info, setInfo] = useState([]);
    const sigCanvas = useRef();
    const [signatureURL, setSignatureURL] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
    });
    const scroll = { x: 'max-content' };
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
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
    }, [id_demande_vehicule]);

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

    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
            render: (text, record, index) => {
            const pageSize = pagination.pageSize || 10;
            const pageIndex = pagination.current || 1;
            return (pageIndex - 1) * pageSize + index + 1;
            },
            width: "3%",
        },
        {
            title: 'Nom',
            dataIndex: 'nom',
            key: 'nom',
            align: 'center',
            render: (text) => <Text type="secondary">{text}</Text>,
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            align: 'center',
            render: (text) => <Text type="secondary">{text}</Text>,
        },
          {
    title: 'Signature',
    dataIndex: 'signature',
    key: 'signature',
    align: 'center',
    render: (path) =>
      path ? (
        <img
          className="img_signature"
          src={`${DOMAIN}/public/${path}`}
          alt="signature"
          style={{ maxHeight: '60px', maxWidth: '100px', objectFit: 'contain' }}
        />
      ) : (
        <Text type="secondary">Aucune</Text>
      ),
  },

    ]

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
            fetchDatas()

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
            <div className="validation_wrapper_info">
                <h2 className="validation_h2">Ceux qui ont déjà signé : </h2>
                { info.length > 1 ?
                <div className="validation_rows_info">
                    <Table
                        columns={columns}
                        dataSource={info}
                        loading={loading}
                        onChange={(pagination) => setPagination(pagination)}
                        rowKey="id"
                        bordered
                        scroll={scroll}
                        size="small"
                        rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                    />
                </div>
                : <div className='message_users'>Aucune signature enregistrée pour le moment.</div>
                 }
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
