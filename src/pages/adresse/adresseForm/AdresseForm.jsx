import React, { useEffect, useState } from 'react';
import { Form, Input, Button, notification, Select } from 'antd';
import { getBins, postAdresse } from '../../../services/batimentService';

const AdresseForm = ({closeModal, fetchData}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [batiment, setBatiment] = useState([]);

  const fetchDataAll = async () => {
        
    try {
        const [binData] = await Promise.all([
            getBins()
        ])
        setBatiment(binData.data)

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
    await postAdresse(values)
    notification.success({
      message: 'Succès',
      description: 'Le formulaire a été soumis avec succès.',
    });
    
    fetchData();
    closeModal();
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
    <div className="client_form" style={{ padding: '20px', background: '#fff', borderRadius: '5px' }}>
      <div className="controle_title_rows">
        <h2 className="controle_h2">Insérer une adresse</h2>
      </div>
      <div className="client_wrapper">
        <Form
          form={form}
          name="format_form"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          style={{ maxWidth: 600, margin: '0 auto' }}
        >
          <Form.Item
            label="Bin"
            name="id_bin"
            rules={[{ required: true, message: 'Veuillez entrer un bin' }]}
          >
            <Select
              showSearch
              options={batiment.map(item => ({ value: item.id, label: item.nom }))}
              placeholder="Sélectionnez..."
              optionFilterProp="label"
            />
          </Form.Item>

          <Form.Item
            label="Adresse"
            name="adresse"
            rules={[{ required: true, message: 'Veuillez entrer une adresse' }]}
          >
            <Input.TextArea rows={4} placeholder="Entrez l'adresse..." />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
              Soumettre
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AdresseForm;
