import React, { useEffect, useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { getFrequenceOne, postFrequence, putFrequence } from '../../../services/frequenceService';

const FrequenceForm = ({idFrequence}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async(values) => {
    setLoading(true);
    try {
        if(idFrequence) {
            await putFrequence(idFrequence, values)
        }
        else {
            await postFrequence(values)
        }
        notification.success({
          message: 'Succès',
          description: 'Le formulaire a été soumis avec succès.',
        });
        window.location.reload();
        
    } catch (error) {
        notification.error({
            message: 'Erreur',
            description: "Erreur lors de l'enregistrement du projet.",
        });
    }
    finally {
        setLoading(false);
    }
  };

  useEffect(()=> {
    const fetchData = async () => {
        const {data} = await getFrequenceOne(idFrequence)
        if(data && data[0] ){
            form.setFieldsValue(data[0])
        }
    }

    fetchData();
  }, [idFrequence])

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
        label="Frequence"
        name="nom"
        rules={[{ required: true, message: 'Veuillez entrer le nom de frequence' }]}
      >
        <Input placeholder="Entrez le nom de frequence" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
          Soumettre
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FrequenceForm;
