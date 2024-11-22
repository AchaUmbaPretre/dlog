import React, { useEffect, useState } from 'react';
import { Form, Input, Button, notification, Select } from 'antd';
import { putInspectionTache } from '../../../services/batimentService';
import { getTache } from '../../../services/tacheService';

const { Option } = Select;

const InspectionTache = ({ closeModal, fetchData, idInspection }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);


  const fetchDataTache = async () => {
    try {
      const { data } = await getTache();
      setData(data.taches);
      setLoading(false);
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données.',
      })

      setLoading(false);
    }
  };

useEffect(() => {
  fetchDataTache();
}, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
        await putInspectionTache( idInspection, values);
      notification.success({
        message: 'Succès',
        description: 'Le formulaire a été soumis avec succès.',
      });
      form.resetFields();
      closeModal();
      fetchData();
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: "Erreur lors de l'enregistrement de la fréquence.",
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
    <Form
      form={form}
      name="inspectionTache_form"
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      style={{ maxWidth: 600, margin: '0 auto' }}
    >
      <Form.Item
        label="Tache"
        name="id_tache"
        rules={[{ required: true, message: 'Veuillez selectionner une tache' }]}
      >
            <Select placeholder="Sélectionnez une tache">
                {data?.map((dd) => (
                    <Option key={dd.id_tache} value={dd.id_tache}>
                        {dd.nom_tache}
                    </Option>
                ))}
            </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
          Soumettre
        </Button>
      </Form.Item>
    </Form>
  );
};

export default InspectionTache;
