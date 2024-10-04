import React, { useState } from 'react';
import { Form, Button, message, Input } from 'antd';
import { postTag } from '../../../services/tacheService';


const TacheTagsForm = ({idTache,closeModal,fetchData}) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      await postTag(idTache, values)
      message.success('Tâche et balises associées avec succès !');
      closeModal();
      fetchData();
      form.resetFields();
    } catch (error) {
      message.error("Impossible d'associer la tâche aux balises");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="controle_form">
        <div className="controle_title_rows">
            <h2 className="controle_h2">Ajoutez le tag</h2>
        </div>
        <div className="controle_wrapper">
            <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}
        >
        <Form.Item
            label="Nom tag"
            name="nom_tag"
            rules={[{ required: true, message: 'Veuillez entrer le nom du tag' }]}
        >
            <Input placeholder="Entrez le nom du tag" />
        </Form.Item>

        <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading} disabled={isLoading}>
                Enregister
            </Button>
        </Form.Item>
            </Form>
        </div>
    </div>
  );
};

export default TacheTagsForm;
