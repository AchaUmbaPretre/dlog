import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Input, Select, DatePicker, Button, InputNumber, Divider } from 'antd';
import { FireOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useConfirmAction } from './hooks/useConfirmAction';
import { usePleinGenerateurForm } from './hooks/usePleinGenerateurForm';
import { renderField } from '../../../../../../utils/renderFieldSkeleton';
import PleinGenerateurLimit from '../../pleinGenerateurLimit/PleinGenerateurLimit';
import ConfirmModal from '../../../../../../components/confirmModal/ConfirmModal';



const FormPleinGenerateur = ({ id_plein, onSaved, closeModal }) => {
    const [form] = Form.useForm();
    const { loading, lists, initialValues, submitting, handleFinish, doSubmit } = usePleinGenerateurForm(id_plein, { onSaved });
    const { visible, message, pending, requestConfirm, confirm, cancel } = useConfirmAction();

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
        } else {
            form.resetFields();
        }
    }, [initialValues, form]);

    const onFinish = async (values) => {
        const result = await handleFinish(values);
        requestConfirm(result, id_plein ? 'Voulez-vous modifier cet enregistrement ?' : 'Voulez-vous enregistrer cet enregistrement ?');
    };

    const onConfirm = async () => {
        const toSubmit = pending ?? null;
        if (!toSubmit) return cancel();

        const { payload, id_plein: payloadId } = toSubmit;
        await doSubmit({ payload, id: payloadId });
        cancel();
        closeModal?.();
        onSaved?.();

    };

    const generateurOptions = useMemo(() => lists.generateurs.map(v => ({ value: v.id_generateur, label: `${v.nom_marque} / ${v.nom_modele} / ${v.code_groupe}` })), [lists.generateurs]);
    const typeOptions = useMemo(() => lists.types.map(t => ({ value: t.id_type_carburant, label: t.nom_type_carburant })), [lists.types]);
    const fournisseurOptions = useMemo(() => lists.fournisseurs.map(f => ({ value: f.id_fournisseur, label: f.nom_fournisseur })), [lists.fournisseurs]);

    const isListsLoading = loading.lists;

    return (
        <div className="carburant_container">
            <h2 className="carburant_h2">
                <FireOutlined style={{ color: '#fa541c', marginRight: 8 }} />
                Gestion des carburants
            </h2>
            <Divider />
            <div className="carburant_wrapper">
                <div className="controle_form">
                    <div className="controle_title_rows">
                        <h2 className="controle_h2">{id_plein ? 'MODIFICATION DU PLEIN' : 'ENREGISTRER UN NOUVEAU PLEIN GENERATEUR'}</h2>
                    </div>

                    <div className="controle_wrapper">
                        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={initialValues || {}}>
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Générateur" name="id_generateur" rules={[{ required: true, message: 'Veuillez sélectionner un générateur.' }]}>
                                        {renderField(isListsLoading, (
                                        <Select showSearch placeholder="Sélectionnez un générateur" options={generateurOptions} />
                                        ))}
                                    </Form.Item>    
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Form.Item label="N° PC" name="num_pc">
                                        {renderField(isListsLoading, <Input placeholder="ex: PC-2025-01" />)}
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Form.Item label="N° facture" name="num_facture">
                                    {renderField(isListsLoading, <Input placeholder="ex: FCT-2025-01" />)}
                                    </Form.Item>
                                </Col>


                                <Col xs={24} sm={12}>
                                    <Form.Item label="Type carburant" name="id_type_carburant" rules={[{ required: true, message: 'Veuillez sélectionner un type.' }]}>
                                    {renderField(isListsLoading, <Select showSearch placeholder="Sélectionnez un type" options={typeOptions} />)}
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Form.Item label="Fournisseur" name="id_fournisseur" rules={[{ required: true, message: 'Veuillez sélectionner un fournisseur.' }]}>
                                    {renderField(isListsLoading, <Select showSearch placeholder="Sélectionnez un fournisseur" options={fournisseurOptions} />)}
                                    </Form.Item>
                                </Col>


                                <Col xs={24} sm={12}>
                                    <Form.Item label="Date d'opération" name="date_operation" rules={[{ required: true, message: 'Veuillez sélectionner une date.' }]}>
                                    {renderField(isListsLoading, <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} placeholder="Sélectionnez une date" />)}
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Form.Item label="Quantité (Litres)" name="quantite_litres" rules={[{ required: true, message: 'Veuillez inserer la quantité.' }]}>
                                    {renderField(isListsLoading, <InputNumber placeholder="ex: 50" style={{ width: '100%' }} />)}
                                    </Form.Item>
                                </Col>


                                <Col xs={24} sm={12}>
                                    <Form.Item label="Commentaire" name="commentaire">
                                    {renderField(isListsLoading, <Input.TextArea placeholder="Entrer..." style={{ resize: 'none' }} />)}
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row justify="end" style={{ marginTop: 20 }}>
                                <Col>
                                    <Button type="primary" htmlType="submit" loading={submitting} disabled={isListsLoading}>
                                    {id_plein ? 'Modifier' : 'Enregistrer'}
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </div>
                {!id_plein && (
                <div className="controle_right">
                    <PleinGenerateurLimit data={lists.limits} loading={loading.lists} />
                </div>
                )}
            </div>
            <ConfirmModal
                visible={visible}
                title={id_plein ? 'Confirmer la modification' : "Confirmer l'enregistrement"}
                content={message}
                onConfirm={onConfirm}
                onCancel={cancel}
                loading={submitting}
            />
        </div>
    )
}

FormPleinGenerateur.propTypes = {
    id_plein: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onSaved: PropTypes.func,
    closeModal: PropTypes.func,
};

export default FormPleinGenerateur;