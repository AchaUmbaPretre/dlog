import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, InputNumber, message, Typography, Row, Col, notification } from 'antd';
import axios from 'axios';
import './binForm.css'; // Assurez-vous de créer un fichier CSS pour le style personnalisé
import { getStatutBin, getTypeBin } from '../../../../services/typeService';

const { Option } = Select;
const { Title } = Typography;

const BinForm = ({id_entrepot}) => {
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
        const value = {
            id_entrepot  : id_entrepot,
            ...values
        }
        try {
            await axios.post('/api/bins', values);
            message.success('Bin créé avec succès !', 3);
            form.resetFields();
        } catch (error) {
            message.error('Erreur lors de la création du bin. Veuillez réessayer.', 3);
        }
    };

    return (
        <div className="bin-form-container">
            <div className="controle_title_rows">
                <h2 className='controle_h2'>Créer un Nouvel Bin</h2>                
            </div>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    statut: 1,
                    type_stockage: 1,
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
                            <Select
                                showSearch
                                options={type.map((item) => ({
                                    value: item.id_type_stockage_bins,
                                    label: item.nom_stockage,
                                }))}
                                placeholder="Sélectionnez..."
                                optionFilterProp="label"
                            />
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
                            <Select
                                showSearch
                                options={status.map((item) => ({
                                    value: item.id_statut_bins,
                                    label: item.nom_statut_bins,
                                }))}
                                placeholder="Sélectionnez..."
                                optionFilterProp="label"
                            />
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
