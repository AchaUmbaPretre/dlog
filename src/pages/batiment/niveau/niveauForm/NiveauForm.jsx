import React, { useState, useEffect } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { getNiveauOnev, postNiveau, putNiveau } from '../../../../services/batimentService';

const NiveauForm = ({ idBatiment, closeModal, fetchData, idNiveau }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const fetchDataOne = async () => {
    setLoading(true);
    try {
      const { data } = await getNiveauOnev(idNiveau);
      form.setFieldsValue({ niveaux: [{ nom_niveau: data[0].nom_niveau }] });
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idNiveau) fetchDataOne();
  }, [idNiveau]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (idNiveau) {
        await putNiveau(idNiveau, values.niveaux[0]);
        notification.success({
          message: 'Succès',
          description: 'Le niveau a été mis à jour avec succès.',
        });
      } else {
        await postNiveau(idBatiment, values.niveaux);
        notification.success({
          message: 'Succès',
          description: 'Les niveaux ont été ajoutés avec succès.',
        });
      }

      form.resetFields();
      closeModal();
      fetchData();
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
          <Form.List name="niveaux" initialValue={[{ nom_niveau: '' }]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <div key={field.key} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <Form.Item
                      {...field}
                      label="Nom du niveau"
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
                { !idNiveau &&
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                      Ajouter un niveau
                    </Button>
                </Form.Item>
                }
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
              { idNiveau ? 'Modifier' : 'Soumettre'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default NiveauForm;
