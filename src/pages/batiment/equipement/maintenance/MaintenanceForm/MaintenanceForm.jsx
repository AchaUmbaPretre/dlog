import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, Select, notification } from 'antd';
import axios from 'axios';

const { TextArea } = Input;

const MaintenanceForm = () => {
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (values) => {
    setLoading(true);
    
    try {
      // Format date before sending it to the backend
      const formattedDate = values.date_entretien.format('YYYY-MM-DD');
      
      const payload = {
        ...values,
        date_entretien: formattedDate,
      };

      await axios.post('/api/maintenances', payload);
      notification.success({
        message: 'Maintenance enregistrée avec succès',
      });
    } catch (error) {
      notification.error({
        message: 'Erreur lors de l\'enregistrement',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit}
      autoComplete="off"
    >
      {/* Equipement ID */}
      <Form.Item
        label="ID de l'équipement"
        name="id_equipement"
        rules={[{ required: true, message: 'Veuillez sélectionner un équipement' }]}
      >
        <Select placeholder="Sélectionner un équipement">
          {/* Vous pouvez remplacer ces options par des données dynamiques */}
          <Select.Option value="1">Équipement 1</Select.Option>
          <Select.Option value="2">Équipement 2</Select.Option>
        </Select>
      </Form.Item>

      {/* Date d'entretien */}
      <Form.Item
        label="Date d'entretien"
        name="date_entretien"
        rules={[{ required: true, message: 'Veuillez sélectionner une date' }]}
      >
        <DatePicker />
      </Form.Item>

      {/* Actions */}
      <Form.Item
        label="Actions"
        name="actions"
        rules={[{ required: true, message: 'Veuillez décrire les actions effectuées' }]}
      >
        <TextArea rows={4} placeholder="Décrivez les actions réalisées durant l'entretien" />
      </Form.Item>

      {/* Technicien */}
      <Form.Item
        label="Technicien"
        name="technicien"
        rules={[{ required: true, message: 'Veuillez entrer le nom du technicien' }]}
      >
        <Input placeholder="Nom du technicien" />
      </Form.Item>

      {/* Submit button */}
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Enregistrer la maintenance
        </Button>
      </Form.Item>
    </Form>
  );
};

export default MaintenanceForm;
