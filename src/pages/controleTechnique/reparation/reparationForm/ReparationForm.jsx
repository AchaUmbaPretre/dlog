import React, { useEffect, useState } from 'react'
import { Col, DatePicker, Form, notification, Input, InputNumber, Row, Select, Skeleton, Button, Divider, message } from 'antd';
import { SendOutlined, PlusCircleOutlined, MinusCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, ShopOutlined, WarningOutlined, UserOutlined  } from '@ant-design/icons';
import { getFournisseur } from '../../../../services/fournisseurService';
import { getInspectionValide, getTypeReparation, getVehicule, postReparation } from '../../../../services/charroiService';
import { useSelector } from 'react-redux';
import { getTypes } from '../../../../services/typeService';
import moment from 'moment';

const { Option } = Select;

const ReparationForm = ({closeModal, fetchData, subInspectionId}) => {
    const [form] = Form.useForm();
    const [loadingData, setLoadingData] = useState(false);
    const [fournisseur, setFournisseur] = useState([]);
    const [vehicule, setVehicule] = useState([]);
    const [idSubInspectionGen, setIdSubInspectionGen] = useState('');
    const [reparation, setReparation] = useState([]);
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
    const [loading, setLoading] = useState(false);
    
    const fetchDatas = async () => {
        try {
            const [vehiculeData, fournisseurData, reparationData, typesData] = await Promise.all([
                getVehicule(),
                getFournisseur(),
                getTypeReparation(),
                getTypes(),
            ])

            setFournisseur(fournisseurData.data)
            setVehicule(vehiculeData.data.data)
            setReparation(reparationData.data.data)

            if(subInspectionId){
                const { data : d } = await getInspectionValide(subInspectionId)
                form.setFieldsValue({
                    id_vehicule: d[0]?.id_vehicule,
                    cout: d[0]?.manoeuvre,
                    montant : d[0]?.cout,
                    reparations: d.map((item) => ({
                        id_type_reparation: item.id_type_reparation,
                        montant: item.budget_valide,
                        description: item.description || ''
                    }))
                })

                setIdSubInspectionGen(d[0]?.id_sub_inspection_gen)
            }
            
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoadingData(false);
        }
    }

        useEffect(()=> {
            fetchDatas()
        }, [subInspectionId])
        
    const onFinish = async (values) => {
        await form.validateFields();
        const loadingKey = 'loadingReparation';
        message.loading({ content: 'Traitement en cours, veuillez patienter...', key: loadingKey, duration: 0 });
        
        setLoading(true)
        try {
            await postReparation({
                ...values,
                user_cr : userId,
                id_sub_inspection_gen : idSubInspectionGen
            })
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
                <h2 className="controle_h2">ENREGISTRER UNE REPARATION</h2>
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
                        <Col xs={24} md={8}>
                            <Form.Item
                                name="id_vehicule"
                                label="Matricule"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez sélectionner un groupe...',
                                    },
                                ]}
                            >
                                {loadingData ? (
                                <Skeleton.Input active={true} />
                                ) : (
                                    <Select
                                        size='large'
                                        allowClear
                                        showSearch
                                        options={vehicule.map((item) => ({
                                            value: item.id_vehicule                                           ,
                                            label: `${item.immatriculation} / ${item.nom_marque} / ${item.modele}`,
                                        }))}
                                        placeholder="Sélectionnez un vehicule..."
                                        optionFilterProp="label"
                                    />
                                )}
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item
                                name="date_entree"
                                label="Date entrée"
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
                                        <DatePicker size='large' style={{ width: '100%' }} />
                                    )}
                                </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
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
                            {loadingData ? (
                                <Skeleton.Input active={true} />
                            ) : (
                                <DatePicker size='large' style={{ width: '100%' }} />
                            )}
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                                <Form.Item
                                    name="cout"
                                    label="Cout(devise)"
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

                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="id_fournisseur"
                                    label="Fournisseur"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez selectionner un fournisseur...',
                                        },
                                    ]}
                                >
                                    {loadingData ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        allowClear
                                        size='large'
                                        showSearch
                                        options={fournisseur.map((item) => ({
                                            value: item.id_fournisseur                                           ,
                                            label: `${item.nom_fournisseur}`,
                                        }))}
                                        placeholder="Sélectionnez un fournisseur..."
                                        optionFilterProp="label"
                                    /> }
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="code_rep"
                                    label="Code de réparation"
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Veuillez fournir une référence...',
                                        }
                                    ]}
                                >
                                    {loadingData ? <Skeleton.Input active={true} /> : <Input size='large' placeholder="Saisir le code de réparation..." style={{width:'100%'}}/>}
                                </Form.Item>
                            </Col>

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
                        </Row>

                        {/* Réparations dynamiques */}
                        <Form.List name="reparations">
                        {(fields, { add, remove }) => (
                            <>
                            <Divider className='title_row'>Réparations</Divider>
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
                                Ajouter une réparation
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

export default ReparationForm