import React, { useEffect, useState } from 'react'
import { Col, DatePicker, Form, notification, Input, InputNumber, Row, Select, Skeleton, Button, Divider, message } from 'antd';
import { MinusCircleOutlined, SendOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { getChauffeur, getTypeReparation, getVehicule, postControleTechnique } from '../../../services/charroiService';
import { getFournisseur } from '../../../services/fournisseurService';
import { useSelector } from 'react-redux';

const { Option } = Select;

const ControleTechniqueForm = ({closeModal,fetchData}) => {
    const [form] = Form.useForm();
    const [loadingData, setLoadingData] = useState(false);
    const [vehicule, setVehicule] = useState([]);
    const [fournisseur, setFournisseur] = useState([]);
    const [chauffeur, setChauffeur] = useState([]);
    const [loading, setLoading] = useState(false);
    const [reparation, setReparation] = useState([]);
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);

    const fetchDatas = async() => {
        try {
            const [vehiculeData, reparationData, fournisseurData, chauffeurData] = await Promise.all([
                getVehicule(),
                getTypeReparation(),
                getFournisseur(),
                getChauffeur()
            ])
            setVehicule(vehiculeData.data.data)
            setReparation(reparationData.data.data)
            setFournisseur(fournisseurData.data)
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

        const loadingKey = 'loadingControle';
        message.loading({ content: 'Traitement en cours, veuillez patienter...', key: loadingKey, duration: 0 });
    
        setLoading(true);
        try {
                await postControleTechnique({
                    ...values,
                    user_cr : userId
                });
            message.success({ content: 'Le controle technique a enregistré avec succès.', key: loadingKey });
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
    };

  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <h2 className="controle_h2">ENREGISTRER UN NOUVEAU CONTROLE TECHNIQUE</h2>
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
                                label="Immatriculation"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez fournir une immatriculation...',
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
                                    name="date_controle"
                                    label="Date Controle"
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
                                        <DatePicker size='large' style={{ width: '100%' }} />
                                    )}
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="date_validite"
                                    label="Date validité"
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
                                        <DatePicker size='large' style={{ width: '100%' }} />
                                    )}
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="kilometrage"
                                    label="Kilometrage"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez fournir un kilometrage...',
                                        },
                                    ]}
                                >
                                    {loadingData ? (
                                        <Skeleton.Input active={true} />
                                    ) : (
                                        <InputNumber
                                            size='large'
                                            min={0}
                                            placeholder="Saisir le kilometrage"
                                            style={{ width: '100%' }}
                                        />
                                    )}
                                </Form.Item>
                            </Col> 

                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="ref_controle"
                                    label="Ref. Controle Tech"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez fournir une référence...',
                                        }
                                    ]}
                                >
                                    {loadingData ? <Skeleton.Input active={true} /> : <Input size='large' placeholder="Saisir la ref..." style={{width:'100%'}}/>}
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="id_agent"
                                    label="Agent"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez selectionner un agent...',
                                        },
                                    ]}
                                >
                                    {loadingData ? <Skeleton.Input active={true} /> : 
                                    <Select size='large' placeholder="Choisir un agent">
                                        <Option value="1">Agent 1</Option>
                                        <Option value="2">Agent 2</Option>
                                    </Select> }
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="resultat"
                                    label="Resultat"
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Veuillez fournir un résultat...',
                                        }
                                    ]}
                                >
                                    {loadingData ? <Skeleton.Input active={true} /> : <Input size='large' placeholder="Saisir le resultat.." style={{width:'100%'}}/>}
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="cout_device"
                                    label="Cout(devise)"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez fournir un cout...',
                                        }
                                    ]}
                                >
                                    {loadingData ? <Skeleton.Input active={true} /> : <InputNumber size='large' min={0} placeholder="Saisir le kilometrage" style={{width:'100%'}}/>}
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="cout_ttc"
                                    label="Cout TTC"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez fournir un cout TCC...',
                                        }
                                    ]}
                                >
                                    {loadingData ? <Skeleton.Input active={true} /> : <InputNumber size='large' min={0} placeholder="Saisir le cout TCC" style={{width:'100%'}}/>}
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="taxe"
                                    label="Taxe"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez fournir une taxe...',
                                        }
                                    ]}
                                >
                                    {loadingData ? <Skeleton.Input active={true} /> : <InputNumber size='large' min={0} placeholder="Saisir la taxe..." style={{width:'100%'}}/>}
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="id_fournisseur"
                                    label="Fournisseur"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez fournir un fournisseur...',
                                        },
                                    ]}
                                >
                                    {loadingData ? (
                                        <Skeleton.Input active={true} />
                                    ) : (
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
                                        />
                                    )}
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="id_chauffeur"
                                    label="Chauffeur"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez sélectionner un chauffeur...',
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
                                            options={chauffeur.map((item) => ({
                                                value: item.id_chauffeur                                            ,
                                                label: `${item.nom} - ${item.prenom}`,
                                            }))}
                                            placeholder="Sélectionnez un chauffeur..."
                                            optionFilterProp="label"
                                        />
                                    )}
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
                                    {loadingData ? <Skeleton.Input active={true} /> : <Input.TextArea placeholder="Saisir le commentaire..." style={{width:'100%', resize:'none'}}/>}
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
                                    name={[name, 'visite']}
                                    label="Autre visite"
                                    rules={[
                                        { required: false, message: 'Veuillez fournir l information de ce champ...' },
                                    ]}
                                    >
                                    <Select placeholder="Choisir une réparation">
                                        <Option value="1">OUI</Option>
                                        <Option value="2">NON</Option>
                                    </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'description']}
                                        label="Description"
                                        rules={[
                                            { required: false, message: 'Veuillez fournir une description...' },
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

export default ControleTechniqueForm