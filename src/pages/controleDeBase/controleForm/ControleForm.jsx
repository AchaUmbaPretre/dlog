import React from 'react';
import { Button, Form, Input, Space, Row, Col } from 'antd';

const ControleForm = () => {
  return (
    <>
      <div className="controle_form">
        <div className="controle_wrapper">
          <Form name="validateOnly" layout="vertical" autoComplete="off">
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="id_departement"
                  label="Département"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input placeholder="Sélectionnez le département.." />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="id_client"
                  label="Client"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input placeholder="Sélectionnez le client.." />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="id_format"
                  label="Format"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input placeholder="Sélectionnez un format.." />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="description"
                  label="Contrôle de base"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input placeholder="description.." />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="frequence"
                  label="Fréquence"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input placeholder="description.." />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="id_users"
                  label="OWNER"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input placeholder="description.." />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item>
                  <Space>
                    <Button type="primary">Submit</Button>
                    <Button htmlType="reset">Reset</Button>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </>
  );
};

export default ControleForm;
