import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, notification, Select, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { postOffre } from '../../../services/offreService';
import { getFournisseur } from '../../../services/fournisseurService';
import { getArticle, getBatiment } from '../../../services/typeService';
import { getBesoin } from '../../../services/besoinsService';

const { Option } = Select;

const FormOffres = () => {
  const [form] = Form.useForm();
  const [article, setArticle] = useState([]);
  const [fournisseur, setFournisseur] = useState([]);
  const [batiment, setBatiment] = useState([]);
  const [besoin, setBesoin] = useState([]);
  const [loading, setLoading] = useState(false);

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
        handleError('Erreur lors du chargement des bâtiments.');
      }
    };

    const fetchArticle = async () => {
      try {
        const response = await getArticle();
        setArticle(response.data);
      } catch (error) {
        handleError('Erreur lors du chargement des articles.');
      }
    };

    const fetchFournisseur = async () => {
      try {
        const response = await getFournisseur();
        setFournisseur(response.data);
      } catch (error) {
        handleError('Erreur lors du chargement des fournisseurs.');
      }
    };

    const fetchBesoin = async () => {
      try {
        const response = await getBesoin();
        setBesoin(response.data);
      } catch (error) {
        handleError('Erreur lors du chargement des besoins.');
      }
    };

    fetchBatiment();
    fetchArticle();
    fetchFournisseur();
    fetchBesoin();
  }, []);

  const handleSubmit = async (values) => {
    setLoading(true);
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
        description: 'Erreur lors de l\'enregistrement de l\'offre.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      initialValues={{
        articles: [{}],
        besoins: [],
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
            rules={[{ required: true, message: 'Veuillez sélectionner un fournisseur.' }]}
          >
            <Select
              showSearch
              options={fournisseur.map(item => ({
                value: item.id_fournisseur,
                label: item.nom_fournisseur,
              }))}
              placeholder="Sélectionnez un fournisseur..."
              optionFilterProp="label"
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Titre"
            name="nom_offre"
            rules={[{ required: true, message: 'Veuillez entrer le titre de l\'offre.' }]}
          >
            <Input placeholder="Titre de l'offre" />
          </Form.Item>
        </Col>
        <Col xs={24} md={24}>
          <Form.Item
            label="Entité"
            name="id_batiment"
            rules={[{ required: false, message: 'Veuillez sélectionner une entité.' }]}
          >
            <Select
              showSearch
              options={batiment.map(item => ({
                value: item.id_batiment,
                label: item.nom_batiment,
              }))}
              placeholder="Sélectionnez une entité..."
              optionFilterProp="label"
            />
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
                style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}
              >
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      {...restField}
                      name={[name, 'id_besoin']}
                      fieldKey={[fieldKey, 'id_besoin']}
                      rules={[{ required: true, message: 'Veuillez sélectionner un besoin.' }]}
                      label="Besoin"
                    >
                      <Select
                        showSearch
                        options={besoin.map(item => ({
                          value: item.id_besoin,
                          label: `Article : ${item.description} - Offre: ${item.nom_projet}`,
                        }))}
                        placeholder="Sélectionnez un besoin..."
                        optionFilterProp="label"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      {...restField}
                      name={[name, 'id_article']}
                      fieldKey={[fieldKey, 'id_article']}
                      rules={[{ required: true, message: 'Veuillez sélectionner l\'article.' }]}
                      label="Article"
                    >
                      <Select
                        showSearch
                        options={article.map(item => ({
                          value: item.id_article,
                          label: item.nom_article,
                        }))}
                        placeholder="Sélectionnez un article..."
                        optionFilterProp="label"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      {...restField}
                      name={[name, 'quantite']}
                      fieldKey={[fieldKey, 'quantite']}
                      rules={[{ required: true, message: 'Veuillez entrer la quantité.' }]}
                      label="Quantité"
                    >
                      <InputNumber min={0} placeholder="Quantité" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      {...restField}
                      name={[name, 'prix']}
                      fieldKey={[fieldKey, 'prix']}
                      rules={[{ required: true, message: 'Veuillez entrer le prix.' }]}
                      label="Prix"
                    >
                      <InputNumber min={0} step={0.01} placeholder="Prix" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Button
                  type="link"
                  onClick={() => remove(name)}
                  style={{ color: 'red', marginTop: '10px' }}
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
                Ajouter un besoin avec article
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
