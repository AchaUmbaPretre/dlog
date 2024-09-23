import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, Select } from 'antd';
import moment from 'moment';

const { Option } = Select;

const MaintenanceForm = ({ onSubmit }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const formattedValues = {
      ...values,
      date_entretien: values.date_entretien.format('YYYY-MM-DD'),
    };
    onSubmit(formattedValues); // Envoi des données au backend ou autre traitement
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="id_equipement"
        label="Équipement ID"
        rules={[{ required: true, message: 'Veuillez entrer l\'ID de l\'équipement' }]}
      >
        <Input placeholder="Entrez l'ID de l'équipement" />
      </Form.Item>

      <Form.Item
        name="date_entretien"
        label="Date d'entretien"
        rules={[{ required: true, message: 'Veuillez sélectionner une date' }]}
      >
        <DatePicker placeholder="Sélectionnez une date" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="actions"
        label="Actions réalisées"
        rules={[{ required: true, message: 'Veuillez décrire les actions réalisées' }]}
      >
        <Input.TextArea placeholder="Décrivez les actions effectuées" />
      </Form.Item>

      <Form.Item
        name="technicien"
        label="Technicien"
        rules={[{ required: true, message: 'Veuillez entrer le nom du technicien' }]}
      >
        <Input placeholder="Nom du technicien" />
      </Form.Item>

      <Form.Item
        name="statut"
        label="Statut"
        rules={[{ required: true, message: 'Veuillez sélectionner un statut' }]}
      >
        <Select placeholder="Sélectionnez le statut">
          <Option value="En cours">En cours</Option>
          <Option value="Terminée">Terminée</Option>
          <Option value="Annulée">Annulée</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Enregistrer la maintenance
        </Button>
      </Form.Item>
    </Form>
  );
};

export default MaintenanceForm;
