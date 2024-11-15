import React, { useState } from 'react';
import { Form, Input, Select, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

const InstructionFormOne = ({idBatiment}) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    console.log('Form Values:', values);
  };

  return (
    <div className="controle_form">
        <div className="controle_title_rows">
            <h2 className="controle_h2">Insérer une instruction</h2>
        </div>
        <div className="controle_wrapper">
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                id_batiment: '',
                commentaire: '',
                id_cat_instruction: '',
                }}
            >
                {/* Commentaire */}
                <Form.Item
                label="Commentaire"
                name="commentaire"
                rules={[{ required: true, message: 'Veuillez entrer un commentaire' }]}
                >
                <TextArea rows={4} placeholder="Entrez votre commentaire" />
                </Form.Item>

                {/* Catégorie d'instruction */}
                <Form.Item
                label="Catégorie d'Instruction"
                name="id_cat_instruction"
                rules={[{ required: true, message: 'Veuillez sélectionner une catégorie' }]}
                >
                <Select placeholder="Sélectionnez une catégorie">
                    <Option value={1}>Catégorie 1</Option>
                    <Option value={2}>Catégorie 2</Option>
                    <Option value={3}>Catégorie 3</Option>
                </Select>
                </Form.Item>

                {/* Type instruction */}
                <Form.Item
                label="Type d'instruction"
                name="id_type_instruction"
                rules={[{ required: true, message: 'Veuillez sélectionner un type d instruction' }]}
                >
                    <Select placeholder="Sélectionnez une catégorie">
                        <Option value={1}>Catégorie 1</Option>
                        <Option value={2}>Catégorie 2</Option>
                        <Option value={3}>Catégorie 3</Option>
                    </Select>
                </Form.Item>

                {/* Image Upload */}
                <Form.Item
                label="Image"
                name="img"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                rules={[{ required: true, message: 'Veuillez télécharger une image' }]}
                >
                <Upload name="img" listType="picture" beforeUpload={() => false}>
                    <Button icon={<UploadOutlined />}>Télécharger une image</Button>
                </Upload>
                </Form.Item>

                {/* Bouton de soumission */}
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Soumettre
                    </Button>
                </Form.Item>
            </Form>
        </div>
    </div>
  );
};

export default InstructionFormOne;
