import React from 'react';
import { Form, Input, DatePicker, Select, Button, Row, Col } from 'antd';

const { Option } = Select;

const EquipementForm = ({idBatiment}) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    console.log('Form values:', values);
    // Traitement des données
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        status: 'active',
      }}
    >
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label="Type de bâtiment"
            name="id_type_batiment"
            rules={[{ required: true, message: 'Veuillez sélectionner un type de bâtiment' }]}
          >
            <Input placeholder="Type de bâtiment" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Modèle"
            name="model"
          >
            <Input placeholder="Modèle (facultatif)" />
          </Form.Item>
        </Col>

        {/* num_serie */}
        <Col span={12}>
          <Form.Item
            label="Numéro de série"
            name="num_serie"
          >
            <Input placeholder="Numéro de série (facultatif)" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* installation_date */}
        <Col span={12}>
          <Form.Item
            label="Date d'installation"
            name="installation_date"
          >
            <DatePicker style={{ width: '100%' }} placeholder="Sélectionnez la date" />
          </Form.Item>
        </Col>

        {/* maintenance_date */}
        <Col span={12}>
          <Form.Item
            label="Date de maintenance"
            name="maintenance_date"
          >
            <DatePicker style={{ width: '100%' }} placeholder="Sélectionnez la date" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* location */}
        <Col span={12}>
          <Form.Item
            label="Emplacement"
            name="location"
          >
            <Input placeholder="Emplacement de l'équipement (facultatif)" />
          </Form.Item>
        </Col>

        {/* status */}
        <Col span={12}>
          <Form.Item
            label="Statut"
            name="status"
            rules={[{ required: true, message: 'Veuillez sélectionner un statut' }]}
          >
            <Select placeholder="Sélectionnez le statut">
              <Option value="active">Actif</Option>
              <Option value="inactive">Inactif</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      {/* Submit button */}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Soumettre
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EquipementForm;
