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

const FormPleinGenerateur = ({id_plein}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState({ data: false, submit: false });
    const [generateur, setGenerateur] = useState([]);
    const [generateurData, setGenerateurData] = useState([]);
    const [type, setType] = useState([]);

    const handleSubmit = (values) => {
        
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
                        <h2 className="controle_h2"> { id_plein ? 'MODIFICATION DU PLEIN' : 'ENREGISTRER UN NOUVEAU PLEIN'}</h2>
                    </div>
                    <div className="controle_wrapper">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            disabled={loading.data}
                        >
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={8}>
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

                                <Col xs={24} sm={8}>
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
                                            options={generateur.map(v => ({
                                            value: v.id_generateur,
                                            label: `${v.nom_marque} / ${v.nom_modele} / ${v.code_groupe}`,
                                            }))}
                                            onChange={setGenerateurData}
                                        />
                                        )}
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={8}>
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

                                <Col xs={24} sm={8}>
                                <Form.Item label="Qté" name="quantite_litres">
                                    {renderField(<Input placeholder="10" />)}
                                </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default FormPleinGenerateur