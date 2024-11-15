import React, { useState } from 'react';
import { Form, Input, Select, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

const InstructionForm = ({idBatiment}) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    console.log('Form Values:', values);
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>Instruction Form</h2>
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
        {/* ID Bâtiment */}
        <Form.Item
          label="ID Bâtiment"
          name="id_batiment"
          rules={[{ required: true, message: 'Veuillez entrer l’ID du bâtiment' }]}
        >
          <Input placeholder="Entrez l'ID du bâtiment" />
        </Form.Item>

        {/* Commentaire */}
        <Form.Item
          label="Commentaire"
          name="commentaire"
          rules={[{ required: true, message: 'Veuillez entrer un commentaire' }]}
        >
          <TextArea rows={4} placeholder="Entrez votre commentaire" />
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

        {/* Bouton de soumission */}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Soumettre
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default InstructionForm;
