import React, { useState } from 'react';
import { Form, Input, InputNumber, Row, Col, Button, Card, Spin, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Item: FormItem, List } = Form;

const ArticleForm = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    console.log('Form values:', values);

    // Simulate a network request
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Handle success logic here
    } catch (error) {
      // Handle error logic here
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
          articles: [{}], // Initialize with one article
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
                      <FormItem
                        {...restField}
                        name={[name, 'nom_article']}
                        fieldKey={[fieldKey, 'nom_article']}
                        label="Nom de l'Article"
                        rules={[{ required: true, message: 'Veuillez entrer le nom de l\'article.' }]}
                      >
                        <Input placeholder="Nom de l'Article" />
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem
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
                          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem
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
                      </FormItem>
                    </Col>
                  </Row>
                </Card>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
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
            {loading ? 'Envoi en cours...' : 'Soumettre'}
          </Button>
        </Form.Item>
      </Form>
      {loading && <div style={{ textAlign: 'center', marginTop: 16 }}><Spin tip="Envoi en cours..." /></div>}
    </Card>
  );
};

export default ArticleForm;
