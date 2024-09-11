import React from 'react';
import { Form, Input, InputNumber, DatePicker, Select, Button } from 'antd';
import moment from 'moment';
import { getArticle } from '../../../services/typeService';

const { TextArea } = Input;
const { Option } = Select;

const ProjetBesoin = () => {
  const [form] = Form.useForm();
  const [article, setArticle] = useState([]);

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
}, [form]);

  const handleSubmit = (values) => {
    console.log('Form Values:', values);
    // Ajoutez votre logique de soumission ici, telle qu'une requête API
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
        rules={[{ required: true, message: 'Veuillez entrer une description' }]}
      >
        <TextArea rows={4} />
      </Form.Item>

      {/* Champ Quantité */}
      <Form.Item
        name="quantite"
        label="Quantité"
        rules={[{ required: true, message: 'Veuillez entrer la quantité' }]}
      >
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>


      {/* Champ Priorité */}
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

      {/* Bouton Soumettre */}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Soumettre
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProjetBesoin;
