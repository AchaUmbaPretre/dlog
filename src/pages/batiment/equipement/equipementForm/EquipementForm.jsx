import React from 'react';
import { Form, Input, DatePicker, Select, Button } from 'antd';

const { Option } = Select;

const EquipementForm = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    console.log('Form values:', values);
    // Vous pouvez ajouter ici le traitement des données comme l'envoi vers un API.
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        status: 'active', // Valeur par défaut
      }}
    >
      {/* id_batiment Index */}
      <Form.Item
        label="Bâtiment"
        name="id_batiment"
        rules={[{ required: true, message: 'Veuillez sélectionner un bâtiment' }]}
      >
        <Select placeholder="Sélectionnez un bâtiment">
          <Option value="1">Bâtiment 1</Option>
          <Option value="2">Bâtiment 2</Option>
        </Select>
      </Form.Item>

      {/* id_type_batiment */}
      <Form.Item
        label="Type de bâtiment"
        name="id_type_batiment"
        rules={[{ required: true, message: 'Veuillez sélectionner un type de bâtiment' }]}
      >
        <Input placeholder="Type de bâtiment" />
      </Form.Item>

      {/* model */}
      <Form.Item
        label="Modèle"
        name="model"
      >
        <Input placeholder="Modèle (facultatif)" />
      </Form.Item>

      {/* num_serie */}
      <Form.Item
        label="Numéro de série"
        name="num_serie"
      >
        <Input placeholder="Numéro de série (facultatif)" />
      </Form.Item>

      {/* installation_date */}
      <Form.Item
        label="Date d'installation"
        name="installation_date"
      >
        <DatePicker style={{ width: '100%' }} placeholder="Sélectionnez la date" />
      </Form.Item>

      {/* maintenance_date */}
      <Form.Item
        label="Date de maintenance"
        name="maintenance_date"
      >
        <DatePicker style={{ width: '100%' }} placeholder="Sélectionnez la date" />
      </Form.Item>

      {/* location */}
      <Form.Item
        label="Emplacement"
        name="location"
      >
        <Input placeholder="Emplacement de l'équipement (facultatif)" />
      </Form.Item>

      {/* status */}
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

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Soumettre
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EquipementForm;
