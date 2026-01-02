import React, { useMemo} from 'react'
import { Form, Row, Card, Col, InputNumber, Select, Button, Input, DatePicker } from 'antd';
import { useInspectionGenForm } from './hook/useInspectionGenForm';
import { useConfirmAction } from '../../composant/pleinGenerateur/formPleinGenerateur/hooks/useConfirmAction';
import { renderField } from '../../../../../utils/renderFieldSkeleton';
import { SendOutlined, PlusCircleOutlined, MinusCircleOutlined  } from '@ant-design/icons';
import ConfirmModal from '../../../../../components/confirmModal/ConfirmModal';

const FormInspectionGenerateur = ({idInspection = null, onSaved, closeModal}) => {
    const [form] = Form.useForm();
    const { loading, lists, submitting, handleFinish, doSubmit } = useInspectionGenForm(idInspection,{onSaved});
    const { visible, message, pending, requestConfirm, cancel } = useConfirmAction();
    
    const onFinish = async(values) => {
        const result = await handleFinish(values);
        requestConfirm(result, idInspection ? 'Voulez-vous modifier cet enregistrement ?' : 'Voulez-vous enregistrer cet enregistrement ?')
    }

    const onConfirm = async() => {
        const toSubmit = pending ?? null;
        if(!toSubmit) return cancel();

        const { payload } = toSubmit;
        await doSubmit({ payload });
        cancel();
        closeModal?.();
        onSaved?.();
    }

    const generateurOptions = useMemo(() => lists.generateurs.map(v => ({ value: v.id_generateur, label: `${v.nom_marque} / ${v.nom_modele} / ${v.code_groupe}` })), [lists.generateurs]);
    const statusOptions = useMemo(() => lists?.statutVehicules.map(s => ({ value : s.id_statut_vehicule, label: s.nom_statut_vehicule})), [lists.statutVehicules]);
    const typeOptions = useMemo(() => lists?.typeReparation.map(r => ({ value : r.id_type_reparation, label : r.type_rep })), [lists.typeReparation]);
    const catOptions = useMemo(() => lists?.catInspection?.map(c => ({ value: c.id_cat_inspection, label : c.nom_cat_inspection})), [lists.catInspection]);
    
    const isListsLoading = loading.lists;

    return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <div className="controle_h2">FORM INSPECTION GENERATEUR</div>
            </div>
            <div className="controle_wrapper">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Card type="inner" title='INFORMATION GENERALE' style={{marginBottom:'10px'}}>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={12}>
                                <Form.Item label="Générateur" name="id_generateur" rules={[{ required: true, message: 'Veuillez sélectionner un générateur.' }]}>
                                    {renderField(isListsLoading , (
                                        <Select showSearch placeholder="Sélectionnez un générateur" options={generateurOptions} />
                                    ))}
                                </Form.Item> 
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="date_inspection"
                                    label="Date"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez fournir une date...',
                                        },
                                    ]}
                                >
                                    {renderField(isListsLoading, (
                                        <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                                    ))}
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="date_prevu"
                                    label="Date prevue"
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Veuillez fournir une date...',
                                        },
                                    ]}
                                >
                                    {renderField(isListsLoading, (
                                        <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                                    ))}
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item name="id_statut_vehicule" label="Statut véhicule" rules={[{ required: true, message: 'Veuillez selectionner un statut...'}]}>
                                    {renderField(isListsLoading, (
                                        <Select showSearch placeholder="Sélectionnez un statut" options={statusOptions} />
                                    ))}
                                </Form.Item>
                            </Col>

                        </Row>
                    </Card>

                    <Form.List name="reparations">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Card style={{marginBottom:'10px'}}>
                                      <Row key={key} gutter={12} align="small">
                                        <Col xs={24} md={8}>
                                            <Form.Item {...restField} name={[name, 'id_type_reparation']} label="Type de réparation" rules={[{ required: true, message: 'Veuillez fournir une réparation...' } ]}>
                                                {renderField(isListsLoading, (
                                                    <Select showSearch placeholder="Sélectionnez un type de réparation" options={typeOptions} />
                                                ))}
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={8}>
                                            <Form.Item
                                                label="Catégorie d'Inspection"
                                                {...restField}
                                                name={[name, 'id_cat_inspection']}
                                                rules={[{ required: true, message: 'Veuillez sélectionner une catégorie' }]}
                                            >
                                                {renderField(isListsLoading, (
                                                    <Select showSearch placeholder="Sélectionnez une categorie" options={catOptions} />
                                                ))}
                                            </Form.Item>
                                        </Col>

                                        <Col xs={24} md={8}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'montant']}
                                                label="Budget ($)"
                                                rules={[{ required: false, message: 'Veuillez fournir le montant...' },]}
                                            >
                                                <InputNumber min={0} placeholder="Saisir le budget..." style={{width:'100%'}}/>
                                            </Form.Item>
                                        </Col> 

                                        <Col xs={24} md={8}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'commentaire']}
                                                label="Préoccupations"
                                                rules={[
                                                    {
                                                        required: false,
                                                        message: 'Veuillez fournir un commentaire...',
                                                    }
                                                ]}
                                            >
                                                {renderField(isListsLoading, (
                                                    <Input.TextArea placeholder="Saisir le commentaire..." style={{width:'100%', resize:'none', height:'50px'}}/>
                                                ))}
                                            </Form.Item>
                                        </Col>

                                        <Col xs={24} md={8}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'avis']}
                                                label="Avis d'expert"
                                            >
                                                {renderField(isListsLoading, (
                                                    <Input.TextArea placeholder="Saisir l'avis d'expert..." style={{width:'100%', resize:'none', height:'50px'}}/>
                                                ))}
                                            </Form.Item>
                                        </Col> 

                                        <Col xs={24} md={2}>
                                            <Button
                                            type="text"
                                            danger
                                            icon={<MinusCircleOutlined />}
                                            onClick={() => {
                                                remove(name);
                                            }}
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
                                        Signaler un problème technique
                                    </Button>
                                </Form.Item>                                
                            </>
                        )}
                    </Form.List>
                    <div style={{ marginTop: '20px' }}>
                        <Button size='large' type="primary" htmlType="submit" icon={<SendOutlined />} loading={isListsLoading} disabled={isListsLoading} >
                            Soumettre
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
        <ConfirmModal
            visible={visible}
            title={idInspection ? 'Confirmer la modification' : "Confirmer l'enregistrement"}
            content={message}
            onConfirm={onConfirm}
            onCancel={cancel}
            loading={submitting}
        />
    </>
  )
}

export default FormInspectionGenerateur