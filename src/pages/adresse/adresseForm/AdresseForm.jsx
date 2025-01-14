import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { postFormat } from '../../../services/formatService';
import { getBatiment } from '../../../services/typeService';

const AdresseForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [batiment, setBatiment] = useState([]);

  const fetchDataAll = async () => {
        
    try {
        const [batimentData] = await Promise.all([
            getBatiment()
        ])
        setBatiment(batimentData.data)
        

    } catch (error) {
        notification.error({
            message: 'Erreur de chargement',
            description: 'Une erreur est survenue lors du chargement des données.',
        });
    }
};

useEffect(() => {
  fetchDataAll()
}, []);

  const onFinish = async(values) => {
    setLoading(true)
    await postFormat(values)
    notification.success({
      message: 'Succès',
      description: 'Le formulaire a été soumis avec succès.',
    });
    
    window.location.reload();
    form.resetFields();
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Échec de la soumission:', errorInfo);
    notification.error({
      message: 'Erreur',
      description: 'Veuillez vérifier les champs du formulaire.',
    });
  };

  return (
    <Form
      form={form}
      name="format_form"
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      style={{ maxWidth: 600, margin: '0 auto' }}
    >
      <Form.Item
        label="Batiment"
        name="id_batiment"
        rules={[{ required: true, message: 'Veuillez entrer le batiment' }]}
      >
        <Select
          showSearch
          options={templates.map(item => ({ value: item.id_batiment, label: item.nom_batiment }))}
          placeholder="Sélectionnez..."
          onChange={setIdTemplate}
          optionFilterProp="label"
        />
      </Form.Item>

      <Form.Item
        label="Adresse"
        name="adresse"
        rules={[{ required: false, message: 'Veuillez entrer une adresse' }]}
      >
        <Input.TextArea rows={4} placeholder="Entrez une description" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
          Soumettre
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AdresseForm;
