import React, { useEffect, useState } from 'react'
import { Col, DatePicker, Form, notification, Input, InputNumber, Row, Select, Skeleton, Button, Divider, message } from 'antd';
import { SendOutlined, PlusCircleOutlined, MinusCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, ShopOutlined, WarningOutlined, UserOutlined  } from '@ant-design/icons';
import { getFournisseur } from '../../../../services/fournisseurService';
import { getEvaluation, getInspectionValide, getPiece, getStatutVehicule, getTypeReparation, getVehicule, postReparation } from '../../../../services/charroiService';
import { useSelector } from 'react-redux';
import { getTypes } from '../../../../services/typeService';
import moment from 'moment';
import { getCat_inspection } from '../../../../services/batimentService';

const { Option } = Select;

const ReclamationForm = ({closeModal, fetchData, id_sud_reparation}) => {
    const [form] = Form.useForm();
    const [loadingData, setLoadingData] = useState(false);
    const [fournisseur, setFournisseur] = useState([]);
    const [reparation, setReparation] = useState([]);
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
    const [loading, setLoading] = useState(false);
    const [ statut, setStatut ] = useState([]);
    const [evaluation, setEvaluation] = useState([]);
    const [piece, setPiece] = useState([]);
    const [tache, setTache] = useState([]);

    
    const fetchDatas = async () => {
        try {
            const [ fournisseurData, reparationData, statutData, pieceData, tacheData ] = await Promise.all([
                getFournisseur(),
                getTypeReparation(),
                getStatutVehicule(),
                getPiece(),
                getCat_inspection()
            ])

            setFournisseur(fournisseurData.data)
            setReparation(reparationData.data.data)
            setStatut(statutData.data)
            setPiece(pieceData.data)
            setTache(tacheData.data)


            
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoadingData(false);
        }
    }

        useEffect(()=> {
            fetchDatas()
        }, [id_sud_reparation])
        
    const onFinish = async (values) => {
        await form.validateFields();
        const loadingKey = 'loadingReparation';
        message.loading({ content: 'Traitement en cours, veuillez patienter...', key: loadingKey, duration: 0 });
        
        setLoading(true)
        try {
/*             await postReparation({
                ...values,
                user_cr : userId,
                id_sud_reparation : id_sud_reparation
            }) */
            message.success({ content: 'La réparation a été enregistrée avec succès.', key: loadingKey });
            fetchData();
            form.resetFields();
            closeModal()
            
        } catch (error) {
            console.error("Erreur lors de l'ajout de controle technique:", error);
            message.error({ content: 'Une erreur est survenue.', key: loadingKey });
            notification.error({
                message: 'Erreur',
                description: `${error.response?.data?.error}`,
            });
        } finally {
            setLoading(false);
        }
    }

  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <h2 className="controle_h2">FORM DE RECLAMATION</h2>
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
                    <Row gutter={12}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="intitule"
                                label="Titre"
                                rules={[
                                            {
                                                required: false,
                                                message: 'Veuillez fournir un titre...',
                                            }
                                ]}
                            >
                                {loadingData ? <Skeleton.Input active={true} /> : <Input placeholder="Saisir le titre..." />}
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="date_debut"
                                label="Date début"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez fournir une date...',
                                    },
                                ]}
                                initialValue={moment()}
                            >
                                    {loadingData ? (
                                        <Skeleton.Input active={true} />
                                    ) : (
                                        <DatePicker size='large' format="YYYY-MM-DD" style={{ width: '100%' }} />
                                    )}
                                </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                                <Form.Item
                                    name="montant"
                                    label="Cout"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez fournir un cout...',
                                        }
                                    ]}
                                >
                                    {loadingData ? <Skeleton.Input active={true} /> : <InputNumber size='large' min={0} placeholder="Saisir le cout..." style={{width:'100%'}}/>}
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                                            <Form.Item
                                                                name="id_statut_vehicule"
                                                                label="Statut véhicule"
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message: 'Veuillez selectionner un statut...',
                                                                    },
                                                                ]}
                                                            >
                                                                {loadingData ? <Skeleton.Input active={true} /> : 
                                                                <Select
                                                                    allowClear
                                                                    showSearch
                                                                    options={statut?.map((item) => ({
                                                                        value: item.id_statut_vehicule                                           ,
                                                                        label: `${item.nom_statut_vehicule}`,
                                                                    }))}
                                                                    placeholder="Sélectionnez un statut..."
                                                                    optionFilterProp="label"
                                                                /> }
                                                            </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="description"
                                    label="Description"
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Veuillez fournir la description...',
                                        }
                                    ]}
                                >
                                    {loadingData ? <Skeleton.Input active={true} /> : <Input.TextArea placeholder="Saisir le commentaire..." style={{width:'100%', resize:'none', height:'90px'}}/>}
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="raison_fin"
                                    label="Raison"
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Veuillez fournir la raison...',
                                        }
                                    ]}
                                >
                                    {loadingData ? <Skeleton.Input active={true} /> : <Input.TextArea placeholder="Saisir le commentaire..." style={{width:'100%', resize:'none', height:'90px'}}/>}
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* Réparations dynamiques */}
                        <Form.List name="sub_reclamation">
                        {(fields, { add, remove }) => (
                            <>
                            <Divider className='title_row'>Réclamer</Divider>
                            {fields.map(({ key, name, ...restField }) => (
                                <Row key={key} gutter={12} align="middle">
                                    <Col xs={24} md={7}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'id_type_reparation']}
                                            label="Type de réparation"
                                            rules={[
                                                { required: true, message: 'Veuillez fournir une réparation...' },
                                            ]}
                                        >
                                            <Select
                                                allowClear
                                                showSearch
                                                options={reparation.map((item) => ({
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
                            ))}
                            <Form.Item>
                                <Button
                                type="dashed"
                                onClick={() => add()}
                                icon={<PlusCircleOutlined />}
                                style={{ width: '100%' }}
                                >
                                Ajouter une réclamation
                                </Button>
                            </Form.Item>
                            </>
                        )}
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

export default ReclamationForm;