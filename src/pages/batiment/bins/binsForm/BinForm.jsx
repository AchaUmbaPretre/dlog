import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, InputNumber, message, Typography, Row, Col, notification } from 'antd';
import axios from 'axios';
import './binForm.css'; // Assurez-vous de créer un fichier CSS pour le style personnalisé
import { getStatutBin, getTypeBin } from '../../../../services/typeService';

const { Option } = Select;
const { Title } = Typography;

const BinForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState([]);
    const [status, setStatus] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const [typeResponse,statusResponse] = await Promise.all([
              getTypeBin(),
              getStatutBin()
            ]);

            setType(typeResponse.data);
            setStatus(statusResponse.data)

          } catch (error) {
            notification.error({
              message: 'Erreur de chargement',
              description: 'Une erreur est survenue lors du chargement des données.',
            });
          } finally {
            setLoading(false);
          }
        };
    
        fetchData();
      }, []);

    const onFinish = async (values) => {
        try {
            const response = await axios.post('/api/bins', values);
            message.success('Bin créé avec succès !', 3);
            form.resetFields();
        } catch (error) {
            message.error('Erreur lors de la création du bin. Veuillez réessayer.', 3);
        }
    };

    return (
        <div className="bin-form-container">
            <Title level={2} className="form-title">Créer un Bin</Title>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    statut: 'libre',
                    type_stockage: 'sec',
                }}
                className="bin-form"
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Nom"
                            name="nom"
                            rules={[{ required: true, message: 'Veuillez entrer le nom du bin.' }]}
                        >
                            <Input placeholder="Entrez le nom du bin" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Superficie (m²)"
                            name="superficie"
                            rules={[{ required: true, message: 'Veuillez entrer la superficie.' }]}
                        >
                            <InputNumber min={0} placeholder="m²" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            label="Longueur (m)"
                            name="longueur"
                            rules={[{ required: true, message: 'Veuillez entrer la longueur.' }]}
                        >
                            <InputNumber min={0} placeholder="m" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Largeur (m)"
                            name="largeur"
                            rules={[{ required: true, message: 'Veuillez entrer la largeur.' }]}
                        >
                            <InputNumber min={0} placeholder="m" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Hauteur (m)"
                            name="hauteur"
                            rules={[{ required: true, message: 'Veuillez entrer la hauteur.' }]}
                        >
                            <InputNumber min={0} placeholder="m" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Capacité"
                            name="capacite"
                            rules={[{ required: true, message: 'Veuillez entrer la capacité.' }]}
                        >
                            <InputNumber min={0} placeholder="Capacité" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Type de stockage"
                            name="type_stockage"
                            rules={[{ required: true, message: 'Veuillez sélectionner un type de stockage.' }]}
                        >
                            <Select placeholder="Sélectionnez un type de stockage">
                                <Option value="sec">Sec</Option>
                                <Option value="liquide">Liquide</Option>
                                <Option value="dangereux">Dangereux</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Statut"
                            name="statut"
                            rules={[{ required: true, message: 'Veuillez sélectionner un statut.' }]}
                        >
                            <Select placeholder="Sélectionnez un statut">
                                <Option value="occupé">Occupé</Option>
                                <Option value="libre">Libre</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="submit-button" block>
                        Créer Bin
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default BinForm;
