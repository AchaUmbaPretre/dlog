import React, { useState } from 'react';
import { Form, Input, InputNumber, Row, Col, Button, Card, Spin, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const ArticleForm = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    console.log('Form values:', values);

    // Simulation d'une requête réseau
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Logique de succès
    } catch (error) {
      // Logique en cas d'erreur
      console.error('Erreur lors de l\'envoi du formulaire:', error);
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
                    <Col span={8}>
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
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, 'prix_unitaire']}
                        fieldKey={[fieldKey, 'prix_unitaire']}
                        label="Prix Unitaire"
                        rules={[{ required: true, message: 'Veuillez entrer le prix unitaire.' }]}
                      >
                        <InputNumber
                          min={0}
                          step={0.01}
                          style={{ width: '100%' }}
                          placeholder="Prix Unitaire"
                          formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, 'id_categorie']}
                        fieldKey={[fieldKey, 'id_categorie']}
                        label="ID Catégorie"
                        rules={[{ required: true, message: 'Veuillez entrer l\'ID de la catégorie.' }]}
                      >
                        <InputNumber
                          min={1}
                          style={{ width: '100%' }}
                          placeholder="ID Catégorie"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, 'quantite']}
                        fieldKey={[fieldKey, 'quantite']}
                        label="Quantité"
                        rules={[{ required: true, message: 'Veuillez entrer la quantité.' }]}
                      >
                        <InputNumber
                          min={1}
                          style={{ width: '100%' }}
                          placeholder="Quantité"
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
