import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Select, Button, notification } from 'antd';
import moment from 'moment';
import { getArticle } from '../../../services/typeService';
import { postBesoin } from '../../../services/besoinsService';

const { TextArea } = Input;
const { Option } = Select;

const ProjetBesoin = ({idProjet,fetchData,closeModal}) => {
  const [form] = Form.useForm();
  const [article, setArticle] = useState([]);
  const [loading, setLoading] = useState(false);


  
  const handleError = (message) => {
    notification.error({
        message: 'Erreur de chargement',
        description: message,
    });
};

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [articleData] = await Promise.all([
                getArticle(),
            ]);

            setArticle(articleData.data);

        } catch (error) {
            handleError('Une erreur est survenue lors du chargement des données.');
        }
    };

    fetchData();
}, []);

  const handleSubmit = async(values) => {

    setLoading(true)
    try {

            await postBesoin({
                ...values,
                id_projet: idProjet
            });
        notification.success({
            message: 'Succès',
            description: 'Le besoin a été enregistré avec succès.',
        });
        form.resetFields();
        fetchData()
        closeModal()
    } catch (error) {
        notification.error({
            message: 'Erreur',
            description: "Erreur lors de l'enregistrement du projet.",
        });
    } finally {
        setLoading(false);
    }
  };



  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        quantite: 1,
        priorite: 'Moyenne',
        date_creation: moment(),
      }}
    >
      <Form.Item
        name="id_article"
        label="Article"
        rules={[{ required: true, message: 'Veuillez entrer l\'ID de l\'article' }]}
      >
        <Select
            placeholder="Sélectionnez un article"
            showSearch
            options={article.map((item) => ({
                value: item.id_article,
                label: item.nom_article,
            }))}
        />
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: false, message: 'Veuillez entrer une description' }]}
      >
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item
        name="quantite"
        label="Quantité"
        rules={[{ required: true, message: 'Veuillez entrer la quantité' }]}
      >
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>


      <Form.Item
        name="priorite"
        label="Priorité"
        rules={[{ required: true, message: 'Veuillez sélectionner la priorité' }]}
      >
        <Select>
          <Option value="Haute">Haute</Option>
          <Option value="Moyenne">Moyenne</Option>
          <Option value="Faible">Faible</Option>
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

export default ProjetBesoin;
