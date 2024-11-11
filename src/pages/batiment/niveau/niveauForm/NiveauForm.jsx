import React, { useState } from 'react';
import { Form, Input, Button, notification, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { postNiveau } from '../../../../services/batimentService';

const NiveauForm = ({ idBatiment }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Envoyer tous les noms de niveaux sous forme de tableau
      await postNiveau(idBatiment, values.niveaux);
      notification.success({
        message: 'Succès',
        description: 'Les niveaux ont été ajoutés avec succès.',
      });
      form.resetFields();
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: "Erreur lors de l'enregistrement des niveaux.",
      });
    } finally {
      setLoading(false);
    }
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
        <h2 className="controle_h2">Insérer plusieurs niveaux</h2>
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
          <Form.List
            name="niveaux"
            initialValue={[{ nom_niveau: '' }]}
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <div key={field.key} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <Form.Item
                      {...field}
                      label={`Nom du niveau`}
                      name={[field.name, 'nom_niveau']}
                      fieldKey={[field.fieldKey, 'nom_niveau']}
                      rules={[{ required: true, message: 'Veuillez entrer le nom du niveau' }]}
                      style={{ flex: 1 }}
                    >
                      <Input placeholder="Entrez le nom du niveau..." />
                    </Form.Item>
                    {fields.length > 1 && (
                      <MinusCircleOutlined onClick={() => remove(field.name)} style={{ marginLeft: 8 }} />
                    )}
                  </div>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    Ajouter un niveau
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
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

export default NiveauForm;
