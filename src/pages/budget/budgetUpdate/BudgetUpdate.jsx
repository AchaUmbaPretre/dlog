import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import axios from 'axios';
import { putBudget } from '../../../services/budgetService';

const BudgetUpdate = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    
      putBudget(values)
      .then((response) => {
        notification.success({
          message: 'Succès',
          description: 'Le montant a été mis à jour avec succès.',
        });
      })
      .catch((error) => {
        notification.error({
          message: 'Erreur',
          description: 'Une erreur est survenue lors de la mise à jour.',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Form
      name="update-budget"
      layout="vertical"
      onFinish={onFinish}
    >
      <Form.Item
        label="ID du Projet"
        name="id_projet"
        rules={[{ required: true, message: 'Veuillez entrer l\'ID du projet' }]}
      >
        <Input placeholder="Entrez l'ID du projet" />
      </Form.Item>

      <Form.Item
        label="Montant"
        name="montant"
        rules={[{ required: true, message: 'Veuillez entrer le montant' }]}
      >
        <Input placeholder="Entrez le montant" type="number" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Mettre à jour le budget
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BudgetUpdate;
