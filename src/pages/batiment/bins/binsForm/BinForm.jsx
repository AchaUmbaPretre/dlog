import React, { useState } from 'react';
import { Form, Input, Select, Button, InputNumber, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const BinForm = () => {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            // Envoyer les données à l'API
            const response = await axios.post('/api/bins', values);
            message.success('Bin créé avec succès !');
            form.resetFields();
        } catch (error) {
            message.error('Erreur lors de la création du bin.');
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
                statut: 'libre',
                type_stockage: 'sec',
            }}
        >
            <Form.Item
                label="Nom"
                name="nom"
                rules={[{ required: true, message: 'Veuillez entrer le nom du bin.' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Superficie (m²)"
                name="superficie"
                rules={[{ required: true, message: 'Veuillez entrer la superficie.' }]}
            >
                <InputNumber min={0} />
            </Form.Item>

            <Form.Item
                label="Longueur (m)"
                name="longueur"
                rules={[{ required: true, message: 'Veuillez entrer la longueur.' }]}
            >
                <InputNumber min={0} />
            </Form.Item>

            <Form.Item
                label="Largeur (m)"
                name="largeur"
                rules={[{ required: true, message: 'Veuillez entrer la largeur.' }]}
            >
                <InputNumber min={0} />
            </Form.Item>

            <Form.Item
                label="Hauteur (m)"
                name="hauteur"
                rules={[{ required: true, message: 'Veuillez entrer la hauteur.' }]}
            >
                <InputNumber min={0} />
            </Form.Item>

            <Form.Item
                label="Capacité"
                name="capacite"
                rules={[{ required: true, message: 'Veuillez entrer la capacité.' }]}
            >
                <InputNumber min={0} />
            </Form.Item>

            <Form.Item
                label="Type de stockage"
                name="type_stockage"
                rules={[{ required: true, message: 'Veuillez sélectionner un type de stockage.' }]}
            >
                <Select>
                    <Option value="sec">Sec</Option>
                    <Option value="liquide">Liquide</Option>
                    <Option value="dangereux">Dangereux</Option>
                </Select>
            </Form.Item>

            <Form.Item
                label="Statut"
                name="statut"
                rules={[{ required: true, message: 'Veuillez sélectionner un statut.' }]}
            >
                <Select>
                    <Option value="occupé">Occupé</Option>
                    <Option value="libre">Libre</Option>
                </Select>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Créer Bin
                </Button>
            </Form.Item>
        </Form>
    );
};

export default BinForm;
