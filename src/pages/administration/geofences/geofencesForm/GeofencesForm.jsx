import { useEffect, useState, useCallback } from 'react';
import { Button, Form, Input, notification, Row, Select, Col, Spin } from 'antd';
import axios from 'axios';
import { getClient } from '../../../../services/clientService';

const { Option } = Select;

const GeofencesForm = ({ closeModal, fetchData }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [optionsData, setOptionsData] = useState({
    falcons: [],
    types: [],
    clients: [],
    zones: [],
  });

  // Fonction pour afficher les notifications
  const openNotification = useCallback((type, message, description) => {
    notification[type]({ message, description });
  }, []);

  // Charger les données nécessaires pour les selects
  const loadOptions = useCallback(async () => {
    try {
      setIsLoading(true);
      const [falconsRes, typesRes, clientsRes, zonesRes] = await Promise.all([
        axios.get('/api/falcons'),
        axios.get('/api/types'),
        getClient,
        axios.get('/api/zones'),
      ]);

      setOptionsData({
        falcons: falconsRes.data,
        types: typesRes.data,
        clients: clientsRes.data,
        zones: zonesRes.data,
      });
    } catch (error) {
      console.error(error);
      openNotification('error', 'Erreur', 'Impossible de charger les données de sélection');
    } finally {
      setIsLoading(false);
    }
  }, [openNotification]);

  useEffect(() => {
    loadOptions();
    form.resetFields();
  }, [form, loadOptions]);

  // Soumission du formulaire
  const onFinish = async (values) => {
    try {
      setIsLoading(true);
      await axios.post('/api/geofences', values);
      openNotification('success', 'Succès', 'Geofence ajouté avec succès');
      form.resetFields();
      fetchData?.(); // rafraîchir les données du parent
      closeModal?.();
    } catch (error) {
      console.error(error);
      openNotification('error', 'Erreur', 'Impossible d\'ajouter le Geofence');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !optionsData.falcons.length) {
    return <Spin tip="Chargement des données..." style={{ width: '100%', marginTop: 50 }} />;
  }

  return (
    <div className="controle_form">
      <div className="controle_title_rows">
        <h2 className="controle_h2">Form Geofences DLOG</h2>
      </div>
      <div className="controle_wrapper">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Nom du falcon"
                name="nom_falcon"
                rules={[{ required: true, message: 'Veuillez entrer le nom du falcon!' }]}
              >
                <Select
                  showSearch
                  placeholder="Sélectionnez un falcon..."
                  optionFilterProp="label"
                  options={optionsData.falcons.map(f => ({ value: f.id, label: f.nom }))}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Nom" name="nom">
                <Input placeholder="Entrez le nom ..." />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Type"
                name="type_geofence"
                rules={[{ required: true, message: 'Veuillez sélectionner un type!' }]}
              >
                <Select
                  showSearch
                  placeholder="Sélectionnez un type..."
                  options={optionsData.types.map(t => ({ value: t.id, label: t.nom }))}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Client" name="client_id">
                <Select
                  showSearch
                  placeholder="Sélectionnez un client..."
                  options={optionsData.clients.map(c => ({ value: c.id, label: c.nom }))}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Zone" name="zone_parent_id">
                <Select
                  showSearch
                  placeholder="Sélectionnez une zone..."
                  options={optionsData.zones.map(z => ({ value: z.id, label: z.nom }))}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Description" name="description">
                <Input.TextArea
                  style={{ height: '80px', resize: 'none' }}
                  placeholder="Entrez la description..."
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading} disabled={isLoading}>
              Ajouter
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default GeofencesForm;
