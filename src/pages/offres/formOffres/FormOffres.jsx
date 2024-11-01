import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, notification, Select, Row, Col, Modal, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { postOffre } from '../../../services/offreService';
import { getFournisseur } from '../../../services/fournisseurService';
import { getArticle, getBatiment, getCatTache } from '../../../services/typeService';
import { getBesoinOne } from '../../../services/besoinsService';
import { getProjet } from '../../../services/projetService';

const FormOffres = () => {
  const [form] = Form.useForm();
  const [article, setArticle] = useState([]);
  const [fournisseur, setFournisseur] = useState([]);
  const [batiment, setBatiment] = useState([]);
  const [besoin, setBesoin] = useState([]);
  const [projet, setProjet] = useState([]);
  const [cat, setCat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const handleError = (message) => {
    notification.error({
      message: 'Erreur de chargement',
      description: message,
    });
  };

  const fetchBesoin = async (projetId) => {
    setModalLoading(true);
    try {
      const response = await getBesoinOne(projetId);
      setBesoin(response.data);
      setModalVisible(true);
    } catch (error) {
      handleError('Une erreur est survenue lors du chargement des besoins.');
    } finally {
      setModalLoading(false);
    }
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

    const fetchCat = async () => {
      try {
      const response = await getCatTache();
        setCat(response.data);
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

    const fetchProjet = async () => {
      try {
        const response = await getProjet();
        setProjet(response.data);
      } catch (error) {
        handleError('Erreur lors du chargement des projets.');
      }
    };

    fetchBatiment();
    fetchArticle();
    fetchFournisseur();
    fetchProjet();
    fetchCat()
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

  const openBesoinModal = (projetId) => {
    if (!projetId) return;
    fetchBesoin(projetId);
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
        <Col xs={24} md={12}>
          <Form.Item
            label="Entité"
            name="id_batiment"
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
        <Col xs={24} md={12}>
          <Form.Item
            label="Projet"
            name="id_projet"
            rules={[{ required: false, message: 'Veuillez sélectionner un projet.' }]}
          >
            <Select
              onChange={openBesoinModal}
              showSearch
              options={projet.map(item => ({
                value: item.id_projet,
                label: item.nom_projet,
              }))}
              placeholder="Sélectionnez un projet pour voir ses besoins..."
              optionFilterProp="label"
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={24}>
          <Form.Item
            label="Categorie"
            name="id_cat_tache"
            rules={[{ required: false, message: 'Veuillez sélectionner une categorie.' }]}
          >                
          <Select
            placeholder="Sélectionnez.."
            showSearch
            options={cat.map((item) => ({
                value: item.id_cat_tache,
                label: item.nom_cat_tache
            }))}
          />
          </Form.Item>
        </Col>
        <Col xs={24} md={24}>
          <Form.Item label="Description" name="description">
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
              <div key={key} style={{ display: 'flex', alignItems: 'center' }}>
                <Form.Item
                  {...restField}
                  name={[name, 'id_article']}
                  fieldKey={[fieldKey, 'id_article']}
                  rules={[{ required: true, message: 'Veuillez sélectionner l\'article.' }]}
                  style={{ flex: 1, marginRight: '10px' }}
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

                <Form.Item
                  {...restField}
                  name={[name, 'quantite']}
                  fieldKey={[fieldKey, 'quantite']}
                  rules={[{ required: true, message: 'Veuillez entrer la quantité.' }]}
                  style={{ flex: 1, marginRight: '10px' }}
                >
                  <InputNumber min={0} placeholder="quantité" style={{ width: '100%' }} />
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
          disabled={loading}
          block
        >
          Soumettre l'offre
        </Button>
      </Form.Item>

      <Modal
        title={`Besoins du Projet : ${besoin[0]?.nom_projet}`}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Fermer
          </Button>
        ]}
      >
        {modalLoading ? (
          <Spin tip="Chargement des besoins..." />
        ) : (
          besoin.length > 0 ? (
            besoin.map((b,index) => (
              <div key={b.id_besoin}>
                <p>{`${index + 1}. ${b.nom_article}`}</p>
              </div>
            ))
          ) : (
            <p>Aucun besoin trouvé pour ce projet.</p>
          )
        )}
      </Modal>
    </Form>
  );
};

export default FormOffres;
