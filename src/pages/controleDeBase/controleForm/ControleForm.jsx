import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Space, Row, Col, Select, notification } from 'antd';
import { getDepartement } from '../../../services/departementService';
import { getClient } from '../../../services/clientService';
import './controleForm.scss'; // SCSS file for custom styles
import { getFormat } from '../../../services/formatService';
import { getFrequence } from '../../../services/frequenceService';
import { getUser } from '../../../services/userService';

const ControleForm = () => {
    const [departement, setDepartement] = useState([]);
    const [client, setClient] = useState([]);
    const [format, setFormat] = useState([]);
    const [frequence, setFrequence] = useState([]);
    const [users, setUsers] = useState([]);


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
            const { data } = await getFormat();
            setFormat(data);
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
            const { data } = await getFrequence();
            setFrequence(data);
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
            const { data } = await getUser();
            setUsers(data);
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
                <Select
                    showSearch
                    options={format?.map((item) => ({
                            value: item.id_format,
                            label: item.nom_format,
                    }))}
                    placeholder="Sélectionnez un format..."
                    optionFilterProp="label"
                />
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
                name="id_frequence"
                label="Fréquence"
                rules={[
                  {
                    required: true,
                    message: 'Veuillez indiquer la fréquence.',
                  },
                ]}
              >
                <Select
                    showSearch
                    options={frequence?.map((item) => ({
                            value: item.id_frequence,
                            label: item.nom,
                    }))}
                    placeholder="Sélectionnez une frequence..."
                    optionFilterProp="label"
                />
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
                <Select
                    showSearch
                    options={users?.map((item) => ({
                            value: item.id,
                            label: `${item.nom} - ${item.prenom}`,
                    }))}
                    placeholder="Sélectionnez une frequence..."
                    optionFilterProp="label"
                />
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
