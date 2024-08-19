import { Button, Form, Input, message } from 'antd';
import React from 'react';
import './ClientForm.scss';

const ClientForm = () => {
  return (
    <div className="client-form-container">
      <div className="client-form-wrapper">
        <Form
          layout="vertical"
          onFinish={(values) => {
            console.log('Form values:', values);
            message.success('Client ajouté avec succès !');
          }}
        >
          <Form.Item
            label="Nom"
            name="nom"
            rules={[{ required: true, message: 'Veuillez entrer le nom du client !' }]}
          >
            <Input placeholder="Entrez le nom du client" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ type: 'email', message: "L'email doit être valide !" }]}
          >
            <Input placeholder="Entrez l'email du client" />
          </Form.Item>

          <Form.Item
            label="Téléphone"
            name="telephone"
            rules={[{ required: true, message: 'Veuillez entrer le téléphone du client !' }]}
          >
            <Input placeholder="Entrez le téléphone du client" />
          </Form.Item>

          <Form.Item
            label="Pays"
            name="pays"
            rules={[{ required: true, message: 'Veuillez entrer le pays du client !' }]}
          >
            <Input placeholder="Entrez le pays du client" />
          </Form.Item>

          <Form.Item
            label="Ville"
            name="ville"
            rules={[{ required: false, message: 'Veuillez entrer la ville du client !' }]}
          >
            <Input placeholder="Entrez la ville du client" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="submit-button">
              Ajouter
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default ClientForm;
