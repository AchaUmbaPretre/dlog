import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Row, Col, Button, Card, Spin, notification, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { postArticle, postOffreArticle } from '../../../services/offreService';
import { getCategorie } from '../../../services/typeService';

const ArticleForm = ({idOffre}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [cat, setCat] = useState([]);

  const handleError = (message) => {
    notification.error({
        message: 'Erreur de chargement',
        description: message,
    });
}

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [catData] = await Promise.all([
                getCategorie()
            ]);

            setCat(catData.data);
        } catch (error) {
            handleError('Une erreur est survenue lors du chargement des données.');
        }
    };

    fetchData();
}, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
        await postArticle({
            ...values,
            id_offre : idOffre
        });
        notification.success({
          message: 'Succès',
          description: 'L article a été enregistré avec succès.',
        });
        form.resetFields();
        window.location.reload();
      } catch (error) {
        notification.error({
          message: 'Erreur',
          description: 'Erreur lors de l\'enregistrement de l article.',
        });
      } finally {
        setLoading(false);
      }
  };

  return (
    <Card title="Gestion des Articles" style={{ width: '100%' }}>
      <Form
        name="article_form"
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          articles: [{}], // Initialiser avec un article
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
                        rules={[{ required: true, message: 'Veuillez entrer le nom de l\'article.' }]}
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
                        rules={[{ required: true, message: 'Veuillez entrer l\'ID de la catégorie.' }]}
                      >
                        <Select
                            placeholder="Sélectionnez la categorie..."
                            options={cat.map((item) => ({
                                        value: item.id_categorie,
                                        label: (
                                            <div>
                                                {item.nom_cat}
                                            </div>
                                        ),
                                    }))}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              ))}
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
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ width: '100%' }}
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
    </Card>
  );
};

export default ArticleForm;
