import React, { useEffect, useState } from 'react';
import { Form, Select, Button, notification } from 'antd';
import { getProjet } from '../../../services/projetService';

const { Option } = Select;

const ProjetAssocieForm = ({idTache,fetchData,closeModal}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [projet, setProjet] = useState([]);

    const handleSubmit = (values) => {
        console.log('Form submitted with values: ', values);
    };

    const fetchDatas = async () => {

    try {
        const { data } = await getProjet();
        setProjet(data);
        setLoading(false);
      } catch (error) {
        notification.error({
          message: 'Erreur de chargement',
          description: 'Une erreur est survenue lors du chargement des données.',
        });
        setLoading(false);
      }
    };

    useEffect(() => {
    fetchDatas();
  }, [idTache]);

  return (
    <div className="controle_form">
        <div className="controle_title_rows">
            <div className="controle_h2">Projet</div>
        </div>
        <div className="controle_wrapper">
            <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ maxWidth: '400px', margin: '0 auto' }}
        >
        <Form.Item
            label="Projet Associé"
            name="projetAssocie"
            rules={[{ required: true, message: 'Veuillez sélectionner un projet' }]}
        >
                <Select
                    showSearch
                    options={projet.map((item) => ({
                        value: item.id_projet,
                        label: item.nom_projet,
                    }))}
                    placeholder="Sélectionnez un département..."
                    optionFilterProp="label"
                />
        </Form.Item>

        <Form.Item>
            <Button type="primary" htmlType="submit" block>
            Soumettre
            </Button>
        </Form.Item>
            </Form>
        </div>
    </div>
  );
};

export default ProjetAssocieForm;
