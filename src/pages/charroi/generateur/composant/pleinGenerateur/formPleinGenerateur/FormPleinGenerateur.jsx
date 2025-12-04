import { useEffect, useState, useCallback } from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  Row,
  Col,
  DatePicker,
  notification,
  Skeleton,
  Divider,
  InputNumber
} from 'antd';
import {
  FireOutlined
} from "@ant-design/icons";
import { getGenerateur, getPleinGenerateurOne, postPleinGenerateur, putPleinGenerateur } from '../../../../../../services/generateurService';
import { getTypeCarburant } from '../../../../../../services/charroiService';
import { useSelector } from 'react-redux';
import moment from 'moment';
import ConfirmModal from '../../../../../../components/confirmModal/ConfirmModal';

const FormPleinGenerateur = ({id_plein, fetchData, closeModal}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState({ data: false, submit: false });
    const [generateur, setGenerateur] = useState([]);
    const [generateurData, setGenerateurData] = useState([]);
    const [type, setType] = useState([]);
    const [loadingConfirm, setLoadingConfirm] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const [confirmVisible, setConfirmVisible] = useState(false); 
    const [pendingPayload, setPendingPayload] = useState(null);
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);

    useEffect(()=> {
        const fetchData = async() => {
            try {
                const [geneData, typeData] = await Promise.all([
                    getGenerateur(),
                    getTypeCarburant()
                ])
                setGenerateur(geneData?.data);
                setType(typeData?.data);


                if(id_plein) {
                    const { data: plein} = await getPleinGenerateurOne(id_plein);
                    if(plein && plein[0]) {
                        form.setFieldsValue({
                            ...plein[0],
                            date_operation: moment(plein[0].date_operation, 'YYYY-MM-DD')
                        })
                    }
                }
            } catch (error) {
                notification.error({
                    message: 'Erreur de chargement',
                    description: 'Impossible de charger les données nécessaires.',
                });
                console.error(error);
            } finally {
                setLoading(prev => ({ ...prev, data: false }));
            }
        }
        fetchData()
    }, []);

    const handleSubmit = (values) => {
        const payload = {
            ...values,
            user_cr: userId
        }
        setPendingPayload(payload);
        setConfirmationMessage(
            id_plein
            ? "Voulez-vous vraiment modifier ces informations carburant ?"
            : "Voulez-vous vraiment enregistrer ces informations carburant ?"
        );
        setConfirmVisible(true);
    };

    const handleConfirm = async() => {
        if(!pendingPayload) return;
        setLoadingConfirm(true)

        try {
            if (id_plein) {
                await putPleinGenerateur(pendingPayload);
            } else {
                await postPleinGenerateur(pendingPayload);
            }

            notification.success({
                message: "Succès",
                description: id_plein
                    ? "Les informations carburant ont été modifiées avec succès."
                    : "Les informations carburant ont été enregistrées avec succès.",
            });
                  
            form.resetFields();
            closeModal?.();
            fetchData?.();
            resetConfirmationState();
        } catch (error) {
            notification.error({
                message: "Erreur",
                description: "Une erreur est survenue lors de l'enregistrement.",
            });
            console.error(error);
            resetConfirmationState();
        } finally {
            setLoadingConfirm(false);
        }
    }

    const resetConfirmationState = () => {
        setConfirmVisible(false);
        setPendingPayload(null);
    };

    const renderField = (component) =>
    loading.data ? <Skeleton.Input active style={{ width: '100%' }} /> : component;

  return (
    <>
        <div className="carburant_container">
            <h2 className="carburant_h2">
                <FireOutlined style={{ color: "#fa541c", marginRight: 8 }} />
                Gestion des carburants
            </h2>
            <Divider />
            <div className="carburant_wrapper">
                <div className="controle_form">
                    <div className="controle_title_rows">
                        <h2 className="controle_h2"> { id_plein ? 'MODIFICATION DU PLEIN' : 'ENREGISTRER UN NOUVEAU PLEIN GENERATEUR'}</h2>
                    </div>
                    <div className="controle_wrapper">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            disabled={loading.data}
                        >
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Générateur"
                                        name="id_generateur"
                                        rules={[{ required: true, message: 'Veuillez sélectionner un générateur.' }]}
                                    >
                                        {renderField(
                                        <Select
                                            showSearch
                                            placeholder="Sélectionnez un générateur"
                                            optionFilterProp="label"
                                            options={generateur.map(v => ({
                                            value: v.id_generateur,
                                            label: `${v.nom_marque} / ${v.nom_modele} / ${v.code_groupe}`,
                                            }))}
                                            onChange={setGenerateurData}
                                        />
                                        )}
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Type carburant"
                                        name="id_type_carburant"
                                        rules={[{ required: true, message: 'Veuillez sélectionner un type.' }]}
                                    >
                                        {renderField(
                                        <Select
                                            showSearch
                                            placeholder="Sélectionnez un type"
                                            optionFilterProp="label"
                                            options={type.map(v => ({
                                            value: v.id_type_carburant,
                                            label: `${v.nom_type_carburant}`,
                                            }))}
                                            onChange={setGenerateurData}
                                        />
                                        )}
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12}>
                                <Form.Item
                                    label="Date d'opération"
                                    name="date_operation"
                                    rules={[{ required: true, message: 'Veuillez sélectionner une date.' }]}
                                >
                                    <DatePicker
                                    format="YYYY-MM-DD"
                                    style={{ width: '100%' }}
                                    placeholder="Sélectionnez une date"
                                    />
                                </Form.Item>
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Form.Item label="Qté" name="quantite_litres">
                                        {renderField( 
                                            <InputNumber
                                                placeholder="ex: 50"
                                                style={{ width: '100%' }}
                                            />
                                        )}
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={24}>
                                    <Form.Item label="Commentaire" name="commentaire">
                                        {renderField(<Input.TextArea placeholder="Entrer..." />)}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row justify="end" style={{ marginTop: 20 }}>
                                <Col>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={loading.submit}
                                        disabled={loading.data}
                                    >
                                        Enregistrer
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </div>
            </div>
            <ConfirmModal
                visible={confirmVisible}
                    title={id_plein ? "Confirmer la modification" : "Confirmer l'enregistrement"}
                    content={confirmationMessage}
                    onConfirm={handleConfirm}
                    onCancel={() => {
                      setConfirmVisible(false);
                      setPendingPayload(null);
                    }}
                    loading={loadingConfirm}
                />
        </div>
    </>
  )
}

export default FormPleinGenerateur