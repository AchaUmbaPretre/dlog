import React, { useEffect, useState } from 'react';
import { Form, Input, Row, Col, Button, Card, Spin, notification, Select, Tooltip, Modal } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { postArticle } from '../../../services/offreService';
import { getArticleOneV, getCategorie, putArticle } from '../../../services/typeService';
import CatForm from '../../categorie/catForm/CatForm';

const ArticleForm = ({ idOffre, closeModal, fetchData, idArticle }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [cat, setCat] = useState([]);
  const [modalType, setModalType] = useState(null);

  const handleError = (message) => {
    notification.error({
      message: 'Erreur de chargement',
      description: message,
    });
  };

  const handlCat = () => openModal('AddCat');

  const closeAllModals = () => {
    setModalType(null);
  };

  const openModal = (type) => {
    closeAllModals();
    setModalType(type);
  };

  const fetchDataAll = async () => {
    try {
      const [catData] = await Promise.all([getCategorie()]);
      setCat(catData.data);

      if (idArticle) {
        const { data: art } = await getArticleOneV(idArticle);
        form.setFieldsValue({
          articles: art.map((d) => ({
            nom_article: d.nom_article,
            id_categorie: d.id_categorie,
          })),
        });
      }
    } catch (error) {
      handleError('Une erreur est survenue lors du chargement des données.');
    }
  };

  useEffect(() => {
    fetchDataAll();
  }, [idArticle]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (idArticle) {
        await putArticle(idArticle, {
          nom_article: values.articles[0].nom_article,
          id_categorie: values.articles[0].id_categorie,
        });
        notification.success({
          message: 'Succès',
          description: 'L’article a été mis à jour avec succès.',
        });
      } else {
        await postArticle({
          ...values,
          id_offre: idOffre,
        });
        notification.success({
          message: 'Succès',
          description: 'L’article a été enregistré avec succès.',
        });
      }
      form.resetFields();
      closeModal();
      fetchData();
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: 'Erreur lors de l\'enregistrement de l’article.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Gestion des Articles" style={{ width: '100%' }}>
      <div>
        <Tooltip title="Ajouter une catégorie">
          <Button
            style={{ margin: '10px 0' }}
            icon={<PlusOutlined />}
            onClick={handlCat}
          />
        </Tooltip>
      </div>
      <Form
        form={form}
        name="article_form"
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          articles: [{}],
        }}
      >
        <Form.List name="articles">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Card
                  key={key}
                  title={`Article ${name + 1}`}
                  style={{ marginBottom: 16 }}
                  extra={
                    fields.length > 1 && (
                      <Button
                        type="link"
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(name)}
                      >
                        Supprimer
                      </Button>
                    )
                  }
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, 'nom_article']}
                        fieldKey={[fieldKey, 'nom_article']}
                        label="Nom de l'Article"
                        rules={[
                          { required: true, message: 'Veuillez entrer le nom de l\'article.' },
                        ]}
                      >
                        <Input placeholder="Nom de l'Article" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, 'id_categorie']}
                        fieldKey={[fieldKey, 'id_categorie']}
                        label="Catégorie"
                        rules={[
                          { required: true, message: 'Veuillez sélectionner une catégorie.' },
                        ]}
                      >
                        <Select
                          placeholder="Sélectionnez la catégorie..."
                          options={cat.map((item) => ({
                            value: item.id_categorie,
                            label: item.nom_cat,
                          }))}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              ))}
              {!idArticle && (
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    style={{ width: '100%' }}
                  >
                    Ajouter un autre article
                  </Button>
                </Form.Item>
              )}
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ width: '100%' }}
            disabled={loading}
          >
            Soumettre
          </Button>
        </Form.Item>
      </Form>
      {loading && (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Spin tip="Envoi en cours..." />
        </div>
      )}
      <Modal
        title=""
        visible={modalType === 'AddCat'}
        onCancel={closeAllModals}
        footer={null}
        width={700}
        centered
      >
        <CatForm idCat={''} closeModal={() => setModalType(null)} fetchData={fetchDataAll} />
      </Modal>
    </Card>
  );
};

export default ArticleForm;
