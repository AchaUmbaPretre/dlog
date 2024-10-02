import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Select, Button, notification, Row, Col } from 'antd';
import moment from 'moment';
import { getArticle, getBatiment } from '../../../services/typeService';
import { postBesoin } from '../../../services/besoinsService';
import './projetBesoin.css'
import { getClient } from '../../../services/clientService';
import { getUser } from '../../../services/userService';
const { TextArea } = Input;
const { Option } = Select;

const ProjetBesoin = ({idProjet,fetchData,closeModal}) => {
  const [form] = Form.useForm();
  const [article, setArticle] = useState([]);
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState([]);
  const [batiment, setBatiment] = useState([]);
  const [users, setUsers] = useState([]);

  
  const handleError = (message) => {
    notification.error({
        message: 'Erreur de chargement',
        description: message,
    });
};

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [articleData, clientData, batimentData, usersData] = await Promise.all([
                getArticle(),
                getClient(),
                getBatiment(),
                getUser()
            ]);

            setArticle(articleData.data);
            setClient(clientData.data);
            setBatiment(batimentData.data)
            setUsers(usersData.data);

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
    <div className="controle_forms">
      <div className="controlr_title_row">
        <h2 className='controle_h2'>Ajouter un besoin</h2>                
      </div>
      <div className="controle_wrapper">
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
          <Row gutter={12}>
            <Col xs={24} md={12}>
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
      filterOption={(input, option) =>
        option?.label.toLowerCase().includes(input.toLowerCase())
      }
    />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="id_client"
                label="Client"
                rules={[
                        {
                          required: false,
                          message: 'Veuillez sélectionner un client.',
                        },
                      ]}
              >
                <Select
                  showSearch
                  options={client.map((item) => ({
                    value: item.id_client,
                    label: item.nom,
                  }))}
                    placeholder="Sélectionnez un client..."
                    optionFilterProp="label"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col xs={24} md={12}>
              <Form.Item
                name="id_batiment"
                label="Entité"
                rules={[
                        {
                          required: false
                        },
                      ]}
              >
                <Select
                  placeholder="Sélectionnez un bâtiment"
                  showSearch
                  options={batiment.map((item) => ({
                            value: item.id_batiment,
                            label: item.nom_batiment,
                          }))}
                  />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="personne"
                label="personne"
                rules={[
                        {
                          required: false,
                          message: 'Veuillez indiquer un demandeur.',
                        },
                  ]}
                >
                  <Select
                    showSearch
                    options={users.map((item) => ({
                      value: item.id_utilisateur,
                      label: `${item.nom}`,
                    }))}
                      placeholder="Sélectionnez un demandeur..."
                      optionFilterProp="label"
                  />
              </Form.Item>
            </Col>
          </Row>
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
      </div>
    </div>
  );
};

export default ProjetBesoin;
