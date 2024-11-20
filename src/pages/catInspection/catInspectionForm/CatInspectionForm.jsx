import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { postCat_inspection } from '../../../services/batimentService';

const CatInspectionForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async(values) => {
    setLoading(true)
    await postCat_inspection(values)
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
    <div className="controle_form">
      <div className="controle_title_rows">
        <h2 className="controle_h2">Inserer une nouvelle categorie inspection</h2>
      </div>
      <div className="controle_wrapper">
        <Form
        form={form}
        name="format_form"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={{ maxWidth: 600, margin: '0 auto' }}
      >
        <Form.Item
          label="Nom categorie inspection"
          name="nom_cat_inspection"
          rules={[{ required: true, message: 'Veuillez entrer la categorie d inspection' }]}
        >
          <Input placeholder="Entrez la categorie" />
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

export default CatInspectionForm;
