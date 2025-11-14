import React, { useEffect, useState } from 'react'
import { Row, Form, Skeleton, notification, Col, Select, Button, Input, message, Space } from 'antd';
import { getProvince } from '../../../../services/clientService';
import { getZone, postSite } from '../../../../services/charroiService';
const { Option } = Select;

const SitesForm = ({closeModal, fetchData}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [province, setProvince] = useState([]);
    const [zone, setZone] = useState([]);


    const fetchDatas = async () => {        
        try {
            setLoadingData(true)
            const [villeData, zoneData] = await Promise.all([
                getProvince(),
                getZone()
            ])

            setProvince(villeData.data)
            setZone(zoneData.data)
            
        } catch (error) {
            console.log(error)
        } finally {
            setLoadingData(false); 
        }
    }

    useEffect(()=> {
        fetchDatas()
    }, [])

    const onFinish = async (values) => {
        setLoading(true);
        const loadingKey = 'loadingSite';
    
        try {
            message.loading({ content: 'En cours...', key: loadingKey });
    
            await postSite(values);
    
            message.success({
                content: 'Le site a été enregistré avec succès.',
                key: loadingKey,
            });
    
            form.resetFields();
            closeModal();
            fetchData();
        } catch (error) {
            console.error("Erreur lors de l'ajout de la déclaration:", error);
    
            message.error({
                content: 'Une erreur est survenue.',
                key: loadingKey, 
            });
    
            notification.error({
                message: 'Erreur',
                description: error.response?.data?.error || 'Une erreur inconnue s\'est produite.',
            });
        } finally {
            setLoading(false);
        }
    };
    
  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <h2 className="controle_h2">Form site</h2>
            </div>
            <div className="controle_wrapper">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Row gutter={12}>
                        <Col xs={24} md={12}>
                                <Form.Item
                                    name="CodeSite"
                                    label="Code site"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez fournir un code...',
                                        },
                                    ]}
                                >
                                    {loadingData ? <Skeleton.Input active={true} /> : <Input placeholder="Saisir le code..." size='large' />}
                                </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                                <Form.Item
                                    name="nom_site"
                                    label="Nom site"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez fournir un nom site... ',
                                        },
                                    ]}
                                >
                                    {loadingData ? <Skeleton.Input active={true} /> : <Input placeholder="Saisir..." size='large' />}
                                </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="IdVille"
                                label="Ville"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez fournir une ville...',
                                    },
                                ]}
                                >
                                    <Select
                                        size='large'
                                        allowClear
                                        showSearch
                                        options={province?.map((item) => ({
                                            value: item.id,
                                            label: item.capital,
                                        }))}
                                        placeholder="Sélectionnez une ville..."
                                        optionFilterProp="label"
                                    />
                                </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="IdZone"
                                label="Zone"
                                rules={[
                                    {
                                        required: false,
                                        message: 'Veuillez fournir une zone...',
                                    },
                                ]}
                            >
                                <Select
                                        size='large'
                                        allowClear
                                        showSearch
                                        options={zone?.map((item) => ({
                                            value: item.id,
                                            label: item.NomZone,
                                        }))}
                                        placeholder="Sélectionnez une zone..."
                                        optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="tel"
                                label="Telephone"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez fournir un telephone...',
                                    },
                                ]}
                                >
                                    {loadingData ? <Skeleton.Input active={true} /> : <Input size='large' placeholder="+243" />}

                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="adress"
                                    label="Adresse"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez fournir une adresse...',
                                        },
                                    ]}
                                >
                                    {loadingData ? <Skeleton.Input active={true} /> : <Input.TextArea placeholder="Saisir l'adresse...." style={{height:"80px", resize:'none'}} />}
                                </Form.Item>
                            </Col>

                            <Col xs={24}>
                                <Form.Item>
                                    <Space className="button-group">
                                        <Button size='large' type="primary" htmlType="submit" loading={loading} disabled={loading}>
                                            {'Ajouter'}
                                        </Button>
                                        <Button size='large' htmlType="reset">
                                            Réinitialiser
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </Col>
                    </Row>
                </Form>
            </div>
        </div>
    </>
  )
}

export default SitesForm