import React, { useEffect, useState } from 'react'
import { Row, Form, Skeleton, notification, Col, Select, Button, Input, message, Space } from 'antd';
import { getProvince } from '../../../../services/clientService';
import { postSite } from '../../../../services/charroiService';
const { Option } = Select;

const SitesForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [province, setProvince] = useState([]);

    const fetchData = async () => {        
        try {
            setLoadingData(true)
            const [villeData] = await Promise.all([
                getProvince()
            ])

            setProvince(villeData.data)
            
        } catch (error) {
            console.log(error)
        } finally {
            setLoadingData(false); 
        }
    }

    useEffect(()=> {
        fetchData()
    }, [])

    const onFinish = async (values) => {
        setLoading(true)
        const loadingKey = 'loadingSite';

        try {
            message.loading({ content: 'En cours...', key: 'submit' });
            await postSite(values)
            message.success({ content: 'Le site a ete enregistré avec succès.' });

            form.resetFields();

        } catch (error) {
            console.error("Erreur lors de l'ajout de la déclaration:", error);
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
                                name="zone"
                                label="Zone"
                                rules={[
                                    {
                                        required: false,
                                        message: 'Veuillez fournir une zone...',
                                    },
                                ]}
                            >
                                <Select allowClear size='large' placeholder="Choisir une zone">
                                    <Option value="1">Zone 1</Option>
                                    <Option value="2">Zone 2</Option>
                                </Select>
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