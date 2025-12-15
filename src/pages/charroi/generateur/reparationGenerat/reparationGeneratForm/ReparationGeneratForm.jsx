import React, { useMemo, useState } from 'react'
import { Col, DatePicker, Form, Modal, Card, notification, Input, InputNumber, Row, Select, Skeleton, Button, Divider, message } from 'antd';
import { useReparateurGenForm } from '../hook/useReparateurGenForm';
import { renderField } from '../../../../../utils/renderFieldSkeleton';
import { MinusCircleOutlined, PlusCircleOutlined, SendOutlined } from '@ant-design/icons';


const ReparationGeneratForm = ({closeModal, fetchData}) => {
    const [form] = Form.useForm();
    const { loading, lists } = useReparateurGenForm()

    const onFinish = async (values) => {

    }

    const generateurOptions = useMemo(()=> lists.generateurs.map(v => ({ value: v.id_generateur, label: `${v.nom_marque} / ${v.nom_modele} / ${v.code_groupe}` })), [lists.generateurs]);
    const fournisseurOptions = useMemo(() => lists.fournisseurs.map(f => ({ value: f.id_fournisseur, label: f.nom_fournisseur })), [lists.fournisseurs]);
    const statusOptions = useMemo(() => lists?.statutVehicules.map(s => ({ value : s.id_statut_vehicule, label: s.nom_statut_vehicule})), [lists.statutVehicules]);
    const typeOptions = useMemo(() => lists?.typeReparation.map(r => ({ value : r.id_type_reparation, label : r.type_rep })), [lists.typeReparation])

    const isListsLoading = loading.lists;

  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <h2 className="controle_h2">ENREGISTRER UNE REPARATION GENERATEUR</h2>
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
                       <Row gutter={12}>
                            <Col xs={24} md={8}>
                                <Form.Item label="Générateur" name="id_generateur" rules={[{ required: true, message: 'Veuillez sélectionner un générateur.' }]}>
                                    {renderField(isListsLoading, (
                                        <Select showSearch placeholder="Sélectionnez un générateur" options={generateurOptions} />
                                    ))
                                    }
                                </Form.Item>  
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item label="Fournisseur" name="id_fournisseur" rules={[{ required: true, message: 'Veuillez sélectionner un fournisseur.' }]}>
                                    {renderField(isListsLoading, (
                                        <Select showSearch placeholder="Sélectionnez un fournisseur" options={fournisseurOptions} />
                                    ))
                                    }
                                </Form.Item>  
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item label="Statut" name="id_statut" rules={[{ required: true, message: 'Veuillez sélectionner un statut.' }]}>
                                    {renderField(isListsLoading, (
                                        <Select showSearch placeholder="Sélectionnez un statut" options={statusOptions} />
                                    ))
                                    }
                                </Form.Item>  
                            </Col>

                            <Col xs={24} sm={8}>
                                <Form.Item label="Date entrée" name="date_entree" rules={[{ required: true, message: 'Veuillez sélectionner une date.' }]}>
                                    {renderField(isListsLoading, <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} placeholder="Sélectionnez une date" />)}
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={8}>
                                <Form.Item label="Date prévue" name="date_prevue">
                                    {renderField(isListsLoading, <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} placeholder="Sélectionnez une date" />)}
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={8}>
                                <Form.Item label="Cout(devise)" name="cout">
                                    {renderField(isListsLoading, <Input placeholder="50 USD" />)}
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={8}>
                                <Form.Item label="Code de réparation" name="code_rep">
                                    {renderField(isListsLoading, <Input placeholder="60B10" />)}
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={8}>
                                <Form.Item label="Commentaire" name="commentaire">
                                    {renderField(isListsLoading, <Input.TextArea style={{height:60}} placeholder="Ecrire..." />)}
                                </Form.Item>
                            </Col>

                       </Row> 
                    </Card>
                    {/* Réparations dynamiques */}
                    <Form.List name="reparations">
                        {(fields, { add,remove}) => (
                            <>
                                <Divider className='title_row'>Réparations</Divider>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Card>
                                        <Row key={key} gutter={12} align="small">
                                            <Col xs={24} md={7}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'id_type_reparation']}
                                                    label="Type de réparation"
                                                    rules={[
                                                        { required: true, message: 'Veuillez fournir une réparation...' },
                                                    ]}
                                                >
                                                {renderField(isListsLoading, (
                                                    <Select showSearch placeholder="Sélectionnez un type" options={typeOptions} />
                                                ))
                                                }
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
                                                    <InputNumber min={0} placeholder="Saisir le montant..." style={{width:'100%'}}/>
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'description']}
                                                    label="Description"
                                                    rules={[
                                                        { required: true, message: 'Veuillez fournir une description...' },
                                                    ]}
                                                >
                                                    <Input.TextArea
                                                        placeholder="Saisir la description"
                                                        style={{ width: '100%', resize: 'none' }}
                                                    />
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
                                    </Card>
                                ))
                                }
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        icon={<PlusCircleOutlined />}
                                        style={{ width: '100%' }}
                                    >
                                        Ajouter une réparation
                                    </Button>
                                </Form.Item>
                            </>
                        )
                        }
                    </Form.List>
                    <div style={{ marginTop: '20px' }}>
                        <Button type="primary" htmlType="submit" loading={loading} icon={<SendOutlined />}>
                            Soumettre
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    </>
  )
}

export default ReparationGeneratForm