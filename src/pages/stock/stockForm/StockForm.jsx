import React, { useEffect, useState } from 'react';
import { Form, InputNumber, Button, Select, notification } from 'antd';
import { postStock } from '../../../services/batimentService';
import { getArticle } from '../../../services/typeService';

const { Option } = Select;
const StockForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [articles, setArticles] = useState([])

    useEffect(() => {
      const fetchData = async () => {
          try {
              const [articleData] = await Promise.all([
                  getArticle(),
              ]);
  
              setArticles(articleData.data);
  
          } catch (error) {
            console.log(error)
          }
      };
  
      fetchData();
  }, [form]);
  
  
    const onFinish = async (values) => {
      setLoading(true);
      try {
        await postStock(values);
        notification.success({
          message: 'Succès',
          description: 'Le stock a été ajouté avec succès.',
        });
        form.resetFields();
      } catch (error) {
        notification.error({
          message: 'Erreur',
          description: "Une erreur est survenue lors de l'ajout du stock.",
        });
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ quantite: 0, seuil_alerte: 1 }}
      >
        {/* Sélection du type d'équipement */}
        <Form.Item
          name="id_type_equipement"
          label="Type d'équipement"
          rules={[{ required: true, message: 'Veuillez sélectionner un type d’équipement' }]}
        >
          <Select placeholder="Sélectionner un type d'équipement">
            {articles.map((type) => (
              <Option key={type.id_type_equipement} value={type.id_type_equipement}>
                {type.nom_equipement}
              </Option>
            ))}
          </Select>
        </Form.Item>
  
        {/* Quantité */}
        <Form.Item
          name="quantite"
          label="Quantité"
          rules={[{ required: true, message: 'Veuillez entrer la quantité' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} placeholder="Entrez la quantité" />
        </Form.Item>
  
        {/* Seuil d'alerte */}
        <Form.Item
          name="seuil_alerte"
          label="Seuil d'alerte"
          rules={[{ required: true, message: 'Veuillez définir un seuil d’alerte' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} placeholder="Entrez le seuil d'alerte" />
        </Form.Item>
  
        {/* Bouton de soumission */}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Ajouter Stock
          </Button>
        </Form.Item>
      </Form>
    );
  };
  
  export default StockForm;
