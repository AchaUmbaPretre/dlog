import React, { useEffect, useState } from 'react';
import { Form, Input, Card, InputNumber, Select, Button, Row, Col, Skeleton } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined, SendOutlined } from '@ant-design/icons';


const SuiviReparationForm = () => {
    const [form] = Form.useForm();
    const [tache, setTache] = useState([]);
    const [evaluation, setEvaluation] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    
    
    useEffect(() => {
        form.setFieldsValue({
            reparations: [{}],
        });
    }, []);

    const onFinish = async (values) => {

    }

  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <h2 className="controle_h2">Suivi de réparation</h2>
            </div>
            <div className="controle_wrapper">
                <Form
                    form={form}
                    name="chauffeurForm"
                    layout="vertical"
                    autoComplete="off"
                    className="custom-form"
                    onFinish={onFinish}
                >
                    <Card>
                        <Col xs={24} md={24}>
                            <Form.Item
                                name="id_etat"
                                label="Evaluation"
                                rules={[
                                    {
                                        required: false,
                                        message: 'Veuillez sélectionner un etat...',
                                    }
                                ]}
                            >
                                {loadingData ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        allowClear
                                        showSearch
                                        options={evaluation.map((item) => ({
                                            value: item.id_type_statut_suivi                                           ,
                                            label: `${item.nom_type_statut}`,
                                        }))}
                                        placeholder="Sélectionnez une évaluation..."
                                        optionFilterProp="label"
                                    />}
                            </Form.Item>
                        </Col>
                    </Card>

                    <Card>
                        <Form.List name="reparations">
                            {(fields, { add, remove }) => (
                                <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Row key={key} gutter={12} align="middle">

                                        <Col xs={24} md={7}>
                                            <Form.Item
                                            {...restField}
                                            name={[name, 'id_tache']}
                                            label="Tache"
                                            rules={[
                                                { required: true, message: 'Veuillez sélectionner une tache...' },
                                            ]}
                                            >
                                            <Select
                                                allowClear
                                                showSearch
                                                options={tache.map((item) => ({
                                                    value: item.id_type_reparation,
                                                    label: `${item.type_rep}`,
                                                }))}
                                                placeholder="Sélectionnez un type de réparation..."
                                                optionFilterProp="label"
                                            />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={7}>
                                            <Form.Item
                                            {...restField}
                                            name={[name, 'id_piece']}
                                            label="Piece"
                                            rules={[
                                                { required: true, message: 'Veuillez fournir une réparation...' },
                                            ]}
                                            >
                                            <Select
                                                allowClear
                                                showSearch
                                                options={tache.map((item) => ({
                                                    value: item.id_type_reparation,
                                                    label: `${item.type_rep}`,
                                                }))}
                                                placeholder="Sélectionnez un type de réparation..."
                                                optionFilterProp="label"
                                            />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={7}>
                                            <Form.Item
                                            {...restField}
                                            name={[name, 'montant']}
                                            label="Montant"
                                            rules={[
                                                { required: false, message: 'Veuillez fournir le montant...' },
                                            ]}
                                            >
                                                <InputNumber size='large' min={0} placeholder="Saisir le montant..." style={{width:'100%'}}/>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={2}>
                                            <Button
                                            type="text"
                                            danger
                                            icon={<MinusCircleOutlined />}
                                            onClick={() => remove(name)}
                                            >
                                            </Button>
                                        </Col>

                                    </Row>
                                ))}
                                <Form.Item>
                                    <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    icon={<PlusCircleOutlined />}
                                    style={{ width: '100%' }}
                                    >
                                    Ajouter un suivi
                                    </Button>
                                </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Card>

                    <Card>
                    <Col xs={24} md={24}>
                        <Form.Item
                            name="commentaire"
                            label="Commentaire"
                            rules={[
                                {
                                    required: false,
                                    message: 'Veuillez fournir un commentaire...',
                                }
                            ]}
                        >
                            {loadingData ? <Skeleton.Input active={true} /> : <Input.TextArea placeholder="Saisir le commentaire..." style={{width:'100%', resize:'none', height:'90px'}}/>}
                        </Form.Item>
                    </Col>
                    <div style={{ marginTop: '20px' }}>
                        <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                            Soumettre
                        </Button>
                    </div>
                    </Card>
                </Form>
            </div>
        </div>
    </>
  )
}

export default SuiviReparationForm