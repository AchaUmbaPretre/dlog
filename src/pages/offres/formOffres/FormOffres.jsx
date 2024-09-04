import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, notification, Select, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { postOffre } from '../../../services/offreService';
import { getArticle, getBatiment } from '../../../services/typeService';
import { getFournisseur } from '../../../services/fournisseurService';
import { getProjet } from '../../../services/projetService';

const { Option } = Select;

const FormOffres = () => {
  const [form] = Form.useForm();
  const [article, setArticle] = useState([]);
  const [fournisseur, setFournisseur] = useState([])
  const [batiment, setBatiment] = useState([]);
  const [loading, setLoading] = useState(false); // État de chargement

  const handleError = (message) => {
    notification.error({
      message: 'Erreur de chargement',
      description: message,
    });
  };

  useEffect(() => {
    const fetchBatiment = async () => {
      try {
        const response = await getBatiment();
        setBatiment(response.data);
      } catch (error) {
        handleError('Une erreur est survenue lors du chargement des besoins. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchBatiment();
  }, []);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await getArticle();
        setArticle(response.data);
      } catch (error) {
        handleError('Une erreur est survenue lors du chargement des besoins. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, []);

  useEffect(() => {
    const fetchFournisseur = async () => {
      try {
        const response = await getFournisseur();
        setFournisseur(response.data);
      } catch (error) {
        handleError('Une erreur est survenue lors du chargement des besoins. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchFournisseur();
  }, []);

  const handleSubmit = async (values) => {
    setLoading(true); // Démarrer le chargement
    try {
      await postOffre(values);
      notification.success({
        message: 'Succès',
        description: 'L\'offre a été enregistrée avec succès.',
      });
      form.resetFields();
      window.location.reload();
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: 'Une erreur est survenue lors de l\'enregistrement de l\'offre.',
      });
    } finally {
      setLoading(false); // Arrêter le chargement
    }
  };

  return (
    <Form
      form={form}
      initialValues={{
        // initialValues peut être défini ici si nécessaire
        articles: [{}], // Initialisation avec un article vide
      }}
      onFinish={handleSubmit}
      layout="vertical"
      style={{ maxWidth: 600, margin: '0 auto' }}
    >
        <Row gutter={24}>
            <Col xs={24} md={12}>
                <Form.Item
                    label="Fournisseur"
                    name="id_fournisseur"
                    rules={[{ required: true, message: 'Veuillez selectionner un fournisseur' }]}
                >
                    <Select
                        showSearch
                        options={fournisseur.map((item) => ({
                            value: item.id_fournisseur,
                            label: item.nom_fournisseur,
                        }))}
                        placeholder="Sélectionnez un article..."
                        optionFilterProp="label"
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12}>
                <Form.Item
                    label="Titre"
                    name="nom_offre"
                    rules={[{ required: true, message: 'Veuillez entrer le nom de l\'offre.' }]}
                >
                    <Input placeholder="Titre de l'offre" />
                </Form.Item>
            </Col>
            <Col xs={24} md={24}>
                <Form.Item
                    label="Entité"
                    name="id_batiment"
                    rules={[{ required: false, message: 'Veuillez selectionner une entité' }]}
                >
                    <Select
                        showSearch
                        options={batiment.map((item) => ({
                            value: item.id_batiment,
                            label: item.nom_batiment,
                        }))}
                        placeholder="Sélectionnez une entité..."
                        optionFilterProp="label"
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={24}>
                <Form.Item
                    label="Description"
                    name="description"
                >
                    <Input.TextArea rows={2} placeholder="Description de l'offre" />
                </Form.Item>
            </Col>
        </Row>

      <Form.List
        name="articles"
        rules={[
          {
            validator: async (_, names) => {
              if (!names || names.length < 1) {
                return Promise.reject(new Error('Ajouter au moins un article.'));
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
              <div
                key={key}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <Form.Item
                  {...restField}
                  name={[name, 'id_article']}
                  fieldKey={[fieldKey, 'id_article']}
                  rules={[{ required: true, message: 'Veuillez sélectionner l\'article.' }]}
                  style={{ flex: 1, marginRight: '10px' }}
                >
                    <Select
                        showSearch
                        options={article.map((item) => ({
                            value: item.id_article,
                            label: item.nom_article,
                        }))}
                        placeholder="Sélectionnez un article..."
                        optionFilterProp="label"
                    />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'prix']}
                  fieldKey={[fieldKey, 'prix']}
                  rules={[{ required: true, message: 'Veuillez entrer le prix.' }]}
                  style={{ flex: 1 }}
                >
                  <InputNumber min={0} step={0.01} placeholder="Prix" style={{ width: '100%' }} />
                </Form.Item>

                <Button
                  type="link"
                  onClick={() => remove(name)}
                  style={{ color: 'red', marginLeft: '10px' }}
                >
                  Supprimer
                </Button>
              </div>
            ))}

            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
              >
                Ajouter un article
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
        >
          Enregistrer
        </Button>
        <Button
          style={{ marginLeft: '10px' }}
          onClick={() => form.resetFields()}
        >
          Annuler
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormOffres;
