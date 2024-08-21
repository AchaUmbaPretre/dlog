import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Space, Row, Col, Select, notification } from 'antd';
import { getDepartement } from '../../../services/departementService';
import { getClient } from '../../../services/clientService';
import './controleForm.scss'; // SCSS file for custom styles

const ControleForm = () => {
    const [departement, setDepartement] = useState([]);
    const [client, setClient] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const { data } = await getDepartement();
            setDepartement(data);
          } catch (error) {
            notification.error({
              message: 'Erreur de chargement',
              description: 'Une erreur est survenue lors du chargement des données.',
            });
          }
        };
    
        fetchData();
      }, []);

      useEffect(() => {
        const fetchData = async () => {
          try {
            const { data } = await getClient();
            setClient(data);
          } catch (error) {
            notification.error({
              message: 'Erreur de chargement',
              description: 'Une erreur est survenue lors du chargement des données.',
            });
          }
        };
    
        fetchData();
      }, []);

  return (
    <div className="controle_form">
      <div className="controle_wrapper">
        <Form 
          name="validateOnly" 
          layout="vertical" 
          autoComplete="off"
          className="custom-form"
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                name="id_departement"
                label="Département"
                rules={[
                  {
                    required: true,
                    message: 'Veuillez sélectionner un département.',
                  },
                ]}
              >
                <Select
                    showSearch
                    options={departement?.map((item) => ({
                            value: item.id_departement,
                            label: item.nom_departement,
                    }))}
                    placeholder="Sélectionnez un département..."
                    optionFilterProp="label"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="id_client"
                label="Client"
                rules={[
                  {
                    required: true,
                    message: 'Veuillez sélectionner un client.',
                  },
                ]}
              >
                <Select
                    showSearch
                    options={client?.map((item) => ({
                            value: item.id_client,
                            label: item.nom,
                    }))}
                    placeholder="Sélectionnez un client..."
                    optionFilterProp="label"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="id_format"
                label="Format"
                rules={[
                  {
                    required: true,
                    message: 'Veuillez saisir un format.',
                  },
                ]}
              >
                <Input placeholder="Sélectionnez un format..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="description"
                label="Contrôle de base"
                rules={[
                  {
                    required: true,
                    message: 'Veuillez fournir une description.',
                  },
                ]}
              >
                <Input placeholder="Description..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="frequence"
                label="Fréquence"
                rules={[
                  {
                    required: true,
                    message: 'Veuillez indiquer la fréquence.',
                  },
                ]}
              >
                <Input placeholder="Fréquence..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="id_users"
                label="Propriétaire"
                rules={[
                  {
                    required: true,
                    message: 'Veuillez indiquer le propriétaire.',
                  },
                ]}
              >
                <Input placeholder="Nom du propriétaire..." />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item>
                <Space className="button-group">
                  <Button type="primary" htmlType="submit">
                    Envoyer
                  </Button>
                  <Button htmlType="reset">
                    Réinitialiser
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default ControleForm;
