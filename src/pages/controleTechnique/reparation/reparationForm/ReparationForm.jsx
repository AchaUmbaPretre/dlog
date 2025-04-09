import React, { useEffect, useState } from 'react'
import { Col, DatePicker, Form, notification, Input, InputNumber, Row, Select, Skeleton, Button, Divider, message } from 'antd';
import { SendOutlined, PlusCircleOutlined, MinusCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, ShopOutlined, WarningOutlined, UserOutlined  } from '@ant-design/icons';
import { getFournisseur } from '../../../../services/fournisseurService';
import { getChauffeur, getTypeReparation, getVehicule } from '../../../../services/charroiService';

const { Option } = Select;

const ReparationForm = () => {
    const [form] = Form.useForm();
    const [loadingData, setLoadingData] = useState(false);
    const [fournisseur, setFournisseur] = useState([]);
    const [vehicule, setVehicule] = useState([]);
    const [chauffeur, setChauffeur] = useState([]);
    const [reparation, setReparation] = useState([]);
    const [loading, setLoading] = useState(false);
    

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
                                        <Col xs={24} md={12}>
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
                
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    name="date_debut"
                                                    label="Date entrée"
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
                
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    name="date_fin"
                                                    label="Date sortie"
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
                
                                            <Col xs={24} md={12}>
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
                                                    {loadingData ? <Skeleton.Input active={true} /> : <Input.TextArea placeholder="Saisir le commentaire..." style={{width:'100%', resize:'none', height:'80px'}}/>}
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

export default ReparationForm