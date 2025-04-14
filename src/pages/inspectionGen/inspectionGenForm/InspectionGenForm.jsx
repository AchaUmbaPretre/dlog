import React, { useEffect, useState } from 'react'
import { Form, Row, Divider, Col, message, notification, InputNumber, Skeleton, Select, Button, Input, DatePicker } from 'antd';
import { SendOutlined, PlusCircleOutlined, MinusCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, ShopOutlined, WarningOutlined, UserOutlined  } from '@ant-design/icons';
import { getChauffeur, getStatutVehicule, getTypeReparation, getVehicule, postInspectionGen } from '../../../services/charroiService';
import { getFournisseur } from '../../../services/fournisseurService';
import { useSelector } from 'react-redux';

const InspectionGenForm = ({closeModal, fetchData}) => {
    const [form] = Form.useForm();
    const [ loading, setLoading ] = useState(false);
    const [ chauffeur, setChauffeur ] = useState([])
    const [ vehicule, setVehicule ] = useState([])
    const [ loadingData, setLoadingData ] = useState(false);
    const [ fournisseur, setFournisseur ] = useState([]);
    const [ reparation, setReparation ] = useState([]);
    const [ statut, setStatut ] = useState([]);
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);

    const fetchDatas = async () => {

        try {
            const [ vehiculeData, fournisseurData, reparationData, statutData, chauffeurData] = await Promise.all([
                getVehicule(),
                getFournisseur(),
                getTypeReparation(),
                getStatutVehicule(),
                getChauffeur()
            ])
            setVehicule(vehiculeData.data.data)
            setFournisseur(fournisseurData.data)
            setReparation(reparationData.data.data)
            setStatut(statutData.data)
            setChauffeur(chauffeurData.data.data)

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoadingData(false);
        }
    }

    useEffect(()=> {
        fetchDatas()
    }, [])

    const onFinish = async (values) => {
        await form.validateFields();
        const loadingKey = 'loadingReparation';
        message.loading({ content: 'Traitement en cours, veuillez patienter...', key: loadingKey, duration: 0 });
        
        setLoading(true)
        try {
            await postInspectionGen({
                ...values,
                user_cr : userId
            })
            message.success({ content: 'La réparation a été enregistrée avec succès.', key: loadingKey });
            form.resetFields();
            fetchData();
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
                <div className="controle_h2">Form inspection</div>
            </div>
            <div className="controle_wrapper">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Row gutter={12}>
                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Véhicule"
                                name="id_vehicule"
                                rules={[{ required: false, message: 'Veuillez sélectionner un véhicule' }]}
                            >
                                { loadingData ? <Skeleton.Input active={true} /> : 
                                <Select
                                    allowClear
                                    showSearch
                                    options={vehicule.map((item) => ({
                                        value: item.id_vehicule,
                                        label: item.immatriculation,
                                    }))}
                                    optionFilterProp="label"
                                    placeholder="Sélectionnez un vehicule..."
                                /> }
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Chauffeur"
                                name="id_chauffeur"
                                rules={[{ required: true, message: 'Veuillez sélectionner un chauffeur' }]}
                            >
                                { loadingData ? <Skeleton.Input active={true} /> : 
                                <Select
                                    allowClear
                                    showSearch
                                    options={chauffeur.map((item) => ({
                                            value: item.id_chauffeur,
                                            label: item.nom,
                                        }))}
                                    optionFilterProp="label"
                                    placeholder="Sélectionnez une categorie..."
                                />}
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
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
                                    {loadingData ? (
                                        <Skeleton.Input active={true} />
                                    ) : (
                                        <DatePicker style={{ width: '100%' }} />
                                    )}
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item
                                name="date_prevu"
                                label="Date prevue"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez fournir une date...',
                                    },
                                ]}
                        >
                            {loadingData ? (
                                <Skeleton.Input active={true} />
                            ) : (
                                <DatePicker style={{ width: '100%' }} />
                            )}
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item
                                name="id_fournisseur"
                                label="Fournisseur"
                                rules={[
                                    {
                                        required: false,
                                        message: 'Veuillez selectionner un fournisseur...',
                                    },
                                ]}
                            >
                                {loadingData ? <Skeleton.Input active={true} /> : 
                                <Select
                                    allowClear
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
                                name="id_statut_vehicule"
                                label="Statut véhicule"
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
                                    showSearch
                                    options={statut.map((item) => ({
                                        value: item.id_statut_vehicule                                           ,
                                        label: `${item.nom_statut_vehicule}`,
                                    }))}
                                    placeholder="Sélectionnez un statut..."
                                    optionFilterProp="label"
                                /> }
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={12}>
                    <Col xs={24} md={12}>
                            <Form.Item
                                name="commentaire"
                                label="Préoccupations"
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
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="avis"
                                label="Avis d'expert"
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
                    
                                <Col xs={24} md={11}>
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
                                
                                <Col xs={24} md={11}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'montant']}
                                        label="Montant"
                                        rules={[{ required: false, message: 'Veuillez fournir le montant...' },]}
                                    >
                                        <InputNumber min={0} placeholder="Saisir le montant..." style={{width:'100%'}}/>
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
                        <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                            Soumettre
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    </>
  )
}

export default InspectionGenForm